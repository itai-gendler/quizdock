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
      "target": "apps/frontend/src/components/seat-status.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/host-seat.service.ts",
      "title": "claim"
    }
  ]
}
---

# Extend the host seat

In local mode, the seat's holder moves its expiry further.
