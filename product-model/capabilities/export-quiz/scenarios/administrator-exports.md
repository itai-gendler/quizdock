---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator chooses Export on a quiz of the instance",
      "kind": "actor",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Owner"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::instance-quizzes"
        }
      }
    },
    {
      "text": "The Product downloads its bundle, whoever owns it",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Type",
            "Prompt",
            "Media",
            "Answer choices",
            "Accepted answers",
            "Target number",
            "Several right pictures",
            "Time limit",
            "Points",
            "Scoring rule",
            "Explanation",
            "Reveal delay",
            "Listen first",
            "Background",
            "Position"
          ]
        },
        {
          "entity": "slide",
          "effect": "reads",
          "facts": [
            "Content",
            "Background",
            "Video",
            "Sound",
            "Display time",
            "Position"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::instance-quizzes"
        }
      }
    }
  ]
}
---

# An administrator exports a quiz

## Trigger

An administrator keeps a copy before acting on a quiz.

## Outcome

They have the quiz's bundle.
