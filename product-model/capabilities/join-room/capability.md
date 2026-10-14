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
      "target": "apps/frontend/src/routes/join-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/player-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "joinSession"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/pin-attempts.ts"
    }
  ]
}
---

# Join a room

A participant enters a room with its PIN — typed, scanned from the QR code or in the join link — under a nickname, with an avatar, in the room or remotely, and lands on the step being played.
