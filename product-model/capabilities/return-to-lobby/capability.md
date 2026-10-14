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
      "title": "backToLobby"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/room-components.tsx"
    }
  ]
}
---

# Go back to the lobby

After a quiz's podium, the host takes the room back to its lobby to play another quiz, keeping the results of the one just played when they ask.
