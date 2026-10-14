---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "change-room-settings"
    },
    {
      "type": "capability",
      "id": "rename-room"
    },
    {
      "type": "capability",
      "id": "change-invitation-address"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "setCapture"
    }
  ]
}
---

# What a quiz records is fixed once it starts

Full answer capture, personalised tracking, whether participants pick their name, who hears the sound, the screens' language, the room's name and the invitation address change only in the lobby; the next quiz's lobby may change them again. Participant access is fixed when the room opens.
