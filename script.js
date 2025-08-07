let gameState = {
    currentDay: 1,
    currentLocation: 0,
    heartPoints: 0,
    diaryEntries: [],
    allDiary: [],
    dayLocations: [],
    metCharacters: {},  // キャラクターとの出会い記録
    treasures: {},      // 発見した宝物の記録
    totalTreasures: 0,  // 発見した宝物の総数
    remainingIndexes: [], // 未訪問の場所リスト
    visitedCount: 0      // 訪問済みの場所数
};

// 宝物データベース
const treasureData = {
    "shinySeed": {
        name: "キラキラの種",
        icon: "🌟",
        description: "公園で見つけた光る種。植えると素敵な花が咲くかも！",
        rarity: "common"
    },
    "oldCoin": {
        name: "古いコイン",
        icon: "🪙",
        description: "商店街で見つけた古いコイン。昔の人の思い出が詰まっています。",
        rarity: "rare"
    },
    "prettyShell": {
        name: "きれいな貝がら",
        icon: "🐚",
        description: "川辺で見つけた美しい貝がら。海の香りがします。",
        rarity: "common"
    },
    "magicStone": {
        name: "不思議な石",
        icon: "💎",
        description: "坂道で見つけた不思議な石。触ると温かくなります。",
        rarity: "epic"
    },
    "goldenLeaf": {
        name: "金色の葉っぱ",
        icon: "🍃",
        description: "交差点で見つけた金色に光る葉っぱ。とても珍しいです。",
        rarity: "rare"
    },
    "heartCrystal": {
        name: "ハートのクリスタル",
        icon: "💖",
        description: "特別な場所で見つけた心の形のクリスタル。愛の力が宿っています。",
        rarity: "legendary"
    },
    "musicBox": {
        name: "小さなオルゴール",
        icon: "🎵",
        description: "どこからか聞こえてくる美しいメロディーの正体でした。",
        rarity: "epic"
    },
    "starFragment": {
        name: "星のかけら",
        icon: "⭐",
        description: "夜空から落ちてきた星のかけら。願いを叶えてくれそうです。",
        rarity: "legendary"
    }
};

// 基本となる場所の一覧
const startLocation = {
    name: "おうち",
    icon: "🏠",
    story: "今日はとても良い天気！<br>街を一周して、いろんな出会いを楽しみましょう。<br>散歩中に素敵な宝物も見つかるかも！<br>さあ、散歩に出発です！",
    choices: [
        { text: "散歩を始める", action: "next" },
        { text: "水を飲む", action: "drinkCoffee" },
        { text: "ちょっと休む", action: "takeRest" },
        { text: "本を読む", action: "readBook" }
    ],
    treasures: []
};

const endLocation = {
    name: "おうち",
    icon: "🏠",
    story: "お疲れさまでした！<br>楽しい散歩から帰ってきました。<br>今日の出会いを振り返ってみましょう。<br>もしかしたら、特別な宝物も見つかるかも？",
    choices: [
        { text: "日記を見る", action: "showDiary" },
        { text: "周りを探索する", action: "searchTreasure", treasure: "heartCrystal" },
        { text: "お茶を飲む", action: "drinkCoffee" },
        { text: "休憩する", action: "takeRest" }
    ],
    treasures: ["heartCrystal"]
};

