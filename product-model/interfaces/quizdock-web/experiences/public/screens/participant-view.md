---
{
  "entities": [
    {
      "entity": "room",
      "shows": [
        "Name",
        "Standings",
        "Full answer capture",
        "Personalised tracking"
      ]
    },
    {
      "entity": "game",
      "shows": [
        "Current step",
        "Time left",
        "Ready participants",
        "Quiz played"
      ]
    },
    {
      "entity": "player",
      "shows": [
        "Nickname",
        "Avatar",
        "Score",
        "Ready",
        "Presence"
      ]
    },
    {
      "entity": "question",
      "shows": [
        "Prompt",
        "Media",
        "Answer choices",
        "Explanation",
        "Time limit"
      ]
    },
    {
      "entity": "answer",
      "shows": [
        "Correct",
        "Points awarded",
        "Credit",
        "Closest rank"
      ],
      "collects": [
        "Value"
      ]
    },
    {
      "entity": "review",
      "collects": [
        "Rating",
        "Comment"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/player-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/rating-panel.tsx"
    }
  ]
}
---

# Participant view

A participant's phone once in the room: the lobby, each question to answer, their own result at each reveal, their rank, the podium and the rating, then the next quiz of the room.
