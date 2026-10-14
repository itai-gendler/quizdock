---
{
  "entities": [
    {
      "entity": "account",
      "shows": [
        "Display name",
        "Email",
        "Roles",
        "Interface language",
        "Participant access at launch"
      ],
      "collects": [
        "Interface language",
        "Participant access at launch"
      ]
    },
    {
      "entity": "host-seat",
      "shows": [
        "Holder",
        "Expires at"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/profile"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/profile-page.tsx"
    }
  ]
}
---

# My account

The signed-in person's identity, roles, host seat and preferences.
