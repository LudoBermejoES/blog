# Glossary

Terminology fixed across the six locales, so the translator agents don't
re-decide it and the site doesn't drift into two voices per language.

The agents are stateless. A word settled in one session is forgotten by the
next, and the second rendering will look just as defensible as the first — that
is the whole failure mode this file exists to prevent. **Add a term here the
moment a translation decision gets made**, not later.

Register conventions (です・ます, 합니다체, mainland Simplified, standard
Esperanto orthography, Title Case English) live in `CLAUDE.md` under
"Precedents already set". This file is only about *words*.

> **If you are one of several agents translating at once, do not append a new
> table.** Fill your own column in the existing rows. A parallel pass once left
> this file with three overlapping tables and two contradictory rulings on the
> same term.

## Fixed terms

| Source (`es`) | `en` | `ja` | `ko` | `zh` | `eo` |
| --- | --- | --- | --- | --- | --- |
| Hadinapló | Hadinapló | Hadinapló | Hadinapló | Hadinapló | Hadinapló |
| Ethos | Ethos | Ethos | Ethos | Ethos | Ethos |
| mestizar | crossbreed | 交雑する | 이종교배하다 | 杂交 | krucbredi |
| rol en vivo | LARP | ライブ・ロールプレイ（LARP） | 라이브 롤플레잉(LARP) | 实境角色扮演 | vivaj rolludoj |
| escenarios digitales | 3D environments | 3D シーン | 환경 | 场景 | medioj |
| motores de videojuegos | game engines | ゲームエンジン | 게임 엔진 | 游戏引擎 | videoludaj motoroj |
| mapas (in a game-engine context) | maps | マップ | 맵 | 数字地图 | mapoj |
| escenario (of a tabletop RPG) | scenario | シナリオ | 시나리오 | 剧本 | scenaro |
| partida (de rol) | session / game | セッション | 세션 | 跑团 | sesio |
| campaña | campaign | キャンペーン | 캠페인 | 战役 | kampanjo |
| ambientación (an RPG setting's atmosphere) | setting | 舞台設定 | 배경 | 设定 | etoso |
| Ligeia | Ligeia | Ligeia | Ligeia | Ligeia | Ligeia |
| Fabrica tu propia mierda | Build Your Own Shit | 自分のクソは自分で作れ | 네 좆같은 건 네가 만들어라 | 自己造自己的狗屎 | Fabriku vian propran merdon |
| Esta no es otra de tus putas novelas juveniles | This Isn't Another One of Your Fucking YA Novels | これはまたぞろお前のクソみたいなヤングアダルト小説なんかじゃない | 이건 네 그 씨발 청소년 소설 중 또 하나가 아니야 | 《这不是又一本你那些他妈的青春小说》 | Ĉi tiu ne estas plia el viaj fikaj junularaj romanoj |
| Alzarreyes (Eslizo's name for Kingmaker) | *unchanged* | *unchanged* | *unchanged* | *unchanged* | *unchanged* |

## Post titles

Titles are translated, and pinned here so a later pass can't quietly re-render
one. The **filename never changes** — `comenzando`, `un-sabado-tranquilo` — it
is the join key `[...slug].astro` uses to match the six versions.

| Slug | `es` | `en` | `ja` | `ko` | `zh` | `eo` |
| --- | --- | --- | --- | --- | --- | --- |
| comenzando | Comenzando | Starting Out | はじめに | 시작하며 | 开始 | Komencante |
| un-sabado-tranquilo | Un sábado tranquilo | A Quiet Saturday | 静かな土曜日 | 조용한 토요일 | 平静的周六 | Trankvila sabato |
| mapas-mapas-mapas | mapas, Mapas, MAPAS! | maps, Maps, MAPS! | ちず、チズ、地図！ | 맵, 또 맵, 맵 천지! | 地图，地图！地图！！！ | mapoj, Mapoj, MAPOJ! |

## Tabletop and tooling vocabulary

The author writes fluent anglicisms — `tokens`, `battlemaps`, `assets` — because
that is how the hobby and the trade talk in Spanish. Each target uses whatever
its own tabletop and dev circles actually say, which is sometimes the English
word and sometimes not.

| Source (`es`) | `en` | `ja` | `ko` | `zh` | `eo` |
| --- | --- | --- | --- | --- | --- |
| tokens | tokens | トークン | 토큰 | token | ĵetonoj |
| battlemaps | battlemaps | バトルマップ | 배틀맵 | 战斗地图 | batalmapoj |
| tags | tags | タグ | 태그 | 标签 | etikedoj |
| assets | assets | アセット | 에셋 | 素材 | rimedoj |
| e2e testing | e2e testing | E2E テスト | E2E 테스트 | 端到端测试 | e2e-testado |
| web scraping | web scraping | ウェブスクレイピング | 웹 스크래핑 | 网页爬虫 | retĉerpado |
| paquetes (de assets) | packs | パック | 패키지 | 资源包 | pakaĵoj |
| rol de mesa | tabletop RPG | テーブルトーク RPG | 테이블톱 롤플레잉 게임 | 桌面角色扮演 | tablaj rolludoj |
| PNJs | NPCs | NPC | NPC | NPC | neludantaj roluloj |
| Un drama de primer mundo | a first world problem | ぜいたくな悩み | 배부른 투정 | 典型的第一世界烦恼 | Unuamonda problemo |

**`NPC` stays Latin in `ja`/`ko`/`zh`.** All three tabletop scenes use the
acronym; the expanded native forms (ノンプレイヤーキャラクター, 非玩家角色) are
formal-register and read stiff inside a joke. Esperanto has no scene to defer to,
so it naturalises.

**Product names are never translated or transliterated, in any locale:**
Inkarnate, Dungeondraft, DungeonFog, Photoshop, Clip Studio Paint, Forgotten
Adventures, Tom Cartos, TC Modern, Patreon, Visual Studio, Godot Engine, Rust,
EightBitz. Nor are the URLs, nor English page and repo titles used as link text.
A genre name like `cyberpunk` is not a product and does naturalise
(`kiberpunko`).

**UI strings inside a screenshot's alt text stay in the language on screen.** The
Inkarnate catalogue shot lists `Airport`, `Appliances`, `Books`… — translating
them would describe an interface the reader is not looking at. All five agents
reached this independently.

## Typographic devices in titles

`mapas, Mapas, MAPAS!` is one word three times, escalating **only** by letter
case. Nothing about the meaning changes; the weight does. Two of the six locales
can copy that directly and three cannot, so the precedent is worth keeping.

| Locale | Title | Device |
| --- | --- | --- |
| `es` | mapas, Mapas, MAPAS! | case (source) |
| `en` | maps, Maps, MAPS! | case — one-for-one |
| `eo` | mapoj, Mapoj, MAPOJ! | case — one-for-one |
| `ja` | ちず、チズ、地図！ | **script density**: hiragana → katakana → kanji |
| `zh` | 地图，地图！地图！！！ | **punctuation weight**: `，` → `！` → `！！！` |
| `ko` | 맵, 또 맵, 맵 천지! | **lexical**: bare → "another one" → "everywhere" |

**English must override the Title Case convention here.** "Precedents already
set" in `CLAUDE.md` converts Spanish sentence-case titles to Title Case; applying
it would give `Maps, Maps, MAPS!` and destroy the first step. When the casing
*is* the content, the convention loses.

**Japanese and Chinese found true analogues.** Script density and punctuation
weight are both purely typographic — same word, nothing added — so they transfer
the device rather than paraphrase it. `ja` rejected `まっぷ、マップ、MAP！`
because ending on a shouted Latin run routes the author's Spanish through
English, the same objection that settled `闇のベルリン`.

**Korean is a substitution and says so.** `또` and `맵 천지` are two words the
Spanish does not have. Korean offers no typographic axis that escalates, and the
faithful `맵, 맵, 맵!` is flat repetition rather than a crescendo, so the agent
traded literal fidelity for the effect. If that trade is ever unwanted, the flat
version is the fallback — but the title then carries nothing.

**The lowercase first word is deliberate in `es`, `en` and `eo`.** It is step one
of the device, not a typo, and no later pass should "correct" it.

## Names: the generic translates, the name doesn't

The rule the author gave for `Estación Victoria`, and it generalises: in a name
built from a **generic word plus a proper name**, translate the generic and keep
the name in whatever form the target language already uses for it.

| Source (`es`) | `en` | `ja` | `ko` | `zh` | `eo` |
| --- | --- | --- | --- | --- | --- |
| Estación Victoria | Victoria Station | ヴィクトリア駅 | 빅토리아역 | 维多利亚车站 | la stacio Victoria |
| Berlín en tinieblas | Berlin in Darkness | 闇のベルリン | 어둠 속의 베를린 | 黑暗中的柏林 | Berlino en tenebroj |

**`Estación Victoria` is not the author's coinage** — it is the Spanish edition's
name for **Victoria Station**, a location in the published Mage books. That is
why it translates. It was initially left in Spanish in five locales on the
assumption that it was his invention; the author corrected it.

**`Berlín en tinieblas` is his own campaign title**, and it was released for
translation under the same rule. Its difficulty is that in Spanish it reuses the
line's own noun — *el viejo Mundo de Tinieblas* sits in the same sentence — so
the title visibly borrows from the line. Whether that echo survives depends
entirely on what the line is called in the target:

- **`zh` keeps it.** The line is 黑暗世界, so 黑暗中的柏林 reproduces the effect
  exactly.
- **`ko` mostly keeps it.** The official name is the transliterated 월드 오브
  다크니스, but 어둠의 세계 circulates alongside it, so 어둠 속의 베를린 still
  rhymes for a reader who knows the line.
- **`ja` and `eo` lose it**, and that is accepted rather than worked around. In
  Japanese the line is ワールド・オブ・ダークネス, so the echo word would have to
  be ダークネス — and 「ベルリン・イン・ダークネス」 is an English title invented
  in order to be transliterated, i.e. routing the author's Spanish through a
  third language. In Esperanto the line stays the English *World of Darkness*,
  so the pun is unreachable short of esperantising a product name.

Grammar notes worth keeping, because they are the traps:

- `ko` — 빅토리아역 ends in a consonant, so the object particle is `을`, not
  `를`. The locative `에` after 베를린 does not alternate and stays.
- `eo` — both terms dodge an accusative apposition, by different routes: `la
  stacio Victoria` agrees with an uninflected `unu el…` head, and «Berlino en
  tenebroj» is a citation form inside guillemets, so the case is carried by the
  generic head. Capitalise only the genuine name.
- `ja` — a Latin run takes half-width spaces around it; once the term is in
  Japanese script those spaces must go.
- `zh` — the `，…，` framing only worked because the term was a Latin run. In an
  all-Chinese run it takes full-width quotes attached to the preceding noun.
  `“ ”` for a home campaign, `《》` reserved for published books.

## White Wolf game lines

These recur in every roleplaying post. The Spanish names are translations *of*
English originals, so they go back to the original — and each locale then uses
that line's **officially published name in its own market**, or the English name
where the line was never published there.

| Source (`es`) | Line | `en` | `ja` | `ko` | `zh` | `eo` |
| --- | --- | --- | --- | --- | --- | --- |
| Mundo de Tinieblas | World of Darkness | World of Darkness | ワールド・オブ・ダークネス | 월드 오브 다크니스 | 黑暗世界 | World of Darkness |
| Mago | Mage: The Ascension | Mage | メイジ | 메이지 | 法师 | Mage |
| Changeling | Changeling: The Dreaming | Changeling | チェンジリング | 체인질링 | 换生灵 | Changeling |
| Hombre lobo | Werewolf: The Apocalypse | Werewolf | ワーウルフ | 워울프 | 狼人 | Werewolf |
| Vampiro | Vampire: The Masquerade | Vampire | ヴァンパイア | 뱀파이어 | 吸血鬼 | Vampire |
| Wraith | Wraith: The Oblivion | Wraith | レイス | 레이스 | 亡魂 | Wraith |

`viejo Mundo de Tinieblas` → 旧版黑暗世界 (`zh`), 旧ワールド・オブ・ダークネス
(`ja`), 구 월드 오브 다크니스 (`ko`). Anniversary editions follow the line:
`Mago 20` → 《法师 20 周年版》, 『メイジ 20』, 메이지 20; `Changeling 20
aniversario` → 《换生灵 20 周年纪念版》, 『チェンジリング 20周年記念版』,
체인질링 20주년 기념판.

**`Changeling` has one `l`.** The Spanish source misspelled it "Changelling" /
"changellings" on the first pass and has since been corrected. If it reappears,
flag it rather than carrying it across.

**`zh` `Wraith` → 亡魂 is the least settled of the six.** 幽魂 also circulates in
Chinese fandom. Revisit if the author prefers it.

`Pathfinder`, `Kingmaker`, *Changeling the Podcast* and *Mage: The Podcast* stay
in English in all six locales, URLs included. `Pathfinder segunda Edición` →
Pathfinder Second Edition / パスファインダー第2版 / 패스파인더 2판 /
《开拓者》第二版.

## Why each one is what it is

**Hadinapló** is a proper noun — the site's name, Hungarian for "war diary". It
is never translated, transliterated or glossed, in any language.

**Ethos** stays in the Latin alphabet in all six. It was briefly split — cognate
in `ja`/`eo` (エトス, Etoso), native word in `ko`/`zh` (신조, 信条) — and the
author settled it the other way: the word is Greek to begin with, and leaving it
foreign in every language is more honest than naturalising it in four. It is an
About-page section heading, so it is visible on every visit.

**mestizar** is a biological metaphor and the metaphor is the point. Do not
flatten it to "combine", "mix" or "blend" — the author means interbreeding
between fields, not stirring them together.

**escenarios digitales** means **real-time 3D environments built in a game
engine** (Unreal/Unity), *not* roleplaying adventure scenarios and *not* an RPG
setting. This is the single most expensive ambiguity the site has produced: the
first translation pass split five languages across three different meanings —
`ja`/`ko` read it as an adventure module (シナリオ/시나리오), `en` as a fictional
world ("settings"), `eo`/`zh` as a place (scenejoj/场景). Only the last was
right. The Spanish source now says "escenarios digitales **generados con motores
de videojuegos**" precisely so the clause cannot be misread again.

The trap is that the same sentence also lists *juegos de rol*, which primes
every translator toward the roleplaying reading. Expect it to keep happening;
the disambiguation matters every time both appear together.

**`escenario` on its own is the opposite case.** In a tabletop context it *is*
the adventure sense — シナリオ, 시나리오, 剧本, `scenaro`. The disambiguator is
whether game engines are in the sentence, not the word itself.

**motores de videojuegos** takes the short form in every target — "game
engines", ゲームエンジン, 게임 엔진, 游戏引擎. The long form ("video game
engines", 비디오 게임 엔진, 电子游戏引擎) is unidiomatic outside Spanish, and in
this post it would also echo "videojuegos" three words earlier in the same
clause — a repetition Spanish tolerates and the others don't.

**mapas** shifts register with context. Next to game engines it means level
geometry, so `ja`/`ko` use the loanword (マップ, 맵) rather than the cartographic
word (地図, 지도), which would pull the reader toward GIS.

**Ligeia** is the author's own audio-management software. Product name, never
translated in any locale.

**"Fabrica tu propia mierda"** and **"Esta no es otra de tus putas novelas
juveniles"** are the author's own coinages — a personal movement and a
provisional novel title. Both are **translated, and the crude register is kept**.
Sanitising "mierda" to "stuff" or "putas" to "damn" is a rewrite: the bluntness
is the joke in both. `mierda` → shit, `putas` (adjectival) → fucking.

**Esperanto takes the English line names**, because no White Wolf line has ever
been published in Esperanto and there is no market name to fall back on. They are
left uninflected and the sentence is restructured where a case ending would
otherwise be needed: `Changeling 20 aniversario` becomes `la libron de la 20-a
datreveno de Changeling`. `changelings` (the creatures) stays tied to the line
name rather than becoming the folkloric `ŝanĝinfanoj`.

**The author's own proper nouns stay in Spanish in all six locales** — the
player nickname `Eslizo`, and `Alzarreyes`, the name Eslizo gave the Pathfinder
adventure path *Kingmaker* in Spanish. `Kingmaker` itself is the official product
name and is never localised.

`Berlin en tinieblas` and `Estación Victoria` were briefly in this category and
are not — see "Names: the generic translates, the name doesn't" above.

**Podcast names are English proper nouns.** *Changeling the Podcast* and *Mage:
The Podcast* stay exactly as written in all six locales, URLs included.

## Pending

**The About-page signature is a Neil Gaiman line** — "And sometimes, when you
fall, you fly", from the story *Fear of Falling*, collected in *The Sandman,
Vol. 6: Fables & Reflections*. The Spanish quotes it bare, with no attribution.

The five translations are **original renderings, not the published wording**, so
the allusion will not be recognised by `ja`/`ko`/`zh` readers. Published editions
of that volume do exist, and the wording would have to come from the books
themselves — it is not on the open web, and a fan translation found on a blog is
worth no more than the agents' own:

| Locale | Edition |
| --- | --- |
| `es` | ECC Ediciones, *Fábulas y reflejos* — the current text already matches the circulating ECC wording |
| `ja` | インターブックス, 『サンドマン 第6巻 神話と追憶』, November 2025 |
| `ko` | 시공사, 『샌드맨 6 우화들』, tr. 이수현, March 2009 |
| `zh` | 《睡魔6：神话和倒影》, 2024 |
| `eo` | None. *The Sandman* has never been published in Esperanto, so the original rendering is permanent here. |

Left as-is by decision, not oversight.

**The film in `un-sabado-tranquilo`** is linked as *Resurrection (2025)*
(`tt29002950`), which is the international title of Bi Gan's 《狂野时代》. Chinese
readers know it by the original title, not by the Spanish *Resurrección*. Left as
the author wrote it; substituting the Chinese title would mean the `zh` version
names a film the other five don't.

**IMDb links carry no locale path.** The first draft linked `imdb.com/es-es/…`,
which served the Spanish interface to every reader in all six locales. Strip the
locale segment — `imdb.com/title/<id>/` — and IMDb negotiates it per reader.
