import requests
from lxml.html import document_fromstring
from waybackpy import WaybackMachineCDXServerAPI
import re
import json
import sqlite3
import signal
import sys
from glom import glom
import pdb
from datetime import datetime


def shorthand_to_int(s: str):
    ret = None
    try:
        if s[-1] == "K":
            ret = int(float(s[:-1]) * 1_000)
        elif s.endswith("тыс."):
            ret = int(float(s.split()[0]) * 1_000)
        elif s.endswith("ألف مشترك"):
            ret = int(float(s.split()[0]) * 1_000)
        elif s[-1] == "万":
            ret = int(float(s[:-1]) * 10_000)
        elif s[-1] == "M":
            ret = int(float(s[:-1]) * 1_000_000)
        else:
            ret = int(re.sub(r"[,.\s]", "", s))
    except:
        print("Failed to parse sub count from:", s)
    finally:
        return ret


def retrieve_subs(wayback_yt_url):
    content = requests.get(wayback_yt_url).text
    document = document_fromstring(content)

    if (
        "This channel does not exist" in content
        or "This account has been terminated" in content
    ):
        return (None, True)

    # In old versions, the subscription button contains just the number
    old_format = document.cssselect(".subscribed")
    if old_format:
        return (shorthand_to_int(old_format[0].text_content()), False)

    # SUBSCRIBER_SYNONYMS = "|".join(
    #     [
    #         "subscribers",
    #         "Abonnenten",
    #         "prenumeranter",
    #         "位訂閱者",
    #         "подписчиков",
    #         "abonnees",
    #     ]
    # )
    SUBSCRIBER_FORMAT = r"(?P<subscribers>[0-9.,\s]+(K|M|万|тыс.|ألف مشترك)?)"
    NO_OP = lambda s: s
    YT_DATA_FORMATS = [
        (
            r'(ytInitialData|window\["ytInitialData"\]) = (?P<ytInitialData>{.*?});',
            NO_OP,
        ),
        (r'<div id="initial-data"><!-- (?P<ytInitialData>{.*?}) --></div>', NO_OP),
        (
            # Weird escaped string
            r'(ytInitialData|window\["ytInitialData"\]) = \'(?P<ytInitialData>.*?)\';',
            lambda s: s.encode("latin1", "backslashreplace").decode("unicode_escape"),
        ),
    ]
    YT_SUB_PATHS = [
        "header.c4TabbedHeaderRenderer.subscriberCountText.simpleText",
        "header.c4TabbedHeaderRenderer.subscriberCountText.runs.0.text",
    ]

    yt_initial_data = None
    for (format, postprocess) in YT_DATA_FORMATS:
        yt_initial_data = re.search(
            format,
            content,
        )
        if yt_initial_data:
            yt_initial_data = postprocess(yt_initial_data.group("ytInitialData"))
            try:
                yt_initial_data = json.loads(yt_initial_data)
                break
            except:
                print("JSON parse failed")
                pdb.set_trace()

    if yt_initial_data:
        for path in YT_SUB_PATHS:
            sub_text = glom(
                yt_initial_data,
                path,
                default=None,
            )
            if sub_text:
                match = re.search(SUBSCRIBER_FORMAT, sub_text)
                if match:
                    return (shorthand_to_int(match.group("subscribers")), False)

        print("Can't extract sub_text from ytInitialData", wayback_yt_url)
        while True:
            choice = input("(B)ad/(D)ebug: ")
            if choice == "B":
                return (None, True)
            elif choice == "D":
                pdb.set_trace()
                break

    if '__wm.wombat("https://consent.youtube.com/' in content:
        return (None, True)
    else:
        return (None, False)


def get_wayback_channel_urls(channel_id):
    cdx = WaybackMachineCDXServerAPI(f"https://www.youtube.com/channel/{channel_id}")
    return [(s.datetime_timestamp.date(), s.archive_url) for s in list(cdx.snapshots())]


if __name__ == "__main__":

    # Handle ctrl+c
    def on_int(*args, **kwargs):
        print("Bye.")
        sys.exit()

    signal.signal(signal.SIGINT, on_int)

    channels = json.loads(open("channels.json").read())
    db = sqlite3.connect("subscribers.db")
    cursor = db.cursor()
    cursor.execute(
        "create table if not exists subscribers(id integer primary key autoincrement, channel text, date date, subscribers int)"
    )
    cursor.execute(
        "create table if not exists known_bad(id integer primary key autoincrement, url text)"
    )
    cursor.execute(
        "create table if not exists mysterious_failures(url text primary key)"
    )
    cursor.execute(
        "create table if not exists finished_scraping(channel text primary key)"
    )

    with open("hodllive.json", "r") as f:
        hodllive_stats = json.loads(f.read())
        already_known = {}
        for member, stats in hodllive_stats.items():
            already_known[member] = datetime.strptime(
                stats[0]["date"], "%Y-%m-%d"
            ).date()

    try:
        for member, channel in channels.items():
            finished_scraping = list(
                cursor.execute(
                    "select * from finished_scraping where channel=:channel",
                    {"channel": channel},
                )
            )
            if finished_scraping:
                continue

            known_by = datetime.max.date()
            if member in already_known:
                known_by = already_known[member]

            wayback_urls = get_wayback_channel_urls(channel)
            print(f"{member} snapshots:", len(wayback_urls))
            finished = True
            for (date, url) in wayback_urls:
                have_date_subs = list(
                    cursor.execute(
                        "select * from subscribers where channel=:channel and date=:date",
                        {"channel": channel, "date": date},
                    )
                )
                known_bad = list(
                    cursor.execute(
                        "select * from known_bad where url=:url", {"url": url}
                    )
                )

                if not have_date_subs and not known_bad and date < known_by:
                    (subs, bad_url) = retrieve_subs(url)
                    if subs is None:
                        if bad_url:
                            print("New known_bad url", date, url)
                            cursor.execute(
                                "insert into known_bad (url) values (?)",
                                (url,),
                            )
                        else:
                            finished = False
                            print(date, url)
                            cursor.execute(
                                "insert or ignore into mysterious_failures (url) values (?)",
                                (url,),
                            )
                    elif subs < 1000:
                        finished = False
                        print("Low subs", date, subs, channel, url)
                    else:
                        print(date, subs)
                        cursor.execute(
                            "insert into subscribers (channel, date, subscribers) values (?, ?, ?)",
                            (channel, date, subs),
                        )
                    last_date = date
            if finished:
                cursor.execute(
                    "insert or ignore into finished_scraping (channel) values (?)",
                    (channel,),
                )
            db.commit()
    finally:
        cursor.close()
        db.commit()
        db.close()
