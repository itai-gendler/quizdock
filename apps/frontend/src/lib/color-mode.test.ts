import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyColorMode, isLiveScreen, setDevicePref, startColorMode } from './color-mode';

const systemDark = (dark: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: dark, addEventListener: vi.fn() })),
  );
const dark = () => document.documentElement.classList.contains('dark');

describe('colour mode', () => {
  afterEach(() => {
    setDevicePref('auto');
    vi.unstubAllGlobals();
  });

  it('follows the system until the device picks, and remembers the pick', () => {
    systemDark(true);
    startColorMode('auto');
    applyColorMode('/quizzes');
    expect(dark()).toBe(true);
    setDevicePref('light');
    applyColorMode('/quizzes');
    expect(dark()).toBe(false);
    expect(localStorage.getItem('qd-color-mode')).toBe('light');
  });

  it('obeys the instance when it forces one', () => {
    systemDark(false);
    startColorMode('dark');
    setDevicePref('light');
    applyColorMode('/quizzes');
    expect(dark()).toBe(true);
    startColorMode('auto');
  });

  it('never darkens a live screen', () => {
    systemDark(true);
    startColorMode('auto');
    expect(isLiveScreen('/join')).toBe(true);
    expect(isLiveScreen('/join/123456')).toBe(true);
    expect(isLiveScreen('/session/123456/projection')).toBe(true);
    expect(isLiveScreen('/sessions')).toBe(false);
    applyColorMode('/join/123456');
    expect(dark()).toBe(false);
  });
});
