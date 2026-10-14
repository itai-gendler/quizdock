---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The question is a poll",
      "kind": "condition",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Type"
          ]
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
      "text": "The Participant picks a choice",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Answer choices"
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
      "text": "The Product counts it in the distribution, awards no points and leaves the streak as it was",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "answer",
          "effect": "creates",
          "facts": [
            "Value",
            "Points awarded",
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

# Answer a poll

## Trigger

The host asks the room's opinion.

## Outcome

They are thanked for their opinion; the reveal shows the distribution.
