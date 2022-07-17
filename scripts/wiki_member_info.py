import requests
from lxml.html import document_fromstring
import re
import json
from pprint import pprint

from .nijisanji_wiki import NIJI_JP, NIJI_EN


def extract_member_wiki(member_url):
    res = requests.get(member_url)
    tree = document_fromstring(res.text)

    member_info = {}

    member_info["wiki_url"] = member_url
    print(member_url)

    full_name = tree.xpath("//h1/text()")
    if full_name:
        full_name = full_name[0].strip()
        member_info["full_name"] = full_name
        print(full_name)

    yt_link = tree.xpath("//a[contains(@href, 'youtube.com')]/@href")
    if yt_link:
        yt_link = yt_link[0]
        yt_channel = re.search(r"channel/(?P<channel>.+)", yt_link)
        if yt_channel:
            channel = yt_channel.group("channel")
            member_info["channel"] = channel
            print(channel)

    emoji = tree.xpath(
        "//*[contains(@class, 'pi-data-value') and ../h3[contains(text(), 'Emoji')]]"
    )
    if emoji:
        emoji = emoji[0].text_content()
        member_info["emoji"] = emoji
        print(emoji)

    debut = tree.xpath(
        "//*[contains(@class, 'pi-data-value') and ../h3[contains(text(), 'Debut Date')]]"
    )
    if debut:
        debut = debut[0].text_content()
        maybe_date = re.search(r"You[Tt]ube:\s*(?P<debut>\d{4}.\d{2}.\d{2})", debut)
        if maybe_date:
            debut = maybe_date.group("debut")
            member_info["debut"] = debut
            print(debut)

    color = None
    maybe_color = tree.xpath("//li[contains(text(), 'Color')]")
    if maybe_color:
        contains_color = maybe_color[0].text_content()
        color_match = re.search(r"#(?P<color>\w{6})", contains_color)
        if color_match:
            color = color_match.group("color")
            member_info["color"] = color
            print("Color:", color)

    print("---")
    return member_info


members = {}
missing = {
    "full_name": [],
    "channel": [],
    "emoji": [],
    "color": [],
}
for member_url in NIJI_JP:
    member_info = extract_member_wiki(member_url)
    member_key = member_url
    if member_info["full_name"]:
        member_key = member_info["full_name"].split()[-1]
    members[member_key] = member_info
    for field in missing:
        if not field in member_info:
            missing[field].append((member_key, member_url))

missing["debut"] = [
    (k, v["debut"], v["wiki_url"])
    for k, v in members.items()
    if not re.match(r"\d{4}/\d{2}/\d{2}", v["debut"])
]

with open("nijisanji.json", "w") as f:
    f.write(json.dumps(members))

pprint(missing)
