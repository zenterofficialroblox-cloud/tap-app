import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'

const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}})
const digest=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(byte=>byte.toString(16).padStart(2,'0')).join('')

Deno.serve(async request=>{
  if(request.method==='OPTIONS')return new Response('ok',{headers:cors})
  if(request.method!=='POST')return json({error:'Method not allowed'},405)
  const authorization=request.headers.get('Authorization')||''
  const url=Deno.env.get('SUPABASE_URL')!;const anon=Deno.env.get('SUPABASE_ANON_KEY')!;const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const caller=createClient(url,anon,{global:{headers:{Authorization:authorization}}})
  const {data:{user}}=await caller.auth.getUser();if(!user)return json({error:'Unauthorized'},401)
  const {providerId}=await request.json().catch(()=>({})) as {providerId?:string}
  if(providerId!=='github'&&providerId!=='youtube')return json({error:'Provider is not supported'},400)
  const clientId=Deno.env.get(providerId==='github'?'GITHUB_CLIENT_ID':'GOOGLE_CLIENT_ID')
  if(!clientId)return json({error:`${providerId==='github'?'GitHub':'YouTube'} OAuth is not configured.`},503)
  const state=crypto.randomUUID()+crypto.randomUUID();const stateHash=await digest(state)
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}})
  await admin.from('provider_oauth_states').delete().eq('user_id',user.id).eq('provider_id',providerId)
  const {error}=await admin.from('provider_oauth_states').insert({state_hash:stateHash,user_id:user.id,provider_id:providerId,expires_at:new Date(Date.now()+10*60_000).toISOString()})
  if(error)return json({error:'Could not start a secure provider connection.'},500)
  const callback=`${url}/functions/v1/provider-oauth-callback`
  const target=providerId==='github'
    ? `https://github.com/login/oauth/authorize?${new URLSearchParams({client_id:clientId,redirect_uri:callback,scope:'read:user',state}).toString()}`
    : `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({client_id:clientId,redirect_uri:callback,response_type:'code',scope:'https://www.googleapis.com/auth/youtube.readonly',access_type:'offline',prompt:'consent',state}).toString()}`
  return json({authorizationUrl:target})
})
