---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "question"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/question-content.ts"
    }
  ]
}
---

# A question stays within its bounds

A time limit runs from 5 to 240 seconds; a choice question holds at most 8 choices, an image choice 2 or 4 pictures, a text input at most 20 accepted answers; a poll has no right answer and true or false two choices; a reveal delay runs from 1 to 300 seconds; each type offers only its own scoring rule.
