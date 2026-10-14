---
{
  "entities": [
    {
      "entity": "room",
      "shows": [
        "Name",
        "PIN",
        "Closed to newcomers",
        "Participant access"
      ]
    },
    {
      "entity": "game",
      "shows": [
        "Quiz played"
      ]
    },
    {
      "entity": "player",
      "collects": [
        "Nickname",
        "Avatar",
        "Presence"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/join"
    },
    {
      "quizdock-web": "/join/:pin"
    }
  ],
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
    }
  ]
}
---

# Join a room

Where a participant types the PIN — or arrives by the QR code or the join link — and then picks a nickname, an avatar and whether they play in the room or remotely.
