export type ConnectionMode = 'oauth' | 'manual'
export type ConnectionState = 'connected' | 'manual' | 'not_connected' | 'error' | 'unavailable'
export type ProviderId = string

export interface ProviderDefinition {
  id: ProviderId; name: string; short: string; accent: string; supportsOAuth: boolean; featured?: boolean; domains?: string[];
  category: 'social' | 'gaming' | 'creator' | 'developer' | 'other'; profileUrl?: (handle: string) => string; officialUrl: string;
  tier?: 'A'|'B'|'C'|'D'|'E'; supportsManualLink?:boolean; supportsVerifiedStats?:boolean; supportsRefresh?:boolean; supportsSmartPaste?:boolean; supportsDefaultProfileUrl?:boolean; supportsCustomIcon?:boolean; supportedMetricKeys?:string[]; readiness?:'live'|'core_ready'|'planned'|'manual_only'
}
export interface Connection { id: string; provider: ProviderId; mode: ConnectionMode; state: ConnectionState; handle: string; displayLabel: string; profileUrl: string; iconUrl?: string; visible: boolean; position: number }
export interface TapCard { id: string; slug: string; name: string; type: 'main' | 'gaming' | 'social' | 'dev'; connectionIds: string[]; visible: boolean }
export type AvatarMode = 'default' | 'initials' | 'custom'
export interface Profile { username: string; displayName: string; bio: string; avatarUrl?: string; avatarMode: AvatarMode; defaultAvatarId: string; discoverable: boolean; accentColor: string; themeId: string; visibility: 'public' | 'private'; xp: number; taps: number; featuredBadges: string[]; onboardingComplete: boolean }
export interface ProfileSearchResult { username:string; displayName:string; avatarUrl?:string; avatarMode:AvatarMode; defaultAvatarId:string; level?:number; isPrivate:boolean }
export type VerifiedMetricType='COUNT'|'BIG_COUNT'|'TIME'|'RATIO'|'SCORE'
export type RefreshStatus='idle'|'pending'|'success'|'error'|'cooldown'|'unavailable'
export interface VerifiedStat {id:string;connectionId?:string;providerId:ProviderId;metricKey:string;metricValue:number;metricLabel:string;metricType:VerifiedMetricType;lastRefreshedAt?:string;nextRefreshEligibleAt?:string;refreshStatus:RefreshStatus}
export interface VerifiedXpSummary {verifiedXp:number;totalXp:number;verifiedPercent:number}
