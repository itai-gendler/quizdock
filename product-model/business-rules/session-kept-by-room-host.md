---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "session",
      "effect": "creates"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "keeps",
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
      "target": "apps/backend/src/game/session-archive.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "requireHost"
    }
  ]
}
---

# Only the room's host keeps a session

A session reaches History when the room's host keeps the results — at the podium, when going back to the lobby, stopping the quiz or closing the room — or when the room closes because its host never came back.
