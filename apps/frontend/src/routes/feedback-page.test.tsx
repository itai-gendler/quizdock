import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { mockApi, renderApp } from '../test/harness';

const item = (id: string, nickname: string | null) => ({
  id,
  rating: 4,
  comment: null,
  nickname,
  createdAt: '2026-10-14T08:00:00.000Z',
});

describe('FeedbackPage', () => {
  afterEach(() => localStorage.clear());

  it("names who rated, and says anonymous for another host's game of a shared quiz", async () => {
    localStorage.setItem('live.localUser', 'Marc');
    mockApi([
      {
        method: 'GET',
        path: '/quizzes/q1/feedback',
        body: {
          count: 2,
          average: 4,
          distribution: [0, 0, 0, 2, 0],
          items: [item('a', 'Wendy'), item('b', null)],
          page: 1,
          pageSize: 20,
          total: 2,
        },
      },
    ]);
    renderApp('/quizzes/q1/reviews');
    expect(await screen.findByText('Wendy')).toBeInTheDocument();
    expect(screen.getByText('Anonyme')).toBeInTheDocument();
  });
});
