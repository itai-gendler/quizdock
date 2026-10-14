---
{
  "appliesTo": [
    {
      "type": "capability-scenario",
      "id": "next-of-the-selection"
    },
    {
      "type": "capability",
      "id": "launch-selection"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selection-access.ts",
      "title": "nextOf"
    }
  ]
}
---

# A room opened from a selection plays its first quiz not played yet

After each quiz, the lobby of a room opened from a selection picks the first quiz of the list the room has not played and that can be played, with the pace the selection gives it; a quiz picked outside the list is played and the queue goes on where it was.
