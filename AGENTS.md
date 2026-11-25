# AGENTS.md — River Village

River Village is a complete single-player, farm-life-inspired game built with **three.js**, running in the browser and as a **mobile PWA**. It is mobile-first and touch-friendly.

## Project identity (hard rules)

1. **Original IP only.** River Village is an original game inspired by the farm-life genre. No character, place, creature, crop, item, festival, song, sound effect, or text from the reference game may appear in the shipped product. Every River Village character, place, creature, and item must have an original name invented by the team.
2. **Reference assets may be used and converted.** The APK contents under `extracted-assets/` were recovered with REA and MAY be converted and used as the basis for River Village game assets (textures, maps, audio, data). They must be converted out of XNB/.xwb/.xsb into web formats (PNG/WebP/GLTF/OGG/MP3/JSON) and placed under `src/assets/`. However: **no name from the reference game may appear anywhere in code, dialogue, UI, file names, or asset metadata.** Every River Village character, place, creature, crop, item, festival, and location must have an original name invented by the team.
3. **Platforms first:** desktop browser and mobile PWA (installable, offline-capable shell). Mobile-first design: touch controls come before mouse/keyboard, layouts scale from small screens up.
4. **Single player only.** No multiplayer, no networking, no server.
5. **Engine:** three.js (WebGL/WebGPU renderer as available), vanilla JS or TypeScript as chosen per phase, no game engine dependency.

## Repository layout

```
river-village/
  AGENTS.md            # this file — project rules
  features.md          # feature catalogue (what we build)
  SPEC.md              # every feature with exactly one acceptance test
  PLAN.md              # phased delivery plan
  extracted-assets/    # REA-recovered reference APK contents — convertible to src/assets/
  src/
    index.html         # PWA shell
    manifest.webmanifest
    sw.js              # service worker
    css/               # mobile-first styles
    js/                # game source (modules)
    assets/            # converted/original game assets (art, audio, fonts, maps); original names only
    tests/             # one test file per SPEC feature
```

## Naming rule (characters, places, creatures)

All in-universe names must be original. Examples of the substitution discipline:

| Reference genre role | River Village original name |
| --- | --- |
| The player's farm | The player's holding (named by player at start) |
| The town | River Village |
| The big corporation | Brightgate Co. |
| General storekeeper | Maren Reed at Reed's Market |
| The wizard | The Hedgewitch of Hollow Hill |
| Slime creatures | Puddles / Glops |
| Mine | The Deep Warrens |

When adding a new named entity, pick a name not found in the reference game, add it to the name registry in `src/assets/names.json`, and use it everywhere (code, dialogue, UI).

## Asset policy

- `extracted-assets/` is read-only source material. Convert XNB/.xwb/.xsb to web formats and place results under `src/assets/`.
- All shipped art, audio, and fonts must be original, converted-from-reference, or CC0/equivalent with attribution recorded in `src/assets/ATTRIBUTION.md`.
- XNB/.xwb/.xsb formats from the reference are not shipped; ship PNG/WebP/GLTF/OGG/MP3.

## Development rules

1. **Autonomous execution.** Do everything yourself. Never ask the user anything.
2. **Step announcements.** Announce each step in one line before you do it.
3. **One test per feature.** Every feature in `SPEC.md` has exactly one test in `src/tests/`. Test files are named `<feature-id>.test.js`. A feature is "done" when its test passes.
4. **Mobile-first.** Every new screen/component is first made usable on a touch device; desktop enhancements come after.
5. **No network.** The game must run entirely offline after PWA install (service worker caches shell + assets).
6. **Commits.** `git commit -m "<type>: <subject>"` with type in {feat, test, fix, refactor, assets, docs, chore}. Reference the SPEC feature id in the body when applicable: `Refs SPEC-<id>`.
7. **No secrets.** Never commit API keys or credentials. The game makes no network calls.

## Definition of done for a feature

- Code implemented in `src/js/`
- Test added to `src/tests/<feature-id>.test.js` and passing
- Mobile-touch verification on a small viewport
- Original names used (checked against `src/assets/names.json`)
- Committed with `Refs SPEC-<id>`