const baseLocations = [
    {
        name: "公園",
        icon: "🌳",
        story: "緑いっぱいの公園に着きました。<br>ベンチに座っているおじいさんと、<br>元気に走り回っている犬がいます。<br>草むらで何かキラキラ光っているのが見えます！",
        choices: [
            { text: "犬と遊ぶ", action: "playWithDog" },
            { text: "おじいさんと話す", action: "talkToOldMan" },
            { text: "キラキラを調べる", action: "searchTreasure", treasure: "shinySeed" },
            { text: "ベンチで休む", action: "takeRest" }
        ],
        treasures: ["shinySeed"]
    },
    {
        name: "商店街",
        icon: "🏪",
        story: "賑やかな商店街に来ました。<br>おいしそうなにおいが漂っています。<br>パン屋さんと八百屋さんが見えます。<br>古い建物の隙間に何か落ちているようです。",
        choices: [
            { text: "パン屋さんに行く", action: "visitBakery" },
            { text: "八百屋さんに行く", action: "visitVeggieStore" },
            { text: "隙間を調べる", action: "searchTreasure", treasure: "oldCoin" },
            { text: "カフェで一息つく", action: "drinkCoffee" }
        ],
        treasures: ["oldCoin"]
    },
    {
        name: "川辺",
        icon: "🌊",
        story: "静かな川辺に到着しました。<br>釣りをしているおじさんと、<br>水面で泳いでいるカモたちがいます。<br>水辺で美しい貝がらが光っています。",
        choices: [
            { text: "釣り人と話す", action: "talkToFisher" },
            { text: "カモを見る", action: "watchDucks" },
            { text: "貝がらを拾う", action: "searchTreasure", treasure: "prettyShell" },
            { text: "石を投げる", action: "throwStone" }
        ],
        treasures: ["prettyShell"]
    },
    {
        name: "坂道",
        icon: "⛰️",
        story: "ちょっと急な坂道です。<br>少し疲れてきましたが、<br>おばあさんが優しく見守ってくれています。<br>足元に不思議な石が転がっています。",
        choices: [
            { text: "頑張って登る", action: "climbHill" },
            { text: "おばあさんと話す", action: "talkToOldWoman" },
            { text: "石を調べる", action: "searchTreasure", treasure: "magicStone" },
            { text: "休憩する", action: "takeRest" }
        ],
        treasures: ["magicStone"]
    },
    {
        name: "図書館",
        icon: "📚",
        story: "静かな図書館に着きました。<br>本がたくさん並んでいます。<br>ページをめくる音が心地よいです。",
        choices: [
            { text: "本を読む", action: "readBook" },
            { text: "本を探す", action: "browseBooks" },
            { text: "静かに休む", action: "takeRest" },
            { text: "散歩を続ける", action: "next" }
        ],
        treasures: []
    },
    {
        name: "美術館",
        icon: "🖼️",
        story: "美術館に入ると素敵な絵が並んでいます。<br>静かに鑑賞している人たちがいます。",
        choices: [
            { text: "絵を鑑賞する", action: "viewArt" },
            { text: "彫刻を見る", action: "observeSculpture" },
            { text: "ベンチで休む", action: "takeRest" },
            { text: "散歩を続ける", action: "next" }
        ],
        treasures: []
    },
    {
        name: "森",
        icon: "🌲",
        story: "森に入ると、木々の間から光が差し込みます。<br>鳥のさえずりが聞こえてきます。",
        choices: [
            { text: "鳥の声を聞く", action: "listenToBirds" },
            { text: "木の実を拾う", action: "pickAcorn" },
            { text: "ベンチで休む", action: "takeRest" },
            { text: "散歩を続ける", action: "next" }
        ],
        treasures: []
    },
    {
        name: "池",
        icon: "🏞️",
        story: "静かな池にたどり着きました。<br>水面には小さな魚が泳いでいます。",
        choices: [
            { text: "魚を眺める", action: "watchFish" },
            { text: "石を投げる", action: "throwStone" },
            { text: "ベンチで休む", action: "takeRest" },
            { text: "散歩を続ける", action: "next" }
        ],
        treasures: []
    }
];

const mysteryLocation = {
    name: "なぞの路地裏",
    icon: "🕵️",
    story: "静かな路地裏で何か不思議なことが起こっているようです。どうする？",
    choices: [
        { text: "手がかりを探す", action: "inspectClue" },
        { text: "周りの人に聞く", action: "askPasser" },
        { text: "警察を呼ぶ", action: "callPolice" },
        { text: "そっと立ち去る", action: "leaveMystery" }
    ],
    treasures: []
};

