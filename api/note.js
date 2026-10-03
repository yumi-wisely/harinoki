// Vercel Serverless Function: note の RSS を取得して、サイトで使いやすい JSON にして返す
// (note の RSS はブラウザから直接読めないため、サーバー側で中継します)

const FEED_URL = 'https://note.com/harinoki/rss';
const MAX_ITEMS = 6;

function decode(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function pick(block, tag) {
  const m = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>'));
  return m ? decode(m[1]).trim() : '';
}

function pickThumbnail(block) {
  const attr = block.match(/<media:thumbnail[^>]*\burl="([^"]+)"/);
  if (attr) return decode(attr[1]);
  return pick(block, 'media:thumbnail');
}

function excerpt(html) {
  const text = html
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<a [^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 70 ? text.slice(0, 70) + '…' : text;
}

function parseItem(block) {
  return {
    title: pick(block, 'title'),
    link: pick(block, 'link'),
    date: pick(block, 'pubDate'),
    thumbnail: pickThumbnail(block),
    excerpt: excerpt(pick(block, 'description'))
  };
}

module.exports = async (req, res) => {
  try {
    const response = await fetch(FEED_URL, { headers: { 'User-Agent': 'harinoki-site' } });
    if (!response.ok) throw new Error('feed status ' + response.status);
    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, MAX_ITEMS)
      .map((m) => parseItem(m[1]))
      .filter((item) => item.title && item.link);

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    res.status(200).json({ items });
  } catch (err) {
    res.status(502).json({ items: [], error: 'feed unavailable' });
  }
};
