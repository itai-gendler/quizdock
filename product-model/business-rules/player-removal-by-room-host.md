---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "player",
      "effect": "removes"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "seats",
          "entity": "room"
        },
        {
          "verb": "hosts",
          "entity": "host"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "banPlayer"
    }
  ]
}
---

# Only the room's host removes a player

Removing a player and banning their nickname is the room's host's.
