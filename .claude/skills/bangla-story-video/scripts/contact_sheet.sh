#!/usr/bin/env bash
# Tile every f*.jpg in a folder into contact sheets (3 columns x 4 rows) for one-glance review.
# Usage: contact_sheet.sh <dir>
cd "$1" && i=0 && for x in $(ls f*.jpg | sort); do cp "$x" "_o$(printf %03d $i).jpg"; i=$((i+1)); done
ffmpeg -y -loglevel error -i _o%03d.jpg -vf "scale=640:360,tile=3x4" sheet%d.jpg && rm _o*.jpg && ls sheet*.jpg
