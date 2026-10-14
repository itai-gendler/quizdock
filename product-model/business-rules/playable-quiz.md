---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "present-quiz"
    },
    {
      "type": "capability",
      "id": "choose-next-quiz"
    },
    {
      "type": "capability",
      "id": "launch-selection"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "playableSnapshot"
    }
  ]
}
---

# A room plays a ready quiz with at least one question

A room plays a quiz that is ready and has a question: the host's own, or one another host shares. A selection plays the quizzes of it the host may play, skipping the others.
