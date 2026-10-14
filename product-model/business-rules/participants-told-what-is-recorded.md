---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "join-room"
    },
    {
      "type": "capability",
      "id": "change-room-settings"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.types.ts",
      "title": "noticeOf"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-METIER.md"
    }
  ]
}
---

# Participants are told what is recorded before they play

Every participant sees, from the lobby on, what the quiz records about them: their taking part and score under their account or nickname, every one of their answers as well, only the group's overall results, or — for another host's quiz — nothing at all. The notice follows every change the host makes in the lobby.
