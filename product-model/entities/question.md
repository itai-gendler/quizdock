---
{
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "Question"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/question-content.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/questions/questions.service.ts"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-IMAGE-CHOICE.md#2-decisions",
      "title": "Image choice brief: decisions"
    }
  ],
  "domain": "my-quizzes"
}
---

# Question

One timed question of a quiz, of one of eight types: single choice, multiple choice, true or false, text input, numeric, ordering, poll or image choice.

## Information kept

- **Type** — single choice, multiple choice, true/false, text input, numeric, ordering, poll or image choice
- **Prompt** — the question in Markdown; a picture or a sound may stand in for it
- **Media** — an optional picture or video, and an optional sound, each with its credit
- **Answer choices** — for choice types, 2 to 8 choices each with its text — or, for image choice, 2 or 4 pictures with their alternative text — its colour and shape, which are right, and for ordering the right order
- **Accepted answers** — for text input, up to 20 answers accepted after normalisation
- **Target number** — for numeric, the right value and the tolerance around it
- **Several right pictures** — for image choice, whether more than one picture is right
- **Time limit** — from 5 to 240 seconds, 20 by default
- **Points** — Standard (1000), Double (2000), Fixed (1000 with no speed weighting) or None
- **Scoring rule** — Standard, or the type's variant: Partial credit, Tolerate typos or Closest answer wins
- **Explanation** — optional text shown at the reveal
- **Reveal delay** — in autoplay, how long the reveal stays, from 1 to 300 seconds
- **Listen first** — whether the answers open only once its sound or video has played
- **Background** — an optional picture or gradient behind it, with the text contrast
- **Position** — its place in the quiz
