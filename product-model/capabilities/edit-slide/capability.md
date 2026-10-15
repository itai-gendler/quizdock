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
      "target": "apps/backend/src/slides/slides.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/slide-content.ts"
    }
  ]
}
---

# Edit a slide

The owner changes a slide: its content, background, video, sound and display time.
