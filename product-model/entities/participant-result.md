---
{
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "PlayerResultLog"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "sessionPlayerDetail"
    }
  ],
  "domain": "sessions"
}
---

# Participant result

One participant's result in a session, kept when personalised tracking was on.

## Information kept

- **Nickname** — the name they played under
- **Rank** — their final rank
- **Score** — their final score
- **Right answers** — how many of their answers were right
- **Answers given** — how many questions they answered
- **Average time** — their average response time
- **Longest streak** — their longest run of right answers
