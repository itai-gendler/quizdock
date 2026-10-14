---
{
  "availability": [
    {
      "place": "quizdock-web::public"
    }
  ],
  "domain": "rooms",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "submit"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/scoring.ts"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/scoring.md"
    }
  ]
}
---

# Answer a question

A participant answers the question on screen from their device; the answer is stamped on arrival, graded and scored at once.
