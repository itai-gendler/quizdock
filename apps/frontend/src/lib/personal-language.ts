import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useSyncExternalStore } from 'react';
import {
  getMeControllerGetPreferencesQueryKey,
  useMeControllerGetPreferences,
  useMeControllerUpdatePreferences,
} from '../api/generated/me/me';
import { useAuth } from '../auth/auth-context';

/**
 * The interface language someone picked (the instance's when null): kept in their
 * account when signed in — on every device it signs in from —, else on this device.
 */

const KEY = 'qd-lang';
const listeners = new Set<() => void>();

function readDevice(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
let device = typeof window === 'undefined' ? null : readDevice();

function setDevice(tag: string | null): void {
  device = tag;
  try {
    if (tag) localStorage.setItem(KEY, tag);
    else localStorage.removeItem(KEY);
  } catch {
    // storage blocked: the choice lasts until the page is left
  }
  listeners.forEach((l) => l());
}

export function usePersonalLanguage(): {
  language: string | null;
  set: (tag: string | null) => Promise<void>;
  /** Signed in: the choice goes to the account. */
  inAccount: boolean;
} {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const preferences = useMeControllerGetPreferences({ query: { enabled: !!user } });
  const update = useMeControllerUpdatePreferences();
  const onDevice = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => void listeners.delete(l);
    },
    () => device,
  );
  const account = user ? preferences.data?.data : undefined;

  // Signing in, a choice made on the device becomes the account's when it has none.
  const adopt = !!account && account.language == null && !!onDevice;
  useEffect(() => {
    if (!adopt || !onDevice) return;
    void update
      .mutateAsync({ data: { language: onDevice } })
      .then(() =>
        queryClient.invalidateQueries({ queryKey: getMeControllerGetPreferencesQueryKey() }),
      )
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adopt]);

  const set = async (tag: string | null) => {
    // The device follows too: signed out later, it keeps speaking the same language.
    setDevice(tag);
    if (!user) return;
    await update.mutateAsync({ data: { language: tag } });
    await queryClient.invalidateQueries({ queryKey: getMeControllerGetPreferencesQueryKey() });
  };

  return {
    language: account ? (account.language ?? (adopt ? onDevice : null)) : onDevice,
    set,
    inAccount: !!user,
  };
}
