---
{
  "availability": [
    {
      "place": "quizdock-web"
    }
  ],
  "domain": "selections",
  "references": [
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-SELECTION.md#2-decisions-taken",
      "title": "Selections brief: decisions taken"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selections.service.ts",
      "title": "fromRoom"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/room-components.tsx"
    }
  ]
}
---

# Save a room as a selection

A host turns the quizzes a room played, in order, into a new selection — from the console, or later from the room in Sessions.
