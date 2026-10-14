---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "selections",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "firstOfSelection"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selection-access.ts"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/live-session.md"
    }
  ]
}
---

# Present a selection

A host opens a room on a selection — theirs or one shared with them — on its first quiz they may play; after each quiz the room's lobby picks the next one not played yet.
