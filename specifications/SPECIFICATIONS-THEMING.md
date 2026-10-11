# QuizDock — Theming: quiz themes, instance look, dark mode

> **Intent, not yet the code.** This document records the decisions taken in October 2026 on theming, before any of
> it is implemented. Once a lot ships, what it changed is described in [`docs/`](../docs/README.md) and this page keeps
> only what is still to do.

Three needs, delivered in this order:

1. **Lot 1 — Quiz themes**: the look and feel of a quiz on the live screens (backgrounds, answer slots, font, sounds,
   motion), from a shared library of themes.
2. **Lot 2 — Instance look**: the organisation's identity (branding) and the look of the interface (theme), set in
   the administration.
3. **Lot 3 — Dark mode** for the interface.

The two theme layers never mix: a **quiz theme** dresses the live game (projection and players); the **interface
theme** dresses the application. The console, the editor and the back office never take a quiz theme.

---

## 1. Shared building blocks

### 1.1 The background object

One object, used by quiz themes, by each step of a quiz (bundle v8, §3) and by the interface theme's showcase pages
(§4.3). Four **modes**:

| Mode | What it does | Settings |
|---|---|---|
| `watermark` | The picture centred, sized in `vmin` (min(vw, vh): right in portrait and landscape) | `size` (% of vmin), `opacity`, `grayscale`, `blur` |
| `cover` | The picture fills the screen, cropped | `veil` (colour + opacity, to keep contrast), `blur`, `grayscale` |
| `contain` | The whole picture visible, on a background colour | `color`, `opacity`, `grayscale` |
| `pattern` | The picture tiled | tile `size`, `opacity`, `grayscale` |

Either a picture or a gradient (`angle`, 2–4 `colors`, as today), always with a base `color` and a `textTone`
(`light` / `dark`) that drives the local palette (`data-scheme`, `on-backdrop:`, two-layer rule of #130). Every
setting is bounded (validation level 1: impossible by construction).

### 1.2 Accessibility compliance

Compliance is **computed, never declared**. One function in `@quiz-dock/contracts` runs live in the editors and on
the server at every save; the result is stored with the theme:

```json
"accessibility": { "status": "compliant | warnings | non_compliant", "checks": [{ "code": "slot_text_contrast", "passed": true }] }
```

Checks, on what is measured:
- the text on the answers — white or black, the theme's choice — reaches 4.5:1 on each slot colour;
- the question's text reaches 4.5:1 and the accent 3:1 on the background as actually rendered (mode, veil,
  opacity). The answers are not checked against the background: on a theme's background each has its two-tone
  edge, which stands out from any colour;
- the 8 slot colours stay apart; the first four (the answers most questions have) under colour-blindness
  simulation too — the eight carry their mark anyway;
- the 8 icons are different files.

Accessibility is said **only in the positive**: a theme that passes every check carries an *Accessible* badge in
the library and the theme picker, with an *Accessible only* filter; any other carries nothing. The detail stays in
the theme editor, folded and neutral: a projector renders colours its own way, these are guides and nothing is
blocked. The shipped themes but *Classic* are accessible: their answers share one palette of deep colours made
for white text. The interface theme (§4) carries the same property.

### 1.3 Fonts

A list of about eight free (OFL) fonts shipped in the image, plus woff2 files imported into a theme. Never a font
from a third-party server (CSP). The licence of an imported font is declared with it (§5) and is the author's
responsibility.

---

## 2. Lot 1 — Quiz themes

### 2.1 What a theme holds

- **Default background** (§1.1): every step without its own, plus the lobby and the podium.
- **Text and icons** on the answers: white or black, for the whole theme.
- **8 answer slots**: the colour and shape names stored today on each option (`red`… `teal`, `triangle`… `cross`,
  `OPTION_COLORS` / `OPTION_SHAPES`) become **8 slots**. For each slot the theme sets a **colour** and an **icon**.
  The author still picks a slot per option; the editor shows the theme's real rendering. Stored values do not change,
  so older bundles stay valid. Colour and a mark together remain guaranteed (never colour alone).
- **Markers**: what marks a slot besides its colour — its **icon**, or the option's **letter** (A–H) or
  **number** (1–8) in its question.
- **Accent** colour (timer, reveal bars, podium).
- **Font** for the prompt and the answers (§1.3).
- **Sounds**: the room effects (`ding`, `tick`, `countdown`, `gong`).
- **Motion**: a **style** among a few shipped ones (*Sober*, *Dynamic*, *Festive*…) that sets the motion tokens of
  UI-SYSTEM §1.8 (durations, easing, stagger, entrance), and an optional **reveal effect** (confetti…).

### 2.2 Icons

