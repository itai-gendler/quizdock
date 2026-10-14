---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "sessions",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/history-page.tsx",
      "title": "HistoryRoomPage"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/room-standings.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/history.controller.ts"
    }
  ]
}
---

# Read a room's results

A host reads a room that kept several quizzes: its quizzes in order and the standings summed over them.
