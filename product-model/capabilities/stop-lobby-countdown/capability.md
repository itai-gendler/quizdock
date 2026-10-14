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
      "title": "stopLobbyCountdown"
    }
  ]
}
---

# Stop the lobby countdown

The host stops the countdown of a quiz picked after another, so it waits for Start.
