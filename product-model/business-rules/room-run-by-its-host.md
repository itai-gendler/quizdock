---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "room",
      "effect": "changes"
    }
  ],
  "permits": [
    {
      "related": [
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

# Only the room's host runs it

Every change to a room — its settings, its name, its invitation, its sound, its projection, closing it to newcomers or closing it — is its host's. The room closes on its own only when its host never came back.
