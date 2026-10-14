---
{
  "appliesTo": [
    {
      "type": "capability-scenario",
      "id": "present-shared-quiz"
    },
    {
      "type": "capability-scenario",
      "id": "rate-another-hosts-game"
    },
    {
      "type": "capability",
      "id": "close-room"
    }
  ],
  "references": [
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-SHARED-PLAY.md"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/session-archive.service.ts",
      "title": "archive"
    }
  ]
}
---

# A game of another host's quiz keeps nothing

A host presenting a quiz another host shares keeps no session, no participant result, no statistic and no answer of it, whatever is ticked; its ratings still reach the quiz without nicknames.

## Rationale

The owner stays free to edit, stop sharing or delete the quiz, and their History holds only their own audiences.
