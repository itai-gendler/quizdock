---
{
  "entities": [
    {
      "entity": "room",
      "shows": [
        "PIN",
        "Name"
      ]
    },
    {
      "entity": "game",
      "shows": [
        "Quiz played",
        "Current step"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/live"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/live-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/components/live-sessions.tsx"
    }
  ]
}
---

# Open rooms

The rooms open right now: a host's own, or for an administrator every room of the instance with its host.
