---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz is another host's and is shared",
      "kind": "condition",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "as": "original",
          "facts": [
            "Owner",
            "Shared"
          ]
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host reads the shared quiz and chooses Create a quiz",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "as": "original",
          "facts": [
            "Title",
            "Owner"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Product creates a draft copy owned by the Host, its title marked as a copy, with every question and slide",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "creates",
          "as": "copy",
          "to": "Draft",
          "facts": [
            "Title",
            "Description",
            "Language",
            "Cover",
            "Sound settings",
            "Theme",
            "Question count",
            "Owner"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "as": "original",
          "facts": []
        },
        {
          "entity": "question",
          "effect": "creates",
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
          ],
          "with": "copy"
        },
        {
          "entity": "slide",
          "effect": "creates",
          "facts": [
            "Content",
            "Background",
            "Video",
            "Sound",
            "Display time",
            "Position"
          ],
          "with": "copy"
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Product opens the copy in the editor",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [],
          "as": "copy"
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    }
  ]
}
---

# Create a quiz from a shared quiz

## Trigger

A host wants to adapt, translate or keep the results of a quiz another host shares.

## Outcome

The copy is theirs alone; whatever happens to the original afterwards, the copy stays.

## Edge cases

- The same is offered from the shared quiz's line in My quizzes.
