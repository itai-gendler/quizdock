---
{
  "entities": [
    {
      "entity": "room",
      "shows": [
        "PIN",
        "Name",
        "Participant access",
        "Full answer capture",
        "Personalised tracking",
        "Own display names",
        "Closed to newcomers",
        "Invitation address",
        "Screen language",
        "Who hears the sound",
        "Room sound",
        "Standings",
        "Selection",
        "Played quizzes"
      ],
      "collects": [
        "Name",
        "Full answer capture",
        "Personalised tracking",
        "Own display names",
        "Invitation address",
        "Screen language",
        "Who hears the sound",
        "Room sound"
      ]
    },
    {
      "entity": "game",
      "shows": [
        "Quiz played",
        "Current step",
        "Pace",
        "Paused",
        "Time left",
        "Starts on its own at",
        "Keeps results",
        "Ready participants",
        "Looking back at",
        "Answer count"
      ]
    },
    {
      "entity": "player",
      "shows": [
        "Nickname",
        "Avatar",
        "Presence",
        "Ready",
        "Score"
      ]
    },
    {
      "entity": "question",
      "shows": [
        "Prompt",
        "Answer choices",
        "Time limit"
      ]
    },
    {
      "entity": "quiz",
      "shows": [
        "Title",
        "Question count",
        "Language",
        "Tags",
        "Owner"
      ]
    },
    {
      "entity": "slide",
      "shows": [
        "Content",
        "Display time"
      ]
    },
    {
      "entity": "selection",
      "shows": [
        "Name",
        "Quizzes"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/session/:pin/console"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/control-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/game/room-components.tsx"
    }
  ]
}
---

# Console

Where the host runs a room: the invitation, who is in and who is ready, the settings fixed at the start, the quiz's outline with its answer key, each step's controls, the scores, and the choice of the next quiz.
