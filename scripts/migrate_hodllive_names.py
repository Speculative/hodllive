import json

NAMES = set()
with open("vtubers.json", "r") as f:
    generations = json.loads(f.read())["generations"]
    for branch in ["hololive JP", "hololive ID", "hololive EN", "HOLOSTARS"]:
        for generation_members in generations[branch].values():
            NAMES.update(generation_members)

with open("hodllive.json", "r+") as historical_data_file:
    historical_data = json.loads(historical_data_file.read())
    historical_data_file.seek(0)
    migrated_data = {}
    for member in historical_data:
        migrated_name = member
        candidates = []
        for candidate_name in NAMES:
            if member.lower() in candidate_name.lower():
                candidates.append(candidate_name)
        if len(candidates) == 1:
            migrated_name = candidates[0]
        else:
            while True:
                migrated_name = input(
                    f"Enter new name for {member}. Candidates {', '.join(candidates)}: "
                )
                if migrated_name in NAMES:
                    break

        migrated_data[migrated_name] = historical_data[member]

    historical_data_file.write(json.dumps(migrated_data, indent=2))
    historical_data_file.truncate()
