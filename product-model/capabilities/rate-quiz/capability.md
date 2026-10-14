---
{
  "availability": [
    {
      "place": "quizdock-web::public"
    }
  ],
  "domain": "rooms",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/rating-panel.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "recordFeedback"
    }
  ]
}
---

# Rate a quiz

At the end of a quiz, a participant gives it one to five stars and an optional comment, which reach the quiz's reviews.
