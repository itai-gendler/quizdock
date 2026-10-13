import {
  GameState,
  OPTION_ORDER,
  type PublicOption,
  type QuestionStartPayload,
  type ThemeValues,
} from '@quiz-dock/contracts';
import { useMemo, useState } from 'react';
import { Segmented } from '@/components/ui/segmented';
import { useTranslation } from 'react-i18next';
import { Markdown } from '@/components/markdown';
import { cn } from '@/lib/utils';
import { ScreenSurface } from '../routes/screen-page';
import { OptionGrid } from './live-components';
import { ParticipantPreview } from './participant-preview';
import { ScaledStage } from './slide-stage';
import { Surface } from './surface';
import { LiveTheme, themeBackdrop } from './theme';
import { type GameView, INITIAL_VIEW } from './use-game-session';

/** The moments a theme is previewed at (docs/themes.md). */
export const PREVIEW_PHASES = ['lobby', 'question', 'reveal', 'podium'] as const;
export type PreviewPhase = (typeof PREVIEW_PHASES)[number];

const CITIES = ['Ankara', 'Istanbul', 'Izmir', 'Antalya'];
const PLAYERS = ['Ada', 'Tom', 'Lina', 'Mehmet', 'Zoé', 'Kai', 'Iris'];

/** Four answers in the default order of their colours: the first one right. */
function sampleOptions(): PublicOption[] {
  return CITIES.map((text, i) => ({
    id: `o${i}`,
    text,
    color: OPTION_ORDER[i].color,
    shape: OPTION_ORDER[i].shape,
  })) as PublicOption[];
}

/**
 * A game that does not exist, at one of its moments, as the live screens receive it:
 * the theme editor draws the real projection and the real phone from it.
 */
export function themePreviewView(
  phase: PreviewPhase,
  theme: ThemeValues,
  text: { title: string; prompt: string },
): GameView {
  const base: GameView = {
    ...INITIAL_VIEW,
    status: 'ready',
    questionIndex: 2,
    totalQuestions: 10,
    quizTitle: text.title,
    // Its clock stands still.
    still: true,
    theme,
  };
  const now = Date.now();
  const question: QuestionStartPayload = {
    questionIndex: 2,
    type: 'single_choice',
    prompt: text.prompt,
    options: sampleOptions(),
    timeLimitS: 20,
    startedAt: now,
    endsAt: now + 20_000,
  } as QuestionStartPayload;
  switch (phase) {
    case 'lobby':
      return {
        ...base,
        state: GameState.Lobby,
        questionIndex: -1,
        players: PLAYERS.map((nickname, i) => ({ playerId: `p${i}`, nickname })),
        lobbyCount: { ready: 5, total: PLAYERS.length },
        joinBaseUrl: window.location.origin,
      };
    case 'question':
      return { ...base, state: GameState.QuestionShow, question };
    case 'reveal':
      return {
        ...base,
        state: GameState.Reveal,
        question,
        reveal: { correctOptionIds: ['o0'], distribution: { o0: 7, o1: 3, o2: 1, o3: 1 } },
        result: { correct: true, points: 850, totalScore: 2350, rank: 2 },
      };
    case 'podium':
      return {
        ...base,
        state: GameState.Podium,
        podium: {
          podium: [
            { nickname: 'Mehmet', score: 6420, rank: 1 },
            { nickname: 'Lina', score: 6180, rank: 2 },
            { nickname: 'Ada', score: 5950, rank: 3 },
          ],
          you: { score: 5120, rank: 4 },
        },
      };
  }
}

/**
 * The projection and a phone in a theme, at one moment of a game (docs/themes.md):
 * drawn by the live screens themselves.
 */
export function ThemePreview({
  theme,
  phase,
  device = 'both',
}: {
  theme: ThemeValues;
  phase: PreviewPhase;
  device?: 'both' | 'projection' | 'phone';
}) {
  const { t } = useTranslation('themes');
  const view = useMemo(
    () =>
      themePreviewView(phase, theme, { title: t('preview.title'), prompt: t('preview.prompt') }),
    [phase, theme, t],
  );
  return (
    <div className="flex flex-wrap items-start gap-4">
      {device !== 'phone' ? (
        <div className="min-w-0 flex-[3_1_28rem]">
          <ScaledStage className="rounded-xl border">
            <ScreenSurface pin="034696" view={view} socket={null} role="preview" fit="box" />
          </ScaledStage>
        </div>
      ) : null}
      {device !== 'projection' ? (
        // A phone's width, whatever its content asks for (a podium is wide).
        <div className="flex min-w-0 flex-[1_1_12rem] justify-center">
          <div className="w-full max-w-[18rem] min-w-0 overflow-hidden text-[0.85rem]">
            <ParticipantPreview view={view} note={false} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * A theme at a glance, for a list or a picker: its background, a question and four
 * answers, drawn with the live screens' own pieces at the projection's proportions.
 */
export function ThemeThumbnail({ theme, className }: { theme: ThemeValues; className?: string }) {
  const { t } = useTranslation('themes');
  const themed = themeBackdrop(theme);
  return (
    <ScaledStage className={cn('pointer-events-none select-none', className)}>
      <LiveTheme theme={theme}>
        <Surface
          background={themed?.background}
          textTone={themed?.textTone}
          textOutline={!!themed && 'url' in themed.background}
          className="h-full w-full"
        >
          <div className="flex h-full flex-col justify-between gap-[1em] p-[2em]">
            <Markdown className="text-center text-[2.6em] leading-tight font-bold">
              {t('preview.prompt')}
            </Markdown>
            <OptionGrid options={sampleOptions()} disabled />
          </div>
        </Surface>
      </LiveTheme>
    </ScaledStage>
  );
}

/**
 * A theme seen at work, beside its editor or on its own page: the moment of the game
 * and the screen picked above the real projection and phone.
 */
export function ThemePreviewPanel({ theme }: { theme: ThemeValues }) {
  const { t } = useTranslation('themes');
  const [phase, setPhase] = useState<PreviewPhase>('question');
  const [device, setDevice] = useState<'both' | 'projection' | 'phone'>('both');
  return (
    <div className="bg-muted/40 flex min-w-0 flex-col gap-4 rounded-2xl p-4 lg:sticky lg:top-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          size="sm"
          label={t('preview.phase')}
          value={phase}
          onChange={setPhase}
          options={PREVIEW_PHASES.map((p) => ({ value: p, label: t(`preview.phases.${p}`) }))}
        />
        <Segmented
          size="sm"
          label={t('preview.device')}
          value={device}
          onChange={setDevice}
          options={(['both', 'projection', 'phone'] as const).map((d) => ({
            value: d,
            label: t(`preview.devices.${d}`),
          }))}
        />
      </div>
      <ThemePreview theme={theme} phase={phase} device={device} />
    </div>
  );
}
