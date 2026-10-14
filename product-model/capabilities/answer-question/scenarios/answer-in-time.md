---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The question's answers are open",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step",
            "Time left"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": []
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
      "text": "The Participant picks, ticks, orders, types or enters their answer and submits it",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt",
            "Answer choices"
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
      }
    },
    {
      "text": "The Product stamps it on arrival, grades it, adds its points to the score and tells them it is saved",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "answer",
          "effect": "creates",
          "facts": [
            "Value",
            "Correct",
            "Credit",
            "Points awarded",
            "Response time"
          ]
        },
        {
          "entity": "player",
          "effect": "changes",
          "facts": [
            "Score"
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

# Answer in time

## Trigger

A question is on screen.

## Outcome

Their answer counts; the room's answer count goes up, and they see their result at the reveal.

## Edge cases

- An answer sent while the connection is lost goes as soon as it is back, and counts only if the answers are still open.
