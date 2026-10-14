---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "review",
      "effect": "changes"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "writes",
          "entity": "participant"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "recordFeedback"
    }
  ]
}
---

# Only its author changes a review

Rating a quiz again replaces the participant's own earlier review.
