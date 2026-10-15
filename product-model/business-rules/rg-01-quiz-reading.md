---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "reads",
      "facts": [
        "Title",
        "Description",
        "Language",
        "Cover",
        "Tags",
        "Licence",
        "Shared",
        "Reviews enabled",
        "Sound settings",
        "Theme",
        "Question count",
        "Owner",
        "Updated"
      ]
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "owns",
          "entity": "host"
        }
      ]
    },
    {
      "actors": [
        "host"
      ],
      "when": [
        {
          "fact": "Shared",
          "is": "On"
        },
        {
          "state": "Ready"
        }
      ]
    },
    {
      "actors": [
        "host"
      ],
      "when": [
        {
          "fact": "Shared",
          "is": "On"
        },
        {
          "state": "Draft"
        }
      ]
    },
    {
      "actors": [
        "administrator"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quiz-access.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    }
  ]
}
---

# A host reads their own quizzes and those shared with them

A host reads their own quizzes, and another host's while it is shared and not archived; an administrator reads every quiz.
