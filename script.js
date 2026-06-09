/**
 * Sonic Mirror — 音楽心理診断
 * HTML / CSS / JavaScript のみで動作
 */

/* ========================================
   質問データ
   ======================================== */
const QUESTIONS = [
  {
    id: 1,
    title: "メロディ明瞭性",
    description: "どちらの音が、メロディ（旋律）をはっきりと感じ取りやすいですか？",
    audioA: "audio/q1-a.mp3",
    audioB: "audio/q1-b.mp3",
    labelA: "楽しくわかりやすいメロディ",
    labelB: "ほわほわとした響き",
    scores: { A: { M: 1 }, B: { A: 1 } },
  },
  {
    id: 2,
    title: "和声安定性",
    description: "どちらの音が、予測しやすく安定した響きに感じますか？",
    audioA: "audio/q2-a.mp3",
    audioB: "audio/q2-b.mp3",
    labelA: "落ち着いたクラシック調",
    labelB: "不思議な響き",
    scores: { A: { S: 1 }, B: { U: 1 } },
  },
  {
    id: 3,
    title: "刺激耐性",
    description: "どちらの音を、長く聴いていても心地よいと感じますか？",
    audioA: "audio/q3-a.mp3",
    audioB: "audio/q3-b.mp3",
    labelA: "エネルギッシュで密度の高い音",
    labelB: "草原のような穏やかな音",
    scores: { A: { H: 1 }, B: { L: 1 } },
  },
  {
    id: 4,
    title: "複雑性",
    description: "どちらの音が、最初から直感的に理解しやすいですか？",
    audioA: "audio/q4-a.mp3",
    audioB: "audio/q4-b.mp3",
    labelA: "シンプルで明快な構成",
    labelB: "層が重なり深掘りしたい構成",
    scores: { A: { E: 1 }, B: { D: 1 } },
  },
  {
    id: 5,
    title: "リズム重視",
    description: "どちらの音が、リズムよりも旋律・フレーズに意識が向きますか？",
    audioA: "audio/q5-a.mp3",
    audioB: "audio/q5-b.mp3",
    labelA: "わかりやすいメロディライン",
    labelB: "低音が効いたグルーヴ",
    scores: { A: { M: 1 }, B: { A: 1 } },
  },
  {
    id: 6,
    title: "音色嗜好",
    description: "どちらの音色が、より心地よく感じられますか？",
    audioA: "audio/q6-a.mp3",
    audioB: "audio/q6-b.mp3",
    labelA: "柔らかく温かみのある音色",
    labelB: "鋭く張りのある音色",
    scores: { A: { L: 1 }, B: { H: 1 } },
  },
];

/* ========================================
   16タイプ結果データ
   ======================================== */
