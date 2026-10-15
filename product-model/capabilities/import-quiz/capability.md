---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "my-quizzes",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/portable/quiz-portable.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/portable/kahoot-spreadsheet.ts"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/quiz-bundle.md"
    }
  ]
}
---

# Import a quiz

A host turns a file into a new draft: a QuizDock bundle (a zip of the quiz and its media, or the bare quiz file), or a Kahoot spreadsheet whose rows to finish are flagged.
