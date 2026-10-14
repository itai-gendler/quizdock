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
      "title": "setRoomName"
    }
  ]
}
---

# Rename the room

In the lobby, the host gives the room its own name, shown above the quiz on every screen and kept with its sessions.
