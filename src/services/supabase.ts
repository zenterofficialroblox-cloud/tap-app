import { createClient, type Session } from "@supabase/supabase-js";
import type {
  Connection,
  Profile,
  ProfileSearchResult,
  ProviderId,
  TapCard,
  VerifiedStat,
  VerifiedXpSummary,
} from "../types";
import {normalizeAvatarIcon,normalizeAvatarMode,normalizePresetAvatar,safeAvatar,validAvatarColor} from '../lib/avatars'
import { hasValidDestination, isHexColor } from "../lib/core";
import { verifiedXpSummary } from "../lib/verifiedStats";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const appUrl =
  (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, "") ||
  location.origin;
export const isSupabaseConfigured = Boolean(url && key);
export const supabase = isSupabaseConfigured
  ? createClient(url!, key!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })
  : null;

export type AppData = {
  profile: Profile;
  connections: Connection[];
  cards: TapCard[];
};
export type PublicProfileResult = {
  status: "public" | "private" | "not_found";
  profile?: Profile;
  connections?: Connection[];
  card?: TapCard;
};

const messageFor = (
  error: { message?: string; status?: number } | null,
  fallback: string,
) => {
  const raw = error?.message?.toLowerCase() || "";
  if (raw.includes("already registered"))
    return "An account with that email already exists.";
  if (raw.includes("invalid login")) return "Email or password is incorrect.";
  if (raw.includes("email not confirmed"))
    return "Confirm your email before signing in.";
  if (raw.includes("rate limit"))
    return "Too many attempts. Wait a moment and try again.";
  if (raw.includes("network") || raw.includes("fetch"))
    return "Could not reach TAP. Check your connection and try again.";
  if (raw.includes("duplicate") || raw.includes("profiles_username_ci"))
    return "That username is already taken.";
  if (raw.includes("jwt") || raw.includes("session"))
    return "Your session expired. Sign in again.";
  if (raw.includes("payload too large") || error?.status === 413)
    return "That image is too large.";
  return fallback;
};

export async function getInitialSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error)
    throw new Error(messageFor(error, "Could not restore your session."));
  return data.session;
}
export const onAuthChange = (
  callback: (session: Session | null, event: string) => void,
) => {
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange((event, session) =>
    callback(session, event),
  );
  return () => data.subscription.unsubscribe();
};
export async function signIn(email: string, password: string) {
  if (!supabase)
    return {
      session: null,
      error:
        "Supabase is not configured. Use Example mode or add environment variables.",
    };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    session: data.session,
    error: error ? messageFor(error, "We could not sign you in.") : null,
  };
}
export async function signUp(email: string, password: string) {
  if (!supabase)
    return {
      session: null,
      needsVerification: false,
      error:
        "Supabase is not configured. Add environment variables to create real accounts.",
    };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  });
  return {
    session: data.session,
    needsVerification: Boolean(data.user && !data.session),
    error: error
      ? messageFor(error, "We could not create your account.")
      : null,
  };
}
export async function resendVerification(email: string) {
  if (!supabase) return "Supabase is not configured.";
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  });
  return error
    ? messageFor(error, "We could not resend the verification email.")
    : null;
}
export async function connectOAuth(provider: "github" | "youtube") {
  if (!supabase)
    throw new Error("Automatic connection needs Supabase configuration");
  const {data,error}=await supabase.functions.invoke('provider-oauth-start',{body:{providerId:provider}})
  if(error)throw error
  const authorizationUrl=String(data?.authorizationUrl||'')
  if(!authorizationUrl.startsWith('https://'))throw new Error(String(data?.error||'OAuth is not configured.'))
  window.location.assign(authorizationUrl)
}

const safeImageUrl = (value: unknown) =>
  typeof value === "string" && hasValidDestination(value) ? value : undefined;
