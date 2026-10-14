---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "A reveal, the leaderboard, a slide or the podium is on screen",
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
          "entity": "slide",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host picks a played question or slide",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt"
          ]
        },
        {
          "entity": "slide",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product shows it again everywhere, a question with its reveal and each participant's own result, and holds the game where it was",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "facts": [
            "Looking back at"
          ]
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# Look back at a step

## Trigger

The host wants to go over a question again.

## Outcome

Everyone sees the step again; no answer is taken and no point changes.
