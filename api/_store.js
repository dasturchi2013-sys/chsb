/* =========================================
   EDUTEST — UMUMIY SAQLASH QATLAMI
   =========================================
   Vercel KV (Redis) o'rnatilgan bo'lsa — doimiy xotira.
   Bo'lmasa — in-memory (funksiya qayta yuklanganda
   standart savollarga qaytadi).

   Vercel KV ulash uchun (ixtiyoriy):
   Vercel dashboard -> Storage -> Create KV ->
   Connect -> env o'zgaruvchilar avtomatik qo'shiladi.
*/

const { createClient } = require('@vercel/kv');

const QUESTIONS_KEY = 'edutest_questions';
const RESULTS_KEY  = 'edutest_results';

const DEFAULT_QUESTIONS = require('../seed/questions.json');

function getKV() {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    return createClient({
      url: KV_REST_API_URL,
      token: KV_REST_API_TOKEN
    });
  }
  return null;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

let memory = {
  questions: clone(DEFAULT_QUESTIONS),
  results: []
};

async function getQuestions() {
  const kv = getKV();
  if (kv) {
    const saved = await kv.get(QUESTIONS_KEY);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    await kv.set(QUESTIONS_KEY, memory.questions);
    return clone(memory.questions);
  }
  return clone(memory.questions);
}

async function saveQuestion(item) {
  const kv = getKV();
  const list = await getQuestions();
  const index = list.findIndex(q => q.id === item.id);
  if (index !== -1) {
    list[index] = item;
  } else {
    list.push(item);
  }
  if (kv) {
    await kv.set(QUESTIONS_KEY, list);
  } else {
    memory.questions = list;
  }
  return clone(list);
}

async function deleteQuestion(id) {
  const kv = getKV();
  const list = await getQuestions();
  const after = list.filter(q => q.id !== id);
  if (kv) {
    await kv.set(QUESTIONS_KEY, after);
  } else {
    memory.questions = after;
  }
  return clone(after);
}

async function addResult(resultItem) {
  const kv = getKV();
  if (kv) {
    const list = (await kv.get(RESULTS_KEY)) || [];
    list.push(resultItem);
    await kv.set(RESULTS_KEY, list.slice(-500));
    return;
  }
  memory.results.push(resultItem);
  memory.results = memory.results.slice(-500);
}

async function getResults() {
  const kv = getKV();
  if (kv) {
    return (await kv.get(RESULTS_KEY)) || [];
  }
  return clone(memory.results);
}

module.exports = {
  getQuestions,
  saveQuestion,
  deleteQuestion,
  addResult,
  getResults,
  getKV
};