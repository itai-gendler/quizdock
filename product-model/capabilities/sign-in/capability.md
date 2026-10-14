---
{
  "availability": [
    {
      "place": "quizdock-web::public"
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
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/no-auth.provider.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/oidc.provider.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/host-seat.service.ts"
    }
  ]
}
---

# Sign in

A person signs in to reach the host area. In local mode they type a name and take the single host seat, or come back under the name that holds it; with an identity provider they sign in there and come back with the roles it gives.
