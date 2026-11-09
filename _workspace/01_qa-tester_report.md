# Stage 1 QA report (re-check, 8 cards)

Tools I had: Read, Glob, Bash (Node), Write. No page exists yet, so no browser checks. Counts come from a Node script that loads `js/problems.js`. Syllable counts are a heuristic, so Flesch-Kincaid is an estimate.

| Check | Pass/Fail | Evidence | Owner |
| --- | --- | --- | --- |
| File loads; `window.ANT_PROBLEMS` is an array of 8 | Pass | Script printed length 8 | learning-designer |
| Exact keys on every card | Pass | All 8 cards have exactly id, title, placeHint, problem, whyHard, question, words | learning-designer |
| Unique kebab-case ids | Pass | heavy-cracker, nest-guard, rain-flood, hot-driveway, lost-trail, giant-feet, sidewalk-gap, fence-web; no duplicates | learning-designer |
| First 7 unchanged | Pass | Word counts in card order: 61, 61, 59, 59, 59, 58, 56, identical to the previous pass | learning-designer |
| problem + whyHard at most 70 words | Pass | 61, 61, 59, 59, 59, 58, 56, and fence-web 65 | learning-designer |
| No sentence over 18 words | Pass | Longest per card: 11, 11, 11, 14, 12, 12, 12, and fence-web 11 | learning-designer |
| Flesch-Kincaid estimate | Pass | Grade 2.7, 3.5, 3.3, 2.5, 2.9, 1.3, 1.4, and fence-web 1.7. All are at or below grade 4. | learning-designer |
| Question starts with "How could you" and is buildable | Pass | All 8 start with it (10 to 15 words). fence-web asks for a way past a web, which is buildable. | learning-designer |
| Science words explained in `words` | Pass | fence-web explains "silk". Existing cards are unchanged. Empty `words` on rain-flood and giant-feet is allowed. | learning-designer |
| Nothing scary or gory | Pass, with a note | fence-web ends with "Now the spider is running toward you!". It is not gory, nothing is eaten, and the designer already flagged it for the teacher. | learning-designer |
| Ant fact for every card in `_workspace/01_learning-designer_notes.md` | Pass | All 8 have a fact, including fence-web. | learning-designer |

Minor notes (not failures):
- The notes file says lost-trail's longest sentence is 14 words. The script counts 12, which is still within the limit.
- The notes header still says "7 cards" and open question 3 is out of date. Neither affects the cards.

RESULT: PASS
