---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens a quiz's History",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-history"
        }
      }
    },
    {
      "text": "The Product lists that quiz's kept sessions, a session played in a room marked with how many quizzes the room kept",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Started",
            "PIN",
            "Participant count",
            "Success rate",
            "Personalised tracking",
            "Full answer capture"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-history"
        }
      }
    }
  ]
}
---

# Browse one quiz's sessions

## Trigger

A host follows one quiz over time.

## Outcome

They see each time it was played and kept, with its success rate.
