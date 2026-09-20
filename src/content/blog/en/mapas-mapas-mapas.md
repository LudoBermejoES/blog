---
title: 'maps, Maps, MAPS!'
subtitle: ''
description: 'Extracting Dungeondraft tokens with a Rust program and uploading them to Inkarnate by automating the browser, because doing it by hand was unbearable.'
pubDate: '2026-09-20'
heroImage: '../../../assets/blog/mapas-mapas-mapas.webp'
---
Over the last five years I've got into the habit of preparing the maps for my tabletop roleplaying sessions. Sometimes I take ready-made maps, like the ones from [Forgotten Adventures](https://www.patreon.com/forgottenadventures) or [Tom Cartos](https://www.patreon.com/tomcartos), and other times I make them myself. Over those years I've used, and still use, a bit of everything. From [Photoshop](https://www.adobe.com/products/photoshop.html) to [Clip Studio Paint](https://www.clipstudio.net/), by way of [Dungeondraft](https://dungeondraft.net/), [DungeonFog](https://www.dungeonfog.com/), or what I've been using lately, [Inkarnate](https://inkarnate.com/). I pay for several [Patreon](https://www.patreon.com/) accounts, like TC Modern's and, at the time, Forgotten Adventures', and I use their maps or build my own with their tokens.

Inkarnate is online software that lets you create maps easily. Or rather, more easily than with Photoshop. The results are pretty good and I've been working with it these past few months. Inkarnate has one extra advantage: it comes with a set of drawings, or tokens, that are wonderful both for fantasy city maps and for fantasy, science fiction or cyberpunk battlemaps. But it has a problem: it has no modern tokens, that is, tokens for making battlemaps for games set in the present day. Luckily there's a way around this, which is that if you're a Premium user you can upload your own tokens. Unfortunately that's where the good news ends, because Inkarnate has no API for uploading them automatically, and the way you create styles and catalogs and upload tokens is, let's say, very manual and very, very slow. I know this first-hand: I tried to upload a few TC Modern packs and nearly went out of my mind with boredom. It's slow, error-prone, and on top of that the system sometimes doesn't work and it isn't clear why. A first world problem, basically. Luckily I had some time this morning, so I set about working on a couple of programs to help me solve it.

The first thing I wanted was to be able to extract the tokens from Tom Cartos' Dungeondraft packs. Why? As a Patreon subscriber I could download zips with the PNG files, but I also wanted the tags Tom Cartos uses in Dungeondraft. So what I did was study how
[EightBitz's Dungeondraft Tools](https://github.com/EightBitz/Dungeondraft-Tools) does it, which has a [Visual Studio](https://visualstudio.microsoft.com/) tool for extracting data. Reading the code, I learned that it uses a variant of [Godot Engine](https://godotengine.org/)'s packaging method, so I put together a command-line program based on [Rust](https://www.rust-lang.org/) that can unpack entire Dungeondraft packs. Could I have used EightBitz's? Well, yes, but I had maaany packs to extract and I wanted to learn. And after a couple of hours I had the solution in a repo, which I'll leave here in case you want to use it: [Reverse-engineered documentation of the Dungeondraft file formats](https://github.com/LudoBermejoES/dungeon-draft-rust-tools)

But that was only part of the problem. The other part is maybe harder, and it has to do with how to upload the extracted images to Inkarnate. I have little time and less patience for repetitive tasks and, besides, I've spent many, many years wrestling with computers. So I put my old web scraping knowledge and my newer e2e testing knowledge to use and wrote a series of scripts to navigate the Inkarnate site, first creating folders and then uploading the assets, or tokens. I don't want to bore you too much with the details, but if you're interested you can take a look at: [dungeon-draft-rust-tools/scripts at main](https://github.com/LudoBermejoES/dungeon-draft-rust-tools/tree/main/scripts)

And now you'll ask me: how did it turn out? Well, here's a dump of how it ended up after running everything:

![Inkarnate catalog with the Tom Cartos modern packs already uploaded: the sidebar lists dozens of categories with their asset counts — Airport, Appliances, Books, Camping, Drinks, Electronics, Food — and the grid shows the appliance tokens seen from above.](../../../assets/blog/mapas-mapas-mapas-inkarnate.webp)

Not bad, right? And now maybe you can see what I meant about doing it by hand. Imagine creating dozens of folders, subfolders and the rest, and uploading every image one by one. Exhausting. But the result is good and I'm happy with it. It's also let me make a start on the map, of which I have 3 rooms so far:

![Top-down map of the upper floor of a dockside warehouse: furnished rooms in three corners — bedrooms, a library, a kitchen, an armory — around a large central bay divided by partition walls, with the dock and the water at the edge.](../../../assets/blog/mapas-mapas-mapas-planta-arriba.webp)

So I can't complain.

Now, on to prepping this afternoon's Alzarreyes session, which I'm running — and if I'm not careful it's going to be a massacre, though I don't know whether of my players or of the game's NPCs.

We'll see.
