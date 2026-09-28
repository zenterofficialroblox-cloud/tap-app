import { z } from "zod";
import type { ProviderId } from "../types";
import { providerById, providers } from "./providers";

const reservedUsernames = new Set([
  "admin",
  "administrator",
  "api",
  "app",
  "auth",
  "login",
  "logout",
  "register",
  "signup",
  "support",
  "help",
  "tap",
  "settings",
  "profile",
  "profiles",
  "u",
  "user",
  "users",
  "example",
]);
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(24)
  .regex(/^[a-z0-9_.]+$/, "Use letters, numbers, _ or .")
  .refine((v) => !reservedUsernames.has(v), "That username is reserved");
export const safeUrlSchema = z
  .string()
  .url()
  .refine(
    (v) => new URL(v).protocol === "https:",
    "Only HTTPS links are allowed",
  );
export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[A-Za-z]/, "Add a letter")
  .regex(/[0-9]/, "Add a number");
export const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);
export const isProfileComplete = (profile: {
  username?: string;
  displayName?: string;
  onboardingComplete?: boolean;
}) =>
  Boolean(
    profile.onboardingComplete &&
    profile.username?.trim() &&
    profile.displayName?.trim(),
  );
export const hasValidDestination = (value?: string) => {
  try {
    return Boolean(value && new URL(value).protocol === "https:");
  } catch {
    return false;
  }
};
export const isDemoUsername = (value?: string) =>
  value?.trim().toLowerCase() === "example";

export function levelFromXp(xp: number) {
  xp = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const floor = (level - 1) ** 2 * 100;
  const ceiling = level ** 2 * 100;
  return {
    level,
    current: xp - floor,
    required: ceiling - floor,
    progress: ((xp - floor) / (ceiling - floor)) * 100,
  };
}

