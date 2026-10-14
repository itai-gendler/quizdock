---
{
  "relations": [
    {
      "entity": "host-seat",
      "verb": "holds",
      "cardinality": "one-to-one"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "User"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/save-user.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/preferences.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/preferences.ts"
    }
  ]
}
---

# Account

What the instance keeps about a signed-in person, whatever their roles: who they are, the roles they hold and the choices that follow them wherever they sign in.

## Information kept

- **Display name** — the name shown, from the identity provider, or the name typed in local mode
- **Email** — the address the identity provider gives, when it gives one
- **Granted roles** — Host, Administrator, both or none, granted from the administration or by the operator; none means a participant
- **Roles** — the roles in effect: the granted ones plus those the identity provider's claims or a held host seat give
- **Interface language** — the language of the person's own screens; the instance's when unset
- **Participant access at launch** — Ask at each launch, Always accounts required or Always open access
