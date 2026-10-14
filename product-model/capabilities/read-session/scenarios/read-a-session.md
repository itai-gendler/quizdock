---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens a session",
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
          "place": "quizdock-web::workspace::quiz-history"
        }
      }
    },
    {
      "text": "The Product shows its participants, success rate and questions played, the results by question, and the participants ranked",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Quiz as played",
            "Started",
            "Ended",
            "Participant count",
            "Success rate",
            "Question results",
            "Personalised tracking",
            "Full answer capture"
          ]
        },
        {
          "entity": "participant-result",
          "effect": "reads",
          "facts": [
            "Nickname",
            "Rank",
            "Score",
            "Right answers",
            "Answers given",
            "Average time",
            "Longest streak"
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
          "place": "quizdock-web::workspace::session"
        }
      }
    }
  ]
}
---

# Read a session

## Trigger

A host wants to see what a group understood.

## Outcome

They spot the questions that went wrong and who did what.

## Edge cases

- The questions are read from the quiz as it was played, whatever was edited since.
- Questions a stopped quiz never reached are marked not played.
