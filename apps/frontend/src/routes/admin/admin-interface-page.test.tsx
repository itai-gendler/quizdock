import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DEFAULT_LOOK } from '@quiz-dock/contracts';
import { describe, expect, it, vi } from 'vitest';
import fr from '../../i18n/locales/fr/admin.json';
import { AdminInterfacePage } from './admin-interface-page';

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: ({ children }: { children: React.ReactNode }) => <a href="#">{children}</a>,
}));

describe('AdminInterfacePage', () => {
  it('saves the look as it changes, and says only of an accessible one that it is', async () => {
    const sets: unknown[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, opts?: RequestInit) => {
        const answer = (body: unknown) =>
          new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
        const done = (data: unknown) =>
          answer({ kind: 'result', result: { outcome: 'done', notes: [], data } });
        if (url.endsWith('/admin/operations/look.get')) return done(DEFAULT_LOOK);
        if (url.endsWith('/admin/operations/look.set')) {
          const params = JSON.parse(String(opts?.body)).params;
          sets.push(params);
          return done(params);
        }
        return answer({ operations: [] });
      }),
    );
    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <AdminInterfacePage />
      </QueryClientProvider>,
    );
    // QuizDock's own look is accessible.
    expect(await screen.findAllByText(fr.look.accessible)).not.toHaveLength(0);
    const main = screen.getAllByLabelText(fr.look.primary)[0];
    fireEvent.change(main, { target: { value: '#fe9a00' } });
    await waitFor(() => expect(sets).toHaveLength(1), { timeout: 2000 });
    expect(sets[0]).toMatchObject({ primary: '#fe9a00' });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(fr.look.saved));
    // White text on amber falls short: no badge, the checks counted.
    expect(screen.queryByText(fr.look.accessible)).toBeNull();
  });
});