const events = {
    playWithDog: {
        character: "ポチ",
        firstStory: "こんにちは！ぼく、ポチだよ！<br>一緒に遊ぼうよ！<br>しっぽを振って喜んでいます。<br>遊んでいる間に、ポチが何か掘り出しました！",
        repeatStory: "また来てくれたんだね！<br>今日も遊んでくれるの？<br>ポチは大はしゃぎです。<br>今度は違う場所を掘り始めました！",
        heartPoints: 2,
        diary: "🐕 公園で元気な犬のポチと遊びました。とても人なつっこくて可愛かったです。",
        hiddenTreasure: "musicBox"
    },
    talkToOldMan: {
        story: "おじいさんが昔の話をしてくれました。<br>「君のような若い人に会えて嬉しいよ」<br>と言って笑顔を見せてくれました。<br>お話の最後に、特別な物をくれました。",
        heartPoints: 3,
        diary: "👴 公園のおじいさんから素敵な昔話を聞きました。人生の先輩って素晴らしいですね。",
        hiddenTreasure: "starFragment"
    },
    visitBakery: {
        story: "パン屋さんでメロンパンを買いました。<br>お店の人が「いつでも来てね」と<br>笑顔で言ってくれました。",
        heartPoints: 2,
        diary: "🥖 パン屋さんでメロンパンを買いました。焼きたてでとても美味しかったです。"
    },
    visitVeggieStore: {
        story: "八百屋さんで新鮮な野菜を見せてもらいました。<br>「健康が一番だよ」と<br>おじさんが教えてくれました。",
        heartPoints: 2,
        diary: "🥬 八百屋さんで新鮮な野菜を見ました。健康について考える良い機会でした。"
    },
    talkToFisher: {
        story: "釣り人のおじさんが魚の話をしてくれました。<br>「自然と一緒にいると心が落ち着くんだ」<br>と教えてくれました。",
        heartPoints: 3,
        diary: "🎣 川辺の釣り人から自然の大切さを教わりました。静かな時間も必要ですね。"
    },
    watchDucks: {
        story: "カモたちが気持ちよさそうに泳いでいます。<br>親子のカモが一緒に泳ぐ姿を見て<br>心が温かくなりました。",
        heartPoints: 2,
        diary: "🦆 川でカモの親子を見ました。家族って素晴らしいなと思いました。"
    },
    climbHill: {
        story: "頑張って坂道を登りました！<br>上から見る景色はとてもきれいです。<br>努力した分だけ喜びも大きいですね。",
        heartPoints: 3,
        diary: "⛰️ 急な坂道を頑張って登りました。努力すれば素晴らしい景色が待っています。"
    },
    talkToOldWoman: {
        story: "おばあさんが「無理をしないでね」と<br>優しく声をかけてくれました。<br>人の優しさが身に染みます。",
        heartPoints: 3,
        diary: "👵 坂道でおばあさんから優しい言葉をかけてもらいました。人の思いやりって素敵です。"
    },
    readBook: {
        story: "静かな時間を過ごしました。<br>面白い物語に夢中になりました。",
        heartPoints: 2,
        diary: "📚 図書館でゆっくり本を読みました。新しい知識が増えました。",
    },
    viewArt: {
        story: "美しい絵に心を奪われました。<br>芸術って素敵ですね。",
        heartPoints: 2,
        diary: "🖼️ 美術館で素敵な絵を鑑賞しました。感性が磨かれた気がします。",
    },
    tasteFruit: {
        story: "市場で新鮮な果物を味見しました。<br>とてもおいしい！",
        heartPoints: 2,
        diary: "🍓 市場で果物を試食しました。旬の味を楽しめました。",
    },
    listenToBirds: {
        story: "木の上から美しい鳥のさえずりが聞こえてきます。<br>心が落ち着きます。",
        heartPoints: 2,
        diary: "🐦 森で鳥のさえずりを聞いて癒されました。",
    },
    pickAcorn: {
        story: "足元にどんぐりが落ちていました。<br>小さな宝物をポケットにしまいました。",
        heartPoints: 1,
        diary: "🌰 森でかわいいどんぐりを拾いました。",
    },
    watchFish: {
        story: "池の魚たちが楽しそうに泳いでいます。<br>見ているだけで穏やかな気持ちになります。",
        heartPoints: 1,
        diary: "🐟 池で泳ぐ魚を眺めてのんびりしました。",
    },
    throwStone: {
        story: "石を投げると、水面に波紋が広がりました。<br>何度も跳ねて楽しい！",
        heartPoints: 1,
        diary: "💦 池に小石を投げて波紋を眺めました。",
    },
    watchTrains: {
        story: "ホームに入る電車を見ていると、遠くへ行きたくなります。",
        heartPoints: 1,
        diary: "🚆 駅で電車が通るのを眺めました。旅に出たくなります。",
    },
    restOnBench: {
        story: "ベンチに座ってひと休み。<br>行き交う人々を眺めながら息を整えました。",
        heartPoints: 2,
        diary: "🪑 駅のベンチで少し休憩しました。人の流れを見ているのも面白いです。",
    },
    runAway: {
        story: "全力で走ってその場を離れました。<br>ドキドキが止まりません。",
        heartPoints: 0,
        diary: "🏃 大きな犬から走って逃げました。無事でよかったです。",
    },
    backAway: {
        story: "そっと後ずさりして距離を取りました。<br>犬は興味をなくして去っていきました。",
        heartPoints: 1,
        diary: "🚶 静かに離れたら何事もなく済みました。",
    },
    callHelp: {
        story: "近くの人に助けを求めました。<br>みんなが協力してくれました。",
        heartPoints: 3,
        diary: "📣 困ったときは助けを呼ぶのが一番ですね。",
    },
    befriendDog: {
        story: "おやつをあげると犬はしっぽを振って仲良くなりました。",
        heartPoints: 2,
        diary: "🐶 犬と友達になれました。とてもかわいかったです。",
    },
    prayAtShrine: {
        story: "静かに手を合わせてお参りしました。<br>心がすっきりします。",
        heartPoints: 3,
        diary: "⛩️ 神社でお参りをして心が落ち着きました。"
    },
    viewBridge: {
        story: "橋の上から川を眺めると風が気持ちいいです。",
        heartPoints: 2,
        diary: "🌉 橋の上で景色を楽しみました。"
    },
    drinkCoffee: {
        story: "温かいコーヒーで一息つきました。",
        heartPoints: 2,
        diary: "☕ カフェでコーヒーを飲んで休憩しました。"
    },
    seeAnimals: {
        story: "かわいい動物たちが元気に動き回っています。",
        heartPoints: 2,
        diary: "🐼 動物園で動物たちに癒されました。"
    },
    enjoyGarden: {
        story: "色とりどりの花が咲き誇っています。",
        heartPoints: 2,
        diary: "🌸 庭園で美しい花を眺めました。"
    },
    rideFerris: {
        story: "観覧車から街が一望できました。",
        heartPoints: 3,
        diary: "🎢 遊園地で観覧車に乗りました。"
    },
    walkBeach: {
        story: "波打ち際を歩くと足元がくすぐったい。",
        heartPoints: 2,
        diary: "🏖️ 海辺を散歩して気分爽快でした。"
    },
    climbLighthouse: {
        story: "灯台の頂上から海を見渡しました。",
        heartPoints: 3,
        diary: "🗼 灯台に登って遠くまで見渡しました。"
    },
    enjoyMountain: {
        story: "山頂の空気はとても澄んでいます。",
        heartPoints: 3,
        diary: "🗻 山頂で壮大な景色を楽しみました。"
    },
    walkSchoolyard: {
        story: "校庭を歩くと子どもたちの笑い声が聞こえてきました。",
        heartPoints: 2,
        diary: "🏫 学校で懐かしい気持ちになりました。"
    },
    waitForSignal: {
        story: "きちんと信号を待って渡りました。<br>ルールを守ることの大切さを<br>改めて感じました。",
        heartPoints: 2,
        diary: "🚦 交差点で信号をしっかり待ちました。ルールを守ることの大切さを再確認しました。"
    },
    checkBothSides: {
        story: "左右をしっかり確認してから渡りました。<br>安全第一！<br>注意深く行動することができました。",
        heartPoints: 2,
        diary: "👀 交差点で左右をしっかり確認しました。安全に気をつけることは大切ですね。"
    },
    searchTreasure: {
        story: "宝物を発見しました！",
        heartPoints: 1,
        diary: "宝物を発見しました。"
    }
};

