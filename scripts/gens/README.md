```
console.log(JSON.stringify(
	Array.from(document.querySelectorAll("table.article-table"))
	.map(table => [
		["H2", "H3", "H4"].includes(table.previousElementSibling.tagName)
			? table.previousElementSibling.innerText
			: table.previousElementSibling.previousElementSibling.innerText,
		Array.from(table.querySelectorAll("a"))
		.map(a => [a.innerText, a.href]).filter(([t,_]) => t)])))
```