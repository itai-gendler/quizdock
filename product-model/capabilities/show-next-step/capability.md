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
      "title": "next"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/steps.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/preload.ts"
    }
  ]
}
---

# Show the next step

The host moves the quiz on: from a reveal to the leaderboard, from the leaderboard or a slide to the next question or slide, and after the last question to the podium. In autoplay the quiz moves on by itself.