function startWalk() {
    gameState.currentLocation = 0;
    gameState.heartPoints = 0;
    gameState.diaryEntries = [];

    const pool = [...baseLocations];
    const todaysLocations = [];
    for (let i = 0; i < 6; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        todaysLocations.push(pool.splice(idx, 1)[0]);
    }
    const mysteryIdx = Math.floor(Math.random() * todaysLocations.length);
    todaysLocations[mysteryIdx] = mysteryLocation;

    gameState.dayLocations = [startLocation, ...todaysLocations, endLocation];
    gameState.remainingIndexes = [];
    for (let i = 1; i < gameState.dayLocations.length - 1; i++) {
        gameState.remainingIndexes.push(i);
    }
    gameState.visitedCount = 0;

    document.getElementById('heart-points').textContent = '0';
    updateTreasureCount();
    updateProgress();
    showLocation();
}

function showLocation() {
    const location = gameState.dayLocations[gameState.currentLocation];
    document.getElementById('location-icon').textContent = location.icon;
    document.getElementById('location-name').textContent = location.name;
    document.getElementById('story-text').innerHTML = location.story;

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    location.choices.forEach(choice => {
        // 宝物がすでに発見済みの場合は選択肢を非表示
        if (choice.action === 'searchTreasure' && choice.treasure && gameState.treasures[choice.treasure]) {
            return;
        }

        const btn = document.createElement('button');
        btn.className = 'choice-button';
        btn.textContent = choice.text;
        btn.onclick = () => handleChoice(choice.action, choice.treasure, choice.next);
        choicesDiv.appendChild(btn);
    });

    addPlaceholderButtons(choicesDiv);
}