const profileUrls: Partial<Record<ProviderId, (handle: string) => string>> = {
  github: (h) => `https://github.com/${encodeURIComponent(h)}`,
  instagram: (h) => `https://instagram.com/${encodeURIComponent(h)}`,
  tiktok: (h) => `https://tiktok.com/@${encodeURIComponent(h)}`,
  twitch: (h) => `https://twitch.tv/${encodeURIComponent(h)}`,
  x: (h) => `https://x.com/${encodeURIComponent(h)}`,
  youtube: (h) => `https://youtube.com/@${encodeURIComponent(h)}`,
  spotify: (h) => `https://open.spotify.com/user/${encodeURIComponent(h)}`,
  figma: (h) => `https://figma.com/@${encodeURIComponent(h)}`,
  snapchat: (h) => `https://snapchat.com/add/${encodeURIComponent(h)}`,
  gitlab: (h) => `https://gitlab.com/${encodeURIComponent(h)}`,
  steam: (h) =>
    /^\d{17}$/.test(h)
      ? `https://steamcommunity.com/profiles/${h}`
      : `https://steamcommunity.com/id/${encodeURIComponent(h)}`,
};
const providerHosts: Partial<Record<ProviderId, string[]>> = {
  github: ["github.com", "www.github.com"],
  gitlab: ["gitlab.com", "www.gitlab.com"],
  instagram: ["instagram.com", "www.instagram.com"],
  youtube: ["youtube.com", "www.youtube.com"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
  twitch: ["twitch.tv", "www.twitch.tv"],
  spotify: ["open.spotify.com"],
  figma: ["figma.com", "www.figma.com"],
  x: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"],
  snapchat: ["snapchat.com", "www.snapchat.com"],
  roblox: ["roblox.com", "www.roblox.com"],
  steam: ["steamcommunity.com", "www.steamcommunity.com"],
};
const blockedSinglePaths: Partial<Record<ProviderId, Set<string>>> = {
  github: new Set([
    "settings",
    "features",
    "topics",
    "marketplace",
    "login",
    "signup",
    "organizations",
    "orgs",
    "explore",
    "notifications",
  ]),
  gitlab: new Set([
    "users",
    "groups",
    "projects",
    "explore",
    "dashboard",
    "help",
  ]),
  instagram: new Set([
    "p",
    "reel",
    "reels",
    "stories",
    "explore",
    "accounts",
    "direct",
  ]),
  twitch: new Set(["directory", "videos", "downloads", "settings", "search"]),
  x: new Set([
    "home",
    "explore",
    "search",
    "settings",
    "messages",
    "compose",
    "notifications",
  ]),
  figma: new Set(["files", "community", "login", "downloads"]),
};
function parsePossibleUrl(raw: string) {
  const value = raw.trim();
  if (!value) return undefined;
  const scheme = value.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && scheme !== "https")
    throw new Error("Only HTTPS links are allowed");
  const candidate = scheme
    ? value
    : /^(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:[/?#]|$)/i.test(value)
      ? `https://${value}`
      : "";
  if (!candidate) return undefined;
  const parsed = new URL(candidate);
  if (parsed.protocol !== "https:")
    throw new Error("Only HTTPS links are allowed");
  if (parsed.username || parsed.password)
    throw new Error("Credentials are not allowed in profile links");
  return parsed;
}
function cleanHandle(value: string) {
  const handle = decodeURIComponent(value).replace(/^@/, "").trim();
  if (!handle || handle.length > 100 || !/^[\p{L}\p{N}._-]+$/u.test(handle))
    throw new Error("Enter a valid profile username");
  return handle;
}
function handleFromProviderUrl(provider: ProviderId, url: URL) {
  const allowed = providerHosts[provider] || providerById(provider)?.domains;
  if (!allowed?.includes(url.hostname.toLowerCase()))
    throw new Error("Use the official profile domain for this service");
  const segments = url.pathname
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);
  if (!providerHosts[provider]) {
    if (provider === "tumblr" || provider === "itchio")
      return cleanHandle(url.hostname.split(".")[0]);
    const prefixes: Partial<Record<ProviderId, string>> = {
      linkedin: "in",
      bluesky: "profile",
      reddit: "user",
      lastfm: "user",
      chesscom: "member",
      duolingo: "profile",
      gog: "u",
      curseforge: "members",
      modrinth: "user",
      osu: "users",
      pypi: "user",
      dockerhub: "u",
      leetcode: "u",
      codewars: "users",
      codeforces: "profile",
      tryhackme: "p",
    };
    const prefix = prefixes[provider];
    if (prefix) {
      if (segments.length !== 2 || segments[0] !== prefix)
        throw new Error("Enter a profile URL");
      return cleanHandle(segments[1]);
    }
    if (provider === "faceit") {
      if (segments.length !== 3 || segments[1] !== "players") throw new Error("Enter a FACEIT player URL");
      return cleanHandle(segments[2]);
    }
    if (provider === "lichess") {
      if (segments.length !== 2 || segments[0] !== "@") throw new Error("Enter a Lichess profile URL");
      return cleanHandle(segments[1]);
    }
    if (["threads","replit","medium","unsplash","stackblitz","glitch","hashnode","producthunt"].includes(provider) && segments.length === 1)
      return cleanHandle(segments[0]);
    if (provider === "npm" && segments.length === 1) return cleanHandle(segments[0].replace(/^~/,""));
    if (segments.length !== 1)
      throw new Error("Enter a profile URL, not a content page");
    return cleanHandle(segments[0]);
  }
  if (provider === "spotify") {
    if (segments.length !== 2 || segments[0] !== "user")
      throw new Error("Enter a Spotify user profile");
    return cleanHandle(segments[1]);
  }
  if (provider === "snapchat") {
    if (segments.length !== 2 || segments[0] !== "add")
      throw new Error("Enter a Snapchat profile");
    return cleanHandle(segments[1]);
  }
  if (provider === "steam") {
    if (segments.length !== 2 || !["id", "profiles"].includes(segments[0]))
      throw new Error("Enter a Steam profile");
    return cleanHandle(segments[1]);
  }
  if (provider === "youtube" || provider === "tiktok") {
    if (segments.length !== 1 || !segments[0].startsWith("@"))
      throw new Error("Enter a channel/profile URL");
    return cleanHandle(segments[0]);
  }
  if (provider === "roblox")
    throw new Error("Use Custom Link for this official profile URL");
  if (
    segments.length !== 1 ||
    blockedSinglePaths[provider]?.has(segments[0].toLowerCase())
  )
    throw new Error("Enter a profile URL, not a content or settings page");
  return cleanHandle(segments[0]);
}
export function detectProviderFromUrl(raw: string): ProviderId | undefined {
  try {
    const host = parsePossibleUrl(raw)?.hostname.toLowerCase();
    if (!host) return undefined;
    const coreMatch = (Object.entries(providerHosts) as [ProviderId, string[]][]).find(
      ([, hosts]) => hosts.includes(host),
    )?.[0];
    if (coreMatch) return coreMatch;
    return providers.find((provider) =>
      provider.domains?.some((domain) => host === domain || host.endsWith(`.${domain}`)),
    )?.id;
  } catch {
    return undefined;
  }
}
export function parseProviderInput(provider: ProviderId, raw: string) {
  const value = raw.trim();
  if (
    !value ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  )
    throw new Error("Enter a valid profile username or URL");
  const parsed = parsePossibleUrl(value);
  if (provider === "website" || provider === "custom") {
    if (!parsed) throw new Error("Enter a full website address");
    return {
      provider,
      handle: parsed.hostname.replace(/^www\./, ""),
      url: safeUrlSchema.parse(parsed.toString()),
    };
  }
  let handle: string;
  if (parsed) {
    const definition = providerById(provider);
    const detected = detectProviderFromUrl(parsed.toString());
    if (detected && detected !== provider)
      throw new Error("That link belongs to another service");
    if (!profileUrls[provider] && !definition?.profileUrl) {
      const allowed = definition?.domains?.some(
        (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
      );
      if (!allowed) throw new Error("Use the official profile domain for this service");
      return {
        provider,
        handle: parsed.pathname.split("/").filter(Boolean).at(-1) || parsed.hostname,
        url: safeUrlSchema.parse(parsed.toString()),
      };
    }
    handle = handleFromProviderUrl(provider, parsed);
  } else {
    if (
      value.includes("/") ||
      value.includes("?") ||
      value.includes("#") ||
      value.includes(":")
    )
      throw new Error("Enter a valid profile username");
    handle = cleanHandle(value);
  }
  const createUrl = profileUrls[provider] || providerById(provider)?.profileUrl;
  if (!createUrl) {
    if (
      [
        "discord",
        "minecraft",
        "xbox",
        "playstation",
        "epic",
        "roblox",
      ].includes(provider)
    )
      return { provider, handle, url: "" };
    throw new Error("Enter a full HTTPS profile URL");
  }
  return { provider, handle, url: createUrl(handle) };
}
export function normalizeProviderUrl(provider: ProviderId, raw: string) {
  return parseProviderInput(provider, raw).url;
}
export function avatarInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (
    parts.length === 1
      ? Array.from(parts[0]).slice(0, 2).join("")
      : Array.from(parts[0])[0] + Array.from(parts.at(-1)!)[0]
  ).toLocaleUpperCase();
}

export const canShowOnCard = (
  connectionId: string,
  connectionIds: string[],
  visible: boolean,
) => visible && connectionIds.includes(connectionId);
export const publicSearchHref = ({
  username,
  isPrivate,
}: {
  username: string;
  isPrivate: boolean;
}) => (isPrivate ? undefined : `/u/${encodeURIComponent(username)}`);
export const tapHomeRoute = ({
  realMode,
  ready,
  authenticated,
  complete,
}: {
  realMode: boolean;
  ready: boolean;
  authenticated: boolean;
  complete: boolean;
}) =>
  realMode && ready && authenticated
    ? complete
      ? "/app"
      : "/onboarding"
    : "/";
