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
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "end"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/session-archive.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/control-page.tsx"
    }
  ]
}
---

# Close a room

The host closes the room for good: the PIN is freed, every device is told, and the quiz being played is kept in History when the host asks. A room whose host never comes back closes on its own.
