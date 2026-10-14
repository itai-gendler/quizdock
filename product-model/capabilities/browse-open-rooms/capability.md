---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "rooms",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/live-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.controller.ts",
      "title": "mine"
    }
  ]
}
---

# Browse open rooms

A host sees the rooms they have open right now; an administrator sees every open room of the instance with its host.