- An **icon bank** ships with QuizDock: about a hundred icons (Phosphor Icons, MIT) in a few groups (animals,
  sky and nature, food, sports, travel, objects, symbols), and sets of eight to apply to the eight answers at
  once. A slot takes an icon of the bank, or one SVG uploaded into the theme.
- **Monochrome, fill only** (no stroke), square `viewBox`, like the icons of SVG Repo: the colour comes from CSS
  (`currentColor`).
- Sanitised on the server at upload and at import: an allowlist of shape elements and attributes, `fill` forced to
  `currentColor`, scripts, links, styles and external references removed; a `stroke` is reported to the author.
- The *Classic* theme draws eight animal glyphs (Phosphor Icons, MIT, `shape-icon.tsx`), one per slot in the
  default order of the options: rabbit (green), cat (red), fish (blue), bird (yellow), dog (purple), butterfly
  (orange), horse (pink), cow (teal). The default order starts green then red, so a true/false question reads
  true in green and false in red.

### 2.3 The library

- Themes are **library objects**, like media. A quiz references one theme.
- **Rights**: any host creates themes and owns them; every host may use every theme; an admin may edit or delete any
  theme and sets the instance's default theme.
- **Child themes**: every user theme is the child of a **shipped theme**, one level only. It stores **only what it
  overrides** and inherits the rest live from its parent. The parent is also its fallback (§3.3).
- **Live reference**: editing a theme changes every quiz that uses it. The theme is **frozen when a quiz starts in a
  room**: nothing changes during a game. Deleting a theme in use is greyed, with its reason (UI-SYSTEM §1.1).
