---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host changes the question and saves it",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Type",
            "Prompt",
            "Media",
            "Answer choices",
            "Accepted answers",
            "Target number",
            "Several right pictures",
            "Time limit",
            "Points",
            "Scoring rule",
            "Explanation",
            "Reveal delay",
            "Listen first",
            "Background",
            "Position"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Product saves it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "question",
          "effect": "changes",
          "facts": [
            "Type",
            "Prompt",
            "Media",
            "Answer choices",
            "Accepted answers",
            "Target number",
            "Several right pictures",
            "Time limit",
            "Points",
            "Scoring rule",
            "Explanation",
            "Reveal delay",
            "Listen first",
            "Background"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    }
  ]
}
---

# Edit a question

## Trigger

A host writes or corrects a question.

## Outcome

The question is saved; a draft saves whatever holds together, complete or not.

## Edge cases

- Choices that do not fit the type are refused: options on a text question, a right answer in a poll, more than two choices for true or false, a scoring rule the type does not offer.
- A replaced or removed media leaves with its file unless something else uses it.
- A room already playing the quiz keeps the question as it was frozen, apart from its explanation, background and reveal delay.