const TYPE_RESULTS = {
  MSHE: {
    name: "煌めくメロディ・エナジー",
    traits: "明瞭なメロディと安定した和声に、高いエネルギーを求めるタイプです。複雑さよりも即座の快感を重視し、キャッチーな旋律に心が動きやすい傾向があります。",
    genres: "J-Pop、シティポップ、フュージョン、明るいロック",
    listening: "通勤・作業中の BGM として、テンポの良いプレイリストをシャッフル再生すると心地よさを感じやすいです。",
  },
  MSHD: {
    name: "叙情の探究メロディスト",
    traits: "メロディの美しさを軸にしながら、安定した土台の上で複雑な感情の層を味わいたいタイプです。一度聴いただけでは足りず、歌詞や編曲の細部まで掘り下げる傾向があります。",
    genres: "バラード、シンフォニック・ポップ、映画音楽、プログレッシブ・ポップ",
    listening: "イヤホンで集中して聴き、歌詞と旋律の関係を意識すると深い満足感が得られます。",
  },
  MSLE: {
    name: "穏やかなメロディの住人",
    traits: "はっきりした旋律と安定した響きを好みつつ、過度な刺激は避けるタイプです。シンプルで理解しやすい音楽から、安心感と心地よさを得やすい傾向があります。",
    genres: "アコースティック、フォーク、ソフトロック、ニューエイジ",
    listening: "静かな環境で音量を控えめに。同じ曲を繰り返すことで、メロディの輪郭がより愛おしく感じられます。",
  },
  MSLD: {
    name: "静かな旋律の詩人",
    traits: "穏やかな刺激の中で、メロディの繊細な変化や深い意味を探るタイプです。表面的なキャッチーさより、内側に潜む物語性に惹かれやすい傾向があります。",
    genres: "インディーフォーク、ミニマル、クラシックの室内楽、詩的なポップ",
    listening: "夜間に一曲ずつ丁寧に聴く「深掘りセッション」が最適。歌詞や楽器の対話に意識を向けてみてください。",
  },
  MSUE: {
    name: "スリルのメロディハンター",
    traits: "予測できない展開の中でも、メロディの輪郭を追いかける快感を覚えるタイプです。安定と意外性のバランスの中で、新鮮さと即時の楽しさを両立させたい傾向があります。",
    genres: "エクスペリメンタル・ポップ、ネオソウル、ジャズフュージョン",
    listening: "新譜の発見プレイリストを定期的に更新し、未知のアーティストとの出会いを楽しむと刺激が続きます。",
  },
  MSUD: {
    name: "革新メロディの探求者",
    traits: "メロディを軸にしながら、予測不能な和声や展開に深い知的好奇心を向けるタイプです。複雑さそのものが快感の源になりやすい傾向があります。",
    genres: "アヴァンギャルド・ポップ、現代音楽、ポストロック、実験的Jazz",
    listening: "ライブ音源やアーティストの解説付きコンテンツと一緒に聴くと、音楽の意図がより立体的に理解できます。",
  },
  MULE: {
    name: "軽やかな旋律の冒険者",
    traits: "メロディの意外性を楽しみつつ、穏やかな刺激で心地よさを保ちたいタイプです。奇抜さの中にも親しみやすさを求めるバランス感覚を持っています。",
    genres: "インディーポップ、チルウェーブ、エレクトロニカ、レトロフューチャー",
    listening: "カフェや散歩中など、リラックスした場面で新しい曲を試すと、意外な旋律との出会いが心地よく感じられます。",
  },
  MULD: {
    name: "微細変化のメロディ鑑賞家",
    traits: "穏やかな音量域の中で、メロディの微妙な揺らぎや不協和から調和への移行を味わうタイプです。静かな中にある「違和感の美学」に惹かれやすい傾向があります。",
    genres: "ポストミニマル、現代クラシック、アンビエント・ポップ、実験フォーク",
    listening: "高品質なオーディオ環境で、同じ曲を異なる音量・時間帯で聴き比べると新たな発見があります。",
  },
  ASHE: {
    name: "音響の王道を浴びる者",
    traits: "メロディよりも音の空間・質感・残響に快感を覚えるタイプです。安定した音響設計の中で、即座に包まれるような体験を好む傾向があります。",
    genres: "アンビエント、ドリームポップ、シネマティック、チルアウト",
    listening: "スピーカーで部屋全体を音で満たす聴き方が最適。視覚情報を減らすと音響の立体感がより際立ちます。",
  },
  ASHD: {
    name: "深層サウンドの潜水者",
    traits: "音響・雰囲気を軸に、複雑なレイヤー構造を時間をかけて解読するタイプです。一聴で理解できる音より、何度も聴くほど深まる音に価値を感じやすい傾向があります。",
    genres: "ドローン、ポストロック、ショウゲイジング、サウンドスケープ",
    listening: "暗室で目を閉じ、音の層が重なっていく過程を意識的に追う「瞑想的リスニング」が向いています。",
  },
  ASLE: {
    name: "穏やかな音景の旅人",
    traits: "音の空気感や質感を愛し、低刺激で安定した響きに安らぎを覚えるタイプです。メロディの有無より、全体のトーンや空間の広がりを重視する傾向があります。",
    genres: "アンビエント、ローファイ、ネイチャーサウンド、ミニマル・テクノ",
    listening: "読書・瞑想・就寝前など、背景として音を溶け込ませる聴き方が最も心地よいです。",
  },
  ASLD: {
    name: "静寂のアンビエント詩人",
    traits: "穏やかな音響の中に潜む微細な変化や意味を、時間をかけて紐解くタイプです。静けさの中の「音の存在」そのものに深い共鳴を覚えやすい傾向があります。",
    genres: "ミニマル・アンビエント、現代音楽、フィールドレコーディング、ネオクラシカル",
    listening: "早朝や深夜など、外界のノイズが少ない時間帯に一アルバムを通して聴くと、音の詩情がより鮮明に感じられます。",
  },
  ASUE: {
    name: "予測不能サウンドの冒険者",
    traits: "音響の意外性と高いエネルギーを同時に楽しむタイプです。メロディよりもテクスチャー・空間・ノイズの変化に心が動き、新しい音響体験を求める傾向があります。",
    genres: "グリッチ、IDM、エクスペリメンタル・エレクトロニカ、ノイズポップ",
    listening: "ライブパフォーマンスやビジュアル付きの音楽体験と組み合わせると、音響の意外性がより立体的に楽しめます。",
  },
  ASUD: {
    name: "混沌から美を見出す者",
    traits: "不安定で複雑な音響の中から、独自の秩序や美を発見する快感を覚えるタイプです。理解に時間がかかる音ほど、深掘りする価値を感じやすい傾向があります。",
    genres: "アヴァン-garde、フリージャズ、インダストリアル、コンクリート・ミュージック",
    listening: "アーティストのインタビューや解説を読んだ上で再聴すると、音響の意図が見えてくる深い体験が得られます。",
  },
  AULE: {
    name: "軽やかな音の遊び心",
    traits: "音響・雰囲気を楽しみつつ、穏やかな刺激でリラックスした状態を保ちたいタイプです。奇抜な音色も、過度な攻撃性がなければ心地よく受け入れやすい傾向があります。",
    genres: "チルホップ、ボサノバ・エレクトロニカ、ネオソウル、ローファイビート",
    listening: "作業BGMとしてループ再生し、音の質感が作業リズムに自然に溶け込む状態を作ると心地よさが続きます。",
  },
  AULD: {
    name: "繊細響きの深層ダイバー",
    traits: "低刺激の音響空間の中で、微細なテクスチャーの変化や音の「間」を深く味わうタイプです。静かな中の複雑さに、最も深い音楽的満足を覚えやすい傾向があります。",
    genres: "マイクロサウンド、ポストミニマル、現代クラシック、エレクトロアコースティック",
    listening: "高品質イヤホンで微音量設定。音の粒一つ一つを意識する「顕微鏡的リスニング」がこのタイプの強みを活かせます。",
  },
};

