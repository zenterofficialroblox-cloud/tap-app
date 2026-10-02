import {
  Fragment,
  useEffect,
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  Copy,
  Database,
  Eye,
  EyeOff,
  ChevronLeft,
  Globe2,
  LayoutGrid,
  Link2,
  Lock,
  Mail,
  LogOut,
  Menu,
  Palette,
  QrCode,
  Search,
  Settings,
  SlidersHorizontal,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Trash2,
  Monitor,
  Plus,
  Minus,
  Gamepad2,
  Code2,
  Play,
  Headphones,
  Orbit,
  Zap,
  X,
} from "lucide-react";
import githubIcon from "simple-icons/icons/github.svg";
import gitlabIcon from "simple-icons/icons/gitlab.svg";
import discordIcon from "simple-icons/icons/discord.svg";
import spotifyIcon from "simple-icons/icons/spotify.svg";
import figmaIcon from "simple-icons/icons/figma.svg";
import youtubeIcon from "simple-icons/icons/youtube.svg";
import instagramIcon from "simple-icons/icons/instagram.svg";
import tiktokIcon from "simple-icons/icons/tiktok.svg";
import twitchIcon from "simple-icons/icons/twitch.svg";
import xIcon from "simple-icons/icons/x.svg";
import snapchatIcon from "simple-icons/icons/snapchat.svg";
import codebergIcon from "simple-icons/icons/codeberg.svg";
import giteaIcon from "simple-icons/icons/gitea.svg";
import robloxIcon from "simple-icons/icons/roblox.svg";
import steamIcon from "simple-icons/icons/steam.svg";
import playstationIcon from "simple-icons/icons/playstation.svg";
import epicIcon from "simple-icons/icons/epicgames.svg";
import facebookIcon from "simple-icons/icons/facebook.svg";
import threadsIcon from "simple-icons/icons/threads.svg";
import mastodonIcon from "simple-icons/icons/mastodon.svg";
import blueskyIcon from "simple-icons/icons/bluesky.svg";
import redditIcon from "simple-icons/icons/reddit.svg";
import pinterestIcon from "simple-icons/icons/pinterest.svg";
import whatsappIcon from "simple-icons/icons/whatsapp.svg";
import telegramIcon from "simple-icons/icons/telegram.svg";
import signalIcon from "simple-icons/icons/signal.svg";
import behanceIcon from "simple-icons/icons/behance.svg";
import dribbbleIcon from "simple-icons/icons/dribbble.svg";
import soundcloudIcon from "simple-icons/icons/soundcloud.svg";
import applemusicIcon from "simple-icons/icons/applemusic.svg";
import mediumIcon from "simple-icons/icons/medium.svg";
import substackIcon from "simple-icons/icons/substack.svg";
import notionIcon from "simple-icons/icons/notion.svg";
import patreonIcon from "simple-icons/icons/patreon.svg";
import kickIcon from "simple-icons/icons/kick.svg";
import letterboxdIcon from "simple-icons/icons/letterboxd.svg";
import stravaIcon from "simple-icons/icons/strava.svg";
import tumblrIcon from "simple-icons/icons/tumblr.svg";
import devtoIcon from "simple-icons/icons/devdotto.svg";
import stackoverflowIcon from "simple-icons/icons/stackoverflow.svg";
import replitIcon from "simple-icons/icons/replit.svg";
import itchioIcon from "simple-icons/icons/itchdotio.svg";
import eaIcon from "simple-icons/icons/ea.svg";
import riotgamesIcon from "simple-icons/icons/riotgames.svg";
import kofiIcon from "simple-icons/icons/kofi.svg";
import bandcampIcon from "simple-icons/icons/bandcamp.svg";
import lastfmIcon from "simple-icons/icons/lastdotfm.svg";
import vimeoIcon from "simple-icons/icons/vimeo.svg";
import dailymotionIcon from "simple-icons/icons/dailymotion.svg";
import unsplashIcon from "simple-icons/icons/unsplash.svg";
import goodreadsIcon from "simple-icons/icons/goodreads.svg";
import duolingoIcon from "simple-icons/icons/duolingo.svg";
import chesscomIcon from "simple-icons/icons/chessdotcom.svg";
import battlenetIcon from "simple-icons/icons/battledotnet.svg";
import ubisoftIcon from "simple-icons/icons/ubisoft.svg";
import gogIcon from "simple-icons/icons/gogdotcom.svg";
import faceitIcon from "simple-icons/icons/faceit.svg";
import curseforgeIcon from "simple-icons/icons/curseforge.svg";
import modrinthIcon from "simple-icons/icons/modrinth.svg";
import osuIcon from "simple-icons/icons/osu.svg";
import lichessIcon from "simple-icons/icons/lichess.svg";
import valorantIcon from "simple-icons/icons/valorant.svg";
import counterstrikeIcon from "simple-icons/icons/counterstrike.svg";
import leagueIcon from "simple-icons/icons/leagueoflegends.svg";
import pubgIcon from "simple-icons/icons/pubg.svg";
import fortniteIcon from "simple-icons/icons/fortnite.svg";
import bitbucketIcon from "simple-icons/icons/bitbucket.svg";
import stackblitzIcon from "simple-icons/icons/stackblitz.svg";
import glitchIcon from "simple-icons/icons/glitch.svg";
import npmIcon from "simple-icons/icons/npm.svg";
import pypiIcon from "simple-icons/icons/pypi.svg";
import dockerIcon from "simple-icons/icons/docker.svg";
import hackerrankIcon from "simple-icons/icons/hackerrank.svg";
import leetcodeIcon from "simple-icons/icons/leetcode.svg";
import codewarsIcon from "simple-icons/icons/codewars.svg";
import kaggleIcon from "simple-icons/icons/kaggle.svg";
import huggingfaceIcon from "simple-icons/icons/huggingface.svg";
import gitbookIcon from "simple-icons/icons/gitbook.svg";
import hashnodeIcon from "simple-icons/icons/hashnode.svg";
import producthuntIcon from "simple-icons/icons/producthunt.svg";
import codeforcesIcon from "simple-icons/icons/codeforces.svg";
import freecodecampIcon from "simple-icons/icons/freecodecamp.svg";
import hacktheboxIcon from "simple-icons/icons/hackthebox.svg";
import tryhackmeIcon from "simple-icons/icons/tryhackme.svg";
import {
  demoCards,
  demoConnections,
  demoProfile,
  emptyProfile,
} from "./data/demo";
import { badgeAccent, badges, equipBadge, unequipBadge, type BadgeCategory } from "./data/badges";
import {
  detectProviderFromUrl,
  hasValidDestination,
  isDemoUsername,
  isHexColor,
  isProfileComplete,
  levelFromXp,
  parseProviderInput,
  passwordSchema,
  publicSearchHref,
  tapHomeRoute,
  usernameSchema,
} from "./lib/core";
import { filterProviders, providerById, providers } from "./lib/providers";
import {
  checkUsername,
  connectOAuth,
  deleteAccount,
  getInitialSession,
  getPublicProfile,
  isSupabaseConfigured,
  loadAppData,
  loadVerifiedStats,
  onAuthChange,
  resendVerification,
  saveCards,
  saveCurrentProfile,
  saveFeaturedBadges,
  searchProfiles,
  signIn,
  signUp,
  supabase,
  syncConnections,
  uploadAvatar,
  uploadConnectionIcon,
  refreshVerifiedStats,
  setVerifiedStatVisibility,
} from "./services/supabase";
import type {
  Connection,
  Profile,
  ProfileSearchResult,
  ProviderDefinition,
  TapCard,
  ProviderId,
  VerifiedStat,
  VerifiedXpSummary,
} from "./types";
import { canRefreshAt, cooldownLabel, refreshStatusLabel, revealDelay, verifiedXpSummary } from "./lib/verifiedStats";
import {avatarIconIds,presetAvatarIds} from './lib/avatars'
import { moveCardConnection, orderedCardConnections, toggleCardConnection } from "./lib/cardOrder";

