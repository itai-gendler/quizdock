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
      "title": "review"
    }
  ]
}
---

# Look back at a played step

Between steps, or in a question they paused, the host shows a step already played again on every screen, read-only: nothing is replayed or rescored.
