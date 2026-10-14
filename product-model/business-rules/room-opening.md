---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "room",
      "effect": "creates"
    }
  ],
  "permits": [
    {
      "actors": [
        "host"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.gateway.ts",
      "title": "requireHost"
    }
  ]
}
---

# A host opens rooms

Opening a room — on a quiz or a selection — belongs to hosts.
