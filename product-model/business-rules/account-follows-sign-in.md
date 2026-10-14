---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "account",
      "effect": "changes",
      "facts": [
        "Display name",
        "Email",
        "Roles"
      ]
    }
  ],
  "permits": [
    {
      "actors": [
        "visitor"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/save-user.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/roles.ts"
    }
  ]
}
---

# An account's name, address and roles in effect follow its sign-in

Each sign-in refreshes the account's name and address from the identity provider, or the name typed in local mode, and its roles in effect from the provider's claims, the held seat and the granted roles.
