import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockApi, renderApp } from '../test/harness';

const session = (id: string, title: string) => ({
  id,
  quizId: `quiz-${id}`,
  quizTitle: title,
  startedAt: '2026-10-01T09:00:00.000Z',
});

describe('History by gathering', () => {
  beforeEach(() => localStorage.setItem('live.localUser', 'Marc'));
  afterEach(() => localStorage.clear());

  it('one line per room with its quizzes; a quiz alone says so; a room opens its page', async () => {
    mockApi([
      {
        method: 'GET',
        path: '/history/rooms/room-1',
        body: {
          roomId: 'room-1',
          name: null,
          hostName: 'Marc',
          sessions: [
            { ...session('a', 'Fractions'), current: false },
            { ...session('b', 'Géométrie'), current: false },
          ],
          standings: [],
        },
      },
      {
        method: 'GET',
        path: '/history',
        body: {
          rooms: [
            {
              roomId: 'room-1',
              name: null,
              hostName: 'Marc',
              startedAt: '2026-10-01T09:00:00.000Z',
              endedAt: '2026-10-01T09:40:00.000Z',
              playerCount: 24,
              sessions: [session('a', 'Fractions'), session('b', 'Géométrie')],
            },
            {
              roomId: null,
              name: null,
              hostName: 'Marc',
              startedAt: '2026-09-28T09:00:00.000Z',
              endedAt: '2026-09-28T09:10:00.000Z',
              playerCount: 12,
              sessions: [session('c', 'Verbes')],
            },
          ],
        },
      },
    ]);
    renderApp('/history');
    expect(await screen.findByText('Fractions · Géométrie')).toBeInTheDocument();
    expect(screen.getByText('Salon de Marc')).toBeInTheDocument();
    expect(screen.getByText('Un quiz seul')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Fractions · Géométrie'));
    expect(await screen.findByRole('link', { name: 'Géométrie' })).toBeInTheDocument();
    // Back to the sessions: the page's own link, beside the top bar's.
    expect(screen.getAllByRole('link', { name: 'Séances' })).toHaveLength(2);
  });

  it('a room’s card saves its archived quizzes as a selection', async () => {
    const fetchMock = mockApi([
      {
        method: 'GET',
        path: '/history/rooms/room-1',
        body: {
          roomId: 'room-1',
          name: 'Jeudi',
          hostName: 'Marc',
          sessions: [
            { ...session('a', 'Fractions'), current: false },
            { ...session('b', 'Géométrie'), current: false },
          ],
          standings: null,
        },
      },
      {
        method: 'POST',
        path: '/selections/from-room',
        status: 201,
        body: { id: 'sel', name: 'Jeudi', items: [] },
      },
    ]);
    renderApp('/history/room-1');
    fireEvent.click(await screen.findByRole('button', { name: /Enregistrer comme sélection/ }));
    expect(await screen.findByRole('link', { name: /Enregistré comme sélection/ })).toHaveAttribute(
      'href',
      '/selections/sel',
    );
    const post = fetchMock.mock.calls.find(([, o]) => o?.method === 'POST');
    expect(JSON.parse(String(post?.[1]?.body))).toEqual({ roomId: 'room-1' });
  });
});
