import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'
import {adapterFor} from '../_shared/verified-stats.ts'

const digest=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(byte=>byte.toString(16).padStart(2,'0')).join('')
const appUrl=()=>Deno.env.get('APP_URL')||'https://tap-app-bax.pages.dev'
const finish=(status:'success'|'error',message?:string)=>Response.redirect(`${appUrl()}/connections?${new URLSearchParams({oauth:status,...(message?{message}:{})}).toString()}`,302)

Deno.serve(async request=>{
  if(request.method!=='GET')return new Response('Method not allowed',{status:405})
  const incoming=new URL(request.url);const code=incoming.searchParams.get('code');const state=incoming.searchParams.get('state')
  if(!code||!state)return finish('error','Provider authorization was cancelled.')
  const url=Deno.env.get('SUPABASE_URL')!;const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}})
  const stateHash=await digest(state)
  const {data:saved}=await admin.from('provider_oauth_states').select('user_id,provider_id,expires_at').eq('state_hash',stateHash).maybeSingle()
  await admin.from('provider_oauth_states').delete().eq('state_hash',stateHash)
  if(!saved||new Date(saved.expires_at)<=new Date())return finish('error','This secure connection request expired. Try again.')
  const provider=String(saved.provider_id);const callback=`${url}/functions/v1/provider-oauth-callback`
  try{
    let token:{access_token:string;refresh_token?:string;expires_in?:number;scope?:string}
    if(provider==='github'){
      const response=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:Deno.env.get('GITHUB_CLIENT_ID'),client_secret:Deno.env.get('GITHUB_CLIENT_SECRET'),code,redirect_uri:callback})})
      token=await response.json();if(!response.ok||!token.access_token)throw new Error('GitHub rejected the authorization code.')
    }else{
      const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:Deno.env.get('GOOGLE_CLIENT_ID')||'',client_secret:Deno.env.get('GOOGLE_CLIENT_SECRET')||'',code,grant_type:'authorization_code',redirect_uri:callback})})
      token=await response.json();if(!response.ok||!token.access_token)throw new Error('Google rejected the authorization code.')
    }
    const refreshed=await adapterFor(provider)!.refresh({providerId:provider,accessToken:token.access_token})
    const identity=refreshed.identity
    const profileUrl=provider==='github'?`https://github.com/${encodeURIComponent(identity.username)}`:`https://www.youtube.com/${identity.username.startsWith('@')?'':'@'}${encodeURIComponent(identity.username)}`
    const {data:existing}=await admin.from('connections').select('id').eq('user_id',saved.user_id).eq('provider',provider).maybeSingle()
    const connection={user_id:saved.user_id,provider,connection_mode:'oauth',handle:identity.username,display_label:identity.displayName,profile_url:profileUrl,visible:true,updated_at:new Date().toISOString()}
    const {data:linked,error:connectionError}=existing
      ? await admin.from('connections').update(connection).eq('id',existing.id).select('id').single()
      : await admin.from('connections').insert({...connection,position:999}).select('id').single()
    if(connectionError||!linked)throw new Error('Could not save the provider connection.')
    if(!existing){const {data:main}=await admin.from('cards').select('id').eq('user_id',saved.user_id).eq('slug','main').single();if(main)await admin.from('card_connections').upsert({card_id:main.id,connection_id:linked.id,position:999,enabled:true})}
    const expires=token.expires_in?new Date(Date.now()+token.expires_in*1000).toISOString():null
    const {error:accountError}=await admin.from('provider_accounts').upsert({user_id:saved.user_id,connection_id:linked.id,provider_id:provider,provider_account_id:identity.accountId,username:identity.username,display_name:identity.displayName,access_token:token.access_token,refresh_token:token.refresh_token||null,token_expires_at:expires,scopes:(token.scope||'').split(/[ ,]+/).filter(Boolean),updated_at:new Date().toISOString()},{onConflict:'connection_id'})
    if(accountError)throw new Error('Could not store the protected provider authorization.')
    return finish('success')
  }catch(error){return finish('error',error instanceof Error?error.message:'Provider connection failed.')}
})
