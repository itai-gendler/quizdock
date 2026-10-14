---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "answer-question"
    },
    {
      "type": "capability",
      "id": "reveal-answer"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.gateway.ts",
      "title": "emitOutline"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/reveal.ts"
    }
  ]
}
---

# No participant learns the right answer before the reveal

The right answers reach the participants' devices and the projection only at the reveal; the answer key shows only on the host's console.
