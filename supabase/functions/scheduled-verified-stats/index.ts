import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async request=>{
  if(request.method!=='POST')return new Response('Method not allowed',{status:405})
  if(request.headers.get('x-cron-secret')!==Deno.env.get('VERIFIED_STATS_CRON_SECRET'))return new Response('Unauthorized',{status:401})
  const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data,error}=await admin.from('verified_stats').select('user_id,connection_id,provider_id').lte('next_refresh_eligible_at',new Date().toISOString()).in('refresh_status',['idle','success','cooldown']).limit(100)
  if(error)return new Response('Could not read refresh queue',{status:500})
  // The cron function intentionally returns a bounded queue. In 0.5B it will
  // dispatch each item to the same provider adapters used by manual refresh.
  return new Response(JSON.stringify({queued:data?.length||0,items:data||[]}),{headers:{'Content-Type':'application/json'}})
})
