---
{
  "kind": "person",
  "acts": "external",
  "relations": [
    {
      "entity": "player",
      "verb": "takes part as",
      "cardinality": "one-to-many"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/roles.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.gateway.ts"
    }
  ]
}
---

# Participant

A person taking part in rooms from their own device: a guest with a nickname, or — where the instance requires accounts — someone signed in whose only role is the floor every account has.
