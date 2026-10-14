---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Autoplay is on and the leaderboard has stayed its time",
      "kind": "condition",
      "unattended": true,
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Pace",
            "Current step"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product shows the next question",
      "kind": "product",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Leaderboard",
          "to": "Question",
          "facts": [
            "Current step",
            "Time left"
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
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# Autoplay moves on

## Trigger

The host lets the quiz run.

## Outcome

The quiz moves on; a reveal stays its question's reveal delay, five seconds otherwise, and a timed slide its display time.
