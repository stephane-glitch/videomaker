#!/usr/bin/env bash
# Génère les bruitages avec ElevenLabs (identifiant injecté par le proxy).
# Usage : bash scripts/sfx.sh [nom…]
set -euo pipefail
gen() { # nom durée influence boucle texte
  local name=$1 dur=$2 infl=$3 loop=$4 text=$5
  if [ $# -gt 5 ]; then :; fi
  curl -sS -f -X POST "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128" \
    -H "content-type: application/json" \
    -d "$(python3 -I -c 'import json,sys; print(json.dumps({"text":sys.argv[1],"duration_seconds":float(sys.argv[2]),"prompt_influence":float(sys.argv[3]),"loop":sys.argv[4]=="1"}))' "$text" "$dur" "$infl" "$loop")" \
    -o "assets/sfx/$name.mp3" && echo "$name ok"
}
want=" $* "
run() { if [ "$want" = "  " ] || [[ "$want" == *" $1 "* ]]; then gen "$@"; fi; }
run whoosh   1.4 0.6 0 "A single soft airy whoosh of a paper airplane gliding past, light and gentle, close microphone, no music"
run pop      0.6 0.7 0 "One soft gentle airy pop, like a small paper card landing softly, subtle interface sound, no music, no reverb"
run slide    0.8 0.7 0 "A sheet of paper card sliding quickly across a table, soft and short, no music"
run chime    1.2 0.6 0 "A gentle positive confirmation chime, two soft warm ascending notes, clean and short, no reverb tail, no music"
run ticks    1.6 0.6 0 "Fast soft mechanical counter ticking, split-flap numbers flipping quickly then stopping, no music"
run applause 3.5 0.6 0 "A big enthusiastic stadium crowd bursting into applause and cheering, joyful, then fading, no music"
run takeoff  5.0 0.5 0 "A futuristic silent electric aircraft taking off, smooth rising airy whoosh building up then flying away, bright and optimistic, no music"
run air      20  0.5 1 "Calm quiet high-altitude airplane cabin air ambience, very soft steady wind hum, peaceful, no music, no voices"
