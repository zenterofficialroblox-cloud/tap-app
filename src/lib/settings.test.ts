import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appSource = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");

describe("settings architecture", () => {
  it("registers every direct-refresh settings route", () => {
    for (const route of ["account", "profile", "privacy", "security", "notifications", "connections", "badges", "preferences", "data"])
      expect(appSource).toContain(`path="/settings/${route}"`);
  });

  it("uses all five supplied TAP themes", () => {
    for (const theme of ["default", "neon", "galaxy", "pixel", "frost"])
      expect(appSource).toContain(`["${theme}",`);
    expect(appSource).toContain("/themes/variants/");
  });

  it("provides debounced, immediate, deduplicated and failure-aware autosave", () => {
    expect(appSource).toContain("window.setTimeout(() => void persist(draft), 650)");
    expect(appSource).toContain("serialized === lastSaved.current");
    expect(appSource).toContain("const immediate = useCallback");
    expect(appSource).toContain('setState("error")');
  });

  it("validates usernames before autosaving and redirects the legacy editor", () => {
    expect(appSource).toContain("usernameSchema.safeParse(value)");
    expect(appSource).toContain("checkUsername(value)");
    expect(appSource).toContain('<Navigate to="/settings/profile" replace />');
  });

  it("has no manual save action on any registered settings page", () => {
    const settingsImplementation = appSource.slice(appSource.indexOf("type SaveState"), appSource.indexOf("function PublicProfile"));
    expect(settingsImplementation.toLowerCase()).not.toContain("save changes");
  });

  it("does not fabricate session device data", () => {
    expect(appSource).not.toContain("Helsinki, Finland");
    expect(appSource).not.toContain("Tampere, Finland");
    expect(appSource).toContain("Advanced device, location, and per-session management is not available");
  });
});
