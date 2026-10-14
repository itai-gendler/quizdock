---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "review",
      "effect": "creates"
    }
  ],
  "permits": [
    {
      "actors": [
        "participant"
      ],
      "when": [
        {
          "entity": "quiz",
          "fact": "Reviews enabled",
          "is": "On"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "recordFeedback"
    }
  ]
}
---

# A participant rates a quiz they played, once

A participant rates a quiz they played in the room, at its podium or in the lobby that follows, once — rating again replaces it — and only while the quiz takes ratings.
