---
{
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "QuizFeedback"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "recordFeedback"
    }
  ],
  "domain": "my-quizzes"
}
---

# Review

A participant's rating of a quiz they played, given at its end.

## Information kept

- **Rating** — one to five stars
- **Comment** — optional, up to 2,000 characters
- **Nickname** — the reviewer's nickname; none for a game another host presented
- **Date** — when it was given
