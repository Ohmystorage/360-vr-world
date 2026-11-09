---
name: ant-problem-cards
description: How to write the Ant's-Eye World problem cards - real hardships an ant faces in a residential yard, in English for grades 3-5, saved as js/problems.js for the scene's pop-ups. Use when creating, revising, adding or removing problem cards or pop-up text. Not for scene code (use aframe) or for checking finished cards (use ant-world-qa).
---

# Ant Problem Cards

Each card becomes one pop-up in the world. A student walks up as an ant, clicks the marked spot, reads the card, and starts thinking about a design that would help.

## File format
Save as `js/problems.js`. It is a plain script (not JSON loaded by `fetch`) so the page works when opened straight from disk.

```js
window.ANT_PROBLEMS = [
  {
    id: "heavy-cracker",            // kebab-case, stable forever once published
    title: "A Cracker Too Big",     // 2-5 words
    placeHint: "dropped snack on the sidewalk near the porch steps",
    problem: "…",                   // what happens, 2-4 short sentences
    whyHard: "…",                   // the ant fact behind it, 1-2 sentences
    question: "How could you help ants move big food faster?",
    words: [{ word: "colony", meaning: "a big family of ants that live together" }]  // 0-2 entries
  }
];
```

Keep exactly these fields. The scene code depends on them; a new field means nothing until the builder uses it.

## Reading level (grades 3-5)
Why: many students read below grade level, and the pop-up competes with a 3D world for attention. Short text gets read; long text gets skipped.
- Sentences of 12 words or fewer where possible, never over 18.
- `problem` + `whyHard` together: 70 words or fewer.
- Common words. A science word is fine if it matters (colony, antenna, pheromone); explain it in `words`.
- Write to the student as the ant: "You are tiny. This crumb weighs as much as ten of you."
- Aim for Flesch-Kincaid grade 4 or lower.

## Science rules
Why: the design challenge only works if the problem is real.
- Base every card on a true ant fact (they carry many times their body weight, follow scent trails, can drown in puddles, overheat on hot pavement, are hunted by spiders and birds, get stepped on, lose trails in rain).
- Note the fact for each card in `_workspace/01_learning-designer_notes.md`.
- Simplify, but never make it false. No talking-animal fantasy facts.

## Design-question rules
Why: the end goal is that students design and make one thing that solves one ant problem.
- One problem per card, so each card can become one design project.
- The question asks "How could you…?" and points at a thing a child could draw or build (a tool, a bridge, a door, a shelter, a cart), not at a fact to look up.
- Do not give the answer. A card may hint at materials or forces, not a finished design.

## Places in a residential yard
Choose from places that fit the scene: sidewalk crack, lawn, garden bed, flower pot, fence post, porch steps, driveway, trash bin, garden hose, puddle, ant nest entrance, doormat. The `placeHint` tells the builder where to put the hotspot; keep it concrete.

## Tone
Real and a little dramatic, never scary or gory. Predators chase, they do not eat on screen.
