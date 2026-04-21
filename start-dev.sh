#!/bin/bash
cd /home/z/my-project

while true; do
  echo "$(date): Starting dev server..."
  bun run dev > /home/z/my-project/dev.log 2>&1
  echo "$(date): Dev server exited, restarting in 3 seconds..."
  sleep 3
done