/* 診断軸の表示ラベル */
const AXIS_LABELS = {
  M: "Melody（メロディ重視）",
  A: "Atmosphere（音響・雰囲気重視）",
  S: "Stable（王道・安定）",
  U: "Unexpected（意外性・不安定）",
  H: "High stimulation（高刺激耐性）",
  L: "Low stimulation（低刺激嗜好）",
  E: "Easy（単純明快）",
  D: "Deep（複雑・深掘り）",
};

/* ========================================
   アプリ状態
   ======================================== */
const state = {
  currentQuestionIndex: 0,
  scores: { M: 0, A: 0, S: 0, U: 0, H: 0, L: 0, E: 0, D: 0 },
  isAnswering: false,
  answers: [],
};

/* ========================================
   DOM 要素
   ======================================== */
const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const elements = {
  btnStart: document.getElementById("btn-start"),
  btnBack: document.getElementById("btn-back"),
  btnRetry: document.getElementById("btn-retry"),
  quizStep: document.getElementById("quiz-step"),
  quizTitle: document.getElementById("quiz-title"),
  quizDesc: document.getElementById("quiz-desc"),
  progressBar: document.getElementById("progress-bar"),
  progressFill: document.getElementById("progress-fill"),
  audioNameA: document.getElementById("audio-name-a"),
  audioNameB: document.getElementById("audio-name-b"),
  audioCardA: document.getElementById("audio-card-a"),
  audioCardB: document.getElementById("audio-card-b"),
  btnPlayA: document.getElementById("btn-play-a"),
  btnPlayB: document.getElementById("btn-play-b"),
  btnChooseA: document.getElementById("btn-choose-a"),
  btnChooseB: document.getElementById("btn-choose-b"),
  choiceRow: document.getElementById("choice-row"),
  btnShowResult: document.getElementById("btn-show-result"),
  audioA: document.getElementById("audio-a"),
  audioB: document.getElementById("audio-b"),
  resultType: document.getElementById("result-type"),
  resultName: document.getElementById("result-name"),
  resultTraits: document.getElementById("result-traits"),
  resultGenres: document.getElementById("result-genres"),
  resultListening: document.getElementById("result-listening"),
  axisList: document.getElementById("axis-list"),
};

/* ========================================
   画面切り替え
   ======================================== */
function showScreen(screenName) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("is-active");
    screen.setAttribute("hidden", "");
  });

  const target = screens[screenName];
  target.removeAttribute("hidden");
  target.classList.add("is-active");
}

/* ========================================
   診断リセット
   ======================================== */
