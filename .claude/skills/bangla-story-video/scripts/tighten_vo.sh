#!/usr/bin/env bash
# Tighten voiceover clips: trim lead/tail silence, shorten inner pauses to ~0.22s, speed up 7% (pitch kept).
# The user wants brisk pacing with no dead air. Re-run vo_timing.sh on the output to get new cue times.
# Usage: tighten_vo.sh <inDir> <outDir> [tempo=1.07]
IN="$1"; OUT="$2"; TEMPO="${3:-1.07}"; mkdir -p "$OUT"
for f in "$IN"/*.mp3; do
  ffmpeg -y -loglevel error -i "$f" -af "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08,areverse,silenceremove=stop_periods=-1:stop_threshold=-38dB:stop_duration=0.28:stop_silence=0.22,atempo=$TEMPO" -ar 44100 -b:a 192k "$OUT/$(basename "$f")"
done
echo "tightened -> $OUT"
