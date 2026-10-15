---
{
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts",
      "title": "joinSession"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.types.ts"
    }
  ],
  "domain": "rooms"
}
---

# Player

A participant's place in a room: their name there, their avatar and how they follow.

## Information kept

- **Nickname** — the name shown, unique in the room; typed, or taken from the account
- **Avatar** — the generated picture, from a seed the participant may change in the lobby
- **Presence** — In the room, following the projection, or Remote, getting the whole question and its media on their device
- **Ready** — whether they said they are ready in the current lobby
- **Score** — their points and current streak in the quiz being played
- **Joined at** — when they entered the room

## States

### Connected

In the room, counted among those who answer.

### Disconnected

Gone for now: still ranked, and back in their place when their device reconnects.
