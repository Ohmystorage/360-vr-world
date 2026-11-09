---
name: ant-world-qa
description: Stage-by-stage checklist for testing the Ant's-Eye World before the teacher sees it - page load, worm's-eye view, keyboard movement, hotspots, pop-ups, and grades 3-5 English text. Use after a stage is built or revised, or when asked to test, check or verify the ant world. Reports issues only; fixing belongs to world-builder or learning-designer.
---

# Ant World QA

Run only the checks for stages that exist so far. Earlier stages are re-checked every time, because a later change can break them.

## How to test
- Serve the project root (for example `npx serve` or `python -m http.server`) and open `index.html` in the browser tools. Also confirm opening the file directly does not break data loading.
- Read the console. Any red error is a fail.
- Take a screenshot as evidence for visual checks.

## Stage 1 - Problem cards (`js/problems.js`)
- File loads; `window.ANT_PROBLEMS` is an array with the requested number of cards.
- Every card has exactly: `id`, `title`, `placeHint`, `problem`, `whyHard`, `question`, `words`.
- `id`s are unique kebab-case.
- `problem` + `whyHard` is 70 words or fewer; no sentence over 18 words. Count them; do not eyeball.
- Each `question` starts with "How could you" and asks for something buildable.
- Science words are explained in `words`. Nothing scary or gory.
- Each card's ant fact is noted in `_workspace/01_learning-designer_notes.md`.

## Stage 2 - Ground world
- Page loads with no console errors.
- Camera starts near the ground and the view tilts upward: grass, steps and fence tower overhead (worm's-eye view).
- The yard reads as a residential area: house wall or porch, sidewalk, lawn, fence, garden items are recognizable.
- Scale feels ant-sized: a grass blade is many times taller than the camera.
- Frame rate is smooth on a normal laptop (no visible stutter while looking around).

## Stage 3 - Keyboard movement
- Arrow keys and WASD both move; mouse drag (or pointer) looks around.
- Speed matches the teacher's setting (about 65 m/s, `acceleration: 357.5`): edge to edge about 35-41 seconds in the 3-place yard (time it).
- The ant cannot leave the play area or walk through large solid objects (walls, pots, steps).
- On-screen English instructions say which keys to use.
- Minimap sits on the right side, shows the whole yard from above, and does not cover the middle of the view.
- The marker is an ant shape (not an arrow) and the map has no text labels.
- The ant marker on the minimap moves when the ant moves, in the same direction, and turns to match where the ant faces. Walk to two corners and compare.
- Main landmarks (house/porch, driveway, lawn, fence, garden) are recognizable on the minimap.

## Stage 4 - Hotspots and pop-ups
- One visible, clearly marked hotspot per card, placed where `placeHint` says.
- Clicking each hotspot opens its pop-up with the right card's title, problem, why-hard text, words and question.
- Pop-up text is large enough to read (at least 18px body) and has a clear Close button; Escape also closes it.
- Movement keys do not move the ant while a pop-up is open.
- Every card `id` in `js/problems.js` has a hotspot, and no hotspot points at a missing `id`.
- Every hotspot also appears on the minimap at the matching place. Walk to one using only the minimap; you arrive at the right hotspot.
- Cards with an empty `words` list open without errors.
- Walking time (teacher's rule): nearest hotspot from any hotspot about 10-15 s; a route through all 8 hotspots takes about 3 minutes or less, not counting reading. Time it by walking, and report the times.
- After a pop-up is opened and closed, that card's minimap marker shows a check mark; unopened cards do not.

## Report
Write `_workspace/{stage}_qa-tester_report.md`:

| Check | Pass/Fail | Evidence | Owner |
| --- | --- | --- | --- |

Owner is `world-builder` for scene/code issues and `learning-designer` for card text. Finish with `RESULT: PASS` or `RESULT: FAIL (n issues)`.
