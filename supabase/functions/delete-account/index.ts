import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins=(Deno.env.get('ALLOWED_ORIGINS')||'http://localhost:5173').split(',').map(value=>value.trim())
const cors=(origin:string|null)=>({
  'Access-Control-Allow-Origin':origin&&allowedOrigins.includes(origin)?origin:allowedOrigins[0],
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Vary':'Origin'
})

Deno.serve(async request=>{
  const origin=request.headers.get('origin')
  if(request.method==='OPTIONS')return new Response('ok',{headers:cors(origin)})
  if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers:cors(origin)})
  const authorization=request.headers.get('Authorization')
  if(!authorization)return new Response('Unauthorized',{status:401,headers:cors(origin)})
  const supabaseUrl=Deno.env.get('SUPABASE_URL')!
  const anonKey=Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const caller=createClient(supabaseUrl,anonKey,{global:{headers:{Authorization:authorization}}})
  const {data:{user},error}=await caller.auth.getUser()
  if(error||!user)return new Response('Unauthorized',{status:401,headers:cors(origin)})
  const admin=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data:files}=await admin.storage.from('avatars').list(user.id)
  if(files?.length)await admin.storage.from('avatars').remove(files.map(file=>`${user.id}/${file.name}`))
  const {data:iconFiles}=await admin.storage.from('connection-icons').list(user.id)
  if(iconFiles?.length)await admin.storage.from('connection-icons').remove(iconFiles.map(file=>`${user.id}/${file.name}`))
  const {error:deleteError}=await admin.auth.admin.deleteUser(user.id)
  if(deleteError)return new Response('Could not delete account',{status:500,headers:cors(origin)})
  return new Response(JSON.stringify({ok:true}),{headers:{...cors(origin),'Content-Type':'application/json'}})
})
