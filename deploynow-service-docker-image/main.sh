#!/bin/bash
set -e

export BUILD_START_TIME=$(date --iso-8601=seconds)
echo "📥 Cloning repo: $GIT_REPOSITORY__URL"
git clone "$GIT_REPOSITORY__URL" /home/app/output

exec node script.js
