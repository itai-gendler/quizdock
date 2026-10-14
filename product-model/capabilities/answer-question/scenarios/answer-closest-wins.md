---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The question is numeric and the closest answer wins",
      "kind": "condition",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Type",
            "Scoring rule"
          ]
        },
        {
          "entity": "answer",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      },
      "actor": "participant"
    },
    {
      "text": "The Participant enters a number and submits it",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product keeps it and awards its points only at the reveal, once every answer is known",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "answer",
          "effect": "creates",
          "facts": [
            "Value",
            "Response time"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    }
  ]
}
---

# Answer a closest-answer question

## Trigger

A numeric question ranks answers by closeness.

## Outcome

At the reveal they see their rank and distance to the target.
