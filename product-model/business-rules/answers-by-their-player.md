---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "answer",
      "effect": "creates"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "gives",
          "entity": "player"
        },
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
      "title": "playerSubmit"
    }
  ]
}
---

# A participant answers only as their own player

An answer is given by the participant seated as that player, in the room they joined.
