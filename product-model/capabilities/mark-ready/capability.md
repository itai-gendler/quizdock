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
      "title": "setReady"
    }
  ]
}
---

# Say one is ready

In the lobby, a participant says they are ready; the host sees one count. A quiz picked after another starts as soon as every connected participant is ready.
