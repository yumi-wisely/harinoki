/* ==========================================================================
   お知らせの描画 — js/news-data.js のデータから各所を自動生成します
   (トップの一覧 / ヘッダーのティッカー / news.html の全件一覧)
   ========================================================================== */

(function () {
  var items = (window.NEWS_ITEMS || []).slice().sort(function (a, b) {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.id - a.id;
  });
  var latest = items.slice(0, 3);

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function setupCarousel(list) {
    window.HarinokiCarousel.init(list, document.getElementById('newsPrev'), document.getElementById('newsNext'));

    // #news-N で指定されたカードが見える位置まで、横にも動かす
    function jumpToHash() {
      var card = location.hash && list.querySelector(location.hash);
      if (!card || !card.classList.contains('news-card')) return;
      var offset = card.getBoundingClientRect().left - list.getBoundingClientRect().left;
      list.scrollTo({ left: list.scrollLeft + offset, behavior: 'auto' });
      // 縦位置はブラウザ任せだと固定ヘッダーに被るため、お知らせ全体が見える位置に合わせる
      setTimeout(function () {
        var top = list.parentNode.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }, 60);
    }
    jumpToHash();
    window.addEventListener('load', function () { setTimeout(jumpToHash, 100); });
    window.addEventListener('hashchange', jumpToHash);
  }

  function render() {
    var list = document.getElementById('newsList');
    if (list) {
      latest.forEach(function (n) {
        var card = el('article', 'news-card');
        card.id = 'news-' + n.id;

        var head = el('div', 'news-card-head');
        var icon = el('img', 'news-card-icon');
        icon.alt = '';
        icon.loading = 'lazy';
        if (n.image) {
          icon.src = n.image;
        } else {
          icon.src = 'assets/symbol-transparent.png';
          icon.classList.add('is-default');
        }
        head.appendChild(icon);
        head.appendChild(el('span', 'news-date', n.date));
        card.appendChild(head);

        card.appendChild(el('h3', 'news-card-title', n.title));
        String(n.body || '').split('\n').forEach(function (para) {
          if (para) card.appendChild(el('p', 'news-card-text', para));
        });
        list.appendChild(card);
      });
      setupCarousel(list);
    }

    var track = document.getElementById('newsTickerTrack');
    if (track) {
      [false, true].forEach(function (isClone) {
        latest.forEach(function (n) {
          var a = el('a', 'news-ticker-item');
          a.href = '#news-' + n.id;
          if (isClone) {
            a.setAttribute('aria-hidden', 'true');
            a.tabIndex = -1;
          }
          a.appendChild(el('span', 'ticker-date', n.date));
          a.appendChild(el('span', 'ticker-title', n.title));
          track.appendChild(a);
        });
      });
    }

    var full = document.getElementById('newsFullList');
    if (full) {
      items.forEach(function (n) {
        var article = el('article', 'news-item');
        article.id = 'news-' + n.id;
        article.appendChild(el('span', 'news-date', n.date));
        article.appendChild(el('span', 'news-tag', n.tag));
        var wrap = el('div');
        var text = el('div', 'news-text');
        text.appendChild(el('span', 'news-title', n.title));
        String(n.body || '').split('\n').forEach(function (para) {
          if (para) text.appendChild(el('p', 'news-body', para));
        });
        if (n.image) {
          article.classList.add('has-photo');
          wrap.className = 'news-with-photo';
          var img = el('img', 'news-photo');
          img.src = n.image;
          img.alt = n.title;
          img.loading = 'lazy';
          wrap.appendChild(img);
        }
        wrap.appendChild(text);
        article.appendChild(wrap);
        full.appendChild(article);
      });

      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
      }
    }
  }

  render();
})();
