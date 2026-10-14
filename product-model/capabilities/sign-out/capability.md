---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/components/user-menu.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/oidc-session.controller.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/host-seat.controller.ts"
    }
  ]
}
---

# Log out

A signed-in person logs out. In local mode, logging out also frees the host seat they hold.
