import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockApi, renderApp } from '../test/harness';

const createSession = vi.fn(async () => ({ pin: '482913' }));
vi.mock('../game/game-client', () => ({
  createSession: (...a: unknown[]) => createSession(...(a as [])),
  ensureGameSocket: vi.fn(() => new Promise(() => undefined)),
}));

const selection = (over: Record<string, unknown> = {}) => ({
  id: 's1',
  ownerId: 'me',
  name: 'Vendredi soir',
  description: null,
  shared: false,
  editable: true,
  quizCount: 3,
  playableCount: 3,
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  ...over,
});

const item = (quizId: string, title: string, over: Record<string, unknown> = {}) => ({
  quizId,
  title,
  status: 'ready',
  questionCount: 4,
  mode: 'manual',
  autoStart: true,
  unplayable: null,
  ...over,
});

describe('SelectionsPage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('lists the host’s selections and the shared ones, and presents one', async () => {
    localStorage.setItem('live.localUser', 'Marc');
    mockApi([
      {
        method: 'GET',
        path: '/selections',
        body: [
          selection(),
          selection({
            id: 's2',
            name: 'D’Alice',
            editable: false,
            shared: true,
            ownerName: 'Alice',
            quizCount: 2,
            playableCount: 1,
          }),
        ],
      },
    ]);
    const { router } = renderApp('/selections');
    expect(await screen.findByText('Vendredi soir')).toBeInTheDocument();
    const theirs = screen.getByText('D’Alice').closest('li')!;
    expect(within(theirs).getByText(/de Alice/)).toBeInTheDocument();
    expect(within(theirs).getByText(/1 jouable/)).toBeInTheDocument();
    // Theirs: copied, or presented — the main action last.
    const copy = within(theirs).getByRole('button', { name: /Créer une sélection\s+à partir/ });
    const present = within(theirs).getByRole('button', { name: 'Présenter' });
    expect(copy.compareDocumentPosition(present) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.click(present);
    await waitFor(() => expect(createSession).toHaveBeenCalledWith({ selectionId: 's2' }, {}));
    await waitFor(() => expect(router.state.location.pathname).toBe('/session/482913/console'));
  });

  it('says when there is none yet, and creates one', async () => {
    localStorage.setItem('live.localUser', 'Marc');
    const fetchMock = mockApi([
      { method: 'GET', path: '/selections', body: [] },
      {
        method: 'POST',
        path: '/selections',
        status: 201,
        body: { ...selection({ id: 'new' }), items: [] },
      },
      { method: 'GET', path: '/selections/new', body: { ...selection({ id: 'new' }), items: [] } },
    ]);
    const { router } = renderApp('/selections');
    expect(await screen.findByText('Aucune sélection pour l’instant')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Nouvelle sélection/ })[0]);
    await waitFor(() => expect(router.state.location.pathname).toBe('/selections/new'));
    const post = fetchMock.mock.calls.find(([, o]) => o?.method === 'POST');
    expect(JSON.parse(String(post?.[1]?.body))).toEqual({ name: 'Nouvelle sélection' });
  });
});

describe('SelectionPage', () => {
  afterEach(() => localStorage.clear());

  it('its owner reorders its quizzes; one that cannot be played is greyed with why', async () => {
    localStorage.setItem('live.localUser', 'Marc');
    const detail = {
      ...selection({ playableCount: 1, quizCount: 2 }),
      unsharedCount: 2,
      items: [
        item('q1', 'Géographie'),
        item('q2', 'Histoire', { status: 'draft', unplayable: 'draft' }),
      ],
    };
    const fetchMock = mockApi([
      { method: 'GET', path: '/selections/s1', body: detail },
      { method: 'GET', path: '/selections/s1/launches', body: [] },
      { method: 'PUT', path: '/selections/s1', body: detail },
    ]);
    renderApp('/selections/s1');
    expect(await screen.findByText(/brouillon : ne peut pas être joué/)).toBeInTheDocument();
    expect(screen.getByText(/2 de ses quiz ne sont pas partagés/)).toBeInTheDocument();
    // As the quiz editor's steps: the arrows show once the line is selected.
    expect(screen.queryByRole('button', { name: 'Monter « Histoire »' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^Histoire/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Monter « Histoire »' }));
    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([, o]) => o?.method === 'PUT')).toBe(true),
    );
    const put = fetchMock.mock.calls.find(([, o]) => o?.method === 'PUT');
    expect(
      JSON.parse(String(put?.[1]?.body)).items.map((i: { quizId: string }) => i.quizId),
    ).toEqual(['q2', 'q1']);
    expect(screen.getByText(/Aucun lancement gardé/)).toBeInTheDocument();
    // A line does not open its quiz: its ⋮ does, or takes it out of the selection.
    expect(screen.queryByRole('link', { name: 'Géographie' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Plus pour « Géographie »' }));
    expect(screen.getByRole('button', { name: /Ouvrir le quiz/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Retirer de la sélection/ }));
    await waitFor(() =>
      expect(fetchMock.mock.calls.filter(([, o]) => o?.method === 'PUT')).toHaveLength(2),
    );
    const removed = fetchMock.mock.calls.filter(([, o]) => o?.method === 'PUT')[1];
    expect(
      JSON.parse(String(removed[1]?.body)).items.map((i: { quizId: string }) => i.quizId),
    ).toEqual(['q2']);
  });

  it('another host reads it, and creates their own from it', async () => {
    localStorage.setItem('live.localUser', 'Marc');
    const theirs = {
      ...selection({ editable: false, shared: true, ownerName: 'Alice' }),
      items: [item('q1', 'Géographie')],
    };
    const fetchMock = mockApi([
      { method: 'GET', path: '/selections/s1', body: theirs },
      {
        method: 'POST',
        path: '/selections/s1/duplicate',
        status: 201,
        body: { ...theirs, id: 'copy', editable: true },
      },
      { method: 'GET', path: '/selections/copy', body: { ...theirs, id: 'copy', editable: true } },
      { method: 'GET', path: '/selections/copy/launches', body: [] },
    ]);
    const { router } = renderApp('/selections/s1');
    expect(await screen.findByText(/Sélection de Alice/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Monter/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Créer une sélection\s+à partir/ }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/selections/copy'));
    expect(
      fetchMock.mock.calls.some(
        ([url, o]) => String(url).endsWith('/selections/s1/duplicate') && o?.method === 'POST',
      ),
    ).toBe(true);
  });
});