const StoreContext = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [profile, setProfile] = useState<Profile>(
    isSupabaseConfigured ? emptyProfile : demoProfile,
  );
  const [connections, setConnections] = useState<Connection[]>(
    isSupabaseConfigured ? [] : demoConnections,
  );
  const [cards, setCards] = useState<TapCard[]>(
    isSupabaseConfigured ? [] : demoCards,
  );
  const hydrated = useRef(false);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      localStorage.getItem("tap-reduced-motion") === "true",
    );
  }, []);
  const hydrate = async () => {
    if (!isSupabaseConfigured) return;
    setReady(false);
    setLoadError("");
    try {
      const data = await loadAppData();
      setProfile(data.profile);
      setConnections(data.connections);
      setCards(data.cards);
      setAuthenticated(true);
      hydrated.current = true;
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Could not load your TAP.",
      );
    } finally {
      setReady(true);
    }
  };
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    getInitialSession()
      .then((session) => {
        if (!active) return;
        if (session) {
          setAuthenticated(true);
          void hydrate();
        } else {
          setAuthenticated(false);
          setReady(true);
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message);
          setReady(true);
        }
      });
    const unsubscribe = onAuthChange((session, event) => {
      if (!active) return;
      setAuthenticated(Boolean(session));
      if (session && ["SIGNED_IN", "USER_UPDATED"].includes(event))
        void hydrate();
      if (!session) {
        setProfile(emptyProfile);
        setConnections([]);
        setCards([]);
        setReady(true);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!hydrated.current || !authenticated) return;
    let active = true;
    const timer = setTimeout(async () => {
      const connectionError = await syncConnections(connections);
      if (!active) return;
      if (connectionError) {
        setLoadError(connectionError);
        return;
      }
      const cardError = await saveCards(cards);
      if (active && cardError) setLoadError(cardError);
    }, 500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [connections, cards, authenticated]);
  return (
    <TapContext.Provider
      value={{
        profile,
        setProfile,
        connections,
        setConnections,
        cards,
        setCards,
        ready,
        authenticated,
        loadError,
        reload: hydrate,
        realMode: isSupabaseConfigured,
      }}
    >
      {children}
    </TapContext.Provider>
  );
};
import { createContext, useContext } from "react";
type TapStore = {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  connections: Connection[];
  setConnections: Dispatch<SetStateAction<Connection[]>>;
  cards: TapCard[];
  setCards: Dispatch<SetStateAction<TapCard[]>>;
  ready: boolean;
  authenticated: boolean;
  loadError: string;
  reload: () => Promise<void>;
  realMode: boolean;
};
const TapContext = createContext<TapStore | null>(null);
const useTap = () => useContext(TapContext)!;

function Logo() {
  const { authenticated, profile, ready, realMode } = useTap();
  const home = tapHomeRoute({
    realMode,
    ready,
    authenticated,
    complete: isProfileComplete(profile),
  });
  return (
    <Link className="logo" to={home} aria-label="TAP home">
      <img src="/tap-icon-192.png" alt="" aria-hidden="true" />TAP
    </Link>
  );
}
function Button({
  children,
  tone = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button className={`btn btn-${tone} ${className}`} {...props}>
      {children}
    </button>
  );
}
const brandIcons: Partial<Record<ProviderId, string>> = {
  github: githubIcon,
  gitlab: gitlabIcon,
  discord: discordIcon,
  spotify: spotifyIcon,
  figma: figmaIcon,
  youtube: youtubeIcon,
  instagram: instagramIcon,
  tiktok: tiktokIcon,
  twitch: twitchIcon,
  x: xIcon,
  snapchat: snapchatIcon,
  codeberg: codebergIcon,
  gitea: giteaIcon,
  roblox: robloxIcon,
  steam: steamIcon,
  playstation: playstationIcon,
  epic: epicIcon,
  facebook: facebookIcon,
  threads: threadsIcon,
  mastodon: mastodonIcon,
  bluesky: blueskyIcon,
  reddit: redditIcon,
  pinterest: pinterestIcon,
  whatsapp: whatsappIcon,
  telegram: telegramIcon,
  signal: signalIcon,
  behance: behanceIcon,
  dribbble: dribbbleIcon,
  soundcloud: soundcloudIcon,
  applemusic: applemusicIcon,
  medium: mediumIcon,
  substack: substackIcon,
  notion: notionIcon,
  patreon: patreonIcon,
  kick: kickIcon,
  letterboxd: letterboxdIcon,
  strava: stravaIcon,
  tumblr:tumblrIcon,devto:devtoIcon,stackoverflow:stackoverflowIcon,replit:replitIcon,itchio:itchioIcon,ea:eaIcon,riotgames:riotgamesIcon,kofi:kofiIcon,bandcamp:bandcampIcon,lastfm:lastfmIcon,vimeo:vimeoIcon,dailymotion:dailymotionIcon,unsplash:unsplashIcon,goodreads:goodreadsIcon,duolingo:duolingoIcon,chesscom:chesscomIcon,
  battlenet:battlenetIcon,ubisoft:ubisoftIcon,gog:gogIcon,faceit:faceitIcon,curseforge:curseforgeIcon,modrinth:modrinthIcon,osu:osuIcon,lichess:lichessIcon,valorant:valorantIcon,counterstrike:counterstrikeIcon,leagueoflegends:leagueIcon,pubg:pubgIcon,fortnite:fortniteIcon,
  bitbucket:bitbucketIcon,stackblitz:stackblitzIcon,glitch:glitchIcon,npm:npmIcon,pypi:pypiIcon,dockerhub:dockerIcon,hackerrank:hackerrankIcon,leetcode:leetcodeIcon,codewars:codewarsIcon,kaggle:kaggleIcon,huggingface:huggingfaceIcon,gitbook:gitbookIcon,hashnode:hashnodeIcon,producthunt:producthuntIcon,codeforces:codeforcesIcon,freecodecamp:freecodecampIcon,hackthebox:hacktheboxIcon,tryhackme:tryhackmeIcon,
};
function ProviderMark({ id, iconUrl }: { id: ProviderId; iconUrl?: string }) {
  const p = providerById(id);
  const icon = brandIcons[id];
  const [failed, setFailed] = useState("");
  const packagedIcon=id==='minecraft'?'/provider-icons/minecraft.png':id==='xbox'?'/provider-icons/xbox.svg':id==='linkedin'?'/provider-icons/linkedin.svg':id==='codepen'?'/provider-icons/codepen.svg':undefined
  const imageSource=iconUrl||packagedIcon
  const custom = imageSource && failed !== imageSource;
  const Fallback=p.category==='gaming'?Gamepad2:p.category==='developer'?Code2:p.category==='creator'?Play:p.category==='social'?UsersRound:Globe2
  return (
    <span
      className="provider-mark"
      data-provider={id}
      style={{ "--provider": p.accent } as React.CSSProperties}
    >
      {custom ? (
        <img className="provider-image" src={imageSource} onError={() => setFailed(imageSource)} alt="" />
      ) : icon ? (
        <img className="brand-icon" src={icon} alt="" />
      ) : <Fallback aria-hidden="true" />}
    </span>
  );
}
function Avatar({
  profile,
  large = false,
}: {
  profile: Profile;
  large?: boolean;
}) {
  const [failed, setFailed] = useState("");
  const custom =
    profile.avatarMode === "photo" &&
    profile.avatarUrl &&
    failed !== profile.avatarUrl;
  return (
    <div
      className={`avatar avatar-${profile.defaultAvatarId} avatar-mode-${profile.avatarMode} ${large ? "avatar-large" : ""}`}
      style={profile.avatarMode==='icon'?{'--avatar-icon':profile.avatarIconColor,'--avatar-bg':profile.avatarBackgroundColor,'--avatar-bg-2':profile.avatarBackgroundColor2||profile.avatarBackgroundColor} as React.CSSProperties:undefined}
    >
      {custom ? (
        <img
          src={profile.avatarUrl}
          onError={() => setFailed(profile.avatarUrl || "")}
          alt=""
        />
      ) : profile.avatarMode === "icon" ? <span className={`avatar-symbol avatar-symbol-${profile.avatarIconId}`}>{profile.avatarIconId==='bolt'?<Zap/>:profile.avatarIconId==='gamepad'?<Gamepad2/>:profile.avatarIconId==='headphones'?<Headphones/>:profile.avatarIconId==='code'?<Code2/>:<Orbit/>}</span> : <span className="preset-art" aria-hidden="true">{profile.defaultAvatarId==='cosmic'?<UserRound/>:profile.defaultAvatarId==='robot'?<Monitor/>:profile.defaultAvatarId==='fox'?<Sparkles/>:profile.defaultAvatarId==='crystal'?<Orbit/>:<Gamepad2/>}</span>}
    </div>
  );
}
function XPBar({ xp }: { xp: number }) {
  const l = levelFromXp(xp);
  return (
    <div className="xp">
      <div className="xp-label">
        <strong>LEVEL {l.level}</strong>
        <span>
          {l.current} / {l.required} XP
        </span>
      </div>
      <div className="xp-track">
        <i style={{ width: `${l.progress}%` }} />
      </div>
    </div>
  );
}
function RevealItem({children,index=0}:{children:ReactNode;index?:number}){
  const ref=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false)
  useEffect(()=>{const node=ref.current;if(!node)return;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('reduce-motion');if(reduced){const timer=setTimeout(()=>setVisible(true),0);return()=>clearTimeout(timer)}const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect()}},{threshold:.18});observer.observe(node);return()=>observer.disconnect()},[])
  return <div ref={ref} className={`reveal-item ${visible?'is-visible':''}`} style={{'--reveal-delay':`${revealDelay(index)}ms`} as React.CSSProperties}>{children}</div>
}
function BadgeArt({id,size="card"}:{id:string;size?:"tiny"|"card"|"help"}){
  const badge=badges.find(item=>item.id===id);
  if(!badge)return null;
  return <img className={`badge-art badge-art-${size}`} src={badge.icon} alt="" loading="lazy" decoding="async" aria-hidden="true"/>;
}
const baseThemeIds = ["default", "neon", "galaxy", "pixel", "frost"] as const;
function themeWallpaperStyle(themeId:string, variant=0){
  const isBase=(baseThemeIds as readonly string[]).includes(themeId);
  const selectedVariant=Math.min(5,Math.max(0,variant));
  return {
    "--theme-wallpaper":`url(/themes/variants/${isBase?`${themeId}-${selectedVariant}`:themeId}.png)`,
    "--theme-size":'cover',
    "--theme-position":'center',
  } as React.CSSProperties;
}
function ProfileCard({
  compact = false,
  card,
  interactive = true,
}: {
  compact?: boolean;
  card?: TapCard;
  interactive?: boolean;
}) {
  const { profile, connections, cards } = useTap();
  const [bioExpanded, setBioExpanded] = useState(false);
  const [badgesExpanded, setBadgesExpanded] = useState(false);
  const active = card || cards[0];
  const bioNeedsToggle = profile.bio.length > 60;
  const visibleBio = bioExpanded || !bioNeedsToggle
    ? profile.bio
    : `${profile.bio.slice(0, 60).trimEnd()}…`;
  const visibleBadges = badgesExpanded
    ? profile.featuredBadges
    : profile.featuredBadges.slice(0, 3);
  const shown = connections
    .filter((c) => c.visible && active?.connectionIds.includes(c.id) && !active.hiddenConnectionIds.includes(c.id))
    .sort(
      (a, b) =>
        (active?.connectionIds.indexOf(a.id) ?? a.position) -
        (active?.connectionIds.indexOf(b.id) ?? b.position),
    );
  return (
    <article
      className={`profile-card theme-${profile.themeId} ${compact ? "profile-card-compact" : ""} ${bioExpanded || badgesExpanded ? "profile-card-expanded" : ""}`}
      style={{ "--accent": profile.accentColor, ...themeWallpaperStyle(profile.themeId, profile.themeVariant) } as React.CSSProperties}
    >
      <div className="card-shine" />
      <div className="profile-identity">
        <Avatar profile={profile} large />
        <h2 title={profile.displayName}>{profile.displayName}</h2>
        <p className="handle" title={`@${profile.username}`}>
          @{profile.username}
        </p>
        {profile.bio && (
          <div className="bio-block">
            <p className="bio">{visibleBio}</p>
            {bioNeedsToggle && (
              <button type="button" className="profile-expand-toggle bio-toggle" aria-expanded={bioExpanded} onClick={() => setBioExpanded((value) => !value)}>
                {bioExpanded ? "LESS" : "MORE"}
              </button>
            )}
          </div>
        )}
        {profile.featuredBadges.length > 0 && (
          <div className="badge-row">
            {visibleBadges.map((b) => (
              <span key={b}><BadgeArt id={b} size="tiny"/>{badges.find((x) => x.id === b)?.name}</span>
            ))}
            {profile.featuredBadges.length > 3 && (
              <button type="button" className="profile-expand-toggle badge-toggle" aria-label={badgesExpanded ? "Show fewer badges" : "Show all badges"} aria-expanded={badgesExpanded} onClick={() => setBadgesExpanded((value) => !value)}>
                {badgesExpanded ? "−" : `+${profile.featuredBadges.length - 3}`}
              </button>
            )}
          </div>
        )}
      </div>
      {shown.length > 0 ? (
        <div
          className={`profile-links ${interactive ? "" : "demo-links"}`}
          tabIndex={interactive && shown.length > 4 ? 0 : undefined}
          aria-label="Connected profiles"
        >
          {shown.map((c,index) =>
            <RevealItem key={c.id} index={index}>{interactive && hasValidDestination(c.profileUrl) ? (
              <a
                href={c.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ProviderMark id={c.provider} iconUrl={c.iconUrl} />
                <span>
                  {c.displayLabel}
                  <small title={c.handle}>{c.handle && `@${c.handle}`}</small>
                </span>
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <div className="profile-link-static">
                <ProviderMark id={c.provider} iconUrl={c.iconUrl} />
                <span>
                  {c.displayLabel}
                  <small title={c.handle}>{c.handle && `@${c.handle}`}</small>
                </span>
              </div>
            )}</RevealItem>,
          )}
        </div>
      ) : (
        <div className="profile-empty">
          <Link2 />
          <strong>
            Your TAP is ready.
            <br />
            Add your first connection.
          </strong>
          {!compact && <Link to="/connections">ADD CONNECTION</Link>}
        </div>
      )}
      {!compact && <XPBar xp={profile.xp} />}
    </article>
  );
}
function DemoProfileCard() {
  const store = useTap();
  return (
    <TapContext.Provider
      value={{
        ...store,
        profile: demoProfile,
        connections: demoConnections,
        cards: demoCards,
      }}
    >
      <ProfileCard compact interactive={false} />
    </TapContext.Provider>
  );
}

function Landing() {
  const { ready, authenticated, profile, realMode } = useTap();
  if (realMode && !ready) return <RouteLoading label="Restoring your TAP…" />;
  if (realMode && authenticated)
    return <Navigate to={isProfileComplete(profile) ? "/app" : "/onboarding"} replace />;
  return (
    <main className="landing">
      <header className="topbar">
        <Logo />
        <nav>
          <Link to="/login">Sign in</Link>
          <Link className="btn btn-primary" to="/register">
            Create my TAP
          </Link>
        </nav>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} /> Your identity, one tap away
          </div>
          <h1>
            Create your identity.
            <br />
            <span>Share it instantly.</span>
          </h1>
          <p>
            Build a profile that actually feels like you. Connect your worlds,
            choose what is public, then share by link or QR.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/register">
              CREATE MY TAP <ChevronRight size={18} />
            </Link>
            <Link className="btn btn-secondary" to="/login">
              SIGN IN
            </Link>
          </div>
          <div className="service-cloud">
            {providers.slice(0, 8).map((p) => (
              <span key={p.id}>
                <ProviderMark id={p.id} />
                {p.name}
              </span>
            ))}
          </div>
        </div>
        <div className="hero-card">
          <DemoProfileCard />
          <span className="floating-pill pill-one">✦ LEVEL 12</span>
          <span className="floating-pill pill-two">
            <QrCode size={16} /> READY TO SHARE
          </span>
        </div>
      </section>
      <section className="steps">
        {[
          ["CREATE", "Customize your identity."],
          ["CONNECT", "Add the places people can find you."],
          ["TAP", "Share your profile in seconds."],
        ].map((s, i) => (
          <article key={s[0]}>
            <b>0{i + 1}</b>
            <h3>{s[0]}</h3>
            <p>{s[1]}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

const accents = [
  ["Violet", "#8B5CF6"],
  ["Blue", "#3B82F6"],
  ["Cyan", "#06B6D4"],
  ["Green", "#22C55E"],
  ["Yellow", "#EAB308"],
  ["Orange", "#F97316"],
  ["Red", "#EF4444"],
  ["Pink", "#EC4899"],
] as const;
function AccentPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [custom, setCustom] = useState(
    !accents.some(([, hex]) => hex.toLowerCase() === value.toLowerCase()),
  );
  const [hex, setHex] = useState(value.toUpperCase());
  const update = (next: string) => {
    setHex(next.toUpperCase());
    if (isHexColor(next)) onChange(next.toUpperCase());
  };
  return (
    <fieldset className="accent-picker">
      <legend>Accent color</legend>
      <div className="swatch-grid">
        {accents.map(([name, color]) => (
          <button
            type="button"
            aria-label={name}
            aria-pressed={value.toLowerCase() === color.toLowerCase()}
            className="color-swatch"
            style={{ "--swatch": color } as React.CSSProperties}
            onClick={() => {
              setCustom(false);
              update(color);
            }}
            key={name}
          >
            <i />
            <span>{name}</span>
            {value.toLowerCase() === color.toLowerCase() && <Check />}
          </button>
        ))}
        <button
          type="button"
          className={`custom-swatch ${custom ? "selected" : ""}`}
          onClick={() => setCustom(!custom)}
        >
          ＋<span>Custom</span>
        </button>
      </div>
      {custom && (
        <div className="custom-color-panel">
          <div
            className="color-preview"
            style={{ background: isHexColor(hex) ? hex : value }}
          />
          <label>
            HEX
            <div className="hex-field">
              <span>#</span>
              <input
                value={hex.replace("#", "")}
                maxLength={6}
                onChange={(e) =>
                  update(`#${e.target.value.replace(/[^0-9a-f]/gi, "")}`)
                }
                aria-invalid={!isHexColor(hex)}
              />
            </div>
          </label>
          <small>
            {isHexColor(hex)
              ? "Preview updates instantly."
              : "Enter six hexadecimal characters."}
          </small>
        </div>
      )}
    </fieldset>
  );
}
const themes = [
  ["default","Default","Clean violet depth"],["neon","Neon","Bright & vibrant"],["galaxy","Galaxy","Cosmic gradients"],["pixel","Pixel","Retro & playful"],["frost","Frost","Cool & minimal"],
  ["sunset","Sunset","Warm & cozy"],["ocean","Ocean","Calm & smooth"],["forest","Forest","Natural & fresh"],["rose","Rose","Soft & modern"],["lavender","Lavender","Dreamy & calm"],
  ["cyber","Cyber","Futuristic & sharp"],["matrix","Matrix","Dark & digital"],["ruby","Ruby","Bold & glossy"],["sapphire","Sapphire","Sleek & elegant"],["amber","Amber","Royal & rich"],
  ["mint","Mint","Fresh & clean"],["cotton","Cotton","Light & soft"],["bubble","Bubble","Fun & cheerful"],["lime","Lime","Crisp & energetic"],["peach","Peach","Friendly & warm"],
  ["midnight","Midnight","Dark & calm"],["aurora","Aurora","Colorful & fluid"],["volcano","Volcano","Intense & bold"],["meadow","Meadow","Natural & soft"],["sand","Sand","Clean & minimal"],
] as const;
function ThemePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [expanded,setExpanded]=useState(false);
  const visibleThemes=expanded?themes:themes.slice(0,5);
  return (
    <fieldset className="theme-picker">
      <legend>Theme</legend>
      <div className="theme-cards">
        {visibleThemes.map(([id, name, desc]) => (
          <button
            type="button"
            className={value === id ? "selected" : ""}
            onClick={() => onChange(id)}
            aria-pressed={value === id}
            key={id}
          >
            <i className={`theme-preview ${id}`} style={themeWallpaperStyle(id,0)}>
              <b />
              <span />
              <em />
            </i>
            <strong>{name}</strong>
            <small>{desc}</small>
            {value === id && <Check />}
          </button>
        ))}
        <button type="button" className={`theme-expand ${expanded?'expanded':''}`} onClick={()=>setExpanded(value=>!value)} aria-label={expanded?'Show fewer themes':'Show all themes'} aria-expanded={expanded}>{expanded?<Minus/>:<Plus/>}</button>
      </div>
    </fieldset>
  );
}
function AvatarPicker({
  profile,
  onChange,
  onUpload,
}: {
  profile: Profile;
  onChange: (profile: Profile) => void;
  onUpload: (file?: File) => void;
}) {
  return (
    <fieldset className="avatar-choice">
      <legend>Profile picture</legend>
      <div className="avatar-current">
        <Avatar profile={profile} large />
        <div>
          <strong>Choose your look</strong>
          <small>Use a photo, premium TAP avatar, or an icon with your colors.</small>
        </div>
      </div>
      <div className="avatar-styles">
        {presetAvatarIds.map((id) => (
          <button
            type="button"
            aria-label={`Use ${id} avatar`}
            aria-pressed={
              profile.avatarMode === "preset" && profile.defaultAvatarId === id
            }
            onClick={() =>
              onChange({
                ...profile,
                avatarMode: "preset",
                defaultAvatarId: id,
              })
            }
            key={id}
          >
            <span className={`avatar avatar-${id}`}><span className="preset-art" /></span>
          </button>
        ))}
      </div>
      <div className="avatar-icon-grid" aria-label="Icon avatars">
        {avatarIconIds.map(id=><button type="button" key={id} aria-label={`Use ${id} icon avatar`} aria-pressed={profile.avatarMode==='icon'&&profile.avatarIconId===id} onClick={()=>onChange({...profile,avatarMode:'icon',avatarIconId:id})}><Avatar profile={{...profile,avatarMode:'icon',avatarIconId:id}} /></button>)}
      </div>
      <div className="avatar-color-row">
        <label>Icon color<input value={profile.avatarIconColor} onChange={e=>onChange({...profile,avatarMode:'icon',avatarIconColor:e.target.value.toUpperCase()})} pattern="#[0-9A-Fa-f]{6}" aria-label="Avatar icon hex color" /></label>
        <label>Background<input value={profile.avatarBackgroundColor} onChange={e=>onChange({...profile,avatarMode:'icon',avatarBackgroundColor:e.target.value.toUpperCase()})} pattern="#[0-9A-Fa-f]{6}" aria-label="Avatar background hex color" /></label>
      </div>
      <div className="avatar-actions">
        <label className="btn btn-secondary">
          UPLOAD PHOTO
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onClick={(e)=>{e.currentTarget.value=""}}
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </label>
      </div>
    </fieldset>
  );
}

function AuthPage({ register = false }: { register?: boolean }) {
  const { ready, authenticated, profile, realMode } = useTap();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const nav = useNavigate();
  const strength = [
    password.length >= 8,
    /[A-Za-z]/.test(password),
    /[0-9]/.test(password),
  ].filter(Boolean).length;
  if (realMode && !ready) return <RouteLoading label="Restoring your TAP…" />;
  if (realMode && authenticated)
    return <Navigate to={isProfileComplete(profile) ? "/app" : "/onboarding"} replace />;
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const confirm = String(f.get("confirm") || password);
    if (register) {
      const check = passwordSchema.safeParse(password);
      if (!check.success) {
        setError(check.error.issues[0].message);
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match");
        return;
      }
    }
    setLoading(true);
    if (register) {
      const result = await signUp(email, password);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.needsVerification) {
        setVerificationEmail(email);
        return;
      }
      nav("/onboarding", { replace: true });
    } else {
      const result = await signIn(email, password);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      nav("/app", { replace: true });
    }
  };
  if (verificationEmail)
    return (
      <main className="auth-page">
        <Link className="back" to="/login">
          ← Back to sign in
        </Link>
        <section className="auth-card">
          <Logo />
          <div>
            <p className="eyebrow">VERIFY YOUR ACCOUNT</p>
            <h1>Check your email</h1>
            <p>
              We sent a verification link to:
              <br />
              <strong>{verificationEmail}</strong>
            </p>
          </div>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <Button
            tone="secondary"
            onClick={async () =>
              setError(
                (await resendVerification(verificationEmail)) ||
                  "Verification email sent again.",
              )
            }
          >
            RESEND EMAIL
          </Button>
          <Link className="btn btn-primary" to="/login">
            BACK TO LOGIN
          </Link>
        </section>
      </main>
    );
  return (
    <main className="auth-page">
      <Link className="back" to="/">
        ← Back to TAP
      </Link>
      <section className="auth-card">
        <Logo />
        <div>
          <p className="eyebrow">
            {register ? "NEW IDENTITY" : "WELCOME BACK"}
          </p>
          <h1>{register ? "Create your TAP" : "Sign in to TAP"}</h1>
          <p>
            {register
              ? "Start with an email. Make it yours in minutes."
              : "Your profile is waiting."}
          </p>
        </div>
        {!isSupabaseConfigured && (
          <div className="demo-note">
            Supabase is not configured. Example mode is available from the home
            page; real account actions are disabled.
          </div>
        )}
        <form onSubmit={submit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <div className="password">
              <input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {register && (
              <span className="password-meter" data-strength={strength}>
                <i />
                <i />
                <i />
                <small>
                  {strength === 3
                    ? "Strong"
                    : strength === 2
                      ? "Almost there"
                      : "8+ characters, one letter and one number"}
                </small>
              </span>
            )}
          </label>
          {register && (
            <label>
              Confirm password
              <input
                name="confirm"
                type={show ? "text" : "password"}
                required
              />
            </label>
          )}
          {!register && (
            <Link className="forgot-link" to="/forgot-password">
              Forgot password?
            </Link>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <Button disabled={loading || !isSupabaseConfigured}>
            {loading ? "PLEASE WAIT…" : register ? "CREATE ACCOUNT" : "SIGN IN"}
          </Button>
        </form>
        <p className="auth-switch">
          {register ? "Already have a TAP?" : "New here?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Sign in" : "Create one"}
          </Link>
        </p>
      </section>
    </main>
  );
}

function PasswordRecovery({ reset = false }: { reset?: boolean }) {
  const { ready, authenticated } = useTap();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const invalidReset = reset && isSupabaseConfigured && ready && !authenticated;
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const f = new FormData(e.currentTarget);
    if (reset) {
      const password = String(f.get("password"));
      const check = passwordSchema.safeParse(password);
      if (!check.success) {
        setError(check.error.issues[0].message);
        setLoading(false);
        return;
      }
      if (supabase) {
        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) {
          setError("This reset link is invalid or expired. Request a new one.");
          setLoading(false);
          return;
        }
      }
    } else {
      const email = String(f.get("email"));
      if (supabase) {
        const { error: err } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: `${location.origin}/reset-password` },
        );
        if (err) {
          setError("We couldn’t send the reset email. Try again.");
          setLoading(false);
          return;
        }
      }
    }
    setSent(true);
    setLoading(false);
  };
  return (
    <main className="auth-page">
      <Link className="back" to="/login">
        ← Back to sign in
      </Link>
      <section className="auth-card">
        <Logo />
        <div>
          <p className="eyebrow">ACCOUNT RECOVERY</p>
          <h1>{reset ? "Choose a new password" : "Reset your password"}</h1>
          <p>
            {invalidReset
              ? "This reset link is invalid or expired. Request a new one."
              : sent
                ? reset
                  ? "Your password is ready."
                  : "Check your inbox for a secure reset link."
                : reset
                  ? "Use at least eight characters with a letter and number."
                  : "Enter the email connected to your TAP."}
          </p>
        </div>
        {invalidReset ? (
          <Link className="btn btn-primary" to="/forgot-password">
            REQUEST A NEW LINK
          </Link>
        ) : sent ? (
          <Link className="btn btn-primary" to={reset ? "/app" : "/login"}>
            {reset ? "CONTINUE TO TAP" : "RETURN TO SIGN IN"}
          </Link>
        ) : (
          <form onSubmit={submit}>
            {reset ? (
              <label>
                New password
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </label>
            ) : (
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
            )}
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <Button disabled={loading}>
              {loading
                ? "WORKING…"
                : reset
                  ? "UPDATE PASSWORD"
                  : "SEND RESET LINK"}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}

function Onboarding() {
  const { profile, setProfile, authenticated, ready, realMode } = useTap();
  const nav = useNavigate();
  const [step, setStep] = useState(profile.username ? 2 : 1);
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<
    "idle" | "checking" | "available" | "unavailable" | "invalid"
  >("idle");
  useEffect(() => {
    if (step !== 1) return;
    const timer = setTimeout(() => {
      const parsed = usernameSchema.safeParse(draft.username);
      if (!parsed.success) {
        setAvailability(draft.username ? "invalid" : "idle");
        return;
      }
      setAvailability("checking");
      checkUsername(parsed.data)
        .then((ok) => setAvailability(ok ? "available" : "unavailable"))
        .catch(() => setAvailability("idle"));
    }, 450);
    return () => clearTimeout(timer);
  }, [draft.username, step]);
  if (realMode && !ready) return <RouteLoading />;
  if (realMode && !authenticated) return <Navigate to="/login" replace />;
  const chooseAvatar = async (file?: File) => {
    if (!file) return;
    setError("");
    setSaving(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      setDraft((current) => ({ ...current, avatarUrl, avatarMode: "photo" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload that image.");
    } finally {
      setSaving(false);
    }
  };
  const next = async () => {
    setError("");
    if (step === 1) {
      const r = usernameSchema.safeParse(draft.username);
      if (!r.success) {
        setError(r.error.issues[0].message);
        return;
      }
      if (availability !== "available") {
        setError(
          availability === "checking"
            ? "Still checking that username."
            : "That username is unavailable.",
        );
        return;
      }
    }
    if (step === 2 && !draft.displayName.trim()) {
      setError("Add a display name to continue.");
      return;
    }
    const nextProfile = { ...draft, onboardingComplete: step === 4 };
    setSaving(true);
    const result = await saveCurrentProfile(nextProfile);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setProfile(nextProfile);
    if (step < 4) setStep(step + 1);
    else nav("/app", { replace: true });
  };
  return (
    <main className="onboarding">
      <div className="progress-dots" aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map((n) => (
          <i className={n <= step ? "active" : ""} key={n} />
        ))}
      </div>
      <section className={`onboard-card onboard-step-${step}`}>
        <span className="eyebrow">STEP {step} OF 4</span>
        {step === 1 && (
          <>
            <h1>Claim your name.</h1>
            <p>This becomes your stable public TAP link.</p>
            <label className="big-input">
              <span>tap.app/u/</span>
              <input
                value={draft.username}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    username: e.target.value.toLowerCase().replace(/\s/g, ""),
                  })
                }
                autoFocus
              />
            </label>
            <small className={availability}>
              3–24 characters · letters, numbers, _ and .{" "}
              {availability === "checking"
                ? "· Checking…"
                : availability === "available"
                  ? "· Available"
                  : availability === "unavailable"
                    ? "· Unavailable"
                    : ""}
            </small>
          </>
        )}
        {step === 2 && (
          <>
            <h1>Show some personality.</h1>
            <AvatarPicker
              profile={{ ...draft, displayName: draft.displayName || "?" }}
              onChange={setDraft}
              onUpload={(file) => void chooseAvatar(file)}
            />
            <label>
              Display name
              <input
                value={draft.displayName}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    displayName: e.target.value.slice(0, 40),
                  })
                }
                autoFocus
              />
            </label>
            <label>
              Short bio
              <textarea
                value={draft.bio}
                onChange={(e) =>
                  setDraft({ ...draft, bio: e.target.value.slice(0, 1000) })
                }
              />
            </label>
          </>
        )}
        {step === 3 && (
          <>
            <h1>Pick your vibe.</h1>
            <ThemePicker
              value={draft.themeId}
              onChange={(themeId) => setDraft({ ...draft, themeId })}
            />
            <AccentPicker
              value={draft.accentColor}
              onChange={(accentColor) => setDraft({ ...draft, accentColor })}
            />
          </>
        )}
        {step === 4 && (
          <>
            <h1>Connect your worlds.</h1>
            <p>
              Your TAP starts empty. Add only the services you actually use.
            </p>
            <div className="mini-providers">
              {providers.slice(0, 6).map((p) => (
                <span key={p.id}>
                  <ProviderMark id={p.id} />
                  {p.name}
                </span>
              ))}
            </div>
          </>
        )}
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <div className="onboard-actions">
          {step > 1 && (
            <Button tone="ghost" onClick={() => setStep(step - 1)}>
              BACK
            </Button>
          )}
          <Button
            onClick={next}
            disabled={saving || availability === "checking"}
          >
            {saving ? "SAVING…" : step === 4 ? "ENTER TAP" : "CONTINUE"}
          </Button>
        </div>
      </section>
    </main>
  );
}

