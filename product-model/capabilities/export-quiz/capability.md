---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    },
    {
      "place": "quizdock-web::administration"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/portable/quiz-portable.service.ts",
      "title": "exportZip"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/quiz-bundle.md"
    }
  ]
}
---

# Export a quiz

A quiz is downloaded as a portable bundle — the quiz and its media, zipped — to back it up or move it between instances: by its owner, or by an administrator for any quiz.
