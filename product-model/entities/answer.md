---
{
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/scoring.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "AnswerLog"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/scoring.md"
    }
  ]
}
---

# Answer

What one player answered to one question of a game, graded on arrival.

## Information kept

- **Value** — the choice, choices, order, text or number given
- **Correct** — whether it is right
- **Credit** — the share of the points earned, for partial credit and closest answers
- **Points awarded** — the points it earned
- **Response time** — from the question opening to its arrival on the server
- **Closest rank** — for closest-answer questions, its rank and distance to the target