const navItems = [
  ["/app", UserRound, "Profile"],
  ["/search", Search, "Search"],
  ["/connections", Link2, "Connections"],
  ["/cards", LayoutGrid, "Cards"],
  ["/badges", BadgeCheck, "Badges"],
] as const;
function AppShell({ children }: { children: ReactNode }) {
  const { profile, realMode } = useTap();
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      {!realMode && (
        <div className="demo-banner">
          <span>EXAMPLE MODE</span> Supabase is not configured.{" "}
          <Link to="/register">Configure accounts</Link>
        </div>
      )}
      <aside className={open ? "open" : ""}>
        <div className="side-head">
          <Logo />
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <X />
          </button>
        </div>
        <nav>
          {navItems.map(([to, I, label]) => (
            <NavLink key={to} to={to} end>
              <I size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-bottom">
          <NavLink to="/settings">
            <Settings size={20} />
            Settings
          </NavLink>
          <Link to={`/u/${profile.username}`}>
            <ArrowUpRight size={20} />
            Public profile
          </Link>
        </div>
      </aside>
      {open && (
        <button
          className="nav-scrim"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}
      <header className="mobile-head">
        <Logo />
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu />
        </button>
      </header>
      <div className="app-content">{children}</div>
      <nav className="bottom-nav">
        {navItems.map(([to, I, label]) => (
          <NavLink key={to} to={to} end>
            <I />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function VerifiedStatsPanel(){
  const {profile,connections,realMode}=useTap();const [stats,setStats]=useState<VerifiedStat[]>([]);const [summary,setSummary]=useState<VerifiedXpSummary>(()=>verifiedXpSummary(profile.xp,0));const [refreshing,setRefreshing]=useState('')
  const reload=()=>loadVerifiedStats(profile.xp).then(data=>{setStats(data.stats);setSummary(data.summary)})
  useEffect(()=>{let active=true;if(!realMode)return;loadVerifiedStats(profile.xp).then(data=>{if(active){setStats(data.stats);setSummary(data.summary)}});return()=>{active=false}},[profile.xp,realMode])
  const refresh=async(stat:VerifiedStat)=>{if(!stat.connectionId||refreshing)return;setRefreshing(stat.id);await refreshVerifiedStats(stat.connectionId,stat.providerId);await reload();setRefreshing('')}
  const setPublic=async(stat:VerifiedStat)=>{if(!stat.connectionId)return;const next=!stat.isPublic;setStats(current=>current.map(item=>item.connectionId===stat.connectionId?{...item,isPublic:next}:item));const error=await setVerifiedStatVisibility(stat.connectionId,next);if(error)await reload()}
  const prepared=connections.filter(connection=>providerById(connection.provider)?.supportsVerifiedStats)
  return <section className="panel verified-panel"><header><div><span className="verified-kicker"><BadgeCheck/> VERIFIED STATS</span><h2>Verified XP</h2><p>Only official API or OAuth-confirmed metrics can contribute.</p></div><div className="verified-xp"><strong>{summary.verifiedXp}</strong><span>{summary.verifiedPercent}% of {summary.totalXp} XP</span></div></header>{stats.length?<div className="verified-stat-list">{stats.map((stat,index)=><RevealItem key={stat.id} index={index}><article><ProviderMark id={stat.providerId}/><div><strong>{stat.metricValue.toLocaleString()}</strong><span>{stat.metricLabel}</span><small>{stat.lastRefreshedAt?`Updated ${new Date(stat.lastRefreshedAt).toLocaleDateString()}`:'Awaiting first refresh'} · {refreshStatusLabel(stat.refreshStatus)}</small><label className="verified-visibility"><input type="checkbox" checked={stat.isPublic} onChange={()=>void setPublic(stat)}/> Show on public profile</label></div><Button tone="secondary" disabled={refreshing===stat.id||!stat.connectionId||!canRefreshAt(stat.nextRefreshEligibleAt)} onClick={()=>void refresh(stat)}>{refreshing===stat.id?'REFRESHING…':canRefreshAt(stat.nextRefreshEligibleAt)?'REFRESH':'COOLDOWN'}</Button>{!canRefreshAt(stat.nextRefreshEligibleAt)&&<small className="cooldown-copy">{cooldownLabel(stat.nextRefreshEligibleAt)}</small>}</article></RevealItem>)}</div>:<div className="verified-empty"><BadgeCheck/><div><strong>{prepared.length?'Connect an official account to activate verified stats.':'Connect a stats-ready provider.'}</strong><p>{prepared.length?`${prepared.map(item=>providerById(item.provider).name).join(', ')} ${prepared.length===1?'supports':'support'} official verified metrics when configured.`:'GitHub and YouTube are the first official adapters.'}</p><small>No user-entered number is treated as verified.</small></div></div>}</section>
}
function Dashboard() {
  const { profile, connections } = useTap();
  return (
    <AppShell>
      <header className="page-head">
        <div>
          <span className="eyebrow">YOUR TAP</span>
          <h1>Hey, {profile.displayName}.</h1>
          <p>Your identity is ready to share.</p>
        </div>
        <ShareButton />
      </header>
      <div className="dashboard-grid">
        <ProfileCard />
        <section className="dash-side">
          <div className="stats">
            {[
              [profile.taps, "Taps"],
              [connections.length, "Connections"],
              [profile.featuredBadges.length, "Badges"],
              [levelFromXp(profile.xp).level, "Level"],
            ].map(([n, l]) => (
              <article key={l}>
                <strong>{n}</strong>
                <span>{l}</span>
              </article>
            ))}
          </div>
          <div className="quick">
            <h2>Quick actions</h2>
            <div>
              <Link to="/edit">
                <Palette />
                Edit profile
              </Link>
              <Link to="/connections">
                <Link2 />
                Connections
              </Link>
              <Link to="/cards">
                <LayoutGrid />
                TAP cards
              </Link>
              <Link to={`/u/${profile.username}`}>
                <ArrowUpRight />
                View public
              </Link>
            </div>
          </div>
          <VerifiedStatsPanel />
          <div className="privacy-card">
            <ShieldCheck />
            <div>
              <strong>Privacy first</strong>
              <p>Only your chosen fields and visible links appear publicly.</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ProfileSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileSearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      const timer = setTimeout(() => {
        setResults([]);
        setStatus("idle");
      }, 0);
      return () => clearTimeout(timer);
    }
    let active = true;
    const timer = setTimeout(() => {
      searchProfiles(term)
        .then((data) => {
          if (active) {
            setResults(data);
            setStatus("done");
          }
        })
        .catch(() => active && setStatus("error"));
    }, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);
  const avatarProfile = (result: ProfileSearchResult): Profile => ({
    ...emptyProfile,
    username: result.username,
    displayName: result.displayName,
    avatarUrl: result.avatarUrl,
    avatarMode: result.avatarMode,
    defaultAvatarId: result.defaultAvatarId,
    avatarIconId: result.avatarIconId || emptyProfile.avatarIconId,
    avatarIconColor: result.avatarIconColor || emptyProfile.avatarIconColor,
    avatarBackgroundColor: result.avatarBackgroundColor || emptyProfile.avatarBackgroundColor,
    avatarBackgroundColor2: result.avatarBackgroundColor2,
    onboardingComplete: true,
  });
  return (
    <AppShell>
      <header className="page-head">
        <div>
          <span className="eyebrow">SEARCH PROFILES</span>
          <h1>Find people on TAP.</h1>
          <p>Search by username or display name.</p>
        </div>
      </header>
      <label className="profile-search-box">
        <Search />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setStatus(e.target.value.trim().length >= 2 ? "loading" : "idle");
          }}
          placeholder="Search people..."
          autoFocus
        />
      </label>
      <section className="search-results" aria-live="polite">
        {status === "idle" && (
          <div className="empty-state">
            <Search />
            <h2>Find people on TAP.</h2>
            <p>Enter at least two characters.</p>
          </div>
        )}
        {status === "loading" &&
          [1, 2, 3].map((id) => (
            <div className="search-skeleton" key={id}>
              <i />
              <span />
              <b />
            </div>
          ))}
        {status === "error" && (
          <div className="empty-state">
            <h2>Search is unavailable.</h2>
            <p>Try again in a moment.</p>
          </div>
        )}
        {status === "done" && results.length === 0 && (
          <div className="empty-state">
            <Search />
            <h2>No profiles found.</h2>
          </div>
        )}
        {status === "done" &&
          results.map((result) => {
            const content = (
              <>
                <Avatar profile={avatarProfile(result)} />
                <span>
                  <strong>{result.displayName}</strong>
                  <small>
                    @{result.username}
                    {!result.isPrivate && result.level ? (
                      <> · Level {result.level}</>
                    ) : null}
                  </small>
                </span>
                {result.isPrivate ? <Lock /> : <ArrowUpRight />}
              </>
            );
            const href = publicSearchHref(result);
            return href ? (
              <Link className="search-result" to={href} key={result.username}>
                {content}
              </Link>
            ) : (
              <div
                className="search-result private"
                aria-label={`${result.displayName}, private profile`}
                key={result.username}
              >
                {content}
              </div>
            );
          })}
      </section>
    </AppShell>
  );
}

function ShareButton() {
  const { profile } = useTap();
  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const url = `${location.origin}/u/${profile.username}`;
  useEffect(() => {
    let active = true;
    if (open) {
      import("qrcode")
        .then(({ default: QRCode }) =>
          QRCode.toDataURL(url, {
            width: 720,
            margin: 3,
            errorCorrectionLevel: "M",
            color: { dark: "#07070b", light: "#ffffff" },
          }),
        )
        .then((value) => {
          if (active) setQr(value);
        })
        .catch(() => undefined);
    }
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => {
      active = false;
      document.removeEventListener("keydown", close);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open, url]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("idle"), 1800);
  };
  const share = async () => {
    try {
      await navigator.share?.({ title: `${profile.displayName} on TAP`, url });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        void copy();
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Share2 size={18} /> SHARE MY TAP
      </Button>
      {open && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="share-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label="Close share dialog"
            >
              <X />
            </button>
            <Logo />
            <Avatar profile={profile} />
            <div>
              <h2 id="share-title">{profile.displayName}</h2>
              <p>@{profile.username}</p>
            </div>
            {qr ? (
              <img className="qr" src={qr} alt={`QR code for ${url}`} />
            ) : (
              <div className="qr skeleton" />
            )}
            <strong>SCAN MY TAP</strong>
            <div className="share-actions">
              <Button onClick={copy}>
                {copyState === "copied" ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}{" "}
                {copyState === "copied"
                  ? "COPIED"
                  : copyState === "error"
                    ? "COPY FAILED"
                    : "COPY LINK"}
              </Button>
              {typeof navigator.share === "function" && (
                <Button tone="secondary" onClick={() => void share()}>
                  <Share2 size={17} /> SHARE
                </Button>
              )}
            </div>
            {copyState === "error" && (
              <input
                className="share-url"
                value={url}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                aria-label="Profile URL"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function EditProfile() {
  const store = useTap();
  const { profile, setProfile } = store;
  const [draft, setDraft] = useState(profile);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const chooseAvatar = async (file?:File) => {
    if(!file)return;
    setSaveState("saving");
    try{
      const avatarUrl=await uploadAvatar(file);
      setDraft(current=>({...current,avatarUrl,avatarMode:"photo"}));
      setSaveState("idle");
    }catch{setSaveState("error")}
  };
  const save = async () => {
    const user = usernameSchema.safeParse(draft.username);
    if (
      !user.success ||
      !draft.displayName.trim() ||
      !isHexColor(draft.accentColor)
    ) {
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    const result = await saveCurrentProfile(draft);
    if (result.error) {
      setSaveState("error");
      return;
    }
    setProfile(draft);
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 1600);
  };
  return (
    <AppShell>
      <header className="page-head">
        <div>
          <span className="eyebrow">PROFILE EDITOR</span>
          <h1>Make it unmistakably yours.</h1>
          <p>Everything updates in the preview before you save.</p>
        </div>
        <Button onClick={save} disabled={saveState === "saving"}>
          {saveState === "saved" ? (
            <>
              <Check /> SAVED
            </>
          ) : saveState === "saving" ? (
            "SAVING…"
          ) : (
            <>
              <Check /> SAVE CHANGES
            </>
          )}
        </Button>
      </header>
      {saveState === "error" && (
        <div className="form-error page-error" role="alert">
          We couldn’t save your profile. Check your details and try again.
        </div>
      )}
      <div className="editor-grid">
        <section className="panel form-stack">
          <div className="form-section">
            <h2>Identity</h2>
            <label>
              Display name
              <input
                value={draft.displayName}
                maxLength={40}
                onChange={(e) =>
                  setDraft({ ...draft, displayName: e.target.value })
                }
              />
            </label>
            <label>
              Username
              <input
                value={draft.username}
                maxLength={24}
                onChange={(e) =>
                  setDraft({ ...draft, username: e.target.value.toLowerCase() })
                }
              />
            </label>
            <label>
              Bio
              <textarea
                value={draft.bio}
                maxLength={1000}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              />
              <small>{draft.bio.length}/1000</small>
            </label>
          </div>
          <div className="form-section">
            <ThemePicker
              value={draft.themeId}
              onChange={(themeId) => setDraft({ ...draft, themeId })}
            />
            <AccentPicker
              value={draft.accentColor}
              onChange={(accentColor) => setDraft({ ...draft, accentColor })}
            />
          </div>
          <fieldset className="visibility-picker">
            <legend>Profile visibility</legend>
            <button
              type="button"
              className={draft.visibility === "public" ? "selected" : ""}
              onClick={() => setDraft({ ...draft, visibility: "public" })}
            >
              <Eye />
              Public<span>Anyone with your TAP can view it.</span>
            </button>
            <button
              type="button"
              className={draft.visibility === "private" ? "selected" : ""}
              onClick={() => setDraft({ ...draft, visibility: "private" })}
            >
              <EyeOff />
              Private<span>Only you can open your profile.</span>
            </button>
          </fieldset>
        </section>
        <div className="editor-preview-column">
          <div className="sticky-preview">
            <span className="eyebrow">LIVE PREVIEW</span>
            <TapContext.Provider value={{ ...store, profile: draft }}>
              <ProfileCard />
            </TapContext.Provider>
          </div>
          <section className="panel avatar-editor-panel">
            <span className="eyebrow">AVATAR STUDIO</span>
            <AvatarPicker profile={draft} onChange={setDraft} onUpload={(file)=>void chooseAvatar(file)} />
          </section>
        </div>
      </div>
    </AppShell>
  );
}

// Kept temporarily for migration safety; /edit now redirects to the autosaving settings editor.
void EditProfile;

function Connections() {
  const { connections, setConnections, cards, setCards } = useTap();
  const [editing, setEditing] = useState<ProviderId | null>(null);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState<"all" | ProviderDefinition["category"]>(
    "all",
  );
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [paste, setPaste] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const detect = () => {
    const id = detectProviderFromUrl(paste);
    if (!id) {
      setMessage("Paste a supported HTTPS profile link.");
      return;
    }
    setFilter(providerById(id).category);
    setEditing(id);
    setValue(paste);
    setMessage(`${providerById(id).name} detected. Confirm the profile below.`);
  };
  const add = (id: ProviderId) => {
    setMessage("");
    try {
      const parsed = parseProviderInput(id, value);
      const url = parsed.url;
      const existing = connections.find((c) => c.provider === id);
      const item: Connection = {
        id: existing?.id || crypto.randomUUID(),
        provider: id,
        mode: "manual",
        state: "manual",
        handle: parsed.handle,
        displayLabel: providerById(id).name,
        profileUrl: url,
        iconUrl: id === "custom" && iconUrl ? iconUrl : existing?.iconUrl,
        visible: true,
        position: existing?.position ?? connections.length,
      };
      setConnections(
        existing
          ? connections.map((c) => (c.id === existing.id ? item : c))
          : [...connections, item],
      );
      if (!existing)
        setCards(
          cards.map((card) =>
            card.slug === "main" && !card.connectionIds.includes(item.id)
              ? { ...card, connectionIds: [...card.connectionIds, item.id] }
              : card,
          ),
        );
      setEditing(null);
      setValue("");
      setMessage(`${providerById(id).name} added to your TAP.`);
    } catch {
      setMessage("Enter a valid username or HTTPS profile URL.");
    }
  };
  const oauth = async (id: ProviderId) => {
    if (id !== "github" && id !== "youtube") return;
    try {
      await connectOAuth(id);
    } catch {
      setMessage(
        `${providerById(id).name} automatic connection isn’t configured yet. Add it manually instead.`,
      );
    }
  };
  const remove = (id: string) => {
    setConnections(connections.filter((c) => c.id !== id));
    setCards(
      cards.map((card) => ({
        ...card,
        connectionIds: card.connectionIds.filter(
          (connectionId) => connectionId !== id,
        ),
        hiddenConnectionIds: card.hiddenConnectionIds.filter(
          (connectionId) => connectionId !== id,
        ),
      })),
    );
    setEditing(null);
    setMessage("Connection removed.");
  };
  const categoryLabels = {
    social: "Social",
    gaming: "Gaming",
    creator: "Creator",
    developer: "Developer",
    other: "Other",
  };
  const visible = filterProviders(search,filter);
  const grouped = Object.entries(categoryLabels)
    .map(([id, label]) => ({
      id: id as ProviderDefinition["category"],
      label,
      items: visible.filter((p) => p.category === id),
    }))
    .filter((g) => g.items.length);
  return (
    <AppShell>
      <header className="page-head">
        <div>
          <span className="eyebrow">CONNECTIONS</span>
          <h1>Bring your worlds together.</h1>
          <p>
            Official connections where available. Polished manual links
            everywhere else.
          </p>
        </div>
      </header>
      <div className="smart-paste">
        <Link2 />
        <input
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") detect();
          }}
          placeholder="Paste profile link..."
          aria-label="Paste profile link"
        />
        <Button onClick={detect}>DETECT</Button>
      </div>
      <div className="connection-toolbar">
        <div
          className="connection-filters"
          role="tablist"
          aria-label="Connection categories"
        >
          {["all", "social", "gaming", "creator", "developer", "other"].map(
            (id) => (
              <button
                role="tab"
                aria-selected={filter === id}
                className={filter === id ? "active" : ""}
                onClick={() => setFilter(id as typeof filter)}
                key={id}
              >
                {id === "all"
                  ? "All"
                  : categoryLabels[id as keyof typeof categoryLabels]}
              </button>
            ),
          )}
        </div>
        <label className="provider-search">
          <Search />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apps…"
            aria-label="Search apps"
          />
        </label>
      </div>
      {message && (
        <div className="connection-message" role="status">
          {message}
        </div>
      )}
      <div className="provider-sections">
        {grouped.map((group) => (
          <section key={group.id}>
            <div className="category-head">
              <span>{group.label}</span>
              <small>
                {group.items.length} {group.items.length === 1 ? "app" : "apps"}
              </small>
            </div>
            <div className="provider-grid">
              {group.items.map((p) => {
                const c = connections.find((x) => x.provider === p.id);
                const status =
                  c?.state === "connected"
                    ? "Connected"
                    : c?.state === "manual"
                      ? "Added manually"
                      : p.supportsOAuth
                        ? "Not connected"
                        : "Manual connection";
                return (
                  <article
                    className={`provider-card ${c ? "provider-linked" : ""}`}
                    key={p.id}
                  >
                    <div className="provider-main">
                      <ProviderMark id={p.id} />
                      <div>
                        <small className="provider-category">
                          {group.label}
                        </small>
                        <h3>{p.name}</h3>
                        <span
                          className={`status ${c?.state || "not_connected"}`}
                        >
                          <i />
                          {status}
                        </span>
                        {c?.handle && (
                          <b className="provider-handle">@{c.handle}</b>
                        )}
                      </div>
                    </div>
                    <div className="provider-actions">
                      {!c && p.supportsOAuth ? (
                        <Button onClick={() => oauth(p.id)}>CONNECT</Button>
                      ) : (
                        <Button
                          tone={c ? "secondary" : "primary"}
                          onClick={() => {
                            setEditing(editing === p.id ? null : p.id);
                            setValue(c?.handle || "");
                          }}
                        >
                          {c ? "EDIT" : "ADD MANUALLY"}
                        </Button>
                      )}
                      {c && hasValidDestination(c.profileUrl) && (
                        <a
                          className="open-profile"
                          href={c.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          OPEN <ArrowUpRight />
                        </a>
                      )}
                    </div>
                    {editing === p.id && (
                      <div className="manual-panel">
                        <div>
                          <strong>
                            {c ? "Edit" : "Add"} {p.name}
                          </strong>
                          <a
                            href={p.officialUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            OPEN {p.name.toUpperCase()} <ArrowUpRight />
                          </a>
                        </div>
                        <label>
                          Username or profile URL
                          <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="@username or https://…"
                            autoFocus
                          />
                        </label>
                        <>
                          {p.id === "custom" && (
                            <label className="custom-icon-upload">
                              Custom icon (optional)
                              <span>
                                <ProviderMark
                                  id="custom"
                                  iconUrl={iconUrl || c?.iconUrl}
                                />
                                <label className="btn btn-secondary">
                                  CHOOSE IMAGE
                                  <input
                                    className="sr-only"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      try {
                                        setIconUrl(
                                          await uploadConnectionIcon(file),
                                        );
                                      } catch (error) {
                                        setMessage(
                                          error instanceof Error
                                            ? error.message
                                            : "Could not upload that icon.",
                                        );
                                      }
                                    }}
                                  />
                                </label>
                              </span>
                            </label>
                          )}
                          <small>
                            {p.id === "discord" || p.id === "minecraft"
                              ? "A username can be shown on TAP, but no public profile link will be invented."
                              : "Manual links are never shown as verified."}
                          </small>
                        </>
                        <div>
                          <Button onClick={() => add(p.id)}>SAVE</Button>
                          {c && (
                            <Button tone="ghost" onClick={() => remove(c.id)}>
                              REMOVE
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
        {visible.length === 0 && (
          <div className="empty-state">
            <Search />
            <h2>No apps found.</h2>
            <p>Try another name or category.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Cards() {
  const { profile, cards, setCards, connections } = useTap();
  const navigate = useNavigate();
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState("");
  const updateCard = (updated: TapCard) =>
    setCards(cards.map((card) => (card.id === updated.id ? updated : card)));
  return (
    <AppShell>
      <header className="page-head">
        <div>
          <span className="eyebrow">TAP CARDS</span>
          <h1>Different sides. One identity.</h1>
          <p>Choose and order the connections shown on each card.</p>
        </div>
        {cards.length < 4 && (
          <Button
            onClick={() =>
              setCards([
                ...cards,
                {
                  id: crypto.randomUUID(),
                  slug: `card-${cards.length + 1}`,
                  name: "NEW CARD",
                  type: "social",
                  visible: true,
                  connectionIds: connections.filter((item) => item.visible).map((item) => item.id),
                  hiddenConnectionIds: [],
                },
              ])
            }
          >
            ＋ ADD CARD
          </Button>
        )}
      </header>
      {connections.length === 0 ? (
        <div className="empty-state large">
          <LayoutGrid />
          <h2>Your Main card is ready.</h2>
          <p>Add your first connection, then choose where it appears.</p>
          <Link className="btn btn-primary" to="/connections">
            ADD A CONNECTION
          </Link>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map((card) => (
            <article className="panel card-editor" key={card.id}>
              <div className="card-editor-head">
                <input
                  value={card.name}
                  onChange={(e) =>
                    setCards(
                      cards.map((c) =>
                        c.id === card.id
                          ? { ...c, name: e.target.value.toUpperCase() }
                          : c,
                      ),
                    )
                  }
                />
                <span>/{card.slug}</span>
                {card.slug !== "main" && (
                  <button
                    className="card-delete"
                    type="button"
                    aria-label={`Delete ${card.name}`}
                    onClick={() => setCards(cards.filter((item) => item.id !== card.id))}
                  >
                    ×
                  </button>
                )}
              </div>
              {orderedCardConnections(card, connections).map((c) => {
                const selected =
                  card.connectionIds.includes(c.id) &&
                  !card.hiddenConnectionIds.includes(c.id);
                return (
                  <div className={`check-row ${selected ? "" : "card-connection-hidden"}`} key={c.id}>
                    <label>
                      <span>
                        <ProviderMark id={c.provider} />
                        {c.displayLabel}
                      </span>
                      <input
                        type="checkbox"
                        checked={selected}
                        aria-label={`${selected ? "Hide" : "Show"} ${c.displayLabel} on ${card.name}`}
                        onChange={() => updateCard(toggleCardConnection(card, c.id))}
                      />
                    </label>
                    {selected && (
                      <span className="order-actions">
                        <button
                          aria-label={`Move ${c.displayLabel} up`}
                          className="order-up"
                          type="button"
                          onClick={() => updateCard(moveCardConnection(card, c.id, -1))}
                        >
                          ↑
                        </button>
                        <button
                          aria-label={`Move ${c.displayLabel} down`}
                          className="order-down"
                          type="button"
                          onClick={() => updateCard(moveCardConnection(card, c.id, 1))}
                        >
                          ↓
                        </button>
                      </span>
                    )}
                  </div>
                );
              })}
              <button
                className="card-preview-link"
                type="button"
                disabled={previewing === card.id}
                onClick={async () => {
                  setPreviewError("");
                  setPreviewing(card.id);
                  const error = await saveCards(cards);
                  setPreviewing(null);
                  if (error) {
                    setPreviewError(error);
                    return;
                  }
                  navigate(`/u/${profile.username}?card=${encodeURIComponent(card.slug)}`);
                }}
              >
                {previewing === card.id ? "Saving…" : "Preview link"} <ArrowUpRight size={15} />
              </button>
            </article>
          ))}
        </div>
      )}
      {previewError && <p className="form-error card-preview-error">{previewError}</p>}
    </AppShell>
  );
}

function Badges() {
  const { profile, setProfile } = useTap();
  const [message, setMessage] = useState("");
  const [category,setCategory]=useState<"All"|BadgeCategory>("All");
  const toggle = async (id: string, featured: boolean) => {
    const featuredBadges = featured
      ? unequipBadge(profile.featuredBadges,id)
      : equipBadge(profile.featuredBadges,profile.earnedBadges,id);
    const error = await saveFeaturedBadges(featuredBadges);
    if (error) {
      setMessage(error);
      return;
    }
    setProfile({ ...profile, featuredBadges });
  };
  return (
    <AppShell>
      <header className="page-head">
        <div>
          <span className="eyebrow">BADGES</span>
          <h1>Your identity has receipts.</h1>
          <p>Equip the badges that represent you. XP stays server-controlled in production.</p>
        </div>
      </header>
      {message && <div className="form-error page-error">{message}</div>}
      <div className="badge-summary"><strong>{profile.earnedBadges.length}</strong><span>of {badges.length} unlocked</span><Link to="/help/badges">Badge guide <ArrowUpRight/></Link></div>
      <div className="badge-filters" aria-label="Badge categories">
        {(["All","Profile","Security","Fun"] as const).map(item=><button type="button" className={category===item?'active':''} aria-pressed={category===item} onClick={()=>setCategory(item)} key={item}>{item}</button>)}
      </div>
      <div className="badge-grid">
        {badges.filter(badge=>category==='All'||badge.category===category).map((badge) => {
          const unlocked = profile.earnedBadges.includes(badge.id);
          const featured = profile.featuredBadges.includes(badge.id);
          return (
            <article className={`badge-card badge-${badge.category.toLowerCase()} ${featured ? "featured" : ""} ${unlocked?'unlocked':'locked'}`} style={{'--badge-accent':badgeAccent(badge.category,unlocked)} as React.CSSProperties} key={badge.id}>
              <span className="badge-icon"><BadgeArt id={badge.id}/></span>
              <small>{badge.category}</small>
              <h3>{badge.name}</h3>
              <p>{badge.unlockCondition}</p>
              <b>{unlocked?(featured?'EQUIPPED':'UNLOCKED'):'LOCKED'}</b>
              {unlocked?<button type="button" onClick={() => void toggle(badge.id, featured)}>{featured?'REMOVE FROM PROFILE':'FEATURE ON PROFILE'}</button>:<Link to={`/help/badges#${badge.id}`}>HOW TO GET <ArrowUpRight/></Link>}
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}

function BadgeHelpContent(){
  const [query,setQuery]=useState("");
  const normalized=query.trim().toLowerCase();
  const visible=normalized?badges.filter(badge=>`${badge.name} ${badge.category} ${badge.unlockCondition}`.toLowerCase().includes(normalized)):badges;
  return <>
    <section className="badge-help-intro">
      <p>TAP badges are permanent achievements that document meaningful progress across your identity, security, and customization.</p>
      <p>Badges unlock automatically when their real conditions are satisfied and verified by TAP.</p>
      <p>Only unlocked badges can be equipped on your public profile.</p>
      <p>Use the Badges page to equip or unequip any badge you already own.</p>
      <p>Locked badges always remain gray, while unlocked badges use the color assigned to their category.</p>
    </section>
    <div className="badge-help-tools">
      <label className="badge-help-search"><Search/><span className="sr-only">Search badges</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search badges"/></label>
      <nav aria-label="Badge categories"><a href="#profile-badges">Profile</a><a href="#security-badges">Security</a><a href="#fun-badges">Fun</a></nav>
    </div>
    <section className="badge-docs" aria-live="polite">
      {visible.length===0?<div className="empty-state"><Search/><h2>No badges found</h2><p>Try a badge name, category, or unlock keyword.</p></div>:visible.map((badge,index)=>{
        const previous=visible[index-1];
        return <Fragment key={badge.id}>
          {(!previous||previous.category!==badge.category)&&<h2 className="badge-category-heading" id={`${badge.category.toLowerCase()}-badges`}>{badge.category} badges</h2>}
          <article id={badge.id} className={`badge-doc badge-${badge.category.toLowerCase()}`} style={{'--badge-accent':badgeAccent(badge.category,true)} as React.CSSProperties}>
            <header><BadgeArt id={badge.id} size="help"/><div><small>BADGE {String(badge.sortOrder).padStart(2,'0')} · {badge.category}</small><h3>{badge.name}</h3><strong>{badge.unlockCondition}</strong></div></header>
            <ol>{badge.help.map((sentence,sentenceIndex)=><li key={sentenceIndex}>{sentence}</li>)}</ol>
          </article>
        </Fragment>;
      })}
    </section>
  </>;
}

function HelpPage({topic}:{topic:'badges'|'levels'|'profile'}){
  const location=useLocation();
  useEffect(()=>{if(location.hash)setTimeout(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'smooth',block:'center'}),50)},[location.hash]);
  const levelRows=Array.from({length:20},(_,i)=>({level:i+1,xp:i*i*100,next:(i+1)*(i+1)*100}));
  return <main className={`help-page help-${topic}`}><header><Logo/><nav><Link to="/help/badges">Badges</Link><Link to="/help/levels">Levels</Link><Link to="/help/profile">Profile</Link><Link to="/app">Open TAP</Link></nav></header><section className="help-hero"><span className="eyebrow">TAP HELP CENTER</span><h1>{topic==='badges'?'Badges':topic==='levels'?'Levels and XP':'Your TAP profile'}</h1>{topic!=='badges'&&<p>{topic==='levels'?'Understand XP, levels, progress, and verified milestones.':'Learn how visibility, cards, connections, avatars, and sharing work.'}</p>}</section>{topic==='badges'?<BadgeHelpContent/>:topic==='levels'?<section className="help-list level-help"><article id="xp"><div><h2>How XP works</h2><p><strong>XP</strong> records meaningful progress in TAP. Verified provider milestones are calculated server-side, so manually typed statistics never count as verified XP.</p></div></article>{levelRows.map(row=><article id={`level-${row.level}`} key={row.level}><div><small>LEVEL {row.level}</small><h2>{row.xp.toLocaleString()} XP</h2><p>Reach this level at {row.xp.toLocaleString()} total XP. The next level begins at {row.next.toLocaleString()} XP.</p></div></article>)}</section>:<section className="help-list"><article id="visibility"><div><h2>Public and private profiles</h2><p>A public profile can be opened by its TAP URL. A private profile is visible only to its owner.</p></div></article><article id="cards"><div><h2>Cards and connection order</h2><p>Cards let you choose which connections appear. Hidden connections stay private and remember their saved priority.</p></div></article><article id="avatars"><div><h2>Avatar Studio</h2><p>Choose a photo, built-in TAP identity, or customizable icon. Your selection is saved to your account.</p></div></article><article id="verified"><div><h2>Verified stats</h2><p>Verified metrics come only from an explicitly authorized official provider API. They do not mean human identity verification.</p></div></article></section>}</main>
}

type SaveState = "idle" | "saving" | "saved" | "error";

function AutosaveStatus({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  return <span className={`autosave-state ${state}`} role="status">{state === "saving" ? "Saving…" : state === "saved" ? "Saved" : "Couldn’t save"}</span>;
}

function useProfileAutosave(initial: Profile, apply: (profile: Profile) => void) {
  const [draft, setDraft] = useState(initial);
  const [state, setState] = useState<SaveState>("idle");
  const lastSaved = useRef(JSON.stringify(initial));
  const pending = useRef("");
  const version = useRef(0);
  const savedTimer = useRef<number | undefined>(undefined);
  const persist = useCallback(async (next: Profile, rollback?: Profile) => {
    const serialized = JSON.stringify(next);
    if (serialized === lastSaved.current || serialized === pending.current) return true;
    const request = ++version.current;
    pending.current = serialized;
    setState("saving");
    const result = await saveCurrentProfile(next);
    if (request !== version.current) return !result.error;
    pending.current = "";
    if (result.error) {
      setState("error");
      if (rollback) setDraft(rollback);
      return false;
    }
    lastSaved.current = serialized;
    apply(next);
    setState("saved");
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setState("idle"), 1600);
    return true;
  }, [apply]);
  useEffect(() => {
    const serialized = JSON.stringify(draft);
    if (serialized === lastSaved.current || serialized === pending.current) return;
    const timer = window.setTimeout(() => void persist(draft), 650);
    return () => window.clearTimeout(timer);
  }, [draft, persist]);
  const immediate = useCallback((next: Profile) => {
    const previous = draft;
    setDraft(next);
    void persist(next, previous);
  }, [draft, persist]);
  return { draft, setDraft, immediate, state, persist };
}

function useAccountIdentity() {
  const [identity, setIdentity] = useState<{ email: string; verified: boolean }>({ email: "", verified: false });
  useEffect(() => {
    let active = true;
    void supabase?.auth.getUser().then(({ data }) => {
      if (!active || !data.user) return;
      setIdentity({ email: data.user.email || "", verified: Boolean(data.user.email_confirmed_at) });
    });
    return () => { active = false; };
  }, []);
  return identity;
}

function SettingsHeader({ title, subtitle, state, root = false }: { title: string; subtitle: string; state?: SaveState; root?: boolean }) {
  return <header className="settings-page-head"><div><span className="eyebrow">SETTINGS</span><h1>{title}</h1><p>{subtitle}</p></div><div className="settings-head-actions">{state && <AutosaveStatus state={state}/>} {!root && <Link className="btn btn-secondary" to="/settings"><ChevronLeft/> Back to settings</Link>}</div></header>;
}

const settingsLinks = [
  ["account", UserRound, "Account", "Manage your email and basic account information."],
  ["profile", Palette, "Profile & Appearance", "Customize your identity, avatar, and visual style."],
  ["privacy", Lock, "Privacy", "Control who can find and view your profile."],
  ["security", ShieldCheck, "Security", "Protect your account and verified connections."],
  ["notifications", Bell, "Notifications", "Choose what you want to be notified about."],
  ["connections", Link2, "Connected Accounts", "Manage social accounts and integrations."],
  ["badges", Sparkles, "Badge Display", "Choose which earned badges appear publicly."],
  ["preferences", SlidersHorizontal, "App Preferences", "Customize motion and interface behavior."],
  ["data", Database, "Data & Storage", "Understand storage or delete your account."],
] as const;

function SettingsSummary() {
  const { profile } = useTap();
  const identity = useAccountIdentity();
  const currentTheme = themes.find(([id]) => id === profile.themeId) || themes[0];
  return <div className="settings-summary"><div className="settings-summary-top"><Avatar profile={profile} large/><div><h2>{profile.displayName}</h2><span>@{profile.username}</span>{identity.verified && <small><i/> Verified email</small>}</div><b>✦ LEVEL {levelFromXp(profile.xp).level}</b></div><div className="summary-line"><span>THEME</span><strong>{currentTheme[1]}</strong></div><div className="summary-line"><span>ACCENT COLOR</span><i style={{background:profile.accentColor}}/><strong>{profile.accentColor}</strong></div><Link className="summary-preview" to={`/u/${profile.username}`}><Eye/> <span><strong>Preview your profile</strong><small>See how your profile looks to others.</small></span><ArrowUpRight/></Link></div>;
}

function SettingsPage() {
  return <AppShell><SettingsHeader root title="Settings" subtitle="Manage your account, privacy, appearance, and app preferences."/><div className="settings-home-layout"><nav className="settings-nav-grid">{settingsLinks.map(([path,Icon,title,description])=><Link className={`settings-nav-card settings-${path}`} to={`/settings/${path}`} key={path}><span><Icon/></span><div><h2>{title}</h2><p>{description}</p></div><ChevronRight/></Link>)}</nav><SettingsSummary/></div></AppShell>;
}

function ProfileSettingsPage() {
  const store = useTap();
  const auto = useProfileAutosave(store.profile, store.setProfile);
  const {draft,setDraft,immediate,state}=auto;
  const [username, setUsername] = useState(auto.draft.username);
  const [usernameState, setUsernameState] = useState<"available"|"unavailable"|"checking"|"invalid">("available");
  useEffect(() => {
    const value = username.toLowerCase().trim();
    if (value === draft.username) { const t=window.setTimeout(()=>setUsernameState("available"),0); return()=>window.clearTimeout(t); }
    const parsed = usernameSchema.safeParse(value);
    if (!parsed.success) { const t=window.setTimeout(()=>setUsernameState("invalid"),0); return()=>window.clearTimeout(t); }
    const timer = window.setTimeout(() => void checkUsername(value).then((available) => {
      setUsernameState(available ? "available" : "unavailable");
      if (available) setUsername(value);
      if (available) setDraft((current) => ({...current, username:value}));
    }).catch(()=>setUsernameState("unavailable")), 450);
    return () => window.clearTimeout(timer);
  }, [username, draft.username, setDraft]);
  const chooseAvatar = async (file?: File) => {
    if (!file) return;
    try { const avatarUrl = await uploadAvatar(file); immediate({...draft, avatarUrl, avatarMode:"photo"}); }
    catch { /* upload validation is surfaced by autosave status below */ }
  };
  return <AppShell><SettingsHeader title="Profile & Appearance" subtitle="Customize how your identity looks across TAP." state={state}/><div className="profile-settings-layout"><div className="profile-settings-sections"><section className="settings-panel"><header><UserRound/><div><h2>Basic information</h2><p>This information is visible on your public profile.</p></div></header><div className="settings-fields"><label>Display name<div><input maxLength={40} value={draft.displayName} onChange={e=>setDraft({...draft,displayName:e.target.value})}/><small>{draft.displayName.length}/40</small></div></label><label>Username<div className="username-field"><span>@</span><input maxLength={24} value={username} onChange={e=>{const value=e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,"");setUsername(value);setUsernameState(usernameSchema.safeParse(value).success?"checking":"invalid");}}/><small className={usernameState}>{usernameState === "checking" ? "Checking…" : usernameState[0].toUpperCase()+usernameState.slice(1)}</small></div></label><label>Bio<div><textarea maxLength={1000} value={draft.bio} onChange={e=>setDraft({...draft,bio:e.target.value})}/><small>{draft.bio.length}/1000</small></div></label></div></section><section className="settings-panel"><header><UserRound/><div><h2>Avatar</h2><p>Choose how your avatar appears across TAP.</p></div></header><AvatarPicker profile={draft} onChange={immediate} onUpload={file=>void chooseAvatar(file)}/></section><section className="settings-panel"><header><Palette/><div><h2>Accent color</h2><p>Used across your profile, cards, and interface elements.</p></div></header><AccentPicker value={draft.accentColor} onChange={accentColor=>immediate({...draft,accentColor})}/></section><section className="settings-panel"><header><Sparkles/><div><h2>Theme</h2><p>Choose a visual theme for your public profile.</p></div></header><ThemePicker value={draft.themeId} onChange={themeId=>immediate({...draft,themeId})}/></section></div><div className="settings-live-preview"><span className="eyebrow">PROFILE PREVIEW</span><TapContext.Provider value={{...store,profile:draft}}><ProfileCard card={store.cards[0]}/></TapContext.Provider><div className="real-profile-stats"><span><strong>{store.connections.length}</strong> connections</span><span><strong>{store.cards.length}</strong> cards</span></div></div></div></AppShell>;
}

function PrivacySettingsPage() {
  const store=useTap(); const auto=useProfileAutosave(store.profile,store.setProfile);
  return <AppShell><SettingsHeader title="Privacy Settings" subtitle="Control how people find and view your TAP." state={auto.state}/><div className="settings-stack wide"><section className="settings-panel"><header><Eye/><div><h2>Profile visibility</h2><p>Choose whether visitors can open your public profile.</p></div></header><div className="visibility-picker"><button className={auto.draft.visibility==='public'?'selected':''} onClick={()=>auto.immediate({...auto.draft,visibility:'public'})}><Eye/>Public<span>Anyone with your link can view it.</span></button><button className={auto.draft.visibility==='private'?'selected':''} onClick={()=>auto.immediate({...auto.draft,visibility:'private'})}><EyeOff/>Private<span>Only you can open your profile.</span></button></div><label className="setting-row"><span><b>Appear in profile search</b><small>Controls whether people can discover your TAP by username.</small></span><input type="checkbox" checked={auto.draft.discoverable} onChange={e=>auto.immediate({...auto.draft,discoverable:e.target.checked})}/></label></section><section className="settings-panel honest-state"><ShieldCheck/><div><h2>Per-item visibility</h2><p>Connection visibility, card visibility, and Verified Stats visibility are managed from their existing editors so the real provider and card permissions remain intact.</p><div><Link className="btn btn-secondary" to="/connections">Connections</Link><Link className="btn btn-secondary" to="/cards">Cards</Link></div></div></section></div></AppShell>;
}

function DangerZone() {
  const { realMode }=useTap(); const nav=useNavigate(); const [deleting,setDeleting]=useState(false); const [error,setError]=useState("");
  const remove=async()=>{if(!confirm("Permanently delete your TAP account and all data? This cannot be undone."))return;setDeleting(true);const result=await deleteAccount();setDeleting(false);if(result){setError(result);return;}await supabase?.auth.signOut();nav("/",{replace:true});};
  return <section className="settings-panel danger-zone"><Trash2/><div><h2>Danger Zone</h2><p>Permanently delete your account, profile, connections, cards, badges, and uploaded files.</p>{error&&<small>{error}</small>}</div><Button tone="secondary" disabled={!realMode||deleting} onClick={()=>void remove()}>{deleting?"DELETING…":"DELETE ACCOUNT"}</Button></section>;
}

function SecuritySettingsPage() {
  const { connections }=useTap(); const identity=useAccountIdentity();
  return <AppShell><SettingsHeader title="Security Settings" subtitle="Protect your account, sessions, and verified connections."/><div className="security-settings-grid"><div className="settings-stack wide"><section className="settings-panel"><header><Mail/><div><h2>Email Address</h2><p>Your email is used for login and account recovery.</p></div></header><div className="security-value"><strong>{identity.email||"Email unavailable"}</strong>{identity.verified&&<span>✓ Verified</span>}</div></section><section className="settings-panel row-panel"><Lock/><div><h2>Password</h2><p>Change your password using Supabase’s secure recovery flow.</p></div><Link className="btn btn-secondary" to="/forgot-password">Change password</Link></section><section className="settings-panel row-panel"><ShieldCheck/><div><h2>Two-factor authentication (2FA)</h2><p>An end-to-end 2FA flow is not configured for TAP yet.</p></div><span className="coming-soon">Coming soon</span></section><section className="settings-panel honest-state"><Monitor/><div><h2>Session management</h2><p>Current session is active. Advanced device, location, and per-session management is not available from the current Supabase setup.</p></div></section></div><div className="settings-stack wide"><section className="settings-panel"><header><Link2/><div><h2>Connected OAuth accounts</h2><p>Real provider status from your TAP connections.</p></div></header><div className="compact-connections">{connections.filter(c=>c.mode==='oauth').length?connections.filter(c=>c.mode==='oauth').map(c=><div key={c.id}><ProviderMark id={c.provider}/><span><strong>{providerById(c.provider)?.name||c.displayLabel}</strong><small>{c.handle}</small></span><b>Connected</b></div>):<p>No OAuth providers connected.</p>}</div><Link className="btn btn-secondary" to="/settings/connections">Manage accounts</Link></section><section className="settings-panel honest-state"><ShieldCheck/><div><h2>Login preferences and alerts</h2><p>Configurable timeouts and login-alert emails are not backed by TAP yet.</p><span className="coming-soon">Coming soon</span></div></section></div></div><DangerZone/></AppShell>;
}

function SimpleSettingsPage({ kind }:{kind:"account"|"notifications"|"connections"|"badges"|"preferences"|"data"}) {
  const store=useTap(); const identity=useAccountIdentity(); const nav=useNavigate(); const [reduced,setReduced]=useState(()=>localStorage.getItem("tap-reduced-motion")==="true");
  const logout=async()=>{await supabase?.auth.signOut();nav("/login",{replace:true});};
  if(kind==="account") return <AppShell><SettingsHeader title="Account" subtitle="Manage your email and account access."/><div className="settings-stack wide"><section className="settings-panel"><header><Mail/><div><h2>Email</h2><p>{identity.email||"Email unavailable"}</p></div></header>{identity.verified&&<span className="verified-label">✓ Verified</span>}</section><section className="settings-panel row-panel"><Lock/><div><h2>Password</h2><p>Securely change your password through account recovery.</p></div><Link className="btn btn-secondary" to="/forgot-password">Change password</Link></section><section className="settings-panel row-panel"><LogOut/><div><h2>Sign out</h2><p>End the current browser session.</p></div><Button tone="secondary" onClick={()=>void logout()}>LOG OUT</Button></section></div></AppShell>;
  if(kind==="notifications") return <AppShell><SettingsHeader title="Notifications" subtitle="Choose what you want to be notified about."/><section className="settings-panel coming-panel"><Bell/><h2>Notifications are coming soon</h2><p>TAP does not currently have a notification delivery backend, so no non-functional toggles are shown.</p></section></AppShell>;
  if(kind==="connections") return <AppShell><SettingsHeader title="Connected Accounts" subtitle="Review the real accounts and integrations connected to TAP."/><div className="settings-stack wide"><section className="settings-panel"><div className="compact-connections">{store.connections.length?store.connections.map(c=><div key={c.id}><ProviderMark id={c.provider}/><span><strong>{c.displayLabel}</strong><small>{c.handle} · {c.mode==='oauth'?'OAuth':'Manual'} · {c.visible?'Public':'Private'}</small></span><b className={c.state}>{c.state.replace('_',' ')}</b></div>):<p>No accounts connected yet.</p>}</div></section><Link className="btn btn-primary settings-primary-action" to="/connections">Open connection manager</Link></div></AppShell>;
  if(kind==="badges") return <AppShell><SettingsHeader title="Badge Display" subtitle="Manage the earned badges shown on your public profile."/><section className="settings-panel"><header><Sparkles/><div><h2>{store.profile.featuredBadges.length} equipped</h2><p>Unequipping a badge never removes ownership. Locked badges cannot be equipped.</p></div></header><div className="equipped-badges">{store.profile.featuredBadges.map(id=><BadgeArt id={id} key={id}/>)}</div><Link className="btn btn-primary" to="/badges">Manage all badges</Link></section></AppShell>;
  if(kind==="preferences") return <AppShell><SettingsHeader title="App Preferences" subtitle="Customize interface-level behavior."/><section className="settings-panel"><label className="setting-row"><span><b>Reduced motion</b><small>Reduce transitions and reveal animations. Your preference stays in this browser.</small></span><input type="checkbox" checked={reduced} onChange={e=>{setReduced(e.target.checked);localStorage.setItem("tap-reduced-motion",String(e.target.checked));document.documentElement.classList.toggle("reduce-motion",e.target.checked);}}/></label><div className="setting-row"><span><b>Profile theme</b><small>Theme selection is saved to your TAP account.</small></span><Link className="btn btn-secondary" to="/settings/profile">Choose theme</Link></div></section></AppShell>;
  return <AppShell><SettingsHeader title="Data & Storage" subtitle="Understand how TAP stores your account data."/><div className="settings-stack wide"><section className="settings-panel"><header><Database/><div><h2>Account data</h2><p>Your profile, cards, connections, badge ownership, and preferences are stored in Supabase under your authenticated account. Uploaded avatars and custom icons use owner-scoped storage.</p></div></header></section><section className="settings-panel honest-state"><Database/><div><h2>Account export</h2><p>A complete downloadable export is not implemented yet.</p><span className="coming-soon">Coming soon</span></div></section><DangerZone/></div></AppShell>;
}

function PublicProfile() {
  const store = useTap();
  const { username = "" } = useParams();
  const locationState = useLocation();
  const cardSlug =
    new URLSearchParams(locationState.search).get("card") || "main";
  const [state, setState] = useState<
    "loading" | "public" | "private" | "not_found" | "error"
  >(isSupabaseConfigured ? "loading" : "public");
  const [publicData, setPublicData] = useState<{
    profile: Profile;
    connections: Connection[];
    card: TapCard;
    availableCards: Pick<TapCard, "slug" | "name" | "type">[];
  } | null>(null);
  const [switchingCard, setSwitchingCard] = useState(false);
  const hasPublicData = useRef(false);
  const navigate = useNavigate();
  const openCard = (slug:string) => {
    if (switchingCard || slug === cardSlug) return;
    setSwitchingCard(true);
    window.setTimeout(() => navigate(`/u/${encodeURIComponent(username)}?card=${encodeURIComponent(slug)}`), 260);
  };
  useEffect(() => {
    let active = true;
    if (!isSupabaseConfigured || isDemoUsername(username)) return;
    Promise.resolve().then(() => {
      if (!active) return;
      if (hasPublicData.current) setSwitchingCard(true);
      else setState("loading");
    });
    getPublicProfile(username, cardSlug)
      .then((result) => {
        if (!active) return;
        setState(result.status);
        if (
          result.status === "public" &&
          result.profile &&
          result.connections &&
          result.card
        ) {
          setPublicData({
            profile: result.profile,
            connections: result.connections,
            card: result.card,
            availableCards: result.availableCards?.length
              ? result.availableCards
              : [{ slug: result.card.slug, name: result.card.name, type: result.card.type }],
          });
          hasPublicData.current = true;
        }
        setSwitchingCard(false);
      })
      .catch(() => {
        if (!active) return;
        setSwitchingCard(false);
        setState("error");
      });
    return () => {
      active = false;
    };
  }, [username, cardSlug]);
  useEffect(() => {
    if (publicData)
      document.title = `${publicData.profile.displayName} (@${publicData.profile.username}) — TAP`;
    return () => {
      document.title = "TAP — Create your identity";
    };
  }, [publicData]);
  const effectiveState = isDemoUsername(username)
    ? "not_found"
    : isSupabaseConfigured
      ? state
      : username === store.profile.username
        ? store.profile.visibility
        : "not_found";
  if (effectiveState === "loading")
    return <RouteLoading label="Loading this TAP…" />;
  if (effectiveState === "private")
    return (
      <main className="public-page">
        <Logo />
        <div className="private-state">
          <ShieldCheck />
          <h1>This TAP profile is private.</h1>
        </div>
      </main>
    );
  if (effectiveState === "not_found")
    return (
      <main className="public-page">
        <Logo />
        <div className="private-state">
          <UserRound />
          <h1>Profile not found.</h1>
          <p>Check the username and try again.</p>
        </div>
      </main>
    );
  if (effectiveState === "error")
    return (
      <main className="public-page">
        <Logo />
        <div className="private-state">
          <UserRound />
          <h1>Could not load this TAP.</h1>
          <Button onClick={() => location.reload()}>TRY AGAIN</Button>
        </div>
      </main>
    );
  const data = publicData || {
    profile: store.profile,
    connections: store.connections,
    card: store.cards.find((c) => c.slug === cardSlug) || store.cards[0],
    availableCards: store.cards.filter((card) => card.visible),
  };
  if (!data.card) return null;
  return (
    <TapContext.Provider
      value={{
        ...store,
        profile: data.profile,
        connections: data.connections,
        cards: [data.card],
      }}
    >
      <main className="public-page">
        <div className="public-top">
          <Logo />
          <ShareButton />
        </div>
        <div className="public-wrap">
          <div className={`public-card-stage ${switchingCard ? "is-switching" : ""}`} key={data.card.slug}>
            <ProfileCard card={data.card} />
          </div>
          <div className="public-meta">
            <div>
              <strong>{data.profile.taps.toLocaleString()}</strong>
              <span>TAPS</span>
            </div>
          </div>
          {data.availableCards.length > 0 && (
            <nav className="public-card-switcher" aria-label="Profile cards">
              {data.availableCards.map((card) => {
                const active = card.slug === data.card.slug;
                return (
                  <button
                    className={active ? "active" : ""}
                    type="button"
                    key={card.slug}
                    aria-current={active ? "page" : undefined}
                    disabled={active || switchingCard}
                    onClick={() => openCard(card.slug)}
                  >
                    <strong>{card.name}</strong>
                    <span>{active ? "ACTIVE CARD" : "OPEN CARD"}</span>
                  </button>
                );
              })}
            </nav>
          )}
          <p className="tap-signoff">Made with TAP · create your identity</p>
        </div>
      </main>
    </TapContext.Provider>
  );
}

function ShortProfileRedirect(){
  const {username=""}=useParams();
  return <Navigate to={`/u/${encodeURIComponent(username.toLowerCase())}`} replace/>;
}

function RouteLoading({ label = "Loading your TAP…" }: { label?: string }) {
  return (
    <main className="route-loading">
      <div className="loading-orb" />
      <span>{label}</span>
    </main>
  );
}
function AuthCallback() {
  const { ready, authenticated, profile, loadError, reload } = useTap();
  if (!ready) return <RouteLoading label="Confirming your account…" />;
  if (loadError)
    return (
      <main className="public-page">
        <Logo />
        <div className="private-state">
          <h1>Could not finish signing in.</h1>
          <p>{loadError}</p>
          <Button onClick={() => void reload()}>TRY AGAIN</Button>
        </div>
      </main>
    );
  if (!authenticated) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={isProfileComplete(profile) ? "/app" : "/onboarding"}
      replace
    />
  );
}
function Protected({ children }: { children: ReactNode }) {
  const { profile, ready, authenticated, loadError, reload, realMode } =
    useTap();
  if (!ready) return <RouteLoading />;
  if (loadError && authenticated)
    return (
      <main className="public-page">
        <Logo />
        <div className="private-state">
          <h1>Could not load your profile.</h1>
          <p>{loadError}</p>
          <Button onClick={() => void reload()}>TRY AGAIN</Button>
        </div>
      </main>
    );
  if (realMode && !authenticated) return <Navigate to="/login" replace />;
  if (realMode && authenticated && !isProfileComplete(profile))
    return <Navigate to="/onboarding" replace />;
  return children;
}
export default function App() {
  return (
    <StoreContext>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordRecovery reset />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/app"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/edit"
          element={
            <Protected>
              <Navigate to="/settings/profile" replace />
            </Protected>
          }
        />
        <Route
          path="/search"
          element={
            <Protected>
              <ProfileSearch />
            </Protected>
          }
        />
        <Route
          path="/connections"
          element={
            <Protected>
              <Connections />
            </Protected>
          }
        />
        <Route
          path="/cards"
          element={
            <Protected>
              <Cards />
            </Protected>
          }
        />
        <Route
          path="/badges"
          element={
            <Protected>
              <Badges />
            </Protected>
          }
        />
        <Route
          path="/settings"
          element={
            <Protected>
              <SettingsPage />
            </Protected>
          }
        />
        <Route path="/settings/profile" element={<Protected><ProfileSettingsPage/></Protected>} />
        <Route path="/settings/privacy" element={<Protected><PrivacySettingsPage/></Protected>} />
        <Route path="/settings/security" element={<Protected><SecuritySettingsPage/></Protected>} />
        <Route path="/settings/account" element={<Protected><SimpleSettingsPage kind="account"/></Protected>} />
        <Route path="/settings/notifications" element={<Protected><SimpleSettingsPage kind="notifications"/></Protected>} />
        <Route path="/settings/connections" element={<Protected><SimpleSettingsPage kind="connections"/></Protected>} />
        <Route path="/settings/badges" element={<Protected><SimpleSettingsPage kind="badges"/></Protected>} />
        <Route path="/settings/preferences" element={<Protected><SimpleSettingsPage kind="preferences"/></Protected>} />
        <Route path="/settings/data" element={<Protected><SimpleSettingsPage kind="data"/></Protected>} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="/help/badges" element={<HelpPage topic="badges" />} />
        <Route path="/help/levels" element={<HelpPage topic="levels" />} />
        <Route path="/help/profile" element={<HelpPage topic="profile" />} />
        <Route path="/:username" element={<ShortProfileRedirect/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StoreContext>
  );
}
