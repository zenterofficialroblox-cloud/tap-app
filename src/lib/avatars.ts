import type {AvatarIconId,AvatarMode,PresetAvatarId,Profile} from '../types'

export const presetAvatarIds:PresetAvatarId[]=['cosmic','robot','fox','crystal','pixel']
export const avatarIconIds:AvatarIconId[]=['orbit','bolt','gamepad','headphones','code']
export const validAvatarColor=(value:string)=>/^#[0-9a-f]{6}$/i.test(value)
export const normalizeAvatarMode=(value:unknown):AvatarMode=>value==='photo'||value==='custom'?'photo':value==='icon'?'icon':'preset'
export const normalizePresetAvatar=(value:unknown):PresetAvatarId=>presetAvatarIds.includes(value as PresetAvatarId)?value as PresetAvatarId:'cosmic'
export const normalizeAvatarIcon=(value:unknown):AvatarIconId=>avatarIconIds.includes(value as AvatarIconId)?value as AvatarIconId:'orbit'
export function safeAvatar(profile:Profile):Profile{return {...profile,avatarMode:normalizeAvatarMode(profile.avatarMode),defaultAvatarId:normalizePresetAvatar(profile.defaultAvatarId),avatarIconId:normalizeAvatarIcon(profile.avatarIconId),avatarIconColor:validAvatarColor(profile.avatarIconColor)?profile.avatarIconColor:'#FFFFFF',avatarBackgroundColor:validAvatarColor(profile.avatarBackgroundColor)?profile.avatarBackgroundColor:'#6D4AFF',avatarBackgroundColor2:profile.avatarBackgroundColor2&&validAvatarColor(profile.avatarBackgroundColor2)?profile.avatarBackgroundColor2:undefined}}