const allowedThemes = new Set(["default", "neon", "galaxy", "pixel", "frost"]);
const mapProfile = (data: Record<string, unknown>): Profile => ({
  username: String(data.username || ""),
  displayName: String(data.display_name || ""),
  bio: String(data.bio || ""),
  avatarUrl: safeImageUrl(data.avatar_url),
  avatarMode: normalizeAvatarMode(data.avatar_mode),
  defaultAvatarId: normalizePresetAvatar(data.default_avatar_id),
  avatarIconId:normalizeAvatarIcon(data.avatar_icon_id),
  avatarIconColor:validAvatarColor(String(data.avatar_icon_color))?String(data.avatar_icon_color):'#FFFFFF',
  avatarBackgroundColor:validAvatarColor(String(data.avatar_background_color))?String(data.avatar_background_color):'#6D4AFF',
  avatarBackgroundColor2:validAvatarColor(String(data.avatar_background_color_2))?String(data.avatar_background_color_2):undefined,
  discoverable: data.discoverable !== false,
  accentColor: isHexColor(String(data.accent_color))
    ? String(data.accent_color)
    : "#8b5cf6",
  themeId: allowedThemes.has(String(data.theme_id))
    ? String(data.theme_id)
    : "default",
  visibility: data.visibility === "private" ? "private" : "public",
  xp: Number.isFinite(Number(data.xp))
    ? Math.max(0, Math.floor(Number(data.xp)))
    : 0,
  taps: Number.isFinite(Number(data.taps))
    ? Math.max(0, Math.floor(Number(data.taps)))
    : 0,
  featuredBadges: Array.isArray(data.featured_badges)
    ? data.featured_badges.map(String)
    : [],
  onboardingComplete: Boolean(data.onboarding_complete),
});
const mapConnection = (
  data: Record<string, unknown>,
  fallbackId?: string,
): Connection => ({
  id: String(data.id || fallbackId || crypto.randomUUID()),
  provider: String(data.provider) as ProviderId,
  mode: data.connection_mode === "oauth" ? "oauth" : "manual",
  state: data.connection_mode === "oauth" ? "connected" : "manual",
  handle: String(data.handle || ""),
  displayLabel: String(data.display_label || ""),
  profileUrl: hasValidDestination(String(data.profile_url || ""))
    ? String(data.profile_url)
    : "",
  iconUrl: safeImageUrl(data.custom_icon_url),
  visible: Boolean(data.visible),
  position: Number(data.position || 0),
});

export async function loadAppData(): Promise<AppData> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Your session expired. Sign in again.");
  const { error: profileInitError } = await supabase
    .from("profiles")
    .upsert(
      { user_id: user.id },
      { onConflict: "user_id", ignoreDuplicates: true },
    );
  if (profileInitError)
    throw new Error(
      messageFor(
        profileInitError,
        "Could not initialize your profile. Run the latest Supabase migration.",
      ),
    );
  const { error: cardInitError } = await supabase
    .from("cards")
    .upsert(
      {
        user_id: user.id,
        slug: "main",
        name: "MAIN",
        type: "main",
        visible: true,
        position: 0,
      },
      { onConflict: "user_id,slug", ignoreDuplicates: true },
    );
  if (cardInitError)
    throw new Error(
      messageFor(cardInitError, "Could not initialize your Main card."),
    );
  const [profileResult, connectionsResult, cardsResult, badgesResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "username,display_name,bio,avatar_url,avatar_mode,default_avatar_id,avatar_icon_id,avatar_icon_color,avatar_background_color,avatar_background_color_2,discoverable,accent_color,theme_id,visibility,xp,onboarding_complete",
        )
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("connections")
        .select(
          "id,provider,connection_mode,handle,display_label,profile_url,custom_icon_url,visible,position",
        )
        .order("position"),
      supabase
        .from("cards")
        .select(
          "id,slug,name,type,visible,position,card_connections(connection_id,position,enabled)",
        )
        .order("position"),
      supabase
        .from("user_badges")
        .select("featured_position,badges(code)")
        .not("featured_position", "is", null)
        .order("featured_position"),
    ]);
  const firstError =
    profileResult.error ||
    connectionsResult.error ||
    cardsResult.error ||
    badgesResult.error;
  if (firstError)
    throw new Error(messageFor(firstError, "Could not load your TAP."));
  if (!profileResult.data)
    throw new Error(
      "Your profile could not be initialized. Run the latest Supabase migration.",
    );
  const profile = mapProfile(profileResult.data);
  profile.featuredBadges = (badgesResult.data || []).flatMap((row) => {
    const badge = row.badges as unknown as { code?: string } | null;
    return badge?.code ? [badge.code] : [];
  });
  const connections = (connectionsResult.data || []).map((row) =>
    mapConnection(row),
  );
  const cards = (cardsResult.data || []).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    type: row.type as TapCard["type"],
    visible: Boolean(row.visible),
    connectionIds: [
      ...((row.card_connections || []) as {
        connection_id: string;
        position: number;
        enabled: boolean;
      }[]),
    ]
      .sort((a, b) => a.position - b.position)
      .map((x) => x.connection_id),
    hiddenConnectionIds: [
      ...((row.card_connections || []) as {
        connection_id: string;
        position: number;
        enabled: boolean;
      }[]),
    ].filter((x) => x.enabled === false).map((x) => x.connection_id),
  }));
  return { profile, connections, cards };
}

