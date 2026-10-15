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
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-IMAGE-CHOICE.md#2-decisions",
      "title": "Image choice brief: decisions"
    }
  ]
}
---

# A question stays within its bounds

A time limit runs from 5 to 240 seconds; a choice question holds at most 8 choices, an image choice 2 or 4 pictures, a text input at most 20 accepted answers; a poll has no right answer and true or false two choices; a reveal delay runs from 1 to 300 seconds; each type offers only its own scoring rule. An image choice's answers are pictures without text, and it has no picture or video of its own: its prompt, a sound and a background remain.

## Rationale

An image choice shows its pictures in one row of two or two rows of two, so it holds two or four, never three; its answers are the pictures.
