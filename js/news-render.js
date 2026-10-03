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

  function render() {
    var list = document.getElementById('newsList');
    if (list) {
      latest.forEach(function (n) {
        var a = el('a', 'news-item');
        a.href = 'news.html#news-' + n.id;
        a.appendChild(el('span', 'news-date', n.date));
        a.appendChild(el('span', 'news-tag', n.tag));
        a.appendChild(el('span', 'news-title', n.title));
        list.appendChild(a);
      });
    }

    var track = document.getElementById('newsTickerTrack');
    if (track) {
      [false, true].forEach(function (isClone) {
        latest.forEach(function (n) {
          var a = el('a', 'news-ticker-item');
          a.href = 'news.html#news-' + n.id;
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
        wrap.appendChild(el('span', 'news-title', n.title));
        String(n.body || '').split('\n').forEach(function (para) {
          if (para) wrap.appendChild(el('p', 'news-body', para));
        });
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
