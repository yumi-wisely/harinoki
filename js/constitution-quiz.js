/* ==========================================================================
   HARINOKI / 鍼ノ木 — 東洋医学 体質チェック ウィジェット
   constitution-quiz.js

   東洋医学(中医学)の考え方をもとにした8つの体質タイプについて、
   16の質問(各タイプ2問)に4段階で回答いただき、傾向の強いタイプを
   ご案内する簡易セルフチェックです。医学的診断ではありません。
   ========================================================================== */

(function () {

  /* ---------------------------------------------------------------------
     アイコン(インラインSVG文字列。サイト全体のアイコンと同じ線画スタイル)
     --------------------------------------------------------------------- */
  var ICONS = {
    header: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c-4 3-6 6-6 10a6 6 0 0 0 12 0c0-4-2-7-6-10z"/></svg>',
    intro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    kikyo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3c-3 3-5 6-5 9a5 5 0 0 0 10 0c0-3-2-6-5-9z" opacity=".55"/><path d="M12 22v-6"/></svg>',
    kekkyo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" stroke-dasharray="2 2"/></svg>',
    inkyo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>',
    youkyo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M8 3.5 12 7l4-3.5M8 20.5 12 17l4 3.5M2.5 9 7 12l-4.5 3M21.5 9 17 12l4.5 3"/></svg>',
    kitai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 8c4-3 8 2 12-1M3 13c4-3 8 2 12-1M3 18c4-3 8 2 10-1"/></svg>',
    oketsu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/><path d="M8 15h8"/></svg>',
    tanshitsu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 18a4 4 0 0 1-1-7.9A5 5 0 0 1 14.9 8 4.5 4.5 0 0 1 17 17H6z"/><path d="M9 21v-1M13 21v-1"/></svg>',
    yousei: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/></svg>',
    heiwa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="8"/><path d="M9 12a3 3 0 0 1 6 0"/><circle cx="12" cy="12" r="1"/></svg>'
  };

  /* ---------------------------------------------------------------------
     8つの体質タイプ定義
     --------------------------------------------------------------------- */
  var TYPES = {
    kikyo: {
      name: '気虚', kana: 'ききょ・エネルギー不足タイプ',
      icon: ICONS.kikyo,
      desc: '活動のもとになる「気」が不足しがちな体質です。頑張り屋さんで、無理を重ねやすい傾向があります。まずはしっかり休み、少しずつ体力を底上げしていくことが巡りへの近道です。',
      effects: [
        '足三里(あしさんり)など気を補うツボへの施術で、体力・免疫力の底上げ',
        '胃腸の働きを整え、食欲不振や消化力の低下をサポート',
        '慢性的な疲労感・息切れ・風邪をひきやすい体質の改善'
      ],
      menu: '全身鍼灸コース、初回カウンセリング+全身鍼灸'
    },
    kekkyo: {
      name: '血虚', kana: 'けっきょ・うるおい&栄養不足タイプ',
      icon: ICONS.kekkyo,
      desc: '体を栄養する「血」が不足しがちな体質です。特に女性に多く見られ、顔色や髪・爪のツヤ、睡眠の質に影響が出やすい傾向があります。',
      effects: [
        '血を補うツボへの施術で、顔色・髪や爪のコンディションをサポート',
        '眼精疲労やめまい、立ちくらみの緩和',
        '月経周期の安定、睡眠の質の向上をサポート'
      ],
      menu: '美容鍼灸コース、鍼灸+温灸コース'
    },
    inkyo: {
      name: '陰虚', kana: 'いんきょ・うるおい枯渇タイプ',
      icon: ICONS.inkyo,
      desc: '体内の「うるおい」が不足し、相対的に熱がこもりやすい体質です。乾燥やほてり、寝汗などが気になる方に多く見られます。',
      effects: [
        'うるおいを補いながら、こもった熱を鎮めるツボへの施術',
        '肌や喉・目の乾燥感、ほてり・のぼせの緩和',
        '寝汗や微熱感、睡眠の質の改善をサポート'
      ],
      menu: '美容鍼灸コース'
    },
    youkyo: {
      name: '陽虚', kana: 'ようきょ・冷え&生成力不足タイプ',
      icon: ICONS.youkyo,
      desc: '体を温める力(陽気)が不足しがちな体質です。冷え性や寒がり、疲れやすさを感じやすい傾向があります。',
      effects: [
        'お灸を中心に、体を内側からじんわり温める施術',
        '手足やお腹の冷え、むくみ、下痢しやすい体質の改善をサポート',
        '巡りを底上げし、だるさ・気力の低下を和らげる'
      ],
      menu: '鍼灸+温灸コース'
    },
    kitai: {
      name: '気滞', kana: 'きたい・ストレス&巡り滞りタイプ',
      icon: ICONS.kitai,
      desc: '気の巡りが滞りやすい体質です。ストレスの影響を受けやすく、イライラや気分の落ち込み、お腹や胸の張りを感じやすい傾向があります。',
      effects: [
        '気の巡りを整えるツボへの施術で、自律神経のバランスをサポート',
        'イライラ・気分の落ち込み、喉や胸のつかえ感の緩和',
        '月経前の不調やお腹の張りの軽減をサポート'
      ],
      menu: '全身鍼灸コース'
    },
    oketsu: {
      name: '瘀血', kana: 'おけつ・血流停滞タイプ',
      icon: ICONS.oketsu,
      desc: '血の巡りが滞りやすい体質です。肩こりや頭痛、生理痛など「痛み」の症状や、くすみ・クマとして現れやすい傾向があります。',
      effects: [
        '血の巡りを促すツボへの施術で、肩こり・頭痛・生理痛の緩和',
        'くすみやクマ、シミなど肌のコンディションをサポート',
        '冷えのぼせなど、巡りの乱れによる不調の軽減'
      ],
      menu: '美容鍼灸+全身調整コース、骨盤調整'
    },
    tanshitsu: {
      name: '痰湿', kana: 'たんしつ・水分&老廃物停滞タイプ',
      icon: ICONS.tanshitsu,
      desc: '余分な水分や老廃物が体に停滞しやすい体質です。体の重だるさ、むくみ、胃もたれを感じやすい傾向があります。',
      effects: [
        '余分な水分の代謝を促すツボへの施術で、むくみ・重だるさの軽減',
        '胃腸機能をサポートし、胃もたれ・消化不良の緩和',
        '巡りを促し、すっきりとした体づくりをサポート'
      ],
      menu: '全身鍼灸コース、鍼灸+温灸コース'
    },
    yousei: {
      name: '陽盛', kana: 'ようせい・熱こもりタイプ',
      icon: ICONS.yousei,
      desc: '体に余分な熱がこもりやすい体質です。暑がり、のぼせ、肌トラブルが出やすく、気持ちが昂りやすい傾向があります。',
      effects: [
        'こもった熱を発散させるツボへの施術で、のぼせ・ほてりの緩和',
        'ニキビや吹き出物など肌トラブルのケアをサポート',
        '気持ちの昂りを落ち着け、リラックスできる状態へ導く'
      ],
      menu: '美容鍼灸コース'
    },
    heiwa: {
      name: '平和質', kana: 'へいわしつ・バランス良好タイプ',
      icon: ICONS.heiwa,
      desc: '今回のチェックでは、特定の体質への強い偏りは見られませんでした。心とからだのバランスが取れている、東洋医学でいう「平和質」に近い状態です。この巡りの良さを保つケアとして、鍼灸を活用いただくのもおすすめです。',
      effects: [
        '今の巡りの良い状態を維持するための、メンテナンス目的の施術',
        '季節の変わり目や環境の変化による、体調の揺らぎを予防',
        '心身のリラックス、日々のコンディション調整'
      ],
      menu: '全身鍼灸コース(メンテナンス目的)'
    }
  };

  /* ---------------------------------------------------------------------
     質問(全16問・各タイプ2問ずつ、タイプが連続しないよう配置)
     --------------------------------------------------------------------- */
  var QUESTIONS = [
    { type: 'kikyo',     text: '階段や坂道で、人より先に息切れ・疲労を感じやすい' },
    { type: 'kekkyo',    text: '顔色が悪い、血色が良くないと言われることがある' },
    { type: 'inkyo',     text: '夕方から夜にかけて、手足や顔がほてる感じがある' },
    { type: 'youkyo',    text: '手足やお腹が冷えやすく、夏でも冷房が苦手' },
    { type: 'kitai',     text: '何となく気分が晴れず、ため息をつくことが多い' },
    { type: 'oketsu',    text: '肩こりや頭痛が慢性的にある' },
    { type: 'tanshitsu', text: '体が重だるく、むくみやすいと感じる' },
    { type: 'yousei',    text: '顔がほてったり、赤くなったりしやすい' },
    { type: 'kikyo',     text: '朝起きても疲れが取れていないと感じることが多い' },
    { type: 'kekkyo',    text: '立ちくらみやめまいを感じやすく、髪や爪がもろい' },
    { type: 'inkyo',     text: '肌や喉、目の乾燥が気になり、寝汗をかくことがある' },
    { type: 'youkyo',    text: '冷たい飲み物や食べ物でお腹をこわしやすい' },
    { type: 'kitai',     text: '喉や胸につかえる感じ、お腹の張りを感じやすい' },
    { type: 'oketsu',    text: '生理痛が重い、または経血に塊が混じることがある(該当しない方は「いいえ」)' },
    { type: 'tanshitsu', text: '胃もたれや消化不良を感じやすく、脂っこいものが苦手' },
    { type: 'yousei',    text: 'ニキビや吹き出物、口内炎ができやすい' }
  ];

  var ANSWER_OPTIONS = [
    { label: 'いいえ',   value: 0 },
    { label: 'たまにある', value: 1 },
    { label: 'よくある',  value: 2 },
    { label: 'いつもそう', value: 3 }
  ];

  /* ---------------------------------------------------------------------
     状態管理
     --------------------------------------------------------------------- */
  var state = { qIndex: 0, answers: new Array(QUESTIONS.length).fill(null) };

  var root, fab, panel, body;

  function byId(id) { return document.getElementById(id); }

  function resetState() {
    state.qIndex = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
  }

  /* ---------------------------------------------------------------------
     画面レンダリング
     --------------------------------------------------------------------- */

  function renderIntro() {
    var typeChips = Object.keys(TYPES)
      .filter(function (k) { return k !== 'heiwa'; })
      .map(function (k) { return '<span class="cq-type-chip">' + TYPES[k].name + '</span>'; })
      .join('');

    body.innerHTML =
      '<div class="cq-screen is-active cq-intro">' +
        '<div class="cq-intro-icon">' + ICONS.intro + '</div>' +
        '<h3>あなたの東洋医学的<br>体質タイプをチェック</h3>' +
        '<p>東洋医学(中医学)では、体質は大きく8つのタイプに分けられると考えられています。全16問の質問にお答えいただくと、あなたの傾向と、鍼灸で期待できる効果の目安をご案内します。</p>' +
        '<div class="cq-intro-meta">' +
          '<span>' + ICONS.clock + '所要時間 約2分</span>' +
          '<span>' + ICONS.list + '全16問</span>' +
        '</div>' +
        '<div class="cq-types-preview">' + typeChips + '</div>' +
        '<button type="button" class="cq-btn cq-btn-primary" id="cqStart">チェックをはじめる</button>' +
        '<p class="cq-disclaimer">※ 本チェックは東洋医学の考え方に基づく簡易的な体質傾向の目安であり、医学的な診断ではありません。気になる症状がある場合は、医療機関にご相談ください。</p>' +
      '</div>';

    byId('cqStart').addEventListener('click', function () {
      resetState();
      renderQuestion(0);
    });
  }

  function renderQuestion(index) {
    state.qIndex = index;
    var q = QUESTIONS[index];
    var progress = Math.round((index / QUESTIONS.length) * 100);

    var answersHtml = ANSWER_OPTIONS.map(function (opt) {
      return '<button type="button" class="cq-answer-btn" data-value="' + opt.value + '">' +
        '<span>' + opt.label + '</span><span class="cq-answer-dot"></span></button>';
    }).join('');

    body.innerHTML =
      '<div class="cq-screen is-active cq-question">' +
        '<div class="cq-progress-track"><div class="cq-progress-fill" style="width:' + progress + '%"></div></div>' +
        '<span class="cq-progress-label">Q' + (index + 1) + ' / ' + QUESTIONS.length + '</span>' +
        '<p class="cq-question-text">' + q.text + '</p>' +
        '<div class="cq-answers">' + answersHtml + '</div>' +
        (index > 0 ? '<button type="button" class="cq-question-back" id="cqBack">&larr; 前の質問に戻る</button>' : '') +
      '</div>';

    var buttons = body.querySelectorAll('.cq-answer-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.answers[index] = parseInt(btn.getAttribute('data-value'), 10);
        if (index + 1 < QUESTIONS.length) {
          setTimeout(function () { renderQuestion(index + 1); }, 180);
        } else {
          setTimeout(function () { renderResult(); }, 180);
        }
      });
    });

    var backBtn = byId('cqBack');
    if (backBtn) {
      backBtn.addEventListener('click', function () { renderQuestion(index - 1); });
    }
  }

  function computeScores() {
    var scores = {};
    Object.keys(TYPES).forEach(function (k) { if (k !== 'heiwa') scores[k] = 0; });
    QUESTIONS.forEach(function (q, i) {
      var v = state.answers[i] || 0;
      scores[q.type] += v;
    });
    return scores;
  }

  function renderResult() {
    var scores = computeScores();
    var sorted = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    var topKey = sorted[0];
    var topScore = scores[topKey];
    var secondKey = sorted[1];
    var secondScore = scores[secondKey];

    var resultKey = topScore <= 2 ? 'heiwa' : topKey;
    var result = TYPES[resultKey];

    var secondaryHtml = '';
    if (resultKey !== 'heiwa' && secondScore >= topScore - 1 && secondScore >= 3) {
      secondaryHtml = '<div class="cq-result-secondary"><strong>' + TYPES[secondKey].name + '</strong>の傾向も見られます。あわせて意識してみてください。</div>';
    }

    var effectsHtml = result.effects.map(function (e) { return '<li>' + e + '</li>'; }).join('');

    body.innerHTML =
      '<div class="cq-screen is-active cq-result">' +
        '<div class="cq-result-badge">' +
          '<div class="cq-result-icon">' + result.icon + '</div>' +
          '<div>' +
            '<p class="cq-result-name">' + result.name + '</p>' +
            '<p class="cq-result-kana">' + result.kana + '</p>' +
          '</div>' +
        '</div>' +
        '<p class="cq-result-desc">' + result.desc + '</p>' +
        secondaryHtml +
        '<h4 class="cq-result-section-title">鍼灸で期待される効果</h4>' +
        '<ul class="cq-result-list">' + effectsHtml + '</ul>' +
        '<div class="cq-menu-hint"><strong>おすすめのメニュー：</strong><br>' + result.menu + '</div>' +
        '<div class="cq-result-actions">' +
          '<a href="#menu" class="cq-btn cq-btn-primary" id="cqGoMenu">おすすめメニューを見る</a>' +
          '<a href="#access" class="cq-btn cq-btn-outline" id="cqGoAccess">鍼灸師に相談する</a>' +
          '<button type="button" class="cq-btn-text" id="cqRestart">もう一度チェックする</button>' +
        '</div>' +
        '<p class="cq-disclaimer">※ 本チェックは東洋医学の考え方に基づく簡易的な体質傾向の目安であり、医学的な診断ではありません。</p>' +
      '</div>';

    ['cqGoMenu', 'cqGoAccess'].forEach(function (id) {
      var el = byId(id);
      if (el) el.addEventListener('click', function () { closePanel(); });
    });

    byId('cqRestart').addEventListener('click', function () {
      resetState();
      renderIntro();
    });
  }

  /* ---------------------------------------------------------------------
     パネルの開閉
     --------------------------------------------------------------------- */

  function openPanel() {
    panel.classList.add('is-open');
    fab.setAttribute('aria-expanded', 'true');
    if (!body.hasChildNodes() || body.dataset.cqInit !== 'done') {
      renderIntro();
      body.dataset.cqInit = 'done';
    }
  }

  function closePanel() {
    panel.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
  }

  /* ---------------------------------------------------------------------
     初期化: HTML構造を生成してbodyに追加
     --------------------------------------------------------------------- */

  function buildWidget() {
    var wrap = document.createElement('div');
    wrap.id = 'cqWidget';
    wrap.innerHTML =
      '<button type="button" class="cq-fab" id="cqFab" aria-expanded="false" aria-label="東洋医学 体質チェックを開く">' +
        '<span class="cq-fab-label">体質チェック</span>' +
        '<span class="cq-fab-btn">' +
          '<span class="cq-fab-ring"></span>' +
          ICONS.header +
        '</span>' +
      '</button>' +
      '<div class="cq-panel" id="cqPanel" role="dialog" aria-label="東洋医学 体質チェック">' +
        '<div class="cq-panel-header">' +
          '<span class="cq-panel-title">' + ICONS.header + '東洋医学 体質チェック</span>' +
          '<button type="button" class="cq-panel-close" id="cqClose" aria-label="閉じる">&times;</button>' +
        '</div>' +
        '<div class="cq-panel-body" id="cqBody"></div>' +
      '</div>';
    document.body.appendChild(wrap);

    fab = byId('cqFab');
    panel = byId('cqPanel');
    body = byId('cqBody');

    fab.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) { closePanel(); } else { openPanel(); }
    });
    byId('cqClose').addEventListener('click', closePanel);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

})();
