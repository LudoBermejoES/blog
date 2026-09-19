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

**motores de videojuegos** takes the short form in every target — "game
engines", ゲームエンジン, 게임 엔진, 游戏引擎. The long form ("video game
engines", 비디오 게임 엔진, 电子游戏引擎) is unidiomatic outside Spanish, and in
this post it would also echo "videojuegos" three words earlier in the same
clause — a repetition Spanish tolerates and the others don't.

**mapas** shifts register with context. Next to game engines it means level
geometry, so `ja`/`ko` use the loanword (マップ, 맵) rather than the cartographic
word (地図, 지도), which would pull the reader toward GIS.

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
