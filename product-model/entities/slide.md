---
{
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "Slide"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/slide-content.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/slides/slides.service.ts"
    }
  ],
  "domain": "my-quizzes"
}
---

# Slide

A content slide between questions of a quiz: something to show the room rather than to answer.

## Information kept

- **Content** — headings, text and pictures in one to three columns, which may name the quiz and the room ({title}, {pin}, {players}…)
- **Background** — an optional picture or gradient, with the text contrast
- **Video** — an optional video behind the content, looped or once, with its sound or muted
- **Sound** — an optional sound
- **Display time** — in autoplay, how many seconds it stays; manual otherwise
- **Position** — the question it comes before, or the end of the quiz
