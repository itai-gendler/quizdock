---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "player",
      "effect": "changes"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "takes part as",
          "entity": "participant"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.gateway.ts",
      "title": "playerOf"
    }
  ]
}
---

# A participant changes only their own place in a room

Their avatar, their readiness, their answers' points and their coming and going belong to the participant themselves.
