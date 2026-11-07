#!/usr/bin/env bash
# Print duration and pauses (sentence boundaries) for each voiceover clip.
# Use the pause midpoints as `at(sec)` cues for scene beats.
# Usage: vo_timing.sh public/vo/*.mp3
for f in "$@"; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  echo "== $(basename "$f")  duration=${d}s"
  ffmpeg -i "$f" -af silencedetect=n=-35dB:d=0.3 -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+" | paste - - | sed 's/silence_start: /  pause /; s/silence_end: / -> /'
done
