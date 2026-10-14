---
{
  "appliesTo": [
    {
      "type": "capability-scenario",
      "id": "present-in-open-access"
    },
    {
      "type": "capability-scenario",
      "id": "open-access-stays-anonymous"
    },
    {
      "type": "capability-scenario",
      "id": "join-under-account-name"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/auth-mode.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "createSession"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-METIER.md"
    }
  ]
}
---

# A room opens to guests only where the operator allows it

With an identity provider, every participant signs in and the PIN opens one room, unless the operator lets hosts open rooms to participants without an account: then the host picks Open access at launch, for the room's whole life, and everyone in it is a guest with personalised tracking off. In local mode the PIN alone always opens the room.