function addPlaceholderButtons(container) {
    while (container.children.length < 4) {
        const btn = document.createElement('button');
        btn.className = 'choice-button';
        btn.textContent = '選択できません';
        btn.disabled = true;
        container.appendChild(btn);
    }
}

function handleChoice(action, treasure, nextIndex) {
    if (action === 'next') {
        moveToNextLocation(nextIndex);
    } else if (action === 'showDiary') {
        showDiary();
    } else if (action === 'searchTreasure') {
        findTreasure(treasure);
    } else if (events[action]) {
        showEvent(action, nextIndex);
    }
}

function moveToNextLocation(nextIndex) {
    if (typeof nextIndex === 'number') {
        gameState.currentLocation = nextIndex;
        const i = gameState.remainingIndexes.indexOf(nextIndex);
        if (i !== -1) {
            gameState.remainingIndexes.splice(i, 1);
        }
    } else if (gameState.remainingIndexes.length > 0 && gameState.visitedCount < 6) {
        const random = Math.floor(Math.random() * gameState.remainingIndexes.length);
        gameState.currentLocation = gameState.remainingIndexes.splice(random, 1)[0];
    } else {
        gameState.currentLocation = gameState.dayLocations.length - 1;
        gameState.remainingIndexes = [];
    }
    gameState.visitedCount++;
    if (gameState.visitedCount >= 6 || gameState.currentLocation === gameState.dayLocations.length - 1) {
        gameState.currentLocation = gameState.dayLocations.length - 1;
        gameState.remainingIndexes = [];
    }
    updateProgress();
    showLocation();
    playSound(440);
}

function findTreasure(treasureId) {
    if (gameState.treasures[treasureId]) {
        return; // すでに発見済み
    }

    const treasure = treasureData[treasureId];
    gameState.treasures[treasureId] = {
        ...treasure,
        foundAt: gameState.dayLocations[gameState.currentLocation].name,
        foundDay: gameState.currentDay
    };

    gameState.totalTreasures++;
    gameState.heartPoints += 2;
    gameState.diaryEntries.push(`✨ ${treasure.name}を発見しました！ ${treasure.description}`);

    playSound(880);
    // 宝物発見演出
    showTreasurePopup(treasure);

    // UI更新
    document.getElementById('heart-points').textContent = gameState.heartPoints;
    updateTreasureCount();

    // 次の選択肢を表示
    setTimeout(() => {
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';

        const continueBtn = document.createElement('button');
        continueBtn.className = 'choice-button';
        continueBtn.textContent = '次へ進む';
        continueBtn.onclick = () => moveToNextLocation();
        choicesDiv.appendChild(continueBtn);
        addPlaceholderButtons(choicesDiv);
    }, 2000);
}

