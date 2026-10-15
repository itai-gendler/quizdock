---
{
  "relations": [
    {
      "entity": "question",
      "verb": "contains",
      "cardinality": "one-to-many"
    },
    {
      "entity": "slide",
      "verb": "contains",
      "cardinality": "one-to-many"
    },
    {
      "entity": "game",
      "verb": "is played in",
      "cardinality": "one-to-many"
    },
    {
      "entity": "session",
      "verb": "is kept in",
      "cardinality": "one-to-many"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "Quiz"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    }
  ]
}
---

# Quiz

An ordered sequence of questions and content slides, owned by one host, presented live in rooms.

## Information kept

- **Title** — the quiz's name
- **Description** — optional plain text about it
- **Language** — the language it is written in; the instance's for a new quiz
- **Cover** — an optional picture
- **Tags** — up to five keywords
- **Licence** — CC0, CC BY 4.0, CC BY-SA 4.0 or none
- **Shared** — whether the instance's other hosts see it read-only, present it and copy it; off by default
- **Reviews enabled** — whether participants may rate it at the end; on by default
- **Sound settings** — the pause after a media, the loudness every sound is brought to, and who hears the sound: the projection only, the projection and remote participants, or every device
- **Theme** — the look its screens take
- **Question count** — how many questions it holds
- **Owner** — the host whose quiz it is
- **Updated** — when it last changed

## States

### Draft

Being written: anything that holds together is saved, and it cannot be presented.

### Ready

Published: every question and slide is complete, and it can be presented at any time.

### Archived

Out of the active lists, kept with its history; it cannot be presented until restored.
