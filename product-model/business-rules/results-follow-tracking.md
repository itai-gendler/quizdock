---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "participant-result"
    },
    {
      "type": "entity",
      "id": "session",
      "facts": [
        "Personalised tracking",
        "Full answer capture"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/session-archive.service.ts"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-METIER.md"
    }
  ]
}
---

# Personalised tracking decides what a session keeps of each participant

With personalised tracking off, a session keeps no participant result and no answer, only its per-question figures and summary. With it on, each participant's result is kept under their nickname and account; every answer is kept only when full answer capture was on too.
