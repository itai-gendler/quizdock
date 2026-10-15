---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "room",
      "facts": [
        "Standings"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "standings"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-ROOM.md"
    }
  ]
}
---

# A room's standings sum its games

A room ranks its players by their total score over the games it played, then by when they arrived; a player who left stays ranked, a removed one does not. A quiz stopped mid-way counts for what was played when the host kept it, and not at all otherwise; one never started does not count.
