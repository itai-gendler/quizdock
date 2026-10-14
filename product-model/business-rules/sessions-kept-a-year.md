---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "session",
      "facts": [
        "Kept until"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/session-archive.service.ts",
      "title": "SESSION_RETENTION_DAYS"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/cli/commands/sessions.ts"
    }
  ]
}
---

# A session is kept one year

Each session carries a date one year after it ended; the operator's purge deletes the sessions past it.