function resetQuiz() {
  state.currentQuestionIndex = 0;
  state.scores = { M: 0, A: 0, S: 0, U: 0, H: 0, L: 0, E: 0, D: 0 };
  state.isAnswering = false;
  state.answers = [];
  hideQuizComplete();
  stopAllAudio();
}

/* ========================================
   進捗バー更新
   ======================================== */
function updateProgress() {
  const total = QUESTIONS.length;
  const current = state.currentQuestionIndex;
  const percent = Math.round((current / total) * 100);

  elements.progressFill.style.width = `${percent}%`;
  elements.progressBar.setAttribute("aria-valuenow", String(percent));
  elements.quizStep.textContent = `Q${current + 1} / ${total}`;
}

/* ========================================
   質問表示
   ======================================== */
function applyAudioLoopSetting(audio) {
  audio.loop = false;

  if (audio.readyState >= 1) {
    audio.loop = Number.isFinite(audio.duration) && audio.duration < 5;
    return;
  }

  audio.addEventListener(
    "loadedmetadata",
    () => {
      audio.loop = Number.isFinite(audio.duration) && audio.duration < 5;
    },
    { once: true }
  );
}

function hideQuizComplete() {
  elements.btnChooseA.hidden = false;
  elements.btnChooseB.hidden = false;
  elements.btnShowResult.hidden = true;
  elements.btnShowResult.classList.add("is-hidden");
}

function showQuizComplete() {
  elements.btnChooseA.hidden = true;
  elements.btnChooseB.hidden = true;
  elements.btnShowResult.hidden = false;
  elements.btnShowResult.classList.remove("is-hidden");
  elements.quizStep.textContent = `完了 / ${QUESTIONS.length}`;
  elements.progressFill.style.width = "100%";
  elements.progressBar.setAttribute("aria-valuenow", "100");
}

function renderQuestion() {
  hideQuizComplete();

  const question = QUESTIONS[state.currentQuestionIndex];
  if (!question) return;

  elements.quizTitle.textContent = question.title;
  elements.quizDesc.textContent = question.description;
  elements.audioNameA.textContent = question.labelA;
  elements.audioNameB.textContent = question.labelB;

  elements.audioA.src = question.audioA;
  elements.audioB.src = question.audioB;
  applyAudioLoopSetting(elements.audioA);
  applyAudioLoopSetting(elements.audioB);
  elements.audioA.load();
  elements.audioB.load();

  stopAllAudio();
  updateProgress();
}

/* ========================================
   音声再生制御
   ======================================== */
function resetAudioPosition(audio) {
  audio.pause();
  if (audio.readyState < 1) return;

  try {
    audio.currentTime = 0;
  } catch {
    // メタデータ未読み込み時の seek エラーを無視
  }
}

function stopAllAudio() {
  [elements.audioA, elements.audioB].forEach(resetAudioPosition);
  resetPlayButtons();
}

function resetPlayButtons() {
  elements.btnPlayA.classList.remove("is-playing");
  elements.btnPlayB.classList.remove("is-playing");
  elements.btnPlayA.querySelector(".btn__text").textContent = "再生";
  elements.btnPlayB.querySelector(".btn__text").textContent = "再生";
  elements.btnPlayA.querySelector(".btn__icon").textContent = "▶";
  elements.btnPlayB.querySelector(".btn__icon").textContent = "▶";
  elements.audioCardA.classList.remove("is-active");
  elements.audioCardB.classList.remove("is-active", "is-active-b");
}

function togglePlay(side) {
  const isA = side === "A";
  const targetAudio = isA ? elements.audioA : elements.audioB;
  const otherAudio = isA ? elements.audioB : elements.audioA;
  const targetBtn = isA ? elements.btnPlayA : elements.btnPlayB;
  const targetCard = isA ? elements.audioCardA : elements.audioCardB;

  // もう一方の音源を停止
  resetAudioPosition(otherAudio);
  elements.btnPlayA.classList.remove("is-playing");
  elements.btnPlayB.classList.remove("is-playing");
  elements.audioCardA.classList.remove("is-active");
  elements.audioCardB.classList.remove("is-active", "is-active-b");

  if (targetAudio.paused) {
    targetAudio
      .play()
      .then(() => {
        targetBtn.classList.add("is-playing");
        targetBtn.querySelector(".btn__text").textContent = "再生中";
        targetBtn.querySelector(".btn__icon").textContent = "♪";
        targetCard.classList.add(isA ? "is-active" : "is-active-b");
      })
      .catch(() => {
        resetPlayButtons();
        targetBtn.querySelector(".btn__text").textContent = "再生できません";
      });
  } else {
    targetAudio.pause();
    resetPlayButtons();
  }
}

