---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "rooms",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "advanceToReveal"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/reveal.ts"
    }
  ]
}
---

# Reveal the answer

The question closes and every screen shows the right answers, the distribution, the explanation and, on each phone, the participant's own result — when the host reveals it, when the time is up, or a moment after every connected participant answered.
