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
      "target": "apps/backend/src/game/game.service.ts",
      "title": "setSounds"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/game-sounds-panel.tsx"
    }
  ]
}
---

# Change the room's sound

At any time, the host sets the game sounds — a tick per answer, a ding as a question appears, the countdown, the gong —, a background track from their library or the instance's, the levels and the mutes of the projection.
