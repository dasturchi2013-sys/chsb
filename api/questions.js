/* =========================================
   EDUTEST — /api/questions endpoint
   =========================================
   GET    -> barcha savollar ro'yxati
   POST   -> savol qo'shish / yangilash
   DELETE -> savol o'chirish (?id=...)
*/

const {
  getQuestions,
  saveQuestion,
  deleteQuestion
} = require('./_store');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const list = await getQuestions();
      return res.status(200).json(list);
    }

    if (req.method === 'POST') {
      const body = req.body || {};

      const grade = String(body.grade || '5');
      const quarter = String(body.quarter || '1');
      const subject = String(body.subject || 'math');
      const question = String(body.q || '').trim();
      const answer = String(body.a || '').trim();
      const options = Array.isArray(body.options)
        ? body.options.map(o => String(o))
        : [];

      if (!question || !answer || options.length < 2) {
        return res.status(400).json({
          error: "Savol, to'g'ri javob va kamida 2 ta variant kerak."
        });
      }

      const item = {
        id: body.id || ('custom_' + Date.now()),
        grade,
        quarter,
        subject,
        q: question,
        a: answer,
        options
      };

      await saveQuestion(item);

      return res.status(200).json({ ok: true, question: item });
    }

    if (req.method === 'DELETE') {
      const id =
        (req.query && req.query.id) ||
        (req.body && req.body.id) ||
        null;

      if (!id) {
        return res.status(400).json({ error: 'id kerak' });
      }

      await deleteQuestion(String(id));

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server xatosi' });
  }
};