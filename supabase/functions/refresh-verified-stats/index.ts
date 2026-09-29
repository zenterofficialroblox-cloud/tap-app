import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'
import {adapterFor,refreshCooldownMinutes} from '../_shared/verified-stats.ts'

const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}})
Deno.serve(async request=>{
  if(request.method==='OPTIONS')return new Response('ok',{headers:cors})
  if(request.method!=='POST')return json({error:'Method not allowed'},405)
  const url=Deno.env.get('SUPABASE_URL')!;const anon=Deno.env.get('SUPABASE_ANON_KEY')!;const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const authorization=request.headers.get('Authorization')||''
  const caller=createClient(url,anon,{global:{headers:{Authorization:authorization}}})
  const {data:{user}}=await caller.auth.getUser();if(!user)return json({error:'Unauthorized'},401)
  const body=await request.json().catch(()=>({})) as {connectionId?:string;providerId?:string}
  if(!body.connectionId||!body.providerId)return json({error:'Connection and provider are required'},400)
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data:connection}=await admin.from('connections').select('id,user_id,provider').eq('id',body.connectionId).eq('user_id',user.id).eq('provider',body.providerId).maybeSingle()
  if(!connection)return json({error:'Connection not found'},404)
  const {data:existing}=await admin.from('verified_stats').select('next_refresh_eligible_at').eq('user_id',user.id).eq('provider_id',body.providerId).order('next_refresh_eligible_at',{ascending:false}).limit(1).maybeSingle()
  if(existing?.next_refresh_eligible_at&&new Date(existing.next_refresh_eligible_at)>new Date())return json({status:'cooldown',nextRefreshEligibleAt:existing.next_refresh_eligible_at},429)
  const adapter=adapterFor(body.providerId)
  if(!adapter)return json({status:'unavailable',message:'Verified Stats support is prepared but this provider adapter is not live yet.'},501)
  const {data:account}=await admin.from('provider_accounts').select('id,provider_account_id,access_token').eq('user_id',user.id).eq('connection_id',connection.id).eq('provider_id',body.providerId).maybeSingle()
  if(!account?.access_token)return json({status:'unavailable',message:'Connect and authorize this provider before refreshing verified stats.'},409)
  const now=new Date();const next=new Date(now.getTime()+refreshCooldownMinutes*60_000)
  try{
    await admin.from('verified_stats').update({refresh_status:'pending',last_error:null}).eq('user_id',user.id).eq('provider_id',body.providerId)
    const refreshed=await adapter.refresh({providerId:body.providerId,accessToken:account.access_token,externalId:account.provider_account_id});const metrics=refreshed.metrics
    await admin.from('provider_accounts').update({username:refreshed.identity.username,display_name:refreshed.identity.displayName,provider_account_id:refreshed.identity.accountId,updated_at:now.toISOString()}).eq('id',account.id)
    const rows=metrics.map(metric=>({user_id:user.id,connection_id:connection.id,provider_id:body.providerId,metric_key:metric.key,metric_value:metric.value,metric_label:metric.label,metric_type:metric.type,is_verified:true,source_kind:'official_api',last_refreshed_at:now.toISOString(),next_refresh_eligible_at:next.toISOString(),refresh_status:'success',last_error:null,updated_at:now.toISOString()}))
    const {error}=await admin.from('verified_stats').upsert(rows,{onConflict:'user_id,provider_id,metric_key'});if(error)throw error
    await admin.from('verified_stat_snapshots').insert(rows.map(row=>({user_id:row.user_id,connection_id:row.connection_id,provider_id:row.provider_id,metric_key:row.metric_key,metric_value:row.metric_value,captured_at:now.toISOString()})))
    return json({status:'success',refreshedAt:now.toISOString(),nextRefreshEligibleAt:next.toISOString()})
  }catch(error){await admin.from('verified_stats').update({refresh_status:'error',last_error:'Provider refresh failed safely.',updated_at:now.toISOString()}).eq('user_id',user.id).eq('provider_id',body.providerId);return json({status:'error',message:error instanceof Error?error.message:'Refresh failed'},502)}
})
