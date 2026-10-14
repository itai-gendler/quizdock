---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz played does not take ratings",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Quiz played"
          ]
        },
        {
          "entity": "quiz",
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
      "text": "The Participant reaches the podium",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
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
      "text": "The Product offers no rating",
      "kind": "product",
      "actor": "participant",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    }
  ]
}
---

# Ratings switched off

## Trigger

The owner switched ratings off for the quiz.

## Outcome

Nothing is asked of the participant.
