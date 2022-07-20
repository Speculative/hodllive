import json
import sqlite3
from datetime import datetime
from pprint import pprint

with open("hodllive.json", "r") as stats_file:
    existing_stats = json.loads(stats_file.read())

with open("channels.json", "r") as channels_file:
    channels = json.loads(channels_file.read())

with open("vtubers.json", "r") as vtubers_file:
    vtubers = json.loads(vtubers_file.read())

db = sqlite3.connect("subscribers.db")
cursor = db.cursor()

merged_stats = {}
for member, channel in channels.items():
    results = list(
        cursor.execute(
            "select date, subscribers from subscribers where channel=:channel",
            {"channel": channel},
        )
    )
    if not results and datetime.strptime(
        vtubers["members"][member]["debut"], "%Y/%m/%d"
    ) < datetime(2020, 9, 7):
        print(member, "doesn't have any scraped sub counts!")
    results = [{"date": date, "subs": subs} for date, subs in results]
    if member in existing_stats:
        results += existing_stats[member]
    sorted_results = sorted(
        results,
        key=lambda d: datetime.strptime(d["date"], "%Y-%m-%d"),
    )
    merged_stats[member] = sorted_results

with open("hodllive_merged.json", "w") as new_stats_file:
    new_stats_file.write(json.dumps(merged_stats, indent=2))
