---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Personalised tracking was off",
      "kind": "condition",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Personalised tracking"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::session"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host opens the session",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Started"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::session"
        }
      }
    },
    {
      "text": "The Product shows the figures and results by question, and says no individual result was recorded",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Success rate",
            "Question results"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::session"
        }
      }
    }
  ]
}
---

# A session without individual results

## Trigger

The session was played without personalised tracking.

## Outcome

Only the group's results are there.
