export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const geo = req.query.geo || 'ID';
  const url = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TrendBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) throw new Error(`Google Trends error: ${response.status}`);

    const xml = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=1800'); // cache 30 menit
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
