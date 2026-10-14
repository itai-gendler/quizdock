---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "publish-quiz"
    },
    {
      "type": "capability-scenario",
      "id": "incomplete-in-a-ready-quiz"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/question-content.ts",
      "title": "questionIssues"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/questions/questions.service.ts",
      "title": "assertPlayableIfReady"
    }
  ]
}
---

# Every question and slide of a ready quiz is complete

A quiz becomes ready only with at least one question and every question and slide complete: a prompt, a picture or a sound for each question; for choice types at least two choices with the right ones marked (exactly one for single choice and true or false); for image choice two or four pictures, each with its alternative text; accepted answers for text input; a target and a tolerance for numeric; something to show on each slide. A question saved in a ready quiz must stay complete. A draft saves anything that holds together.

## Rationale

A ready quiz can be presented at any time.