function showTreasurePopup(treasure) {
    const popup = document.getElementById('treasure-popup');
    const icon = document.getElementById('treasure-icon');
    const text = document.getElementById('treasure-text');

    icon.textContent = treasure.icon;
    text.textContent = `${treasure.name}を発見！`;

    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

function showEvent(eventName, nextIndex) {
    const event = events[eventName];
    const hasMet = gameState.metCharacters[eventName];
    const story = event.repeatStory && hasMet ? event.repeatStory : event.firstStory || event.story;

    gameState.metCharacters[eventName] = true;
    gameState.heartPoints += event.heartPoints;
    gameState.diaryEntries.push(event.diary);

    // 隠し宝物がある場合
    if (event.hiddenTreasure && !gameState.treasures[event.hiddenTreasure]) {
        const treasure = treasureData[event.hiddenTreasure];
        gameState.treasures[event.hiddenTreasure] = {
            ...treasure,
            foundAt: gameState.dayLocations[gameState.currentLocation].name,
            foundDay: gameState.currentDay
        };
        gameState.totalTreasures++;
        gameState.heartPoints += 3; // 隠し宝物はボーナスポイント
        gameState.diaryEntries.push(`🎁 隠し宝物「${treasure.name}」を発見しました！`);
        
        // 隠し宝物発見演出
        setTimeout(() => {
            showTreasurePopup(treasure);
        }, 1000);
    }

    playSound(660);
    document.getElementById('heart-points').textContent = gameState.heartPoints;
    updateTreasureCount();
    document.getElementById('story-text').innerHTML = story;

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'choice-button';
    continueBtn.textContent = '次へ進む';
    continueBtn.onclick = () => moveToNextLocation(nextIndex);
    choicesDiv.appendChild(continueBtn);
    addPlaceholderButtons(choicesDiv);
}

function updateProgress() {
    const percent = (Math.min(gameState.visitedCount, 6) / 6) * 100;
    document.getElementById('progress-fill').style.width = percent + '%';
}

function updateTreasureCount() {
    document.getElementById('treasure-count').textContent = gameState.totalTreasures;
}

function playSound(frequency = 440) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
}

function showDiary() {
    document.querySelector('.game-screen').style.display = 'none';
    document.getElementById('diary-screen').style.display = 'block';

    const diaryContent = document.getElementById('diary-content');
    diaryContent.innerHTML = '';

    const summary = document.createElement('div');
    summary.className = 'diary-entry';
    summary.innerHTML = `
        <strong>📊 ${gameState.currentDay}日目のまとめ</strong><br>
        こころポイント: ${gameState.heartPoints}💖<br>
        発見した宝物: ${gameState.totalTreasures}個🎁<br>
        出会った人・もの: ${gameState.diaryEntries.length}個<br><br>
        <strong>💭 感想</strong><br>
        ${getDiaryMessage()}
    `;
    diaryContent.appendChild(summary);

    gameState.diaryEntries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'diary-entry';
        div.innerHTML = entry;
        diaryContent.appendChild(div);
    });
}

function showTreasureCollection() {
    document.getElementById('diary-screen').style.display = 'none';
    document.getElementById('treasure-collection').style.display = 'block';

    const collectionGrid = document.getElementById('collection-grid');
    collectionGrid.innerHTML = '';

    // 全ての宝物を表示（発見済みと未発見）
    Object.keys(treasureData).forEach(treasureId => {
        const treasure = treasureData[treasureId];
        const found = gameState.treasures[treasureId];
        
        const item = document.createElement('div');
        item.className = `treasure-item ${found ? '' : 'undiscovered'}`;
        
        const icon = document.createElement('div');
        icon.className = 'treasure-item-icon';
        icon.textContent = found ? treasure.icon : '❓';
        
        const name = document.createElement('div');
        name.className = 'treasure-item-name';
        name.textContent = found ? treasure.name : '？？？';
        
        const description = document.createElement('div');
        description.className = 'treasure-item-count';
        description.textContent = found ? `発見場所: ${found.foundAt}` : '未発見';
        
        item.appendChild(icon);
        item.appendChild(name);
        item.appendChild(description);
        collectionGrid.appendChild(item);
    });
}

function backToDiary() {
    document.getElementById('treasure-collection').style.display = 'none';
    document.getElementById('diary-screen').style.display = 'block';
}

