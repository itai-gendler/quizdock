---
{
  "relations": [
    {
      "entity": "answer",
      "verb": "collects",
      "cardinality": "one-to-many"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/index.ts",
      "title": "GameState"
    },
    {
      "kind": "doc",
      "role": "intent",
      "target": "docs/live-session.md"
    }
  ]
}
---

# Game

One quiz played in a room — what the screens call the quiz being played. It runs on the quiz as it stood when it opened, step after step, from its lobby to its podium.

## Information kept

- **Quiz played** — the quiz's questions, slides, answers, scoring and timing, frozen when the game opened; backgrounds, explanations, reveal delays and slides follow later edits
- **Current step** — the slide or question on screen, out of how many
- **Pace** — By hand, where the host moves on, or Autoplay, where each reveal and timed slide moves on by itself
- **Paused** — whether the clock and autoplay stand still
- **Time left** — when the question on screen closes
- **Starts on its own at** — for a quiz picked after another, when its lobby countdown ends
- **Keeps results** — off for a game of another host's shared quiz
- **Ready participants** — who said they are ready in the lobby
- **Looking back at** — a played step shown again, read-only
- **Answer count** — how many connected players have answered the question on screen

## States

### Lobby

Waiting to start; participants join, say they are ready, and the host settles the room.

### Slide

A content slide is on screen.

### Waiting for media

A question is due but a device that plays its sound or video has not loaded it yet.

### Question

A question is on screen and its answers are open until its time is up.

### Answers revealed

The right answers, the distribution and each participant's result are shown.

### Leaderboard

The quiz's standings after a scored question.

### Podium

The quiz is over and its top three are shown.

### Waiting for the host

The host's console is gone: the clock stands still until they come back.

### Ended

Over; nothing is scored any more.
