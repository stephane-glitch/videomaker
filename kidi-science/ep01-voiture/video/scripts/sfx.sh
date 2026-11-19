#!/usr/bin/env bash
# Bruitages de l'épisode (ElevenLabs, identifiant injecté par le proxy). Usage : bash scripts/sfx.sh [nom…]
set -euo pipefail
gen() {
  curl -sS -f -X POST "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128" -H "content-type: application/json" \
    -d "$(python3 -I -c 'import json,sys; print(json.dumps({"text":sys.argv[1],"duration_seconds":float(sys.argv[2]),"prompt_influence":0.6}))' "$3" "$2")" \
    -o "assets/sfx/$1.mp3" && echo "$1 ok"
}
want=" $* "
run() { if [ "$want" = "  " ] || [[ "$want" == *" $1 "* ]]; then gen "$@"; fi; }
run jingle 3.5 "A short cheerful children's science show jingle: four bright xylophone notes rising, then a happy ukulele chord, playful and warm, no vocals"
run boum   0.9 "A soft friendly cartoon thump, a muffled small explosion puff, short and round, not scary, no music"
run zap    0.5 "A tiny electric spark zap, one short crackle, no music"
run putter 5.0 "A small friendly cartoon car engine running steadily, soft regular putt-putt-putt, gentle, no music"
run ehum   4.0 "A smooth clean electric motor whirring up, rising pitch hum, futuristic and soft, no music"
run brake  1.5 "A short soft car brake squeak slowing to a stop, gentle, no music"