function setupAudioEvents() {
  const pairs = [
    { audio: elements.audioA, side: "A" },
    { audio: elements.audioB, side: "B" },
  ];

  pairs.forEach(({ audio }) => {
    // 短い効果音はループ再生、曲は終了時にボタンをリセット
    audio.addEventListener("ended", () => {
      if (!audio.loop) {
        resetPlayButtons();
      }
    });
  });
}

/* ========================================
   回答処理
   ======================================== */
function addScore(scoreMap) {
  Object.entries(scoreMap).forEach(([key, value]) => {
    state.scores[key] += value;
  });
}

function handleAnswer(choice) {
  if (state.currentQuestionIndex >= QUESTIONS.length) {
    showQuizComplete();
    return;
  }
  if (state.isAnswering) return;

  state.isAnswering = true;

  try {
    const question = QUESTIONS[state.currentQuestionIndex];
    if (!question) return;

    const scoreMap = question.scores[choice];

    addScore(scoreMap);
    state.answers.push(choice);
    state.currentQuestionIndex += 1;

    const finished = state.currentQuestionIndex >= QUESTIONS.length;

    stopAllAudio();

    if (finished) {
      showQuizComplete();
    } else {
      renderQuestion();
    }
  } finally {
    state.isAnswering = false;
  }
}

function goBack() {
  if (state.isAnswering) return;

  if (state.currentQuestionIndex === 0) {
    resetQuiz();
    showScreen("start");
    return;
  }

  if (state.currentQuestionIndex >= QUESTIONS.length) {
    hideQuizComplete();
  }

  state.currentQuestionIndex -= 1;
  const lastChoice = state.answers.pop();
  const scoreMap = QUESTIONS[state.currentQuestionIndex].scores[lastChoice];

  Object.entries(scoreMap).forEach(([key, value]) => {
    state.scores[key] -= value;
  });

  stopAllAudio();
  renderQuestion();
}

/* ========================================
   タイプ判定
   ======================================== */
function calculateTypeCode() {
  const { scores } = state;

  const axis1 = scores.M >= scores.A ? "M" : "A";
  const axis2 = scores.S >= scores.U ? "S" : "U";
  const axis3 = scores.H >= scores.L ? "H" : "L";
  const axis4 = scores.E >= scores.D ? "E" : "D";

  return axis1 + axis2 + axis3 + axis4;
}

/* ========================================
   結果表示
   ======================================== */
function showResult() {
  const typeCode = calculateTypeCode();
  const result = TYPE_RESULTS[typeCode] || TYPE_RESULTS.MSHE;

  elements.resultType.textContent = typeCode;
  elements.resultName.textContent = result.name;
  elements.resultTraits.textContent = result.traits;
  elements.resultGenres.textContent = result.genres;
  elements.resultListening.textContent = result.listening;

  renderAxisBreakdown(typeCode);
  showScreen("result");
}

function renderAxisBreakdown(typeCode) {
  const axes = [
    { pair: ["M", "A"], chosen: typeCode[0] },
    { pair: ["S", "U"], chosen: typeCode[1] },
    { pair: ["H", "L"], chosen: typeCode[2] },
    { pair: ["E", "D"], chosen: typeCode[3] },
  ];

  elements.axisList.innerHTML = axes
    .map(({ pair, chosen }) => {
      const label = AXIS_LABELS[chosen];
      return `<li><strong>${chosen}</strong> — ${label}</li>`;
    })
    .join("");
}

/* ========================================
   イベント登録
   ======================================== */
function bindEvents() {
  elements.btnStart.addEventListener("click", () => {
    resetQuiz();
    renderQuestion();
    showScreen("quiz");
  });

  elements.btnRetry.addEventListener("click", () => {
    resetQuiz();
    showScreen("start");
  });

  elements.btnBack.addEventListener("click", goBack);

  elements.btnPlayA.addEventListener("click", () => togglePlay("A"));
  elements.btnPlayB.addEventListener("click", () => togglePlay("B"));

  elements.btnChooseA.addEventListener("click", () => handleAnswer("A"));
  elements.btnChooseB.addEventListener("click", () => handleAnswer("B"));
  elements.btnShowResult.addEventListener("click", showResult);
}

/* ========================================
   初期化
   ======================================== */
function init() {
  bindEvents();
  setupAudioEvents();
  hideQuizComplete();
  showScreen("start");
}

init();
