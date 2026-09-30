export type BadgeCategory = "Profile" | "Security" | "Fun";
export type BadgeRuleStatus = "automatic" | "pending";

export interface BadgeDefinition {
  id: string;
  name: string;
  category: BadgeCategory;
  icon: string;
  unlockCondition: string;
  sortOrder: number;
  ruleId: string;
  ruleStatus: BadgeRuleStatus;
  help: readonly string[];
}

type BadgeSeed = readonly [id: string, name: string, category: BadgeCategory, unlockCondition: string, ruleStatus?: BadgeRuleStatus];

const seeds: readonly BadgeSeed[] = [
  ["launch-spark","Launch Spark","Profile","Complete TAP onboarding and activate your first real profile."],
  ["first-imprint","First Imprint","Profile","Complete your username, display name, and profile description."],
  ["profile-signature","Profile Signature","Profile","Publish your TAP profile publicly for the first time."],
  ["face-forward","Face Forward","Profile","Choose a custom photo, preset avatar, or icon avatar."],
  ["chromatic-pulse","Chromatic Pulse","Profile","Save a custom profile accent color."],
  ["style-architect","Style Architect","Profile","Apply a non-default TAP theme to your profile."],
  ["first-connection","First Connection","Profile","Add your first valid provider connection."],
  ["connected-core","Connected Core","Profile","Add three valid provider connections."],
  ["identity-collector","Identity Collector","Profile","Add ten different provider connections."],
  ["woven-network","Woven Network","Profile","Connect services from at least three provider categories."],
  ["card-crafter","Card Crafter","Profile","Create your first custom TAP card."],
  ["dual-identity","Dual Identity","Profile","Create a second card with a different purpose from your Main card."],
  ["card-architect","Card Architect","Profile","Maintain at least five valid profile cards."],
  ["fine-curator","Fine Curator","Profile","Manually reorder connections on one of your cards.","pending"],
  ["intentional-layout","Intentional Layout","Profile","Customize the visibility and order of a card without deleting its connections."],
  ["clean-selection","Clean Selection","Profile","Hide at least one connection from a public card while keeping the connection saved."],
  ["essential-only","Essential Only","Profile","Publish a card containing only a deliberately selected subset of your connections."],
  ["searchable-signal","Searchable Signal","Profile","Enable your profile to appear in TAP profile search."],
  ["public-beacon","Public Beacon","Profile","Receive the first legitimate public view of your TAP profile."],
  ["shared-identity","Shared Identity","Profile","Use TAP's share feature to share your public profile URL."],
  ["qr-messenger","QR Messenger","Profile","Share your TAP identity using its QR code.","pending"],
  ["copy-ready","Copy Ready","Profile","Copy your public TAP profile link using the built-in share controls.","pending"],
  ["cross-device","Cross Device","Profile","Use the same TAP account successfully on another device or browser session.","pending"],
  ["first-impression","First Impression","Profile","Reach ten legitimate public profile views."],
  ["quiet-wave","Quiet Wave","Profile","Reach fifty legitimate public profile views."],
  ["attention-magnet","Attention Magnet","Profile","Reach one hundred legitimate public profile views."],
  ["open-gateway","Open Gateway","Profile","Reach one thousand legitimate public profile views."],
  ["social-anchor","Social Anchor","Profile","Connect your first Social-category provider."],
  ["community-thread","Community Thread","Profile","Connect at least three Social or Community providers."],
  ["creator-channel","Creator Channel","Profile","Connect your first Creator-category provider."],
  ["visual-stream","Visual Stream","Profile","Connect a provider primarily focused on video creation or publishing."],
  ["audio-trail","Audio Trail","Profile","Connect a music or audio-focused provider."],
  ["author-voice","Author Voice","Profile","Connect a writing, blog, newsletter, or publishing provider."],
  ["supporter-bridge","Supporter Bridge","Profile","Connect a supported creator-funding or supporter platform."],
  ["source-flame","Source Flame","Profile","Connect your first Development-category provider."],
  ["repository-soul","Repository Soul","Profile","Connect a supported source-code hosting profile."],
  ["deployment-trail","Deployment Trail","Profile","Connect a supported hosting, deployment, or development platform."],
  ["maker-mindset","Maker Mindset","Profile","Connect at least three Development or Design providers."],
  ["design-thread","Design Thread","Profile","Connect a supported design or prototyping platform."],
  ["package-pathfinder","Package Pathfinder","Profile","Connect a supported package registry, plugin marketplace, or distribution platform."],
  ["gaming-imprint","Gaming Imprint","Profile","Connect your first Gaming-category provider."],
  ["spawn-point","Spawn Point","Profile","Add your first supported game identity."],
  ["lobby-link","Lobby Link","Profile","Connect a gaming service centered around multiplayer or community play."],
  ["achievement-hunter","Achievement Hunter","Profile","Connect a supported gaming account capable of exposing achievements or progression."],
  ["ranked-soul","Ranked Soul","Profile","Connect a supported competitive or ranked gaming identity."],
  ["world-builder","World Builder","Profile","Connect a game or platform centered around building, creation, or custom worlds."],
  ["mod-forge","Mod Forge","Profile","Connect a supported modding or asset-distribution platform."],
  ["pixel-nomad","Pixel Nomad","Profile","Connect three different Gaming-category identities."],
  ["crossworld-identity","Crossworld Identity","Profile","Connect at least one Social, one Gaming, and one Development or Creator provider."],
  ["complete-signal","Complete Signal","Profile","Build a public TAP profile containing an avatar, theme, card, and multiple connections."],
  ["private-step","Private Step","Security","Switch your TAP profile to private for the first time."],
  ["silent-guardian","Silent Guardian","Security","Make your profile private and disable profile discoverability."],
  ["half-shadow","Half Shadow","Security","Use a private profile while intentionally remaining discoverable in search."],
  ["visibility-keeper","Visibility Keeper","Security","Review and save your public profile visibility settings.","pending"],
  ["hidden-link","Hidden Link","Security","Keep a saved connection private while other connections remain public."],
  ["selective-exposure","Selective Exposure","Security","Configure a card so only selected connections are publicly visible."],
  ["secure-return","Secure Return","Security","Log out and successfully return to your account without losing stored profile data.","pending"],
  ["session-keeper","Session Keeper","Security","Restore a valid authenticated TAP session after reopening the application.","pending"],
  ["verified-source","Verified Source","Security","Receive your first metric through an official Verified Stats provider integration."],
  ["trusted-channel","Trusted Channel","Security","Connect your first provider through supported official OAuth."],
  ["trusted-pair","Trusted Pair","Security","Connect two different providers through supported official OAuth."],
  ["real-identity-link","Real Identity Link","Security","Successfully retrieve an account identity from an official provider API."],
  ["fresh-verification","Fresh Verification","Security","Complete your first successful manual Verified Stats refresh."],
  ["background-guard","Background Guard","Security","Complete the first successful scheduled Verified Stats refresh for your account.","pending"],
  ["stable-sync","Stable Sync","Security","Complete three consecutive successful verified-stat refreshes without an adapter error.","pending"],
  ["data-trail","Data Trail","Security","Store the first verified-stat history snapshot for your account."],
  ["measured-trust","Measured Trust","Security","Earn your first Verified XP from an official provider metric."],
  ["verified-presence","Verified Presence","Security","Have at least two active providers producing verified data."],
  ["verified-spectrum","Verified Spectrum","Security","Have verified metrics from at least three different providers."],
  ["public-by-choice","Public by Choice","Security","Explicitly enable public display for at least one verified metric."],
  ["private-by-choice","Private by Choice","Security","Keep at least one verified metric private while the connection itself remains active."],
  ["privacy-mix","Privacy Mix","Security","Use different visibility settings across multiple connected providers."],
  ["safe-avatar","Safe Avatar","Security","Successfully upload and use a supported, validated custom profile image."],
  ["clean-link","Clean Link","Security","Add a provider using a valid HTTPS profile link that passes TAP validation."],
  ["smart-validation","Smart Validation","Security","Successfully use TAP smart-paste to recognize and normalize a provider profile.","pending"],
  ["account-recovery","Account Recovery","Security","Successfully complete TAP's supported password-recovery flow.","pending"],
  ["fresh-credential","Fresh Credential","Security","Successfully change your TAP account password.","pending"],
  ["verified-display","Verified Display","Security","Show verified provider identity data on your own TAP dashboard."],
  ["controlled-profile","Controlled Profile","Security","Use privacy, discoverability, and connection visibility controls together."],
  ["trust-layer","Trust Layer","Security","Maintain a profile with OAuth-linked identity, verified stats, and deliberate privacy settings."],
  ["first-level-up","First Level Up","Fun","Reach your first TAP level above the starting level."],
  ["momentum","Momentum","Fun","Earn TAP XP through meaningful actions on multiple different days.","pending"],
  ["profile-charge","Profile Charge","Fun","Reach a major TAP XP milestone."],
  ["category-hopper","Category Hopper","Fun","Use connections from at least three different provider categories."],
  ["four-worlds","Four Worlds","Fun","Connect Social, Creator, Development, and Gaming providers on one account."],
  ["quick-connect","Quick Connect","Fun","Add a supported provider using TAP's quickest available connection flow.","pending"],
  ["smart-drop","Smart Drop","Fun","Add a provider successfully by pasting a recognized profile URL.","pending"],
  ["provider-hunter","Provider Hunter","Fun","Use provider search to find and add a connection.","pending"],
  ["theme-explorer","Theme Explorer","Fun","Try multiple TAP profile themes.","pending"],
  ["color-alchemist","Color Alchemist","Fun","Create and save a custom profile color combination."],
  ["iconic-identity","Iconic Identity","Fun","Use an Icon plus Color avatar configuration."],
  ["avatar-explorer","Avatar Explorer","Fun","Use more than one available avatar mode over the lifetime of your account.","pending"],
  ["polished-presence","Polished Presence","Fun","Complete the major visual customization options available for your profile."],
  ["minimal-signal","Minimal Signal","Fun","Create a deliberately minimal public card with only your most important connections."],
  ["profile-orbit","Profile Orbit","Fun","Create a profile spanning multiple identity categories while keeping a coherent visual style."],
  ["cloud-footprint","Cloud Footprint","Fun","Use TAP successfully from multiple devices while preserving your account state.","pending"],
  ["metric-climber","Metric Climber","Fun","Unlock more than one Verified XP milestone."],
  ["living-profile","Living Profile","Fun","Have an active public profile with at least one recently refreshed verified metric."],
  ["tap-aura","TAP Aura","Fun","Combine a customized avatar, theme, cards, and connected services into a complete public identity."],
  ["profile-apex","Profile Apex","Fun","Complete the core TAP identity experience with a finished profile, public sharing, multiple connections, cards, and verified data."],
] as const;

