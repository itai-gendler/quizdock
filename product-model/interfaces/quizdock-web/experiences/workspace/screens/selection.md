---
{
  "entities": [
    {
      "entity": "selection",
      "shows": [
        "Name",
        "Description",
        "Shared",
        "Quizzes"
      ],
      "collects": [
        "Name",
        "Description",
        "Shared",
        "Quizzes"
      ]
    },
    {
      "entity": "quiz",
      "shows": [
        "Title",
        "Question count"
      ]
    },
    {
      "entity": "session",
      "shows": [
        "Room name",
        "Started",
        "Participant count",
        "Success rate"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/selections/:selectionId"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/selection-page.tsx"
    }
  ]
}
---

# Selection

One selection: its name, its quizzes in order with their pace, its sharing and its launches. Another host's shared selection opens here read-only.
