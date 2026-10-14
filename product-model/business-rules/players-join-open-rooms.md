---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "player",
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
          "entity": "room",
          "fact": "Closed to newcomers",
          "is": "Off"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "joinSession"
    }
  ]
}
---

# A participant joins a room open to newcomers

A participant is seated in a room only while it is not closed to newcomers, under a nickname that is free in the room and not banned from it. Those already in come back whatever the setting.
