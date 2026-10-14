---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "answer-question"
    },
    {
      "type": "entity",
      "id": "answer",
      "effect": "creates"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "submit"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/scoring.md"
    }
  ]
}
---

# One answer per question, in time

A player answers each question once: the first answer counts and later ones are refused. An answer arriving before the answers open, or more than 300 ms after the question closed, is refused and does not count; the streak stays as it was.
