---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "game",
      "effect": "creates"
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

# Only the room's host opens its next quiz

A new game in a room — the quiz chosen, or the lobby the room goes back to — is opened by the room's host.
