---
title: '맵, 또 맵, 맵 천지!'
subtitle: ''
description: 'Rust로 만든 프로그램으로 Dungeondraft의 토큰을 추출하고, 브라우저를 자동화해 Inkarnate에 올리기. 손으로 하자니 도저히 견딜 수가 없었습니다.'
pubDate: '2026-09-20'
heroImage: '../../../assets/blog/mapas-mapas-mapas.webp'
---
지난 5년 동안 저는 테이블톱 롤플레잉 게임 세션에 쓸 맵을 직접 준비하는 일에 익숙해졌습니다. 어떤 때는 [Forgotten Adventures](https://www.patreon.com/forgottenadventures)나 [Tom Cartos](https://www.patreon.com/tomcartos)의 맵처럼 이미 만들어져 있는 것을 가져다 쓰고, 어떤 때는 직접 만듭니다. 이 몇 년 동안 정말 온갖 것을 써 봤고, 지금도 쓰고 있습니다. [Photoshop](https://www.adobe.com/products/photoshop.html)부터 [Clip Studio Paint](https://www.clipstudio.net/)까지, 그 사이에 [Dungeondraft](https://dungeondraft.net/)와 [DungeonFog](https://www.dungeonfog.com/), 그리고 요즘 제가 쓰고 있는 [Inkarnate](https://inkarnate.com/)까지요. [Patreon](https://www.patreon.com/)도 여러 개 후원하고 있습니다. TC Modern이 그렇고 한때는 Forgotten Adventures도 그랬는데, 그렇게 받은 맵을 쓰거나 그들의 토큰으로 직접 맵을 만듭니다.

Inkarnate는 맵을 간단하게 만들 수 있는 온라인 소프트웨어입니다. 더 정확히 말하면, Photoshop으로 만드는 것보다는 간단합니다. 결과물은 꽤 괜찮고, 최근 몇 달 동안 이 도구로 작업해 왔습니다. Inkarnate에는 장점이 하나 더 있습니다. 판타지 도시 지도에도, 판타지·SF·사이버펑크 배틀맵에도 훌륭하게 어울리는 그림 모음, 즉 토큰이 함께 딸려 온다는 점입니다. 하지만 문제가 하나 있습니다. 현대물 토큰이 없다는 것, 그러니까 현대를 배경으로 하는 게임용 배틀맵을 만들 수 있는 토큰이 없다는 것입니다. 다행히 이 문제를 해결할 방법이 있는데, Premium 사용자라면 자기 토큰을 직접 올릴 수 있습니다. 안타깝게도 좋은 소식은 거기까지입니다. Inkarnate에는 토큰을 자동으로 올릴 수 있는 API가 없고, 스타일과 카탈로그를 만들고 토큰을 올리는 방식은, 말하자면, 대단히 수동적이고 아주, 아주 느립니다. 제가 직접 겪어서 잘 압니다. TC Modern 패키지를 몇 개 올려 보려다가 지루해서 미쳐 버릴 뻔했습니다. 느리고, 실수하기 쉽고, 게다가 가끔은 시스템이 작동하지 않는데 왜 그런지조차 분명하지 않습니다. 뭐, 배부른 투정이긴 합니다. 다행히 오늘 아침에는 시간이 있어서, 이 문제를 해결하는 데 도움이 될 프로그램을 두어 개 만들기 시작했습니다.

가장 먼저 하고 싶었던 일은 Tom Cartos의 Dungeondraft 패키지에서 토큰을 추출하는 것이었습니다. 왜냐고요? Patreon 후원자이니 PNG 파일이 담긴 zip을 내려받을 수도 있지만, Tom Cartos가 Dungeondraft에서 사용하는 태그까지 함께 갖고 싶었기 때문입니다. 그래서 제가 한 일은 [EightBitz's Dungeondraft Tools](https://github.com/EightBitz/Dungeondraft-Tools)가 그 일을 어떻게 하는지 살펴보는 것이었습니다. 데이터를 추출하는 [Visual Studio](https://visualstudio.microsoft.com/) 도구가 들어 있는 프로젝트입니다. 코드를 읽으면서 [Godot Engine](https://godotengine.org/)의 패키지 방식을 변형해 쓴다는 것을 알게 되었고, 그래서 Dungeondraft 패키지를 통째로 압축 해제할 수 있는 [Rust](https://www.rust-lang.org/) 기반 명령줄 프로그램을 만들었습니다. EightBitz의 도구를 쓸 수도 있지 않았느냐고요? 네, 그럴 수 있었습니다. 하지만 압축을 풀어야 할 패키지가 어어엄청 많았고, 배우고 싶기도 했습니다. 그렇게 두어 시간 만에 해결책을 손에 넣었고, 혹시 써 보고 싶은 분이 있을까 싶어 저장소를 남겨 둡니다: [Reverse-engineered documentation of the Dungeondraft file formats](https://github.com/LudoBermejoES/dungeon-draft-rust-tools)

하지만 그건 문제의 일부일 뿐이었습니다. 나머지 한 부분은 어쩌면 더 어려운 쪽으로, 압축을 푼 이미지를 Inkarnate에 어떻게 올리느냐 하는 문제였습니다. 저는 시간이 없고, 반복 작업에 쓸 인내심은 그보다 더 없습니다. 게다가 아주 오랜, 정말 오랜 세월 동안 컴퓨터와 씨름해 왔습니다. 그래서 예전부터 알고 있던 웹 스크래핑 지식과 새로 익힌 E2E 테스트 지식을 활용해, Inkarnate 웹사이트를 돌아다니며 먼저 폴더를 만들고 그다음에 에셋, 그러니까 토큰을 올려 주는 스크립트를 여러 개 준비했습니다. 자세한 이야기로 너무 지루하게 만들고 싶지는 않지만, 관심이 있으시다면 여기를 한번 보셔도 좋습니다: [dungeon-draft-rust-tools/scripts at main](https://github.com/LudoBermejoES/dungeon-draft-rust-tools/tree/main/scripts)

그럼 이제 결과가 어떻게 됐느냐고 물으시겠지요. 자, 전부 실행하고 난 뒤의 모습을 그대로 담은 화면입니다:

![Tom Cartos modern 패키지를 이미 올려 둔 Inkarnate 카탈로그. 사이드바에는 수십 개의 카테고리가 에셋 개수와 함께 나열되어 있고(Airport, Appliances, Books, Camping, Drinks, Electronics, Food), 격자에는 위에서 내려다본 가전제품 토큰들이 보입니다.](../../../assets/blog/mapas-mapas-mapas-inkarnate.webp)

나쁘지 않죠? 이제 손으로 한다는 게 무슨 뜻이었는지 아마 이해가 되실 겁니다. 수십 개의 폴더와 하위 폴더 따위를 하나하나 만들고, 이미지를 한 장씩 올리는 모습을 상상해 보세요. 진이 빠지는 일입니다. 하지만 결과는 좋고, 저는 만족합니다. 게다가 덕분에 맵 작업도 시작할 수 있었는데, 지금까지 방 3개를 만들었습니다:

![항구 창고 위층을 위에서 내려다본 맵. 세 모퉁이에는 가구가 갖춰진 방들이 있고(침실, 서재, 주방, 무기고), 이 방들이 칸막이로 나뉜 커다란 중앙 공간을 둘러싸고 있으며, 가장자리에는 부두와 물이 보입니다.](../../../assets/blog/mapas-mapas-mapas-planta-arriba.webp)

그러니 불평할 처지는 아니지요.

이제 오늘 오후에 할 Alzarreyes 세션을 준비해야 합니다. 제가 진행할 차례인데, 조심하지 않으면 학살극이 될 것 같습니다. 제 플레이어들이 당할지, 게임 속 NPC들이 당할지는 모르겠지만요.

어떻게 되는지 지켜보겠습니다.
