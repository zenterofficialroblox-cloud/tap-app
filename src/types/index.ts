export type ConnectionMode = 'oauth' | 'manual'
export type ConnectionState = 'connected' | 'manual' | 'not_connected' | 'error' | 'unavailable'
export type ProviderId = string

export interface ProviderDefinition {
  id: ProviderId; name: string; short: string; icon?:string; accent: string; supportsOAuth: boolean; featured?: boolean; domains?: string[];
  category: 'social' | 'gaming' | 'creator' | 'developer' | 'other'; profileUrl?: (handle: string) => string; officialUrl: string;
  tier?: 'A'|'B'|'C'|'D'|'E'; supportsManualLink?:boolean; supportsVerifiedStats?:boolean; supportsRefresh?:boolean; supportsSmartPaste?:boolean; supportsDefaultProfileUrl?:boolean; supportsCustomIcon?:boolean; supportedMetricKeys?:string[]; readiness?:'AVAILABLE'|'MANUAL_ONLY'|'OAUTH_READY'|'VERIFIED_STATS_READY'|'REQUIRES_CONFIGURATION'|'UNAVAILABLE'
}
export interface Connection { id: string; provider: ProviderId; mode: ConnectionMode; state: ConnectionState; handle: string; displayLabel: string; profileUrl: string; iconUrl?: string; visible: boolean; position: number }
export interface TapCard {
  id: string;
  slug: string;
  name: string;
  type: 'main' | 'gaming' | 'social' | 'dev';
  /** All saved connections in priority order, including hidden ones. */
  connectionIds: string[];
  /** Connections hidden from this public card. Their saved priority is retained. */
  hiddenConnectionIds: string[];
  visible: boolean;
}
export type AvatarMode = 'photo' | 'preset' | 'icon'
export type PresetAvatarId = 'cosmic'|'robot'|'fox'|'crystal'|'pixel'
export type AvatarIconId = 'orbit'|'bolt'|'gamepad'|'headphones'|'code'
export interface Profile { username: string; displayName: string; bio: string; avatarUrl?: string; avatarMode: AvatarMode; defaultAvatarId: PresetAvatarId; avatarIconId: AvatarIconId; avatarIconColor:string; avatarBackgroundColor:string; avatarBackgroundColor2?:string; discoverable: boolean; accentColor: string; themeId: string; visibility: 'public' | 'private'; xp: number; taps: number; featuredBadges: string[]; earnedBadges:string[]; onboardingComplete: boolean }
export interface ProfileSearchResult { username:string; displayName:string; avatarUrl?:string; avatarMode:AvatarMode; defaultAvatarId:PresetAvatarId; avatarIconId?:AvatarIconId; avatarIconColor?:string; avatarBackgroundColor?:string; avatarBackgroundColor2?:string; level?:number; isPrivate:boolean }
export type VerifiedMetricType='COUNT'|'BIG_COUNT'|'TIME'|'RATIO'|'SCORE'
export type RefreshStatus='idle'|'pending'|'success'|'error'|'cooldown'|'unavailable'
export interface VerifiedStat {id:string;connectionId?:string;providerId:ProviderId;metricKey:string;metricValue:number;metricLabel:string;metricType:VerifiedMetricType;isPublic:boolean;lastRefreshedAt?:string;nextRefreshEligibleAt?:string;refreshStatus:RefreshStatus}
export interface VerifiedXpSummary {verifiedXp:number;totalXp:number;verifiedPercent:number}
