---
{
  "entities": [
    {
      "entity": "host-seat",
      "shows": [
        "Holder",
        "Expires at"
      ]
    },
    {
      "entity": "account",
      "collects": [
        "Display name"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/login"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/login-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/callback-page.tsx"
    }
  ]
}
---

# Sign-in

Where a person signs in: with a name and the host seat in local mode, or through the identity provider.
