---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "read-archived-room"
    },
    {
      "type": "capability-scenario",
      "id": "session-in-a-room"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "roomOf"
    }
  ]
}
---

# A room's kept standings need every session tracked

History sums a room's standings per nickname over its kept sessions only when every one of them kept participants' results.
