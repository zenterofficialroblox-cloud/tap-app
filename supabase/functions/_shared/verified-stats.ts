export type VerifiedMetric={key:string;value:number;label:string;type:'COUNT'|'BIG_COUNT'|'TIME'|'RATIO'|'SCORE'}
export type ProviderRefreshContext={providerId:string;accessToken?:string;externalId?:string}
export type ProviderAdapter={refresh:(context:ProviderRefreshContext)=>Promise<VerifiedMetric[]>}

// Provider secrets and API-specific adapters are added here in 0.5B. Never
// accept metric values from the browser or user-authored connection metadata.
export const providerAdapters:Record<string,ProviderAdapter>={}
export const refreshCooldownMinutes=60

export function adapterFor(providerId:string){return providerAdapters[providerId]}
