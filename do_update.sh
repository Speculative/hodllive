#!/usr/bin/env sh
CURRENT_DATE=$(date "+%Y-%m-%d")
source ./env/bin/activate
python hodllive.py
git add hodllive.json
git commit -m "Daily update"
git push
