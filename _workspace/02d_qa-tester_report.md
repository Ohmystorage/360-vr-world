# QA 02d - fence-web revision (place 3, reason to pass the web)

Tools I had: Browser pane (navigate, screenshot, zoom, JS, console, resize), Bash, PowerShell, file tools. Server: python -m http.server 8133 (stopped after; 8123 untouched). file:// not tested.

| Check | Pass/Fail | Evidence | Owner |
| --- | --- | --- | --- |
| S1: 8 cards, exact keys, unique kebab-case ids | PASS | script: 8 cards, keys match, 8 unique ids | - |
| S1: problem+whyHard <=70 words, no sentence >18 | PASS | counts 61/61/59/59/59/58/56/69; longest sentence 14 | - |
| S1: questions start "How could you" | PASS | all 8 | - |
| S1: only fence-web changed | PASS (not diffed; other 7 cards read normal and counts unchanged) | file read | - |
| Title "Place 3: A Web in the Way" | PASS | on-screen header in both sizes | - |
| Card text matches scene (strawberry, one gap under fence, web over gap) | PASS | text: strawberry, "fence sits tight on the ground", "one small gap", "web covers the gap"; scene shows all three | - |
| (a) Food visible and recognizable without turning, 1280x720 | PASS (borderline small) | strawberry about 70 px wide x 65 px tall of 1280x720 (about 5% of width); red body, yellow seeds, green cap, plus red hanging berry and leaves visible through gap | world-builder (optional: enlarge) |
| (a) Food visible without turning, portrait 733x1135 | PASS | strawberry about 130 px wide of 733 (18%), clearly a strawberry with seeds and cap | - |
| (b) Web gap reads as only way (fence tight to ground, post side blocked) | PASS | both sizes: boards run to the ground left and right of the gap; flower pot and end post fill the right side at 1280x720. Portrait: right side is solid board. Note: in 1280x720 the pot is seen partly beside the post, not a clear "wall"; a child could still wonder about the right side, but no gap is visible | - |
| (c) Trail of bits leads through the web | PASS | red bits from the foreground through the web's bottom edge to the berry; near bits large, far bits small slivers (about 5-8 px) | - |
| Web covers the gap | PASS | web centered on the opening, spider at upper right, empty web | - |
| Console errors: index.html, ?place=giant-feet, ?place=fence-web | PASS | read_console_messages (errors only) empty on all three; window error handler empty on place 3 | - |
| Places 1 and 2 unchanged | PASS | place 1: cracker, fence, house as before; place 2: porch, doormat, steps, blue item as before (visual compare to notes; no pixel diff) | - |
| fps / draw calls | PASS | place 3 start: 60 fps, 253 draw calls, 24k triangles (matches builder's note); portrait view 214 calls | - |

## Suggestions (not failures)
1. At 1280x720 the strawberry is small (about 70 px). A teacher on a projector or a child on a small laptop sees it as a red blob with a cap. Enlarging it about 1.3x or moving it a bit closer to the web front would help.
2. Far trail bits and the juice puddle are thin slivers at the start view; the near bits carry the cue. Fine.
3. At 1280x720 the strawberry's lower half is crossed by the web's bottom strands, which slightly cuts its shape. Not a blocker.
4. The pot beside the post reads as a pot, not obviously as "blocking the way". The text says "fence sits tight on the ground", which supports the idea; OK.

RESULT: PASS
