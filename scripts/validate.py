import json
from pprint import pprint
from emoji import is_emoji
from datetime import datetime


def print_set(s):
    for m in s:
        print(m)


with open("vtubers.json") as f:
    vtubers = json.loads(f.read())

all_in_members = set()
missing = {
    "full_name": [],
    "debut": [],
    "emoji": [],
    "color": [],
}
for member, member_info in vtubers["members"].items():
    all_in_members.add(member)
    for field in missing:
        if not field in member_info or member_info[field] is None:
            missing[field].append(member)

print("Missing fields in vtubers.json:members")
print("======================================")
for field in missing:
    if missing[field]:
        print()
        print(field)
        print("-" * len(field))
        for name in missing[field]:
            print(name)

print()
print("Debut date check")
print("================")
for member, member_info in vtubers["members"].items():
    if not "debut" in member_info or member_info["debut"] is None:
        continue
    try:
        datetime.strptime(member_info["debut"], "%Y/%m/%d")
    except ValueError:
        print(member, "debut is invalid format", member_info["debut"])

print()
print("Emoji check")
print("===========")
print()
for member, member_info in vtubers["members"].items():
    if not "emoji" in member_info or member_info["emoji"] is None:
        continue
    bad = False
    for c in member_info["emoji"]:
        if not is_emoji(c):
            bad = True
    if bad:
        print(
            member,
            "has non-emoji characters",
            len(member_info["emoji"]),
            member_info["emoji"],
        )

print()
print("Members set consistency")
print("=======================")
print()
all_in_gens = set()
for branch in vtubers["generations"].values():
    for gen in branch.values():
        all_in_gens.update(gen)

gen_missing = all_in_members - all_in_gens
if gen_missing:
    print("Members with member info that aren't in a generation")
    print("----------------------------------------------------")
    print_set(gen_missing)
gen_extra = all_in_gens - all_in_members
if gen_extra:
    print("Members in generations that don't have member info")
    print("--------------------------------------------------")
    print_set(gen_extra)

with open("channels.json", "r") as f:
    channels = json.loads(f.read())
all_in_channels = set(name for name in channels if channels[name] is not None)

channel_missing = all_in_members - all_in_channels
if channel_missing:
    print("Members with member info that don't have a channel")
    print("--------------------------------------------------")
    print_set(channel_missing)
channel_extra = all_in_channels - all_in_members
if channel_extra:
    print("Members with channels that don't have member info")
    print("-------------------------------------------------")
    print_set(channel_extra)

with open("hodllive.json") as f:
    stats = json.loads(f.read())

all_in_stats = set(stats.keys())
stats_missing = all_in_members - all_in_stats
if stats_missing:
    print("Members with member info that don't have stats")
    print("--------------------------------------------------")
    print_set(stats_missing)
stats_extra = all_in_stats - all_in_members
if stats_extra:
    print("Members with stats that don't have member info")
    print("----------------------------------------------")
    print_set(stats_extra)

print()
print("Stat Count Checks")
print("=================")
for member, member_stats in stats.items():
    last_date = datetime.min.date()
    last_subs = 0
    last_views = 0
    for date_stats in member_stats:
        stat_date = datetime.strptime(date_stats["date"], "%Y-%m-%d").date()
        subs = int(date_stats["subs"])
        views = None
        if "views" in date_stats:
            views = int(date_stats["views"])

        if stat_date < last_date:
            print(
                f"{member} data point on {stat_date.strftime('%Y-%m-%d')} out of order"
            )
            last_date = stat_date
            continue

        if subs + 1000 < last_subs:
            print(
                f"{member} data point on {stat_date.strftime('%Y-%m-%d')} decreased in subs from {last_subs} to {subs}"
            )

        last_date = stat_date
        last_subs = subs
        last_views = views if views is not None else last_views
