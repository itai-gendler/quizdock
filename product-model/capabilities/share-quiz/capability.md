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
      "target": "apps/frontend/src/routes/editor-page.tsx",
      "title": "setShared"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-SHARED-PLAY.md"
    }
  ]
}
---

# Share a quiz

The owner shares a quiz with the instance's other hosts, who then find it in their quizzes read-only, may present it without keeping results, and may create their own copy.
