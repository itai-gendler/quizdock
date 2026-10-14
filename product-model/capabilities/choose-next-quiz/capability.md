---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "rooms",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "nextQuiz"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/room-components.tsx"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-ROOM.md"
    }
  ]
}
---

# Choose the next quiz

In the room's lobby, the host picks the quiz the room plays — one of their ready quizzes or one another host shares — or replaces the one picked before it starts. Players stay in, at zero for the new quiz.