function buildHelp(name: string, category: BadgeCategory, condition: string, status: BadgeRuleStatus): readonly string[] {
  const evaluation = status === "automatic"
    ? `TAP evaluates the ${name} rule automatically from trusted account data.`
    : `The ${name} rule is reserved for a tracked TAP capability and is not awarded from guesses.`;
  const privacy = category === "Security"
    ? "Its progress uses only the security or verification state required by this rule."
    : "Its progress does not expose private account data to profile visitors.";
  return [
    `${name} represents a specific achievement in the ${category} category.`,
    `It unlocks when you ${condition.charAt(0).toLowerCase()}${condition.slice(1)}`,
    evaluation,
    "Only completed actions recorded for your signed-in TAP account can count.",
    "Preview data, demo profiles, and manually invented statistics do not count.",
    privacy,
    "When the requirement is satisfied, ownership is stored securely on your account.",
    "An unlocked badge can be equipped from the Badges page and shown on your public profile.",
    "Unequipping the badge only removes it from the profile and never removes ownership.",
    "After it is earned, the badge remains available across refreshes, sign-ins, and supported devices.",
  ];
}

export const badges: readonly BadgeDefinition[] = seeds.map(([id,name,category,unlockCondition,status="automatic"], index) => ({
  id,
  name,
  category,
  icon: `/badges/${id}.png`,
  unlockCondition,
  sortOrder: index + 1,
  ruleId: `badge.${id}`,
  ruleStatus: status,
  help: buildHelp(name, category, unlockCondition, status),
}));

export const badgeCategoryColors: Record<BadgeCategory,string> = {Profile:"#22D3EE",Security:"#8B5CF6",Fun:"#F59E0B"};
export const lockedBadgeColor = "#737786";
export function badgeAccent(category: BadgeCategory, unlocked: boolean) { return unlocked ? badgeCategoryColors[category] : lockedBadgeColor; }
export function canEquipBadge(earned: readonly string[], id: string) { return earned.includes(id); }
export function equipBadge(featured: readonly string[], earned: readonly string[], id: string) { return canEquipBadge(earned,id)&&!featured.includes(id)?[...featured,id]:[...featured]; }
export function unequipBadge(featured: readonly string[], id: string) { return featured.filter(code=>code!==id); }
