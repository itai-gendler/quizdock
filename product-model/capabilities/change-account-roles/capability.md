---
{
  "availability": [
    {
      "place": "quizdock-web::administration"
    }
  ],
  "domain": "accounts",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/admin/admin-accounts-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/admin/operations/cli-commands.operations.ts",
      "title": "users.set-role"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/roles.ts",
      "title": "effectiveRoles"
    }
  ]
}
---

# Change an account's roles

An administrator grants or revokes the Host and Administrator roles of an account, on top of what the identity provider or the host seat gives.
