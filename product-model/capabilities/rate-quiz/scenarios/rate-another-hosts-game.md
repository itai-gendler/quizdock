---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The game plays another host's shared quiz",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Keeps results"
          ]
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
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
      "text": "The Participant picks stars and sends them",
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
      "text": "The Product keeps the review for the quiz without any nickname",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "review",
          "effect": "creates",
          "facts": [
            "Rating",
            "Comment",
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

# Rate a game another host presented

## Trigger

A participant rates a quiz presented by a host who does not own it.

## Outcome

The owner reads the rating as anonymous.
