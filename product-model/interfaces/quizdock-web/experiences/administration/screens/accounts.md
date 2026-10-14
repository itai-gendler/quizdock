---
{
  "entities": [
    {
      "entity": "account",
      "shows": [
        "Display name",
        "Email",
        "Roles",
        "Granted roles"
      ],
      "collects": [
        "Granted roles"
      ]
    },
    {
      "entity": "host-seat",
      "shows": [
        "Holder",
        "Claimed at"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/admin/accounts"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/admin/admin-accounts-page.tsx"
    }
  ]
}
---

# Accounts

Every account of the instance with its roles, the roles granted from here, and the host seat.
