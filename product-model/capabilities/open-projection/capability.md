---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    },
    {
      "place": "quizdock-web::public"
    }
  ],
  "domain": "rooms",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/screen-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.gateway.ts",
      "title": "spectatorJoin"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/live-session.md"
    }
  ]
}
---

# Open a room's projection

The room is shown on the big screen: the host's own projection window, a screen elsewhere showing a code for the host to pair, or a participant's copy on a device of their own.
