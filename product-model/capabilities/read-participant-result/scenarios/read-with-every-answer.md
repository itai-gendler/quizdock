---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Every answer was kept",
      "kind": "condition",
      "entities": [
        {
          "entity": "session",
          "effect": "reads",
          "facts": [
            "Full answer capture"
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
          "place": "quizdock-web::workspace::session"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host opens a participant of the session",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "participant-result",
          "effect": "reads",
          "facts": [
            "Nickname"
          ]
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "session",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::session"
        }
      }
    },
    {
      "text": "The Product shows their result and their answer to each question, right or wrong, with its points and time",
      "kind": "product",
      "actor": "host",
      "entities": [
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
          "entity": "answer",
          "effect": "reads",
          "facts": [
            "Value",
            "Correct",
            "Points awarded",
            "Response time"
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
          "place": "quizdock-web::workspace::participant-sheet"
        }
      }
    }
  ]
}
---

# Read a participant's answers

## Trigger

A host follows one participant up, for an audit or a certification.

## Outcome

They see what that participant answered, question by question.
