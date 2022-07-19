import json
from pprint import pprint
from emoji import is_emoji


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
    print("Members in generations that don't have member info")
    print("--------------------------------------------------")
    print_set(gen_missing)
gen_extra = all_in_gens - all_in_members
if gen_extra:
    print("Members with member info that aren't in a generation")
    print("----------------------------------------------------")
    print_set(gen_extra)

with open("channels.json", "r") as f:
    channels = json.loads(f.read())
all_in_channels = set(name for name in channels if channels[name] is not None)

channel_missing = all_in_members - all_in_channels
if channel_missing:
    print("Members with channels that don't have member info")
    print("-------------------------------------------------")
    print_set(channel_missing)
channel_extra = all_in_channels - all_in_members
if channel_extra:
    print("Members with member info that don't have a channel")
    print("--------------------------------------------------")
    print_set(channel_extra)
