---
{
  "relations": [
    {
      "entity": "game",
      "verb": "plays",
      "cardinality": "one-to-many"
    },
    {
      "entity": "player",
      "verb": "seats",
      "cardinality": "one-to-many"
    },
    {
      "entity": "session",
      "verb": "keeps",
      "cardinality": "one-to-many"
    }
  ],
  "references": [
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-ROOM.md"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.types.ts"
    }
  ]
}
---

# Room

What participants join with a PIN and stay in: a host opens it on a quiz, it plays one quiz after another, and it keeps its players and its own standings across them.

## Information kept

- **PIN** — six digits, unique among open rooms, shown with a QR code
- **Name** — the room's own name, up to 60 characters; "<host>'s room" when blank
- **Participant access** — Accounts required or Open access, fixed when the room opens
- **Full answer capture** — whether every answer of each participant is kept with the results; off by default
- **Personalised tracking** — whether individual results are kept, attached to each participant; on by default, off in open access
- **Own display names** — whether participants pick their display name rather than taking their account's; on in local mode, off by default with an identity provider
- **Closed to newcomers** — whether new participants are refused; those already in still come back
- **Invitation address** — the address the QR code and the join link point at
- **Screen language** — each quiz's own language, or one language for the projection and the phones of the whole room
- **Who hears the sound** — for the quiz about to start, which devices play sounds and videos
- **Room sound** — the game sounds (a tick per answer, a ding as a question appears, the countdown, the gong), a background track, their levels and mutes
- **Selection** — the selection the room was opened from, if any
- **Banned nicknames** — the nicknames refused, each until its ban ends
- **Standings** — each player's totals over the games played in the room: score, rank, right answers, answers given, average time, longest streak, quizzes played
- **Projection screens** — the screens the host paired as the room's projection
- **Played quizzes** — the quizzes the room played, in order, each with its pace

## States

### Open

Joinable with its PIN, between quizzes or playing one.

### Closed

The PIN is freed and every device is told; nothing can be played in it any more.
