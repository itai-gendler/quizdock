import type { ColorMode } from '@quiz-dock/contracts';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * Light or dark (THEMING lot 3). The instance may force one; else each device follows
 * its system, or what its person picked here (kept on the device). The live screens —
 * the projection, a participant's pages — are not concerned: the quiz theme dresses them.
 */

const KEY = 'qd-color-mode';
const listeners = new Set<() => void>();

function readPref(): ColorMode {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

let pref: ColorMode = typeof window === 'undefined' ? 'auto' : readPref();
let forced: ColorMode = 'auto';

/** This device's choice: `auto` follows its system. */
export function setDevicePref(next: ColorMode): void {
  pref = next;
  try {
    if (next === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
  } catch {
    // storage blocked: the choice lasts until the page is left
  }
  applyColorMode();
  listeners.forEach((l) => l());
}

/** A projection or a participant's page: drawn by the quiz theme, never dark. */
export function isLiveScreen(pathname: string): boolean {
  return /^\/session\/[^/]+\/projection/.test(pathname) || /^\/join(\/|$)/.test(pathname);
}

const systemDark = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;

/** Whether the interface is dark now, for this device. */
export function isDark(): boolean {
  const mode = forced !== 'auto' ? forced : pref;
  return mode === 'auto' ? systemDark() : mode === 'dark';
}

/** Sets or clears `.dark` on the document for the page shown. */
export function applyColorMode(pathname = window.location.pathname): void {
  const dark = isDark() && !isLiveScreen(pathname);
  document.documentElement.classList.toggle('dark', dark);
}

/** At start, before the first render: the instance's rule, and the system's changes followed. */
export function startColorMode(instanceMode: ColorMode): void {
  forced = instanceMode;
  applyColorMode();
  if (typeof matchMedia === 'undefined') return;
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    applyColorMode();
    listeners.forEach((l) => l());
  });
}

/** This device's choice, and whether the instance leaves it one. */
export function useColorMode(): {
  pref: ColorMode;
  forced: ColorMode;
  set: (m: ColorMode) => void;
} {
  const current = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => pref,
  );
  return { pref: current, forced, set: setDevicePref };
}

/** Re-applies the mode when the page changes (a live screen is never dark). */
export function useColorModeFor(pathname: string): void {
  useEffect(() => {
    applyColorMode(pathname);
  }, [pathname]);
}
