---
{
  "relations": [
    {
      "entity": "participant-result",
      "verb": "lists",
      "cardinality": "one-to-many"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/session-archive.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "GameSessionLog"
    }
  ],
  "domain": "sessions"
}
---

# Session

One quiz played in a room, as History keeps it once the host kept its results.

## Information kept

- **Quiz as played** — a copy of the quiz as it was played, which History reads
- **Room name** — the room's name when it was played
- **PIN** — the room's PIN
- **Started** — when the game opened
- **Ended** — when it was kept
- **Participant count** — how many played
- **Success rate** — the share of right answers over all answers
- **Personalised tracking** — whether individual results were kept
- **Full answer capture** — whether every answer was kept
- **Question results** — for each question shown: answers, right answers, success rate, average time and the distribution of answers
- **Selection** — the host's own selection the room was opened from, if any
- **Kept until** — one year after it ended

## States

### Ended

Played to its podium, or ended there by the host.

### Interrupted

Stopped before its end: by the host keeping what was played so far, or by a host who never came back.
