---
{
  "id": "quizdock",
  "summary": "A self-hosted live quiz: hosts build quizzes and present them in rooms on the big screen, participants join from their phones with a PIN, answers are scored on correctness and speed, and kept results land in the host's History.",
  "category": "live-quiz",
  "tags": [
    "quiz",
    "live",
    "classroom",
    "training",
    "self-hosted"
  ],
  "authors": [
    {
      "name": "QuizDock project",
      "url": "https://github.com/quizdock/quizdock"
    }
  ],
  "license": "MIT",
  "languages": [
    "en",
    "fr",
    "es",
    "zh",
    "zh-TW",
    "tr",
    "de",
    "hi",
    "it",
    "ja",
    "pl",
    "ru"
  ],
  "limitations": [
    "Quizzes are played live only, with the host presenting: there is no self-paced or homework mode.",
    "Participants play individually: there are no teams, and a room plays one quiz at a time.",
    "People sign in either with a typed name and one host seat (local mode) or through the operator's OpenID Connect provider; QuizDock keeps no passwords.",
    "A quiz another host shares is presented as it is and keeps no results; a host who wants results presents a copy of their own.",
    "Results reach History only when the host keeps them, or when a room closes because its host never came back; a quiz closed without keeping them leaves no trace."
  ],
  "references": [
    {
      "kind": "doc",
      "role": "intent",
      "target": "README.md",
      "title": "QuizDock README"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-METIER.md",
      "title": "Business specification"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-ROOM.md",
      "title": "Multi-quiz room brief"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-SELECTION.md",
      "title": "Selections brief"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-SHARED-PLAY.md",
      "title": "Presenting a shared quiz brief"
    },
    {
      "kind": "doc",
      "role": "context",
      "target": "apps/frontend/src/i18n/GLOSSARY.md",
      "title": "Interface glossary"
    }
  ]
}
---

# QuizDock

QuizDock is a live quiz a team or a teacher runs on its own server. A host builds quizzes — eight question types, content slides between questions, pictures, video and sound, answer explanations — and presents one in a room: the big screen shows the PIN and a QR code, participants join from their phones without installing anything, and every question is timed by the server, scored on correctness and speed with a streak bonus, revealed with its distribution and followed by the leaderboard and a final podium. A room can play several quizzes in a row, keeping its players and its own standings, and a host can line quizzes up beforehand as a selection. When the host keeps the results, each quiz played lands in History with its per-question statistics and each participant's result, optionally with every answer, exportable as CSV. Hosts may share a quiz or a selection with the instance's other hosts, and administrators grant roles and oversee every quiz and room of the instance.

## Intent

A host runs a live session, the participants answer from their own device, and both speed and correctness are rewarded. The goal is to liven the session up, measure what people learned and hand the host and the organisation results they can act on — on their own infrastructure, with no telemetry, and every result in their own database.
