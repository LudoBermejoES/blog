---
title: '地图，地图！地图！！！'
subtitle: ''
description: '用一个 Rust 程序把 Dungeondraft 里的 token 提取出来，再用自动化浏览器上传到 Inkarnate，因为手动做实在受不了。'
pubDate: '2026-09-20'
heroImage: '../../../assets/blog/mapas-mapas-mapas.webp'
---
过去五年里，我习惯了自己准备桌面角色扮演跑团要用的地图。有时候我直接拿现成的地图，比如 [Forgotten Adventures](https://www.patreon.com/forgottenadventures) 或者 [Tom Cartos](https://www.patreon.com/tomcartos) 的，有时候则自己画。这些年我什么都用过，现在也还在用。从 [Photoshop](https://www.adobe.com/products/photoshop.html) 到 [Clip Studio Paint](https://www.clipstudio.net/)，中间还有 [Dungeondraft](https://dungeondraft.net/)、[DungeonFog](https://www.dungeonfog.com/)，以及我最近在用的 [Inkarnate](https://inkarnate.com/)。我订阅了好几个 [Patreon](https://www.patreon.com/)，比如 TC Modern，还有当初的 Forgotten Adventures，用他们的地图，或者用他们的 token 自己做。

Inkarnate 是一款在线软件，可以很轻松地做地图。或者更准确地说，比用 Photoshop 轻松。出来的效果相当不错，最近几个月我一直在用它。Inkarnate 还有一个额外的优势：它自带一套图形，也就是 token，不管是做奇幻城市地图，还是做奇幻、科幻或者赛博朋克的战斗地图，都好用得很。但它有个问题：没有现代题材的 token，也就是说，没有能用来做当代背景战斗地图的 token。好在这个问题有办法解决：如果你是 Premium 用户，就可以上传自己的 token。不幸的是，好消息到此为止，因为 Inkarnate 没有提供自动上传的 API，而创建风格、创建目录、上传 token 的方式，怎么说呢，非常手工，也非常、非常慢。这我可有切身体会，我试着上传过几个 TC Modern 的资源包，差点无聊到发疯。又慢，又容易出错，而且系统有时候干脆就不工作，还看不出是为什么。好吧，典型的第一世界烦恼。幸好今天早上我有空，就动手写了两个程序来帮我解决这个问题。

我首先想做到的，是把 Tom Cartos 那些 Dungeondraft 资源包里的 token 提取出来。为什么？作为 Patreon 订阅者，我本来可以直接下载装着 PNG 文件的 zip，但我还想拿到 Tom Cartos 在 Dungeondraft 里用的那些标签。于是我去研究了
[EightBitz's Dungeondraft Tools](https://github.com/EightBitz/Dungeondraft-Tools) 是怎么做的，它有一个用 [Visual Studio](https://visualstudio.microsoft.com/) 写的工具可以提取数据。读代码的时候我明白了，它用的是 [Godot Engine](https://godotengine.org/) 打包方式的一个变体，于是我基于 [Rust](https://www.rust-lang.org/) 写了一个命令行程序，可以把整个 Dungeondraft 资源包解压出来。那我用 EightBitz 的不行吗？行是行，可我要解压的包实在是好多好多好多，而且我想学点东西。两个小时之后，我就有了方案，放在一个仓库里，链接留给你们，想用就拿去：[Reverse-engineered documentation of the Dungeondraft file formats](https://github.com/LudoBermejoES/dungeon-draft-rust-tools)

但这只是问题的一部分。另一部分可能更难，跟怎么把解压出来的图片上传到 Inkarnate 有关。我时间不多，对重复劳动的耐心更少，再加上我跟电脑死磕了很多很多年。所以我把老本行网页爬虫的经验和新学的端到端测试的经验用上了，写了一组脚本，让它们去操作 Inkarnate 的网页：先创建文件夹，再上传素材，也就是 token。细节我就不多讲了，免得你们无聊，不过如果你们有兴趣，可以到这里看看：[dungeon-draft-rust-tools/scripts at main](https://github.com/LudoBermejoES/dungeon-draft-rust-tools/tree/main/scripts)

现在你们大概要问了，最后成什么样了？是这样，下面就是全部跑完之后的结果：

![Inkarnate 的目录，Tom Cartos modern 的资源包已经上传完毕：侧边栏列出了几十个分类以及各自的素材数量——Airport、Appliances、Books、Camping、Drinks、Electronics、Food——网格里显示的是俯视角度的家电 token。](../../../assets/blog/mapas-mapas-mapas-inkarnate.webp)

不错吧？现在你们大概也明白我说的“手动做”是什么意思了。想象一下，一个个建起几十个文件夹、子文件夹之类的，再把每张图片一张张传上去。累死人。不过结果是好的，我挺满意。而且这也让我能开始画地图了，目前画好了 3 个房间：

![港口仓库上层的俯视地图：三个角落里是布置好家具的房间——卧室、一间图书室、一间厨房、一间军械库——围着中央一个被隔墙分开的大厂房，边上是码头和水面。](../../../assets/blog/mapas-mapas-mapas-planta-arriba.webp)

所以我没什么可抱怨的。

现在该去准备今天下午 Alzarreyes 的跑团了，这次轮到我当主持人，要是不当心，场面会变成一场屠杀，不知道被屠的是我的玩家，还是游戏里的 NPC。

到时候就知道了。
