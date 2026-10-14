---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "join-room"
    },
    {
      "type": "entity",
      "id": "player",
      "facts": [
        "Nickname"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "claimNickname"
    }
  ]
}
---

# A nickname is unique in a room

Two players of one room never share a nickname, compared ignoring case, accents and spaces; a nickname typed is refused when taken, a name taken from an account is told apart by a number.
