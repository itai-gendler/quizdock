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
      "target": "apps/frontend/src/game/use-launch-session.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/launch-access-dialog.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "createSession"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.gateway.ts"
    }
  ]
}
---

# Present a quiz

A host opens a room on a ready quiz — theirs, or one another host shares — and lands on its console, the room's lobby waiting for participants.
