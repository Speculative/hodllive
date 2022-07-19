import json
from pprint import pprint
from emoji import is_emoji

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

print("Missing fields:")
pprint(missing)

for member, member_info in vtubers["members"].items():
    if not "emoji" in member_info or member_info["emoji"] is None:
        continue
    bad = False
    for c in member_info["emoji"]:
        if not is_emoji(c):
            print("non-emoji:", c.encode("utf-8"), c)
            bad = True
    if bad:
        print(
            member,
            "has non-emoji characters",
            len(member_info["emoji"]),
            member_info["emoji"],
        )

all_in_gens = set()
for branch in vtubers["generations"].values():
    for gen in branch.values():
        all_in_gens.update(gen)

print("Missing in generations:", all_in_members - all_in_gens)
print("Extra in generations:", all_in_gens - all_in_members)
