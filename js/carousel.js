/* ==========================================================================
   横スクロール(カルーセル)の「← →」ボタン制御 — お知らせ・note で共通利用
   ========================================================================== */

window.HarinokiCarousel = {
  init: function (list, prev, next) {
    if (!list || !prev || !next) return;

    function step() {
      var card = list.querySelector('.news-card');
      return card ? card.getBoundingClientRect().width + 20 : list.clientWidth;
    }
    function update() {
      var max = list.scrollWidth - list.clientWidth;
      prev.disabled = list.scrollLeft <= 4;
      next.disabled = list.scrollLeft >= max - 4;
      prev.parentNode.hidden = max <= 4;
    }

    prev.addEventListener('click', function () { list.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { list.scrollBy({ left: step(), behavior: 'smooth' }); });
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
};
