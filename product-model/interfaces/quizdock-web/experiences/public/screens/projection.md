---
{
  "entities": [
    {
      "entity": "room",
      "shows": [
        "PIN",
        "Invitation address",
        "Name",
        "Standings"
      ]
    },
    {
      "entity": "game",
      "shows": [
        "Current step",
        "Time left",
        "Answer count",
        "Ready participants",
        "Quiz played"
      ]
    },
    {
      "entity": "player",
      "shows": [
        "Nickname",
        "Avatar",
        "Score"
      ]
    },
    {
      "entity": "question",
      "shows": [
        "Prompt",
        "Media",
        "Answer choices",
        "Explanation"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/session/:pin/projection"
    },
    {
      "quizdock-web": "/join/:pin/screen"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/screen-page.tsx"
    }
  ]
}
---

# Projection

The big screen of a room: its PIN, QR code and players in the lobby, each slide and question, the answer count, the reveal, the leaderboard, the podium and the room's standings. A participant may follow it on a device of their own.