function getDiaryMessage() {
    const totalScore = gameState.heartPoints + (gameState.totalTreasures * 2);
    
    if (totalScore >= 25) {
        return "今日は本当に素晴らしい散歩でした！たくさんの宝物と出会いがあって、心がとても豊かになりました。君は立派な宝物ハンターです！";
    } else if (totalScore >= 20) {
        return "とても楽しい散歩でした！宝物もたくさん見つけて、いろんな人と出会えて素晴らしい一日でした。";
    } else if (totalScore >= 15) {
        return "楽しい散歩でした。いくつかの宝物と素敵な出会いがあって、心が温かくなりました。";
    } else {
        return "今日も散歩を楽しめました。小さな発見も、大切な宝物になりますね。";
    }
}

function restartGame() {
    gameState = {
        currentDay: 1,
        currentLocation: 0,
        heartPoints: 0,
        diaryEntries: [],
        allDiary: [],
        dayLocations: [],
        metCharacters: {},
        treasures: {},
        totalTreasures: 0,
        remainingIndexes: [],
        visitedCount: 0
    };

    document.getElementById('heart-points').textContent = '0';
    document.getElementById('treasure-count').textContent = '0';
    document.getElementById('progress-fill').style.width = '0%';

    document.querySelector('.game-screen').style.display = 'block';
    document.getElementById('diary-screen').style.display = 'none';
    document.getElementById('treasure-collection').style.display = 'none';

    startWalk();
}

document.addEventListener('mouseover', event => {
    if (event.target.classList.contains('choice-button')) {
        playSound(660);
    }
});

window.addEventListener('load', () => {
    initDailyWalk();
});

const extraEvents = {
    takeRest: {
        story: "ベンチに座ってひと休みしました。<br>少し元気が戻ってきます。",
        heartPoints: 1,
        diary: "😌 ベンチで休憩して体力を回復しました。",
    },
    browseBooks: {
        story: "棚を歩き回り、気になる本をいくつか手に取りました。",
        heartPoints: 1,
        diary: "📖 図書館で面白そうな本を探しました。",
    },
    observeSculpture: {
        story: "美しい彫刻に見入ってしまいました。",
        heartPoints: 2,
        diary: "🗿 美術館で素敵な彫刻を鑑賞しました。",
    },
    inspectClue: {
        story: "周囲を調べると小さな手がかりを見つけました。<br>謎は深まります。",
        heartPoints: 2,
        diary: "🕵️ 手がかりを見つけてミステリーは続きます。",
    },
    askPasser: {
        story: "通りがかりの人が怪しい影を見たと教えてくれました。",
        heartPoints: 1,
        diary: "👂 通行人から貴重な情報を得ました。",
    },
    callPolice: {
        story: "警察がすぐに駆けつけ、状況を確認してくれました。事件は無事解決！",
        heartPoints: 3,
        diary: "🚓 警察を呼んで事件が解決しました。",
    },
    leaveMystery: {
        story: "何もなかったことにしてその場を離れました。",
        heartPoints: 0,
        diary: "😶 不思議な出来事を見なかったことにしました。",
    }
};

Object.assign(events, extraEvents);

// --- Daily walk progression system ---

