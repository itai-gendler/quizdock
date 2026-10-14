---
{
  "appliesTo": [
    {
      "type": "capability-scenario",
      "id": "banned-nickname"
    },
    {
      "type": "capability-scenario",
      "id": "ban-a-player"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "banPlayer"
    }
  ]
}
---

# A banned nickname stays out for its ban

A nickname the host banned is refused in the room until the ban's minutes are over.
