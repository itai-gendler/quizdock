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
      "title": "start"
    }
  ]
}
---

# Start the quiz

The host starts the quiz waiting in the lobby; a quiz picked after another starts on its own after its countdown or once everyone is ready.
