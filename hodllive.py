import sys
import googleapiclient.discovery
from time import strftime, gmtime
import json

from channels import MEMBERS

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]


def main():
    api_key = sys.argv[1]
    # Normal updates target all channels
    target_members = MEMBERS.keys()
    if len(sys.argv) == 3:
        # But manual updates might want to target only a few members,
        # such as initial data fetch for new members, or to fix mistakes
        target_members = sys.argv[2].split(",")

    youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)

    # Member -> (subscribers, views)
    stats = {}
    for member in target_members:
        request = youtube.channels().list(part="statistics", id=MEMBERS[member])
        response = request.execute()

        stats[member] = (
            int(response["items"][0]["statistics"]["subscriberCount"]),
            int(response["items"][0]["statistics"]["viewCount"]),
        )

    with open("hodllive.json", "r+") as historical_data_file:
        historical_data = json.loads(historical_data_file.read())
        historical_data_file.seek(0)
        date = strftime("%Y-%m-%d", gmtime())
        for member in stats:
            subs, views = stats[member]
            historical_data[member].append({"date": date, "subs": subs, "views": views})
        historical_data_file.write(json.dumps(historical_data, indent=2))
        historical_data_file.truncate()


if __name__ == "__main__":
    main()