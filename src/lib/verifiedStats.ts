import type { ProviderId, RefreshStatus, VerifiedStat, VerifiedXpSummary } from '../types'

export type XpMilestone={key:string;threshold:number;xp:number}
export const verifiedXpRules:Record<string,XpMilestone[]>={
  followers:[{key:'10',threshold:10,xp:10},{key:'100',threshold:100,xp:25},{key:'1k',threshold:1_000,xp:60},{key:'10k',threshold:10_000,xp:120},{key:'100k',threshold:100_000,xp:250},{key:'1m',threshold:1_000_000,xp:500}],
  subscribers:[{key:'10',threshold:10,xp:10},{key:'100',threshold:100,xp:25},{key:'1k',threshold:1_000,xp:60},{key:'10k',threshold:10_000,xp:120},{key:'100k',threshold:100_000,xp:250},{key:'1m',threshold:1_000_000,xp:500}],
  downloads:[{key:'100',threshold:100,xp:15},{key:'1k',threshold:1_000,xp:40},{key:'10k',threshold:10_000,xp:100},{key:'100k',threshold:100_000,xp:220},{key:'1m',threshold:1_000_000,xp:450}],
  stars:[{key:'10',threshold:10,xp:10},{key:'100',threshold:100,xp:35},{key:'1k',threshold:1_000,xp:90},{key:'10k',threshold:10_000,xp:220}],
  views:[{key:'1k',threshold:1_000,xp:15},{key:'10k',threshold:10_000,xp:45},{key:'100k',threshold:100_000,xp:120},{key:'1m',threshold:1_000_000,xp:280}],
  repositories:[{key:'1',threshold:1,xp:5},{key:'10',threshold:10,xp:20},{key:'50',threshold:50,xp:60},{key:'100',threshold:100,xp:120}],
  projects:[{key:'1',threshold:1,xp:5},{key:'10',threshold:10,xp:25},{key:'50',threshold:50,xp:80}],
  achievements:[{key:'10',threshold:10,xp:15},{key:'50',threshold:50,xp:50},{key:'100',threshold:100,xp:120}],
  hours_played:[{key:'10',threshold:10,xp:5},{key:'100',threshold:100,xp:25},{key:'1k',threshold:1_000,xp:100}]
}
export function earnedMilestones(providerId:ProviderId,metricKey:string,value:number,alreadyAwarded:Iterable<string>=[]){const awarded=new Set(alreadyAwarded);return (verifiedXpRules[metricKey]||[]).filter(rule=>value>=rule.threshold&&!awarded.has(`${providerId}:${metricKey}:${rule.key}`)).map(rule=>({...rule,awardKey:`${providerId}:${metricKey}:${rule.key}`}))}
export function verifiedXpSummary(totalXp:number,verifiedXp:number):VerifiedXpSummary{const safeTotal=Math.max(0,Math.floor(totalXp));const safeVerified=Math.min(safeTotal,Math.max(0,Math.floor(verifiedXp)));return {totalXp:safeTotal,verifiedXp:safeVerified,verifiedPercent:safeTotal?Math.round(safeVerified/safeTotal*100):0}}
export const canRefreshAt=(nextEligible?:string,now=Date.now())=>!nextEligible||new Date(nextEligible).getTime()<=now
export function cooldownLabel(nextEligible?:string,now=Date.now()){if(canRefreshAt(nextEligible,now))return 'Refresh available';const minutes=Math.max(1,Math.ceil((new Date(nextEligible!).getTime()-now)/60_000));return `You can refresh again in ${minutes} minute${minutes===1?'':'s'}.`}
export function snapshotRows(stats:Pick<VerifiedStat,'connectionId'|'providerId'|'metricKey'|'metricValue'>[],capturedAt=new Date().toISOString()){return stats.map(stat=>({connection_id:stat.connectionId||null,provider_id:stat.providerId,metric_key:stat.metricKey,metric_value:stat.metricValue,captured_at:capturedAt}))}
export const refreshStatusLabel=(status:RefreshStatus)=>({idle:'Refresh available',pending:'Refreshing',success:'Up to date',error:'Error refreshing',cooldown:'Cooldown',unavailable:'Available soon'}[status])
export const revealDelay=(index:number,reducedMotion=false)=>reducedMotion?0:Math.min(Math.max(0,index),8)*45
export const shouldAnimateReveal=(alreadyVisible:boolean,reducedMotion:boolean)=>!alreadyVisible&&!reducedMotion
