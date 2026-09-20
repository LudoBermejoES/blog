---
title: 'mapoj, Mapoj, MAPOJ!'
subtitle: ''
description: 'Eltiri la ĵetonojn el Dungeondraft per programo en Rust kaj alŝuti ilin al Inkarnate aŭtomatigante la retumilon, ĉar mane tio estis neeltenebla.'
pubDate: '2026-09-20'
heroImage: '../../../assets/blog/mapas-mapas-mapas.webp'
---
En la lastaj kvin jaroj mi alkutimiĝis prepari la mapojn por miaj sesioj de tabla rolludo. Foje mi prenas jam kreitajn mapojn, kiel tiujn de [Forgotten Adventures](https://www.patreon.com/forgottenadventures) aŭ [Tom Cartos](https://www.patreon.com/tomcartos), kaj aliajn fojojn mi mem kreas ilin. Dum ĉi tiuj jaroj mi uzis, kaj plu uzas, ĉion ajn. De [Photoshop](https://www.adobe.com/products/photoshop.html) ĝis [Clip Studio Paint](https://www.clipstudio.net/), tra [Dungeondraft](https://dungeondraft.net/), [DungeonFog](https://www.dungeonfog.com/) aŭ tio, kion mi uzas en la lasta tempo, [Inkarnate](https://inkarnate.com/). Mi pagas plurajn abonojn en [Patreon](https://www.patreon.com/), kiel tiun de TC Modern aŭ, siatempe, tiun de Forgotten Adventures, kaj mi uzas iliajn mapojn aŭ kreas ilin mem per iliaj ĵetonoj.

Inkarnate estas reta programaro, kiu ebligas krei mapojn facile. Aŭ pli ĝuste, pli facile ol per Photoshop. La rezultoj estas sufiĉe bonaj kaj mi laboras per ĝi dum la lastaj monatoj. Inkarnate havas plian avantaĝon: ĝi venas kun aro da desegnaĵoj, aŭ ĵetonoj, kiuj estas mirindaj tiel por mapoj de fantaziaj urboj kiel por batalmapoj de fantazio, sciencfikcio aŭ kiberpunko. Sed ĝi havas problemon: ĝi ne havas modernajn ĵetonojn, tio estas, ĵetonojn, kiuj ebligas fari batalmapojn por ludoj situantaj en la nuntempo. Feliĉe ekzistas maniero solvi ĉi tiun problemon: se vi estas uzanto Premium, vi povas alŝuti viajn proprajn ĵetonojn. Bedaŭrinde tie finiĝas la bonaj novaĵoj, ĉar por Inkarnate ne ekzistas API por alŝuti ilin aŭtomate, kaj la maniero krei stilojn, katalogojn kaj alŝuti ĵetonojn estas, ni diru, tre mana kaj tre, tre malrapida. Mi bone scias tion: mi provis alŝuti kelkajn pakaĵojn de TC Modern kaj preskaŭ freneziĝis pro enuo. Ĝi estas malrapida, erarema kaj krome foje la sistemo ne funkcias, sed ne klaras kial. Unuamonda problemo, nu ja. Feliĉe, ĉi-matene mi havis tempon, do mi eklaboris pri paro da programoj, kiuj helpu min solvi ĉi tiun problemon.

La unua afero, kiun mi volis, estis kapabli eltiri la ĵetonojn el la Dungeondraft-pakaĵoj de Tom Cartos. Kial? Kiel Patreon-abonanto mi povus elŝuti zip-dosierojn kun la PNG-dosieroj, sed mi volis havi ankaŭ la etikedojn, kiujn Tom Cartos uzas en Dungeondraft. Do mi studis, kiel tion faras
[EightBitz's Dungeondraft Tools](https://github.com/EightBitz/Dungeondraft-Tools), kiu havas ilon en [Visual Studio](https://visualstudio.microsoft.com/) por eltiri datumojn. Legante la kodon mi lernis, ke ĝi uzas varianton de la pakaĵmetodo de [Godot Engine](https://godotengine.org/), do mi preparis komandlinian programon bazitan sur [Rust](https://www.rust-lang.org/), kiu ebligas elpaki kompletajn Dungeondraft-pakaĵojn. Ĉu mi povus esti uzinta tiun de EightBitz? Nu jes, sed mi havis muuultajn pakaĵojn por elpaki kaj mi volis lerni. Kaj post paro da horoj mi havis la solvon en deponejo, kiun mi lasas al vi, se vi volas uzi ĝin: [Reverse-engineered documentation of the Dungeondraft file formats](https://github.com/LudoBermejoES/dungeon-draft-rust-tools)

Sed tio estis nur parto de la problemo. La alia parto estas eble pli malfacila kaj rilatas al tio, kiel alŝuti la elpakitajn bildojn al Inkarnate. Mi havas malmulte da tempo kaj eĉ malpli da pacienco por ripetemaj taskoj kaj, krome, mi batalas kun komputiloj jam de multaj, multaj jaroj. Do mi profitis miajn malnovajn sciojn pri retĉerpado kaj la novajn pri e2e-testado por prepari serion da skriptoj, kiuj servu al mi por navigi tra la retejo de Inkarnate kaj krei unue dosierujojn kaj poste alŝuti la rimedojn, aŭ ĵetonojn. Mi ne volas tro enuigi vin per la detaloj sed, se tio interesas vin, vi povas rigardeti ĉi tie: [dungeon-draft-rust-tools/scripts at main](https://github.com/LudoBermejoES/dungeon-draft-rust-tools/tree/main/scripts)

Kaj nun vi demandos min: kiel rezultis la afero? Nu, jen bildo de tio, kiel ĝi rezultis post plenumi ĉion:

![Katalogo de Inkarnate kun la pakaĵoj de Tom Cartos modern jam alŝutitaj: la flanka breto listigas dekojn da kategorioj kun sia nombro da rimedoj —Airport, Appliances, Books, Camping, Drinks, Electronics, Food— kaj la krado montras la ĵetonojn de hejmaparatoj viditajn de supre.](../../../assets/blog/mapas-mapas-mapas-inkarnate.webp)

Ne malbone, ĉu ne? Kaj nun eble vi komprenas, kion mi volis diri per fari ĝin mane. Imagu krei dekojn da dosierujoj, subdosierujoj kaj tiel plu, kaj alŝuti unu post alia ĉiun bildon. Lacige. Sed la rezulto estas bona, mi kontentas pri ĝi. Kaj krome ĝi permesis al mi komenci la mapon, el kiu mi momente havas 3 ĉambrojn:

![Zenita mapo de la supra etaĝo de havena magazeno: mebligitaj ĉambroj en tri anguloj —dormoĉambroj, biblioteko, kuirejo, arsenalo— ĉirkaŭ granda centra halo dividita per vandoj, kun la kajo kaj la akvo ĉe la rando.](../../../assets/blog/mapas-mapas-mapas-planta-arriba.webp)

Do mi ne povas plendi.

Nun, prepari la ĉi-posttagmezan sesion de Alzarreyes, kiun mi devas gvidi, kaj, se mi ne atentos, ĝi estos buĉado, mi ne scias ĉu de miaj ludantoj aŭ de la neludantaj roluloj de la ludo.

Ni vidos.
