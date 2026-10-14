---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz the player played is at its podium and takes ratings",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "player",
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
      "text": "The Participant picks stars, may write a comment, and sends it",
      "kind": "actor",
      "actor": "participant",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product keeps the review with their nickname for the quiz they played",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "review",
          "effect": "creates",
          "facts": [
            "Rating",
            "Comment",
            "Nickname",
            "Date"
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
      }
    }
  ]
}
---

# Rate at the podium

## Trigger

A participant has just finished a quiz.

## Outcome

Their review reaches the quiz's owner.

## Edge cases

- If the host moved on to the next lobby meanwhile, the rating still goes to the quiz they played.
- A participant who only saw the podium, without playing, is not asked.
