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
      "title": "setCapture"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/control-page.tsx"
    }
  ]
}
---

# Change the room's settings

Before the quiz starts, the host settles what the room records and how its screens behave: full answer capture, personalised tracking, whether participants pick their name, who hears the sound and the screens' language.
