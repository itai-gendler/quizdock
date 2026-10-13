import type { RoomSoundsPayload, ThemeValues } from '@quiz-dock/contracts';
import { useEffect, useMemo } from 'react';
import type { GameSocket } from '../game-client';
import type { GameView } from '../use-game-session';
import { anchorOf } from './followed';
import { useGameSounds } from './game-sounds';
import { clearRoomPositions } from './media-position';
import { preloadMedia, waitedFor } from './media-pool';

/** Whether the room plays any game sound (#93): a tick, a gong or a music track. */
export function hasGameSounds(sounds: RoomSoundsPayload | null): boolean {
  return !!sounds && (sounds.tick || sounds.gong || !!sounds.musicUrl);
}

/**
 * What a device of the room does with the game's media, the same on the
 * projection and on a phone. A new lobby, a new game: the media positions of the
 * room's last one are forgotten (its PIN stays; a quiz played again would read
 * "played to the end" and stay silent). The game's sounds play here when
 * `sounds`. What comes next is fetched while the room waits (`preload` not
 * `off`); with `ready`, the host's console hears when this device can play it
 * (a copy fetches ahead too, but is never waited for: `fetch`).
 */
export function useRoomMedia(
  view: GameView,
  pin: string,
  socket: GameSocket | null,
  {
    sounds,
    preload,
    room = false,
  }: {
    sounds: boolean;
    preload: 'off' | 'fetch' | 'ready';
    /** The projection itself: the console's master mute and MEDIA bus apply here (#150). */
    room?: boolean;
  },
): void {
  useEffect(() => {
    if (view.state === 'LOBBY') clearRoomPositions(pin);
  }, [view.state, pin]);

  // A sample the host chose for the room wins, then the quiz theme's, then the
  // synthesised effect (docs/themes.md); the room's mixer keeps the levels in every case.
  const roomSounds = useMemo(
    () => withThemeSounds(view.sounds, view.theme),
    [view.sounds, view.theme],
  );
  useGameSounds(
    roomSounds,
    {
      state: view.state,
      questionIndex: view.questionIndex,
      answered: view.answerCount?.answered ?? 0,
      paused: view.paused,
      media: view.question?.media,
      mediaStartAt: view.question?.mediaStartAt ?? null,
      endsAt: view.question?.endsAt ?? null,
      startedAt: view.question?.startedAt ?? null,
      anchor: view.question && anchorOf(view, { questionIndex: view.question.questionIndex }),
    },
    sounds,
    room,
  );

  useEffect(() => {
    const next = view.preload;
    if (preload === 'off' || !next) return;
    let cancelled = false;
    void preloadMedia(next.media, next.images, next.videos).then((loaded) => {
      if (!cancelled && loaded && preload === 'ready' && waitedFor(next.media, next.videos)) {
        socket?.emit('media:ready', {
          pin,
          questionIndex: next.questionIndex,
          ...(next.slideIndex !== undefined ? { slideIndex: next.slideIndex } : {}),
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [preload, view.preload, socket, pin]);
}

/** The room's sounds, each effect the host left without a sample taking the theme's. */
export function withThemeSounds(
  sounds: RoomSoundsPayload | null,
  theme: ThemeValues | null,
): RoomSoundsPayload | null {
  const own = theme?.sounds;
  if (!sounds || !own || Object.keys(own).length === 0) return sounds;
  return {
    ...sounds,
    tickUrl: sounds.tickUrl ?? own.tick ?? null,
    dingUrl: sounds.dingUrl ?? own.ding ?? null,
    countdownUrl: sounds.countdownUrl ?? own.countdown ?? null,
    gongUrl: sounds.gongUrl ?? own.gong ?? null,
  };
}
