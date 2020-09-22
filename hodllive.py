import googleapiclient.discovery
from time import strftime, gmtime
import json

from channels import MEMBERS

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]


def main():
    api_key = None
    with open("API_KEY", "r") as api_key_file:
        api_key = api_key_file.read()

    youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)

    sub_counts = {}
    for member in MEMBERS:
        request = youtube.channels().list(part="statistics", id=MEMBERS[member])
        response = request.execute()

        sub_counts[member] = response["items"][0]["statistics"]["subscriberCount"]

    with open("hodllive.json", "r+") as historical_data_file:
        historical_data = json.loads(historical_data_file.read())
        historical_data_file.seek(0)
        date = strftime("%Y-%m-%d", gmtime())
        for member in sub_counts:
            historical_data[member].append({"date": date, "subs": sub_counts[member]})
        historical_data_file.write(json.dumps(historical_data, indent=2))
        historical_data_file.truncate()


if __name__ == "__main__":
    main()