const eventPool = [
    { title: "花畑", description: "美しい花が咲き誇っています", icon: "🌼" },
    { title: "不思議な路地", description: "通行人が怪しい影について教えてくれました", icon: "🕵️" },
    { title: "静かな神社", description: "遠くで鈴の音が聞こえます", icon: "🔔" },
    { title: "川沿いの散歩道", description: "水面が太陽の光でキラキラ光っています", icon: "🌊" },
    { title: "賑やかな市場", description: "商人たちが元気に呼び込みをしています", icon: "🛍️" },
    { title: "丘の上の景色", description: "ここから見る町はとても小さく見えます", icon: "⛰️" },
    { title: "居心地の良いカフェ", description: "挽きたてのコーヒーの香りが漂っています", icon: "☕" },
    { title: "古い図書館", description: "埃をかぶった本が忘れられた物語をささやいています", icon: "📚" },
    { title: "陽だまりの広場", description: "子どもたちが太陽の下で楽しそうに遊んでいます", icon: "☀️" },
    { title: "ささやきの森", description: "木々の葉が秘密を囁いています", icon: "🌲" },
    { title: "隠れた庭園", description: "門を抜けると花の海が広がっています", icon: "🌷" },
    { title: "海辺の桟橋", description: "波が静かに桟橋に打ち寄せています", icon: "⚓" },
    { title: "星空の天文台", description: "望遠鏡を覗くと遠い星が見えます", icon: "🌠" },
    { title: "霧の湿原", description: "足元に霧が絡みつきます", icon: "🌫️" },
    { title: "素朴な農場", description: "動物たちが興味深そうな目で迎えてくれます", icon: "🐄" },
    { title: "にぎやかな祭り", description: "街は音楽と笑い声であふれています", icon: "🎉" },
    { title: "人けのない遊び場", description: "風に揺られてブランコがきしんでいます", icon: "🛝" },
    { title: "骨董品店", description: "棚にはそれぞれ物語が詰まっています", icon: "🪑" },
    { title: "山の小道", description: "曲がりくねった道を登っていきます", icon: "🥾" },
    { title: "桜公園", description: "花びらがそよ風に舞っています", icon: "🌸" },
    { title: "月明かりの浜辺", description: "月の光が波に銀色の輝きを描きます", icon: "🌙" },
    { title: "静かな駅", description: "人気のないホームが静かにあなたを待っています", icon: "🚉" },
    { title: "秘密の洞窟", description: "暗闇から冷たい風が流れてきます", icon: "🕳️" },
    { title: "浮かぶ橋", description: "橋が川の上でゆっくり揺れています", icon: "🌉" },
    { title: "提灯の通り", description: "頭上の提灯が暖かく光っています", icon: "🏮" },
    { title: "クリスタルの湖", description: "水面は空を映すほど澄んでいます", icon: "💧" },
    { title: "風の草原", description: "背の高い草が海のように揺れています", icon: "🍃" },
    { title: "黄金の寺", description: "黄金の屋根が陽光を反射しています", icon: "🛕" },
    { title: "雪道", description: "新雪が足の下でサクサクと音を立てます", icon: "❄️" },
    { title: "パンダの森", description: "パンダがのんびりと竹を食べています", icon: "🐼" }
];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

let currentDay;
let currentStep;
let todayEvents;

function loadProgress() {
    currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
    currentStep = parseInt(localStorage.getItem('currentStep')) || 0;
    try {
        todayEvents = JSON.parse(localStorage.getItem('todayEvents')) || [];
    } catch (e) {
        todayEvents = [];
    }
    if (!Array.isArray(todayEvents) || todayEvents.length < 6) {
        todayEvents = shuffle([...eventPool]).slice(0, 6);
    }
}

function saveProgress() {
    localStorage.setItem('currentDay', currentDay);
    localStorage.setItem('currentStep', currentStep);
    localStorage.setItem('todayEvents', JSON.stringify(todayEvents));
}

function displayEvent(ev) {
    document.getElementById('location-icon').textContent = ev.icon || '📍';
    document.getElementById('location-name').textContent = ev.title;
    document.getElementById('story-text').textContent = ev.description;
}

function updateUI() {
    document.getElementById('day-display').textContent = `${currentDay}日目`;
    document.getElementById('step-display').textContent = `${currentStep} / 6 歩`;
    document.getElementById('progress-fill').style.width = `${(currentStep / 6) * 100}%`;
}

function nextStep() {
    if (currentStep < 6) {
        const ev = todayEvents[currentStep];
        displayEvent(ev);
        currentStep++;
        saveProgress();
        updateUI();
    } else {
        currentDay++;
        currentStep = 0;
        todayEvents = shuffle([...eventPool]).slice(0, 6);
        saveProgress();
        updateUI();
        displayEvent({ title: "新しい日が始まりました", description: "「次へ」をクリックして今日の散歩を始めましょう", icon: "☀️" });
    }
}

function initDailyWalk() {
    loadProgress();
    updateUI();
    displayEvent({ title: "散歩に出かけましょう", description: "「次へ」を押して最初の場所へ移動します", icon: "🚶" });
    document.getElementById('next-btn').addEventListener('click', nextStep);
}
