---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "game",
      "effect": "changes"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "plays",
          "entity": "room"
        },
        {
          "verb": "hosts",
          "entity": "host"
        }
      ]
    },
    {
      "unattended": true
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "requireHost"
    }
  ]
}
---

# Only the room's host steers its game

Starting, revealing, moving on, pausing, timing, pacing, looking back and stopping are the room's host's. The game also moves on its own: a closing deadline, everyone having answered, autoplay, a countdown, media loading and the host's absence.
