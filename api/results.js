/* =========================================
   EDUTEST — /api/results endpoint
   =========================================
   GET  -> natijalar ro'yxati
   POST -> yangi natija saqlash
*/

const {
  addResult,
  getResults
} = require('./_store');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const list = await getResults();
      return res.status(200).json(list);
    }

    if (req.method === 'POST') {
      const body = req.body || {};

      const item = {
        id: 'r_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
        studentName: String(body.studentName || body.name || 'Noma\'lum'),
        grade: String(body.grade || ''),
        subject: String(body.subject || ''),
        quarter: String(body.quarter || ''),
        correct: Number(body.correct) || 0,
        wrong: Number(body.wrong) || 0,
        total: Number(body.total) || 0,
        percent: Number(body.percent) || 0,
        date: new Date().toISOString()
      };

      await addResult(item);

      return res.status(200).json({ ok: true, result: item });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
};