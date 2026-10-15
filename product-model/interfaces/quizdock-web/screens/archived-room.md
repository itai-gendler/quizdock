---
{
  "entities": [
    {
      "entity": "session",
      "shows": [
        "Room name",
        "Quiz as played",
        "Started"
      ]
    },
    {
      "entity": "participant-result",
      "shows": [
        "Nickname",
        "Score",
        "Right answers",
        "Answers given",
        "Average time",
        "Longest streak"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/history/:roomId"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/history-page.tsx",
      "title": "HistoryRoomPage"
    }
  ]
}
---

# Room

A room of History that kept several quizzes: its quizzes in order and its standings summed over them.
