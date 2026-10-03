/* ==========================================================================
   note の記事を表示 — /api/note(api/note.js)から最新記事を取得し、
   お知らせと同じカード形式(横スクロール)で表示します
   ========================================================================== */

(function () {
  var grid = document.getElementById('noteGrid');
  if (!grid) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function formatDate(raw) {
    var d = new Date(raw);
    if (isNaN(d)) return '';
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '.' + m + '.' + day;
  }

  function showMessage(text) {
    grid.textContent = '';
    grid.appendChild(el('p', 'note-status', text));
  }

  function renderCard(item) {
    var card = el('a', 'news-card is-link');
    card.href = item.link;
    card.target = '_blank';
    card.rel = 'noopener';

    var head = el('div', 'news-card-head');
    var icon = el('img', 'news-card-icon');
    icon.alt = '';
    icon.loading = 'lazy';
    if (item.thumbnail && /^https:\/\//.test(item.thumbnail)) {
      icon.src = item.thumbnail;
    } else {
      icon.src = 'assets/symbol-transparent.png';
      icon.classList.add('is-default');
    }
    head.appendChild(icon);
    head.appendChild(el('span', 'news-date', formatDate(item.date)));
    card.appendChild(head);

    card.appendChild(el('h3', 'news-card-title', item.title));
    if (item.excerpt) card.appendChild(el('p', 'news-card-text is-clamp', item.excerpt));
    card.appendChild(el('span', 'news-card-more', 'noteで読む'));
    return card;
  }

  fetch('/api/note')
    .then(function (res) {
      if (!res.ok) throw new Error('status ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var items = (data.items || []).filter(function (item) {
        return item.link && /^https:\/\/note\.com\//.test(item.link);
      });
      if (!items.length) {
        showMessage('記事は準備中です。noteページもぜひご覧ください。');
        return;
      }
      grid.textContent = '';
      items.forEach(function (item) {
        grid.appendChild(renderCard(item));
      });
      window.HarinokiCarousel.init(grid, document.getElementById('notePrev'), document.getElementById('noteNext'));
    })
    .catch(function () {
      showMessage('記事を読み込めませんでした。noteページから直接ご覧ください。');
    });
})();
