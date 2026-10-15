---
{
  "entities": [
    {
      "entity": "quiz",
      "shows": [
        "Title"
      ]
    },
    {
      "entity": "question",
      "shows": [
        "Prompt",
        "Media",
        "Answer choices",
        "Explanation"
      ]
    },
    {
      "entity": "slide",
      "shows": [
        "Content",
        "Background",
        "Video"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/quizzes/:quizId/preview"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/preview-page.tsx"
    }
  ]
}
---

# Preview

A quiz rehearsed exactly as the big screen will show it, step by step, with the answers shown.
