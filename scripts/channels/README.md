```
cat scripts/wiki_results/hololive_wiki.json | jq '[.[] | {key: .full_name, value: .channel}] | from_entries' > scripts/channels/hololive_channels.json
```
