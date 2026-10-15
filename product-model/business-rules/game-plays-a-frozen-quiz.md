---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "game"
    }
  ],
  "references": [
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/live-session.md"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/snapshot.ts"
    }
  ]
}
---

# A game plays the quiz as it stood when it opened

A game freezes its quiz's questions, order, types, prompts, media, choices, right answers, scoring and timing when it opens, so its statistics hold; the form — backgrounds, text contrast, explanations, reveal delays, the ratings switch and the slides — follows the editor at each step. A question deleted meanwhile keeps its frozen version.
