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

# Stop the quiz

During a quiz, the host stops it where it stands and takes the room back to its lobby, keeping what was played so far when they ask.
