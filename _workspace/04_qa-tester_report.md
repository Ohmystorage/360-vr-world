# Stage 4 QA report (hotspots + pop-ups, 3-place version)

Tools I had: Browser pane (navigate, screenshot, real hover/click/key, JS, console, resize). Served on 127.0.0.1:8142 (stopped after). Port 8123 and other tabs not touched. No project files edited.
Note on method: the Browser tool's click does not send a mouse move first, so I hovered, then clicked (a real mouse always moves first). Held-key walking was simulated with keydown/keyup events (same wasd-controls path); the ant position is rig + camera.

| Check | Result | Evidence | Owner |
| --- | --- | --- | --- |
| Page loads, no console errors (default, ?place=giant-feet, ?place=fence-web) | PASS | Only A-Frame 1.7.0 / THREE 173 logs; 0 errors/warnings | - |
| 3 hotspots built, ids match cards | PASS | hotspot ids heavy-cracker n1, giant-feet n2, fence-web n3 | - |
| Hotspot visible from each start view, does not hide cracker / mat / web + strawberry | PASS | Screenshots: "1" floats above cracker, "2" small at the mat's left edge, "3" above web; web and strawberry fully visible | - |
| Hover shows hand cursor | PASS | canvas cursor "pointer" over badge | - |
| Click opens correct card (1, 2, 3) with exact text | PASS | title, problem, whyHard, words, question compared to js/problems.js by script: all true for 3 cards | - |
| Empty `words` (giant-feet) leaves no broken section | PASS | "Words to know" box display:none; only "Why is it hard?" and "Your design challenge" headings shown | - |
| Body text >= 18px | PASS | problem, whyHard, question, words list all 20px; hint 22px | - |
| Close button and Escape both close | PASS | Real mouse click on Close and real Escape key: card hidden both times | - |
| Far-click hint | PASS | Clicking badge 3 from place 1 (about 1470 m): "Walk closer to read this!" shown, no card | - |
| Walking and look frozen while open; nothing moves after close | PASS | W + ArrowRight held 1.5 s with card open: position change 0. After close: 2 s drift 0; wasd/look enabled; no focus trap (BODY) | - |
| Speed unchanged after close | PASS | acceleration 229.2; S held 1 s = 42.6 m | - |
| Map marker becomes a check after card opened; ant stays on top; no words on map | PASS | Zoomed map: 1 and 2 green check after reading, 3 still a number; ant marker drawn over them. Map has digits and the old "N" mark only | - |
| Find each hotspot using only the minimap | PASS (code + walk) | Map markers and hotspots both use the same PLACES x,z. Walked by keys: place 1 -> mat edge stop at (-440,-217), title changed to Place 2; -> web, title changed to Place 3 | - |
| Walking times | PASS (note) | Place 1 -> waypoint 10.9 s, then about 4 s to the mat edge (about 15 s total, top of the 10-15 s range). Mat -> web about 23 s with my detour waypoint. Speed 42.6 m/s | - |
| 1280x720: card fits, Close reachable | PASS | fence-web card 56-664 px, no scroll, Close 592-644 px | - |
| 400x700: card readable, Close reachable, no side scroll | PASS | Card 16-384 px wide, scrolls inside (819 in 668), Close pinned at 612-664 px, question reachable after scroll | - |
| Grades 3-5 reading check of new UI text | PASS | "Walk closer to read this!", "Read: click a pink number", "Why is it hard?", "Words to know", "Your design challenge", "Close": short, plain words | - |
| Regression: collision at 3 places | PASS | Cracker: stopped at x -567 (edge -564). Mat: stopped at z -217 (edge -220). Web: stopped at x 397 | - |
| Regression: boundaries | PASS | West stop -1297; south walkway 1195; south lawn 1197; east 1167; north wall -1280; garage -1262 | - |
| Regression: strawberry unreachable | PASS | Walking toward strawberry (475,-655) from the west stops at x 397, before the web | - |

## Issues (not blockers)

1. **Badge 3 hidden under the title box at 400 px width** (minor, world-builder). Repro: open `?place=fence-web`, resize to 400x700. Badge 3 projects to (154,148) while the title box covers x 12-236, y 12-217, so the number cannot be seen at the web start (clicking through still works). Builder already lists this as a known limit. Suggest a smaller or shorter title box on narrow windows, or moving the hint line.
2. **Badge 2 is drawn over the mat's bristles at the place-2 start** (cosmetic, world-builder). It is small and does not hide the mat, but it looks like it sits on the mat edge (the builder's "drawn through walls" limit). No action needed unless the teacher dislikes it.
3. **Cracker -> mat is about 15 s** (note only). It is at the top of the 10-15 s rule, so no change unless the teacher wants it closer.

Not verified: frame rate (pane showed about 60 rAF/s only); the 400 m read distance edge was only tested at two points (57 m allowed, 1470 m refused).

RESULT: PASS (0 blocking issues; 2 minor notes)
