---
{
  "entities": [
    {
      "entity": "quiz",
      "shows": [
        "Title",
        "Description",
        "Language",
        "Cover",
        "Tags",
        "Licence",
        "Shared",
        "Reviews enabled",
        "Sound settings",
        "Theme",
        "Owner"
      ],
      "collects": [
        "Title",
        "Description",
        "Language",
        "Cover",
        "Tags",
        "Licence",
        "Shared",
        "Reviews enabled",
        "Sound settings",
        "Theme"
      ]
    },
    {
      "entity": "question",
      "shows": [
        "Type",
        "Prompt",
        "Media",
        "Answer choices",
        "Accepted answers",
        "Target number",
        "Several right pictures",
        "Time limit",
        "Points",
        "Scoring rule",
        "Explanation",
        "Reveal delay",
        "Listen first",
        "Background",
        "Position"
      ],
      "collects": [
        "Type",
        "Prompt",
        "Media",
        "Answer choices",
        "Accepted answers",
        "Target number",
        "Several right pictures",
        "Time limit",
        "Points",
        "Scoring rule",
        "Explanation",
        "Reveal delay",
        "Listen first",
        "Background",
        "Position"
      ]
    },
    {
      "entity": "slide",
      "shows": [
        "Content",
        "Background",
        "Video",
        "Sound",
        "Display time",
        "Position"
      ],
      "collects": [
        "Content",
        "Background",
        "Video",
        "Sound",
        "Display time",
        "Position"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/quizzes/:quizId"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/editor-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/quiz-read-only.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/question-form.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/slide-form.tsx"
    }
  ]
}
---

# Quiz editor

One quiz: its settings, its sequence of questions and slides, and each step's properties. Another host's shared quiz opens here read-only.
