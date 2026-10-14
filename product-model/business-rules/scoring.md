---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "answer"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/scoring.ts"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/scoring.md"
    }
  ]
}
---

# Right answers earn points by speed, with a streak bonus

A right answer earns its base points (1000, 2000 when doubled) times one minus half the share of the time taken — everything when instant, half at the limit; Fixed points skip the speed weighting, and a poll or a question worth no points scores nothing. Each right answer after the first in a row adds 100, up to 500; a wrong answer resets the streak. Partial credit gives its share of the timed points without growing or breaking the streak; Tolerate typos accepts one typo up to five letters and two beyond; Closest answer wins ranks the answers at the reveal — full points within the tolerance, then 100, 75, 50 and 30 % by rank and 10 % beyond.