export async function saveCurrentProfile(profile: Profile) {
  if (!supabase) return { error: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Sign in again." };
  const safe=safeAvatar(profile)
  const { error } = await supabase
    .from("profiles")
    .update({
      username: safe.username || null,
      display_name: safe.displayName,
      bio: safe.bio,
      avatar_url: safe.avatarUrl || null,
      avatar_mode: safe.avatarMode,
      default_avatar_id: safe.defaultAvatarId,
      avatar_icon_id:safe.avatarIconId,
      avatar_icon_color:safe.avatarIconColor,
      avatar_background_color:safe.avatarBackgroundColor,
      avatar_background_color_2:safe.avatarBackgroundColor2||null,
      discoverable: profile.discoverable,
      accent_color: profile.accentColor,
      theme_id: profile.themeId,
      visibility: profile.visibility,
      onboarding_complete: profile.onboardingComplete,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);
  return {
    error: error ? messageFor(error, "Could not save your profile.") : null,
  };
}
export async function checkUsername(username: string) {
  if (!supabase) return true;
  const { data, error } = await supabase.rpc("username_available", {
    candidate: username,
  });
  if (error)
    throw new Error(messageFor(error, "Could not check that username."));
  return Boolean(data);
}
export async function saveConnection(connection: Connection) {
  if (!supabase) return { data: connection, error: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { data: null, error: "Your session expired. Sign in again." };
  const row = {
    id: connection.id,
    user_id: user.id,
    provider: connection.provider,
    connection_mode: connection.mode,
    handle: connection.handle,
    display_label: connection.displayLabel,
    profile_url: connection.profileUrl || null,
    custom_icon_url: connection.iconUrl || null,
    visible: connection.visible,
    position: connection.position,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("connections")
    .upsert(row)
    .select(
      "id,provider,connection_mode,handle,display_label,profile_url,custom_icon_url,visible,position",
    )
    .single();
  return {
    data: data ? mapConnection(data) : null,
    error: error ? messageFor(error, "Could not save that connection.") : null,
  };
}
export async function deleteConnection(id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from("connections").delete().eq("id", id);
  return error ? messageFor(error, "Could not remove that connection.") : null;
}
export async function syncConnections(connections: Connection[]) {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "Your session expired. Sign in again.";
  const { data: existing } = await supabase
    .from("connections")
    .select("id,custom_icon_url")
    .eq("user_id", user.id);
  const keepIds = new Set(connections.map((connection) => connection.id));
  const removedIconPaths = (existing || [])
    .filter((row) => !keepIds.has(String(row.id)) && row.custom_icon_url)
    .flatMap((row) => {
      try {
        const marker = "/storage/v1/object/public/connection-icons/";
        const path = decodeURIComponent(
          new URL(String(row.custom_icon_url)).pathname.split(marker)[1] || "",
        );
        return path.startsWith(`${user.id}/`) ? [path] : [];
      } catch {
        return [];
      }
    });
  if (connections.length) {
    const rows = connections.map((connection) => ({
      id: connection.id,
      user_id: user.id,
      provider: connection.provider,
      connection_mode: connection.mode,
      handle: connection.handle,
      display_label: connection.displayLabel,
      profile_url: connection.profileUrl || null,
      custom_icon_url: connection.iconUrl || null,
      visible: connection.visible,
      position: connection.position,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("connections").upsert(rows);
    if (error) return messageFor(error, "Could not save your connections.");
    const keep = connections.map((connection) => connection.id);
    const { error: deleteError } = await supabase
      .from("connections")
      .delete()
      .not("id", "in", `(${keep.join(",")})`);
    if (deleteError)
      return messageFor(deleteError, "Could not update your connections.");
  } else {
    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("user_id", user.id);
    if (error) return messageFor(error, "Could not update your connections.");
  }
  if (removedIconPaths.length)
    await supabase.storage.from("connection-icons").remove(removedIconPaths);
  return null;
}
export async function saveCards(cards: TapCard[]) {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "Your session expired. Sign in again.";
  for (let position = 0; position < cards.length; position++) {
    const card = cards[position];
    const { error } = await supabase
      .from("cards")
      .upsert({
        id: card.id,
        user_id: user.id,
        slug: card.slug,
        name: card.name,
        type: card.type,
        visible: card.visible,
        position,
        updated_at: new Date().toISOString(),
      });
    if (error) return messageFor(error, "Could not save your cards.");
    const { error: clearError } = await supabase
      .from("card_connections")
      .delete()
      .eq("card_id", card.id);
    if (clearError) return messageFor(clearError, "Could not update the card.");
    if (card.connectionIds.length) {
      const { error: linkError } = await supabase
        .from("card_connections")
        .insert(
          card.connectionIds.map((connection_id, index) => ({
            card_id: card.id,
            connection_id,
            position: index,
            enabled: !card.hiddenConnectionIds.includes(connection_id),
          })),
        );
      if (linkError) return messageFor(linkError, "Could not update the card.");
    }
  }
  const keep = cards.map((card) => card.id);
  if (keep.length) {
    const { error } = await supabase
      .from("cards")
      .delete()
      .neq("slug", "main")
      .not("id", "in", `(${keep.join(",")})`);
    if (error) return messageFor(error, "Could not remove that card.");
  }
  return null;
}
export async function uploadAvatar(file: File) {
  if (!supabase)
    throw new Error("Avatar upload requires Supabase configuration.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPEG, PNG, or WebP image.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("That image is too large. Choose one under 5 MB.");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Your session expired. Sign in again.");
  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[file.type];
  const path = `${user.id}/avatar.${extension}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });
  if (error) throw new Error(messageFor(error, "Could not upload that image."));
  const obsolete = ["jpg", "png", "webp"]
    .filter((item) => item !== extension)
    .map((item) => `${user.id}/avatar.${item}`);
  await supabase.storage.from("avatars").remove(obsolete);
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}
export async function getPublicProfile(
  username: string,
  cardSlug = "main",
): Promise<PublicProfileResult> {
  if (!supabase) return { status: "not_found" };
  const { data, error } = await supabase.rpc("get_public_profile", {
    requested_username: username,
    requested_card: cardSlug,
  });
  if (error) throw new Error(messageFor(error, "Could not load this TAP."));
  const raw = data as Record<string, unknown> | null;
  const status = (raw?.status as PublicProfileResult["status"]) || "not_found";
  if (status !== "public" || !raw) return { status };
  const profile = mapProfile({
    ...raw,
    onboarding_complete: true,
    featured_badges: raw.featured_badges,
  });
  const connections = (
    (raw.connections as Record<string, unknown>[]) || []
  ).map((x, index) =>
    mapConnection(
      { ...x, connection_mode: x.mode, visible: true },
      `public-${String(x.provider)}-${index}`,
    ),
  );
  const c = raw.card as Record<string, unknown> | null;
  const card = c
    ? {
        id: "public",
        slug: String(c.slug),
        name: String(c.name),
        type: String(c.type || "main") as TapCard["type"],
        visible: true,
        connectionIds: connections.map((x) => x.id),
        hiddenConnectionIds: [],
      }
    : undefined;
  return { status, profile, connections, card };
}
export async function searchProfiles(
  query: string,
): Promise<ProfileSearchResult[]> {
  if (!supabase || query.trim().length < 2) return [];
  const { data, error } = await supabase.rpc("search_profiles", {
    search_query: query.trim(),
    result_limit: 20,
  });
  if (error)
    throw new Error(messageFor(error, "Could not search TAP right now."));
  return (data || []).map((row: Record<string, unknown>) => ({
    username: String(row.username),
    displayName: String(row.display_name),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    avatarMode: normalizeAvatarMode(row.avatar_mode),
    defaultAvatarId: normalizePresetAvatar(row.default_avatar_id),
    avatarIconId:normalizeAvatarIcon(row.avatar_icon_id),avatarIconColor:String(row.avatar_icon_color||'#FFFFFF'),avatarBackgroundColor:String(row.avatar_background_color||'#6D4AFF'),avatarBackgroundColor2:row.avatar_background_color_2?String(row.avatar_background_color_2):undefined,
    level: row.level == null ? undefined : Number(row.level),
    isPrivate: Boolean(row.is_private),
  }));
}
export async function uploadConnectionIcon(file: File) {
  if (!supabase)
    throw new Error("Custom icons require Supabase configuration.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPEG, PNG, or WebP icon.");
  if (file.size > 1024 * 1024) throw new Error("Choose an icon under 1 MB.");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Your session expired. Sign in again.");
  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[file.type];
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("connection-icons")
    .upload(path, file, { contentType: file.type });
  if (error) throw new Error(messageFor(error, "Could not upload that icon."));
  return supabase.storage.from("connection-icons").getPublicUrl(path).data
    .publicUrl;
}
export async function deleteAccount() {
  if (!supabase) return "Supabase is not configured.";
  const { error } = await supabase.functions.invoke("delete-account");
  return error ? messageFor(error, "Could not delete your account.") : null;
}
export async function saveFeaturedBadges(codes: string[]) {
  if (!supabase) return null;
  const { error } = await supabase.rpc("set_featured_badges", { codes });
  return error
    ? messageFor(error, "Could not save your featured badges.")
    : null;
}
export async function loadVerifiedStats(totalXp:number):Promise<{stats:VerifiedStat[];summary:VerifiedXpSummary}>{
  if(!supabase)return {stats:[],summary:verifiedXpSummary(totalXp,0)}
  const [statsResult,xpResult]=await Promise.all([supabase.from('verified_stats').select('id,connection_id,provider_id,metric_key,metric_value,metric_label,metric_type,is_public,last_refreshed_at,next_refresh_eligible_at,refresh_status').order('provider_id'),supabase.rpc('get_verified_xp_summary')])
  if(statsResult.error||xpResult.error)return {stats:[],summary:verifiedXpSummary(totalXp,0)}
  const raw=xpResult.data as {verified_xp?:number;total_xp?:number}|null
  return {stats:(statsResult.data||[]).map(row=>({id:String(row.id),connectionId:row.connection_id?String(row.connection_id):undefined,providerId:String(row.provider_id),metricKey:String(row.metric_key),metricValue:Number(row.metric_value),metricLabel:String(row.metric_label),metricType:String(row.metric_type) as VerifiedStat['metricType'],isPublic:Boolean(row.is_public),lastRefreshedAt:row.last_refreshed_at?String(row.last_refreshed_at):undefined,nextRefreshEligibleAt:row.next_refresh_eligible_at?String(row.next_refresh_eligible_at):undefined,refreshStatus:String(row.refresh_status) as VerifiedStat['refreshStatus']})),summary:verifiedXpSummary(Number(raw?.total_xp??totalXp),Number(raw?.verified_xp||0))}
}
export async function setVerifiedStatVisibility(connectionId:string,isPublic:boolean){
  if(!supabase)return 'Supabase is not configured.'
  const {error}=await supabase.rpc('set_verified_stat_visibility',{target_connection:connectionId,make_public:isPublic})
  return error?messageFor(error,'Could not update verified stat visibility.'):null
}
export async function refreshVerifiedStats(connectionId:string,providerId:ProviderId){
  if(!supabase)return {status:'unavailable',error:'Verified refresh requires Supabase.'}
  const {data,error}=await supabase.functions.invoke('refresh-verified-stats',{body:{connectionId,providerId}})
  return {status:String((data as {status?:string}|null)?.status||'error'),error:error?messageFor(error,'Could not refresh verified stats.'):null}
}
