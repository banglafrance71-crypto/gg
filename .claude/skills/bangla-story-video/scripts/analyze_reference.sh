#!/usr/bin/env bash
# Study a reference video: timestamped contact sheets (1 frame / N s), scene cuts, audio bed check.
# Usage: analyze_reference.sh <video> <outDir> [secondsPerFrame=6]
V="$1"; O="$2"; N="${3:-6}"; mkdir -p "$O"
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate -show_entries format=duration -of compact "$V"
ffmpeg -y -loglevel error -i "$V" -vf "fps=1/$N,scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=4x4" "$O/sheet%d.jpg"
echo "hard cuts:"; ffmpeg -i "$V" -vf "select='gt(scene,0.35)',showinfo" -an -f null - 2>&1 | grep -oE "pts_time:[0-9.]+" | tr '\n' ' '; echo
echo "silent gaps (0 = continuous music/ambience bed under narration):"
ffmpeg -i "$V" -af "silencedetect=n=-45dB:d=0.4" -vn -f null - 2>&1 | grep -c silence_start
ffmpeg -y -loglevel error -i "$V" -filter_complex "showspectrumpic=s=1200x300:legend=0" "$O/spectrum.png"
ls "$O"
