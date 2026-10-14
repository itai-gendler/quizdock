import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { mockApi, renderApp } from '../test/harness';

const theme = (id: string, name: string, owner: { id: string; name: string }) => ({
  id,
  name,
  parent: 'classic',
  overrides: {},
  accessibility: { status: 'compliant', checks: [] },
  owner,
  canEdit: false,
  quizCount: 0,
  isDefault: false,
  media: {},
  license: null,
  updatedAt: '2026-10-01T00:00:00.000Z',
});

describe('ThemesPage', () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('filters the library as My quizzes does: the search, then whose', async () => {
    localStorage.setItem('live.localUser', 'Marc');
    mockApi([
      {
        method: 'GET',
        path: '/themes',
        body: {
          themes: [
            theme('t1', 'Forêt', { id: 'a', name: 'Alice' }),
            theme('t2', 'Océan', { id: 'b', name: 'Bob' }),
          ],
          defaultTheme: { builtin: 'classic' },
        },
      },
    ]);
    renderApp('/themes');
    expect(await screen.findByText('Forêt')).toBeInTheDocument();
    expect(screen.getByText('Océan')).toBeInTheDocument(); // everyone's by default
    fireEvent.change(screen.getByRole('combobox', { name: 'Propriétaire' }), {
      target: { value: 'b' },
    });
    expect(screen.queryByText('Forêt')).toBeNull();
    expect(screen.getByText('Océan')).toBeInTheDocument();
  });
});