- **Shipped themes**, read-only, usable as parents:
  - archetypes: *Classic* (today's rendering with its animal glyphs, the default), *Sober*, *Kids / School*,
    *Festive*, *Night*, *High contrast* (aims at AAA, no effect, reduced motion);
  - seasonal: *Halloween*, *Christmas*, *New Year*, *Easter*, *Summer*.

  Their assets (sounds, fonts, icons, pictures) weigh on the image: a size budget is to be set before production.

### 2.4 Cascade

**Instance default → quiz theme → step.** A step overrides only its **background** (and keeps its own media, as
today); slots, font, sounds and motion are set for the whole quiz. In a multi-quiz room the theme follows each quiz:
the look changes between two quizzes. The room imposes no theme.

**Sounds**: a sample the host chose for the room wins, then the quiz theme's, then the synthesised effect. The room
mixer keeps the volumes in every case.

**Motion**: the room's *Animations* switch and each device's *reduce motion* always win over the theme's style.

### 2.5 Reveal effects

An **exception to UI-SYSTEM §1.8** (only opacity and position move), bounded:
- played on the **phones of the players who found the answer** only; the projection, which reveals every
  question, stays unchanged;
- off with *reduce motion* and with the room's *Animations* switch;
- never in the way of the game: no timer, sync or media waits for an effect.

### 2.6 Where a theme shows

The **projection and the players' phones**, from the lobby to the podium. The console stays neutral, except the
thumbnail of the current step. The quiz editor's preview shows the quiz in its theme.

### 2.7 Editing

- A **Themes** page next to the media library: list with thumbnails and compliance badge, create (by choosing a
  parent), edit, duplicate, import/export (§3.4).
- The theme editor shows a **live preview** of the projection and a phone in four phases (lobby, question, reveal,
  podium), rendered by the **real live components**, not a mock-up.
- The quiz settings carry a theme picker with thumbnails.

---

## 3. Bundle v8

Format rules unchanged: one schema file per version, a published version never rewritten, an export stamps the
**lowest version it needs**, a bundle from a newer version is refused.

### 3.1 The `theme` block

A top-level block, next to `quiz`, `media` and `items` (a theme has its own identity). Three forms:

```json
"theme": { "builtin": "festive" }
```

```json
"theme": {
  "slug": "halloween-party", "name": "Halloween party", "revision": 2, "license": "CC-BY-4.0",
  "parent": "festive",
  "overrides": {
    "background": { "mode": "pattern", "image": "media/bats.webp", "size": 20, "opacity": 0.15,
                    "color": "#1a1025", "textTone": "light" },
    "slots": { "red": { "color": "#ff6a00", "icon": "media/pumpkin.svg" } },
    "accent": "#ff6a00",
    "font": { "file": "media/creepster.woff2", "license": "OFL-1.1" },
    "sounds": { "gong": "media/howl.m4a" },
    "motion": { "style": "festive", "revealEffect": "confetti" }
  },
  "accessibility": { "status": "warnings", "checks": [] }
}
```

or no block at all (the quiz follows the importing instance's default).

- Slots are keyed by today's names; a child theme lists only the slots it changes.
- `font` is `{ "builtin": "<key>" }` or `{ "file", "license" }`.
- `accessibility` is exported for display (store), **always recomputed** at import, never trusted.
- An unknown `builtin` or `parent` key at import: the instance default, with a warning.

### 3.2 Step backgrounds

Steps gain the background object of §1.1 (`background`). `backgroundImage`, `backgroundGradient` and `textTone` are
still read (bundles ≤ v7) and mapped to `cover` and a gradient.

### 3.3 Export options

| Option | Content | Version |
|---|---|---|
| **Full** | the theme with its overrides and assets | v8 |
| **Fallback** | only the parent: `{ "builtin": "<parent>" }`, no assets | v8 |
| **None** | no `theme` block, step backgrounds degraded to v7 fields | ≤ v7 |

*None* is for an instance that has not reached v8. A quiz on the default theme with no v8 step background stays ≤ v7
on its own.

### 3.4 Assets and import

- Theme assets live in the same flat `media/` folder. **SVG and woff2** are accepted only where the theme references
  them (icons, font), checked by content like any upload, SVG sanitised (§2.2). Limits per kind, and the whole within
  `IMPORT_MAX_BYTES`, as today.
- **Deduplication**: at import, a theme identical to one already in the library (fingerprint of parent key,
  overrides and asset bytes) is reused; otherwise a copy is created, owned by the importer.
- If the embedded theme cannot be used (an asset refused), the quiz falls back to its parent, with a warning.

### 3.5 Theme bundle

A sibling format **`quizdock/theme`**: a zip of `theme.json` + `media/`, schema `schema/theme-bundle.v1.json`. The
`theme` block of the quiz bundle is that same schema. Exported and imported from the Themes page.

---

## 4. Lot 2 — Instance look

### 4.1 Branding, a separate space

The administration gets a **Branding** space for the identity, on the current settings and their environment
variables: `APP_NAME`, `APP_LANG`, `APP_LOGO_URL`, `APP_FEEDBACK_URL`, the logo in `branding/`. Unchanged mechanism.

### 4.2 Interface theme

A separate space, **stored in the database only** (no environment variable: it holds files and is set with a
preview):
- **primary** colour and **accent** colour, the whole token scale derived from them (OKLCH, contrast checked, dark
  variant included);
- **font** (§1.3);
- **corner radius** (square, standard, rounded);
- **showcase backgrounds** (§4.3);
- the **compliance** property (§1.2).

`branding/override.css` stays, loaded last, for the cases the settings do not cover.

### 4.3 Showcase backgrounds

Only on the **showcase pages**: home, join, sign-in, error and not-found pages. Working pages (editor, console,
administration, history) stay plain; the lobby belongs to the quiz theme.

Default: a `watermark` of the **branding logo** (QuizDock's until the instance sets its own, so a white-label instance
gets its watermark without any setting), in greyscale, faded, centred, sized in `vmin`.

### 4.4 Out of scope

The identity provider's sign-in page (Keycloak or another): the provider can be anything. A documentation note points
to its own theming.

---

## 5. Lot 3 — Dark mode

- The interface follows the **system preference** by default; a light / dark / auto switch is remembered **per
  device**; an admin may force light or dark for the whole instance.
- The live screens are not concerned: the quiz theme drives them.
- Clears the tech-debt entry "A dark theme nothing turns on": the existing `.dark` tokens are switched on and every
  screen checked (Playwright screenshot per screen and state, in both modes).

---

## 6. Community store

Themes join the store ([SPECIFICATIONS-STORE.md](./SPECIFICATIONS-STORE.md)) on its model:
- **Same author repository**: a `themes/<slug>/` folder (an unzipped theme bundle) next to `quizzes/`. One
  registration per author.
- The author template `quizdock/quizdock-quizzes` is **renamed `quizdock/quizdock-extensions`**, since it no longer
  holds only quizzes, and the registry `quizdock/quiz-store` is **renamed `quizdock/quizdock-store`** for the same
  reason. Done before the store opens, while nobody depends on the names; the store docs, guide, STORE spec and the
  `QUIZ_STORE_URL` examples follow (GitHub's redirects are not relied on for `raw.githubusercontent.com` links).
- The release builds the theme zips too; `index.json` gains a `kind` (`quiz` / `theme`). The publication action
  evolves compatibly under `@v1` (quiz-store side).
- The store page in QuizDock gets a **Themes** tab; installing a theme copies it into the library (copy, never
  reference; deduplicated as in §3.4). A quiz published with a full theme carries it.
- **Licences**: a theme declares CC0, CC BY or CC BY-SA, like a quiz; an imported font declares its own, `OFL-1.1` or
  one of the three CC licences, anything else refused by the store. Credits for icons, pictures and sounds are the
  contributor's responsibility: a warning, never a refusal.

---

## 7. Open points

- The size budget of the shipped themes' assets.
- The list of shipped fonts and motion styles, and the reveal effects offered.
- How icon distinctness is measured (silhouette comparison threshold).
