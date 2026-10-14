---
{
  "entities": [
    {
      "entity": "session",
      "shows": [
        "Room name",
        "Started",
        "Ended",
        "Participant count",
        "Quiz as played"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/history"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/history-page.tsx"
    }
  ]
}
---

# Sessions

What was played, room by room: a room that kept several quizzes is one line, a quiz played alone another.
