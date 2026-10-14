---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    },
    {
      "place": "quizdock-web::administration"
    }
  ],
  "domain": "accounts",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/host-seat.service.ts",
      "title": "release"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/admin/admin-accounts-page.tsx"
    }
  ]
}
---

# Release the host seat

The seat is freed for someone else to host: by its holder, who stays signed in as a participant, or by an administrator, whoever holds it.
