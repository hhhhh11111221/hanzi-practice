"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const STROKE_NAMES = {
  heng: "横",
  shu: "竖",
  pie: "撇",
  na: "捺",
  dian: "点",
  zhe: "折",
  ti: "提",
  hengzhe: "横折",
  shugou: "竖钩",
  hengpie: "横撇",
  hengzhegou: "横折钩",
  shuwangou: "竖弯钩",
  shuzhe: "竖折",
  shuti: "竖提",
  henggou: "横钩",
  wogou: "卧钩",
  xiegou: "斜钩",
  wangou: "弯钩",
  hengzhewan: "横折弯",
  hengzheti: "横折提",
  piezhe: "撇折",
  shuzhepie: "竖折撇",
  hengzhewangou: "横折弯钩",
  hengxiegou: "横斜钩",
  shuzhezhegou: "竖折折钩",
  hengzhezhepie: "横折折撇"
};

const CORE_STROKES = {
  "一": { pinyin: "yī", strokes: ["heng"], paths: ["M90 208 C150 198 250 198 312 204"] },
  "二": { pinyin: "èr", strokes: ["heng", "heng"], paths: ["M116 158 C172 148 232 149 286 154", "M84 248 C160 238 246 238 318 244"] },
  "三": { pinyin: "sān", strokes: ["heng", "heng", "heng"], paths: ["M116 132 C168 124 232 124 282 130", "M106 198 C168 190 238 191 294 196", "M78 272 C152 260 254 260 326 268"] },
  "十": { pinyin: "shí", strokes: ["heng", "shu"], paths: ["M92 172 C160 162 244 162 312 170", "M202 78 C197 150 198 246 203 326"] },
  "人": { pinyin: "rén", strokes: ["pie", "na"], paths: ["M214 96 C198 158 165 235 92 310", "M206 142 C230 210 272 268 326 310"] },
  "口": { pinyin: "kǒu", strokes: ["shu", "hengzhe", "heng"], paths: ["M126 120 C118 178 120 244 126 294", "M128 118 C190 110 248 112 288 122 C284 178 282 244 276 294", "M128 294 C178 304 226 304 276 294"] },
  "日": { pinyin: "rì", strokes: ["shu", "hengzhe", "heng", "heng"], paths: ["M132 92 C124 158 124 246 132 320", "M134 94 C196 84 250 88 284 100 C282 168 280 250 274 318", "M132 202 C178 194 230 195 280 202", "M134 318 C180 326 226 326 274 318"] },
  "月": { pinyin: "yuè", strokes: ["pie", "hengzhe", "heng", "heng"], paths: ["M150 86 C148 178 136 260 94 324", "M154 88 C210 78 260 86 286 102 C286 184 282 266 270 326", "M148 180 C194 174 238 176 282 184", "M140 252 C190 246 234 248 276 254"] },
  "木": { pinyin: "mù", strokes: ["heng", "shu", "pie", "na"], paths: ["M88 166 C154 156 248 158 314 166", "M204 80 C198 160 198 244 204 326", "M194 178 C164 224 128 270 82 304", "M214 178 C248 234 286 278 328 306"] },
  "禾": { pinyin: "hé", strokes: ["pie", "heng", "shu", "pie", "na"], paths: ["M252 78 C210 96 168 110 118 118", "M88 166 C158 156 248 158 316 166", "M204 96 C198 170 198 250 204 326", "M194 178 C162 226 124 274 78 308", "M214 178 C248 236 286 280 330 308"] },
  "大": { pinyin: "dà", strokes: ["heng", "pie", "na"], paths: ["M92 164 C160 154 242 154 310 164", "M206 86 C198 176 160 258 82 318", "M210 168 C238 232 282 284 326 318"] },
  "小": { pinyin: "xiǎo", strokes: ["shu", "pie", "dian"], paths: ["M204 92 C198 168 198 246 204 318", "M166 184 C144 224 118 260 88 292", "M246 184 C270 220 294 252 320 286"] },
  "上": { pinyin: "shàng", strokes: ["shu", "heng", "heng"], paths: ["M200 94 C196 150 196 216 200 276", "M202 184 C246 178 286 180 316 186", "M92 284 C158 274 244 274 312 282"] },
  "下": { pinyin: "xià", strokes: ["heng", "shu", "dian"], paths: ["M84 112 C154 102 250 102 322 112", "M202 116 C198 184 198 258 204 324", "M216 196 C246 214 276 236 302 260"] },
  "山": { pinyin: "shān", strokes: ["shu", "shuzhe", "shu"], paths: ["M124 146 C120 202 120 258 126 300", "M204 82 C200 154 198 230 204 300 C158 302 116 302 84 296", "M286 140 C284 196 282 248 276 300"] },
  "水": { pinyin: "shuǐ", strokes: ["shugou", "hengpie", "pie", "na"], paths: ["M198 84 C196 160 198 238 204 312 C194 322 184 326 170 318", "M124 156 C154 166 174 180 192 202 C158 244 120 278 78 304", "M172 212 C146 240 122 266 94 292", "M218 166 C244 222 282 272 328 304"] },
  "火": { pinyin: "huǒ", strokes: ["dian", "pie", "pie", "na"], paths: ["M154 126 C138 154 126 178 116 202", "M248 112 C238 154 224 184 206 210", "M198 92 C202 186 164 268 82 320", "M206 214 C236 258 278 292 326 316"] },
  "田": { pinyin: "tián", strokes: ["shu", "hengzhe", "heng", "shu", "heng"], paths: ["M114 102 C108 172 110 244 118 318", "M116 100 C178 90 248 92 296 104 C294 178 292 250 286 318", "M116 204 C170 196 230 198 290 204", "M204 102 C198 168 198 246 204 318", "M118 318 C172 326 232 326 286 318"] },
  "云": { pinyin: "yún", strokes: ["heng", "heng", "piezhe", "dian"], paths: ["M124 126 C174 118 232 120 278 126", "M88 210 C158 200 244 202 318 210", "M202 208 C178 244 154 276 128 304 C176 300 222 294 270 286", "M264 246 C288 268 306 288 320 310"] },
  "手": { pinyin: "shǒu", strokes: ["pie", "heng", "heng", "shugou"], paths: ["M254 80 C210 96 164 108 112 116", "M96 162 C158 154 246 154 308 162", "M82 218 C154 208 256 208 328 216", "M202 112 C198 178 198 250 204 320 C190 330 174 328 158 316"] },
  "子": { pinyin: "zǐ", strokes: ["henggou", "shugou", "heng"], paths: ["M132 104 C190 94 248 98 288 108 C264 142 238 172 206 202", "M206 202 C202 246 204 286 206 320 C192 330 174 326 158 312", "M78 226 C150 216 258 216 330 226"] },
  "女": { pinyin: "nǚ", strokes: ["piezhe", "pie", "heng"], paths: ["M196 90 C174 154 152 214 124 276 C176 250 230 212 274 166", "M178 198 C222 238 268 276 322 306", "M82 246 C154 234 250 238 326 250"] },
  "好": { pinyin: "hǎo", strokes: ["piezhe", "pie", "ti", "henggou", "shugou", "heng"], paths: ["M108 104 C92 162 78 218 62 274 C100 254 138 226 166 184", "M98 202 C128 232 154 258 180 284", "M64 252 C104 244 142 238 178 230", "M224 104 C266 96 302 100 328 110 C306 138 280 166 252 194", "M252 194 C250 236 252 278 254 316 C242 326 228 324 214 312", "M196 226 C238 218 288 218 334 226"] },
  "学": { pinyin: "xué", strokes: ["dian", "dian", "pie", "dian", "henggou", "henggou", "shugou", "heng"], paths: ["M128 84 C142 104 154 124 162 148", "M202 76 C198 104 194 126 188 150", "M278 82 C260 110 242 132 222 154", "M88 152 C82 178 78 200 74 220", "M100 152 C160 144 246 144 306 154 C300 176 294 196 286 214", "M154 210 C202 202 248 204 282 212 C260 238 236 260 208 284", "M208 284 C208 304 206 322 204 338 C190 346 174 342 160 330", "M94 284 C156 274 250 274 318 284"] },
  "输": {
    pinyin: "shū",
    strokes: ["heng", "shuzhe", "shu", "ti", "pie", "na", "heng", "shu", "hengzhegou", "heng", "heng", "shu", "shugou"],
    paths: [
      "M58 136 C92 128 132 128 164 132",
      "M116 86 C106 138 96 186 90 224 C112 220 142 212 170 204",
      "M128 116 C122 186 118 264 116 336",
      "M58 276 C92 268 132 256 172 240",
      "M238 82 C222 126 198 164 174 194",
      "M250 98 C280 148 316 184 356 202",
      "M210 198 C246 190 300 190 334 196",
      "M218 220 C214 264 214 312 216 346",
      "M222 222 C250 218 276 220 292 228 C292 272 290 318 286 352 C276 362 266 358 256 346",
      "M220 268 C244 264 270 264 290 268",
      "M218 314 C244 310 268 310 286 314",
      "M318 235 C316 274 316 312 318 338",
      "M350 218 C356 266 356 326 350 356 C340 366 328 360 318 348"
    ],
    widths: [36, 38, 38, 36, 36, 38, 34, 34, 36, 28, 28, 26, 34]
  },
  "习": { pinyin: "xí", strokes: ["hengzhegou", "dian", "ti"], paths: ["M98 108 C164 98 244 100 300 112 C294 182 288 252 276 316 C258 326 238 320 220 304", "M138 166 C160 184 180 204 196 226", "M122 262 C170 248 212 232 254 210"] }
};

const LOW_GRADE_CHARS = "一二三四五六七八九十人口耳目手足站坐日月水火山石田禾木米竹马牛羊鸟虫云雨风花草天地上下左右东西南北大小多少来去出入开关男女子儿好学习语文数学学校老师同学朋友我们你他她它家国春夏秋冬早晚明亮白黑红黄蓝绿江河海湖村林森果苗叶口牙心力刀尺本书包笔画字词句课桌椅门窗衣车船飞跑跳走看听说读写问答爱爸妈爷奶哥姐弟妹";

function makeCurriculum() {
  const books = ["一年级上册", "一年级下册", "二年级上册", "二年级下册"];
  let cursor = 0;
  return books.map((book, bookIndex) => {
    const units = Array.from({ length: 4 }, (_, unitIndex) => {
      const lessons = Array.from({ length: 3 }, (_, lessonIndex) => {
        const chars = [...LOW_GRADE_CHARS].slice(cursor, cursor + 5);
        cursor = (cursor + 5) % LOW_GRADE_CHARS.length;
        return {
          id: `b${bookIndex + 1}u${unitIndex + 1}l${lessonIndex + 1}`,
          title: `第${lessonIndex + 1}课`,
          chars
        };
      });
      return { title: `第${unitIndex + 1}单元`, lessons };
    });
    return { title: book, units };
  });
}

const WORDS = [
  { text: "人口", pinyin: ["rén", "kǒu"] },
  { text: "大小", pinyin: ["dà", "xiǎo"] },
  { text: "上下", pinyin: ["shàng", "xià"] },
  { text: "山水", pinyin: ["shān", "shuǐ"] },
  { text: "学习", pinyin: ["xué", "xí"] },
  { text: "好人", pinyin: ["hǎo", "rén"] }
];

const DEFAULT_SETTINGS = {
  count: 5,
  mode: "mixed",
  practiceType: "stroke",
  strictness: "strict",
  animationSpeed: 1,
  sound: true
};

const db = {
  name: "hanzi-practice-db",
  version: 1,
  handle: null,
  open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.name, this.version);
      req.onupgradeneeded = () => {
        const storeNames = ["settings", "records", "mistakes", "customBanks"];
        storeNames.forEach((name) => {
          if (!req.result.objectStoreNames.contains(name)) req.result.createObjectStore(name, { keyPath: "id" });
        });
      };
      req.onsuccess = () => {
        this.handle = req.result;
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  },
  tx(store, mode = "readonly") {
    return this.handle.transaction(store, mode).objectStore(store);
  },
  get(store, id) {
    return new Promise((resolve, reject) => {
      const req = this.tx(store).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  put(store, value) {
    return new Promise((resolve, reject) => {
      const req = this.tx(store, "readwrite").put(value);
      req.onsuccess = () => resolve(value);
      req.onerror = () => reject(req.error);
    });
  },
  delete(store, id) {
    return new Promise((resolve, reject) => {
      const req = this.tx(store, "readwrite").delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
  all(store) {
    return new Promise((resolve, reject) => {
      const req = this.tx(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },
  clear(store) {
    return new Promise((resolve, reject) => {
      const req = this.tx(store, "readwrite").clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

const app = {
  view: "home",
  curriculum: makeCurriculum(),
  settings: { ...DEFAULT_SETTINGS },
  records: [],
  mistakes: [],
  customBanks: [],
  session: null,
  currentWriters: [],
  animation: null,
  strokeData: {},
  voices: []
};

const icons = {
  play: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  pause: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4v16M16 4v16"/></svg>`,
  undo: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-2"/></svg>`,
  trash: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m20 6-11 11-5-5"/></svg>`,
  eye: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  plus: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
  speaker: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M16 9a5 5 0 0 1 0 6"/></svg>`
};

function dataFor(char) {
  if (app.strokeData[char]) return app.strokeData[char];
  if (CORE_STROKES[char]) return CORE_STROKES[char];
  return { pinyin: "", strokes: [], paths: [], supported: false };
}

function hasStrokeData(char) {
  return Boolean(dataFor(char)?.strokes?.length && dataFor(char)?.paths?.length);
}

function filterSupportedChars(chars) {
  return chars.filter(hasStrokeData);
}

function isSupportedItem(item) {
  const chars = item.type === "word" ? [...item.text] : [item.char];
  return chars.every(hasStrokeData);
}

function strokeTypeFromMedian(median) {
  if (!median || median.length < 2) return "dian";
  const normalized = median.map(([x, y]) => ({ x: x / 1024, y: (900 - y) / 1024 }));
  if (pathLength(normalized) < 0.16) return "dian";
  const first = { x: median[0][0] / 1024, y: (900 - median[0][1]) / 1024 };
  const lastRaw = median[median.length - 1];
  const last = { x: lastRaw[0] / 1024, y: (900 - lastRaw[1]) / 1024 };
  if (median.length > 2 || pathLength(normalized) > distance(first, last) * 1.22) {
    const a = { x: median[0][0] / 1024, y: (900 - median[0][1]) / 1024 };
    const bRaw = median[Math.min(2, median.length - 1)];
    const b = { x: bRaw[0] / 1024, y: (900 - bRaw[1]) / 1024 };
    const cRaw = median[Math.max(0, median.length - 3)];
    const c = { x: cRaw[0] / 1024, y: (900 - cRaw[1]) / 1024 };
    const d = last;
    const firstDir = direction(a, b);
    const lastDir = direction(c, d);
    if (firstDir === "shu" && lastDir === "heng") return "shuzhe";
    if (firstDir === "heng" && lastDir === "shu") return "hengzhe";
    if (firstDir === "heng" && lastDir === "pie") return "hengpie";
    if (lastDir === "gou") return firstDir === "shu" ? "shugou" : "hengzhegou";
  }
  return direction(first, last);
}

function normalizeHanziWriterData(char, raw) {
  const medians = raw.medians || [];
  return {
    pinyin: CORE_STROKES[char]?.pinyin || "",
    strokes: medians.map(strokeTypeFromMedian),
    paths: raw.strokes || [],
    medians,
    source: "hanzi-writer-data"
  };
}

async function ensureStrokeData(char) {
  if (app.strokeData[char]?.source === "hanzi-writer-data") return app.strokeData[char];
  const cacheKey = `hanzi-writer-data:${char}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      app.strokeData[char] = normalizeHanziWriterData(char, JSON.parse(cached));
      return app.strokeData[char];
    }
  } catch (error) {
    console.warn("读取笔画缓存失败", error);
  }
  let raw = null;
  const localUrl = `./data/${encodeURIComponent(char)}.json`;
  const cdnUrl = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodeURIComponent(char)}.json`;
  for (const url of [localUrl, cdnUrl]) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      raw = await response.json();
      break;
    } catch (error) {
      console.warn("加载笔画数据失败", url, error);
    }
  }
  if (!raw) throw new Error(`未找到 ${char} 的笔画数据`);
  app.strokeData[char] = normalizeHanziWriterData(char, raw);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(raw));
  } catch (error) {
    console.warn("写入笔画缓存失败", error);
  }
  return app.strokeData[char];
}

async function ensureItemStrokeData(item) {
  const chars = item.type === "word" ? [...item.text] : [item.char];
  await Promise.all(chars.map((char) => ensureStrokeData(char).catch(() => null)));
}

function normalizeChars(text) {
  return [...new Set([...text.replace(/[^\u4e00-\u9fa5]/g, "")])];
}

function normalizeBankEntries(text) {
  const entries = text
    .split(/[\s,，、;；]+/)
    .map((item) => item.replace(/[^\u4e00-\u9fa5]/g, ""))
    .filter(Boolean);
  return [...new Set(entries)];
}

function bankEntries(bank) {
  if (bank?.entries?.length) return bank.entries;
  return bank?.chars?.length ? bank.chars : [];
}

function itemsFromEntries(entries) {
  return entries.flatMap((entry) => {
    const chars = normalizeChars(entry);
    if (!chars.length) return [];
    if (chars.length === 1) return { type: "char", char: chars[0] };
    const text = chars.join("");
    return { type: "word", text, pinyin: getPinyinList(text) };
  });
}

function getPinyinList(text) {
  return [...text].map((char) => dataFor(char).pinyin || "");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

async function boot() {
  if (!("indexedDB" in window)) {
    $("#app").innerHTML = `<main class="screen"><div class="card"><h2>浏览器不支持 IndexedDB</h2><p>请使用 Safari、Chrome 或 Edge 的较新版本。</p></div></main>`;
    return;
  }
  prepareVoices();
  await db.open();
  const savedSettings = await db.get("settings", "main");
  app.settings = { ...DEFAULT_SETTINGS, ...(savedSettings?.value || {}) };
  app.records = await db.all("records");
  app.mistakes = await db.all("mistakes");
  app.customBanks = await db.all("customBanks");
  const migrated = [];
  app.mistakes.forEach((item) => {
    const oldId = item.id;
    if (!item.libraryType) item.libraryType = "stroke";
    if (!item.id.includes(":")) item.id = `${item.libraryType}:${item.char}`;
    if (oldId !== item.id) migrated.push({ oldId, item });
  });
  await Promise.all(migrated.map(({ oldId, item }) => db.delete("mistakes", oldId).then(() => db.put("mistakes", item))));
  applyInitialRoute();
  render();
}

function applyInitialRoute() {
  const params = new URLSearchParams(location.search);
  const view = params.get("view");
  if (["home", "practice", "animation", "mistakes", "stats", "custom", "settings"].includes(view)) {
    app.view = view;
  }
  if (view === "animation") app.animation = { char: params.get("char") || "学" };
  if (view === "practice") {
    const chars = normalizeChars(params.get("chars") || "");
    const practiceType = params.get("practiceType");
    if (["stroke", "dictation"].includes(practiceType)) app.settings.practiceType = practiceType;
    createSession(chars.length ? "chars" : "quick", chars);
  }
}

function prepareVoices() {
  if (!("speechSynthesis" in window)) return;
  const load = () => {
    app.voices = speechSynthesis.getVoices().filter((voice) => /^zh|Chinese|Mandarin/i.test(`${voice.lang} ${voice.name}`));
  };
  load();
  speechSynthesis.addEventListener?.("voiceschanged", load);
}

function render() {
  $("#app").innerHTML = `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">字</div>
        <div>
          <h1 class="brand-title">小学生字练习</h1>
          <p class="brand-subtitle">iPad 手写、笔顺动画、练习库复习</p>
        </div>
      </div>
      <nav class="nav-tabs" aria-label="主导航">
        ${navButton("home", "课程")}
        ${navButton("practice", "练习")}
        ${navButton("animation", "笔顺")}
        ${navButton("mistakes", "练习库")}
        ${navButton("stats", "统计")}
        ${navButton("custom", "字库")}
        ${navButton("settings", "设置")}
      </nav>
    </header>
    <main class="screen">${screen()}</main>
  `;
  $$(".nav-tab").forEach((btn) => btn.addEventListener("click", () => navigate(btn.dataset.view)));
  bindScreen();
}

function navButton(id, label) {
  return `<button class="nav-tab ${app.view === id ? "active" : ""}" data-view="${id}">${label}</button>`;
}

function navigate(view) {
  cancelAnimation();
  app.view = view;
  render();
}

function screen() {
  if (app.view === "home") return homeScreen();
  if (app.view === "practice") return practiceScreen();
  if (app.view === "animation") return animationScreen();
  if (app.view === "mistakes") return mistakesScreen();
  if (app.view === "stats") return statsScreen();
  if (app.view === "custom") return customScreen();
  if (app.view === "settings") return settingsScreen();
  return homeScreen();
}

function homeScreen() {
  const totalChars = LOW_GRADE_CHARS.length;
  return `
    <section class="section-head">
      <div>
        <h2>按教材开始练字</h2>
        <p>内置约 ${totalChars} 个低年级常用字，按册次、单元、课次组织。</p>
      </div>
      <div class="toolbar">
        <button class="button" data-action="quickPractice">${icons.play}开始今日练习</button>
      </div>
    </section>
    <section class="dashboard-grid">
      <div class="band">
        <div class="book-list">
          ${app.curriculum.map(bookRow).join("")}
        </div>
      </div>
      <aside class="side-panel">
        ${overviewCard()}
        <div class="card">
          <h3>词语模式</h3>
          <p class="small-text">多个田字格并排，每个汉字独立采集与校验。</p>
          <div class="char-preview">${WORDS.slice(0, 4).map((w) => `<span class="char-chip">${w.text}</span>`).join("")}</div>
          <p><button class="button secondary" data-action="wordPractice">练词语</button></p>
        </div>
      </aside>
    </section>
  `;
}

function bookRow(book, index) {
  const chars = book.units.flatMap((u) => u.lessons.flatMap((l) => l.chars));
  return `
    <article class="book-row">
      <div>
        <h3>${book.title}</h3>
        <div class="unit-meta">${book.units.length} 个单元 · ${chars.length} 个生字</div>
      </div>
      <div>
        <div class="char-preview">${chars.slice(0, 24).map((char) => `<span class="char-chip">${char}</span>`).join("")}</div>
        <div class="toolbar" style="margin-top:10px">
          ${book.units.flatMap((unit, unitIndex) => unit.lessons.map((lesson, lessonIndex) => `
            <button class="button ghost" data-action="lessonPractice" data-book="${index}" data-unit="${unitIndex}" data-lesson="${lessonIndex}">${unit.title}${lesson.title}</button>
          `)).join("")}
        </div>
      </div>
      <button class="button secondary" data-action="bookPractice" data-book="${index}">${icons.play}开始</button>
    </article>
  `;
}

function overviewCard() {
  const total = app.records.reduce((sum, item) => sum + item.total, 0);
  const correct = app.records.reduce((sum, item) => sum + item.correct, 0);
  const rate = total ? Math.round((correct / total) * 100) : 0;
  const strokeLibrary = app.mistakes.filter((item) => (item.libraryType || "stroke") === "stroke").length;
  const dictationLibrary = app.mistakes.filter((item) => item.libraryType === "dictation").length;
  return `
    <div class="card">
      <h3>学习概览</h3>
      <div class="stat-grid">
        <div class="stat"><strong>${total}</strong><span class="small-text">累计练习</span></div>
        <div class="stat"><strong>${rate}%</strong><span class="small-text">正确率</span></div>
        <div class="stat"><strong>${strokeLibrary}</strong><span class="small-text">笔画练习库</span></div>
        <div class="stat"><strong>${dictationLibrary}</strong><span class="small-text">默写练习库</span></div>
        <div class="stat"><strong>${app.customBanks.length}</strong><span class="small-text">自定义字库</span></div>
      </div>
    </div>
  `;
}

function practiceScreen() {
  if (!app.session) createSession("quick");
  const session = app.session;
  if (session.done) return summaryScreen();
  const item = session.items[session.index];
  const chars = item.type === "word" ? [...item.text] : [item.char];
  const isDictation = session.practiceType === "dictation";
  const practiceTitle = session.source === "review" ? "练习库复习" : (isDictation ? "汉字默写练习" : "笔画练习");
  const sideTitle = isDictation ? "默写提示" : "标准字预览";
  return `
    <section class="section-head">
      <div>
        <h2>${practiceTitle}</h2>
        <p>${item.type === "word" ? "词语模式" : "单字模式"} · ${isDictation ? "看拼音默写汉字" : "按标准笔顺书写"} · ${session.usedHint ? "已使用提示" : "未使用提示"}</p>
      </div>
      <div class="toolbar">
        <button class="button ghost" data-action="speak">${icons.speaker}朗读</button>
        <button class="button secondary" data-action="showOrder">${icons.eye}查看笔顺</button>
      </div>
    </section>
    <div class="progress-line">
      <span>${session.index + 1}/${session.items.length}</span>
      <div class="progress-bar"><div class="progress-fill" style="width:${((session.index + 1) / session.items.length) * 100}%"></div></div>
    </div>
    <section class="practice-layout">
      <div class="practice-main band">
        <div class="word-grid">
          ${chars.map((char, i) => writeCell(char, item.pinyin?.[i] || dataFor(char).pinyin, i, chars.length > 1, session.practiceType)).join("")}
        </div>
        <div class="toolbar" style="margin-top:16px">
          <button class="button ghost" data-action="undo">${icons.undo}撤销</button>
          <button class="button ghost" data-action="clear">${icons.trash}清除</button>
          <button class="button" data-action="submit" ${session.awaitingNext ? "disabled" : ""}>${icons.check}提交答案</button>
          ${session.awaitingNext ? `<button class="button secondary" data-action="nextQuestion">${session.index + 1 >= session.items.length ? "查看总结" : "下一个"}</button>` : ""}
        </div>
      </div>
      <aside class="side-panel">
        <div class="card">
          <h3>逐笔反馈</h3>
          <div id="resultList" class="result-list"><p class="small-text">提交后会显示笔画类型、方向、顺序反馈。</p></div>
        </div>
        <div class="card">
          <h3>${sideTitle}</h3>
          <div class="char-preview">${isDictation ? chars.map((char) => `<span class="char-chip pinyin-chip">${dataFor(char).pinyin || "拼音"}</span>`).join("") : chars.map((char) => `<span class="char-chip">${char}</span>`).join("")}</div>
          <p class="small-text">${isDictation ? "田字格不显示底字，提交后仍按笔顺和笔画数量校验。" : "结果页会把标准字与学生笔迹并列展示。"}</p>
        </div>
      </aside>
    </section>
  `;
}

function writeCell(char, pinyin, index, compact, practiceType = "stroke") {
  const isDictation = practiceType === "dictation";
  return `
    <div class="write-cell ${isDictation ? "dictation" : ""}" data-index="${index}" data-char="${char}" data-practice-type="${practiceType}">
      <div class="pinyin">${pinyin || "&nbsp;"}</div>
      <div class="grid-wrap ${compact ? "small" : ""}">
        <canvas class="grid-canvas"></canvas>
        <canvas class="standard-canvas"></canvas>
        <canvas class="ink-canvas" aria-label="${char} 书写区域"></canvas>
      </div>
      <div class="character-label">${isDictation ? "默写" : char}</div>
    </div>
  `;
}

function summaryScreen() {
  const s = app.session;
  return `
    <section class="section-head">
      <div>
        <h2>练习总结</h2>
        <p>用时 ${formatDuration(Date.now() - s.startedAt)}</p>
      </div>
      <div class="toolbar">
        <button class="button" data-action="quickPractice">${icons.play}再练一组</button>
        <button class="button secondary" data-action="goHome">返回课程</button>
      </div>
    </section>
    <section class="band">
      <div class="summary">
        <div class="stat"><strong>${s.correct}</strong><span class="small-text">正确</span></div>
        <div class="stat"><strong>${s.wrong}</strong><span class="small-text">错误</span></div>
        <div class="stat"><strong>${s.unfamiliar}</strong><span class="small-text">不熟悉</span></div>
        <div class="stat"><strong>${s.usedHint ? "是" : "否"}</strong><span class="small-text">使用提示</span></div>
      </div>
    </section>
  `;
}

function animationScreen(char = app.animation?.char || "学") {
  const info = dataFor(char);
  const firstStroke = info.strokes[0] ? STROKE_NAMES[info.strokes[0]] : "加载中";
  return `
    <section class="section-head">
      <div>
        <h2>标准笔顺动画</h2>
        <p>显示当前笔画、第几笔和播放速度。</p>
      </div>
      <div class="toolbar">
        <button class="button secondary" data-action="tryChar" data-char="${char}">我来试试</button>
      </div>
    </section>
    <section class="animation-stage band">
      <div class="anim-box" data-char="${char}">
        <canvas class="grid-canvas"></canvas>
        <div class="standard-shadow anim-standard">${char}</div>
        <canvas class="anim-canvas"></canvas>
      </div>
      <div class="side-panel">
        <div class="card">
          <h3>${char} <span class="small-text">${info.pinyin}</span></h3>
          <p id="strokeInfo">${info.strokes.length ? `自动循环 · 第 1 笔 / 共 ${info.strokes.length} 笔 · ${firstStroke}` : "正在加载标准笔画..."}</p>
        </div>
        <div class="card">
          <h3>速度</h3>
          <div class="segmented" data-setting="speed">
            ${[0.5, 1, 1.5, 2].map((speed) => `<button data-speed="${speed}" class="${app.settings.animationSpeed === speed ? "active" : ""}">${speed}x</button>`).join("")}
          </div>
        </div>
        <div class="card">
          <h3>换一个字</h3>
          <div class="char-preview">${["一", "人", "口", "木", "水", "好", "学", "习", "输"].map((c) => `<button class="char-chip" data-action="animChar" data-char="${c}">${c}</button>`).join("")}</div>
        </div>
      </div>
    </section>
  `;
}

function mistakesScreen() {
  const strokeItems = libraryItems("stroke");
  const dictationItems = libraryItems("dictation");
  return `
    <section class="section-head">
      <div>
        <h2>练习库</h2>
        <p>这里收集孩子还不熟练的字，按笔画练习和默写练习分别复习。</p>
      </div>
    </section>
    ${librarySection("笔画练习库", "stroke", strokeItems)}
    ${librarySection("默写练习库", "dictation", dictationItems)}
  `;
}

function libraryItems(type) {
  return app.mistakes.filter((item) => (item.libraryType || "stroke") === type);
}

function librarySection(title, type, items) {
  const due = items.filter((m) => !m.nextReview || m.nextReview <= Date.now());
  return `
    <section class="band mistake-list">
      <div class="library-head">
        <div>
          <h3>${title}</h3>
          <p class="small-text">${type === "dictation" ? "默写练习中还不熟练的字。" : "笔画练习中还不熟练的字。"}</p>
        </div>
        <button class="button" data-action="reviewLibrary" data-type="${type}" ${due.length ? "" : "disabled"}>${icons.play}练习到期字</button>
      </div>
      ${items.length ? items.map(mistakeRow).join("") : `<p class="small-text">这个练习库还是空的。完成练习后，不熟练的字会自动加入这里。</p>`}
    </section>
  `;
}

function mistakeRow(item) {
  const type = item.libraryType || "stroke";
  return `
    <article class="book-row">
      <div><span class="char-chip">${item.char}</span></div>
      <div>
        <h3>${item.char} <span class="small-text">${dataFor(item.char).pinyin}</span></h3>
        <div class="unit-meta">不熟练 ${item.count} 次 · 最近 ${new Date(item.lastWrong).toLocaleString()} · 下次 ${item.nextReview ? new Date(item.nextReview).toLocaleString() : "现在"}</div>
      </div>
      <button class="button secondary" data-action="reviewOne" data-type="${type}" data-char="${item.char}">练习</button>
    </article>
  `;
}

function statsScreen() {
  const total = app.records.reduce((sum, r) => sum + r.total, 0);
  const correct = app.records.reduce((sum, r) => sum + r.correct, 0);
  const wrong = app.records.reduce((sum, r) => sum + r.wrong, 0);
  const rate = total ? Math.round((correct / total) * 100) : 0;
  return `
    <section class="section-head">
      <div>
        <h2>学习统计</h2>
        <p>所有记录保存在本机 IndexedDB，关闭浏览器后不会丢失。</p>
      </div>
    </section>
    <section class="band">
      <div class="summary">
        <div class="stat"><strong>${total}</strong><span class="small-text">总练习量</span></div>
        <div class="stat"><strong>${correct}</strong><span class="small-text">正确</span></div>
        <div class="stat"><strong>${wrong}</strong><span class="small-text">错误</span></div>
        <div class="stat"><strong>${rate}%</strong><span class="small-text">正确率</span></div>
      </div>
      <h3>最近记录</h3>
      <div class="mistake-list">
        ${app.records.slice(-8).reverse().map((r) => `<div class="stroke-result"><span class="mark ${r.wrong ? "bad" : "ok"}">${r.wrong ? "!" : "✓"}</span><div>${new Date(r.createdAt).toLocaleString()} · ${r.correct}/${r.total} 正确 · 用时 ${formatDuration(r.duration)}</div></div>`).join("") || `<p class="small-text">暂无练习记录。</p>`}
      </div>
    </section>
  `;
}

function customScreen() {
  return `
    <section class="section-head">
      <div>
        <h2>自定义字词库</h2>
        <p>创建自己的单字或词语列表，编辑时用空格或逗号分隔。</p>
      </div>
      <button class="button" data-action="newBank">${icons.plus}新建字库</button>
    </section>
    <section class="dashboard-grid">
      <div class="band custom-list">
        ${app.customBanks.length ? app.customBanks.map(bankRow).join("") : `<p class="small-text">还没有自定义字库。</p>`}
      </div>
      <aside class="card">
        <h3 id="bankFormTitle">新建字库</h3>
        <div class="field-grid">
          <div class="field"><label for="bankName">名称</label><input id="bankName" placeholder="例如：本周听写" /></div>
          <div class="field"><label for="bankChars">字词列表</label><textarea id="bankChars" placeholder="例如：牛 羊 学习，学校"></textarea></div>
          <button class="button" data-action="saveBank">保存</button>
        </div>
      </aside>
    </section>
  `;
}

function bankRow(bank) {
  const entries = bankEntries(bank);
  const charCount = normalizeChars(entries.join("")).length;
  return `
    <article class="book-row">
      <div><h3>${escapeHTML(bank.name)}</h3><div class="unit-meta">${entries.length} 个条目 · ${charCount} 个字</div></div>
      <div class="char-preview">${entries.slice(0, 28).map((entry) => `<span class="char-chip">${entry}</span>`).join("")}</div>
      <div class="toolbar">
        <button class="button secondary" data-action="practiceBank" data-id="${bank.id}">练习</button>
        <button class="button ghost" data-action="editBank" data-id="${bank.id}">编辑</button>
      </div>
    </article>
  `;
}

function settingsScreen() {
  return `
    <section class="section-head">
      <div>
        <h2>设置</h2>
        <p>出题数量、严格度、音效和动画速度都会持久保存。</p>
      </div>
    </section>
    <section class="band field-grid">
      <div class="field">
        <label>出题数量</label>
        <div class="segmented" data-setting="count">${[5, 10, 15, 20].map((v) => `<button data-value="${v}" class="${app.settings.count === v ? "active" : ""}">${v}</button>`).join("")}</div>
      </div>
      <div class="field">
        <label>出题方式</label>
        <div class="segmented" data-setting="mode">
          <button data-value="single" class="${app.settings.mode === "single" ? "active" : ""}">仅单字</button>
          <button data-value="mixed" class="${app.settings.mode === "mixed" ? "active" : ""}">单字+词语</button>
        </div>
      </div>
      <div class="field">
        <label>练习类型</label>
        <div class="segmented" data-setting="practiceType">
          <button data-value="stroke" class="${app.settings.practiceType === "stroke" ? "active" : ""}">笔画练习</button>
          <button data-value="dictation" class="${app.settings.practiceType === "dictation" ? "active" : ""}">汉字默写</button>
        </div>
      </div>
      <div class="field">
        <label>严格度</label>
        <div class="segmented" data-setting="strictness">
          <button data-value="strict" class="${app.settings.strictness === "strict" ? "active" : ""}">严格模式</button>
          <button data-value="loose" class="${app.settings.strictness === "loose" ? "active" : ""}">宽松模式</button>
        </div>
      </div>
      <div class="field">
        <label for="speedRange">动画速度：${app.settings.animationSpeed}x</label>
        <input id="speedRange" type="range" min="0.5" max="2" step="0.1" value="${app.settings.animationSpeed}" />
      </div>
      <div class="field">
        <label>音效</label>
        <div class="segmented" data-setting="sound">
          <button data-value="true" class="${app.settings.sound ? "active" : ""}">开启</button>
          <button data-value="false" class="${!app.settings.sound ? "active" : ""}">关闭</button>
        </div>
      </div>
      <div class="toolbar">
        <button class="button danger" data-action="resetData">${icons.trash}重置数据</button>
      </div>
    </section>
  `;
}

function bindScreen() {
  $$("[data-action]").forEach((el) => el.addEventListener("click", handleAction));
  if (app.view === "practice" && app.session && !app.session.done) initWriters();
  if (app.view === "animation") initAnimation($(".anim-box")?.dataset.char || "学");
  $$("[data-setting]").forEach((group) => {
    group.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const key = group.dataset.setting;
      const raw = btn.dataset.value ?? btn.dataset.speed;
      app.settings[key === "speed" ? "animationSpeed" : key] = parseSetting(raw);
      await saveSettings();
      render();
    });
  });
  $("#speedRange")?.addEventListener("input", async (e) => {
    app.settings.animationSpeed = Number(e.target.value);
    await saveSettings();
    render();
  });
}

function parseSetting(raw) {
  if (raw === "true") return true;
  if (raw === "false") return false;
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
}

async function handleAction(e) {
  const el = e.currentTarget;
  const action = el.dataset.action;
  if (action === "quickPractice") return startAndRender("quick");
  if (action === "wordPractice") return startAndRender("word");
  if (action === "bookPractice") return startAndRender("book", Number(el.dataset.book));
  if (action === "lessonPractice") return startAndRender("lesson", {
    book: Number(el.dataset.book),
    unit: Number(el.dataset.unit),
    lesson: Number(el.dataset.lesson)
  });
  if (action === "goHome") return navigate("home");
  if (action === "speak") return speakCurrent();
  if (action === "undo") return undoStroke();
  if (action === "clear") return clearInk();
  if (action === "submit") return submitAnswer();
  if (action === "nextQuestion") return nextQuestion();
  if (action === "showOrder") return showOrder();
  if (action === "tryChar") return startAndRender("chars", [el.dataset.char]);
  if (action === "animChar") {
    app.animation = { char: el.dataset.char };
    return render();
  }
  if (action === "reviewLibrary") {
    const libraryType = el.dataset.type || "stroke";
    const chars = libraryItems(libraryType).filter((m) => !m.nextReview || m.nextReview <= Date.now()).map((m) => m.char);
    return startAndRender("review", { chars, practiceType: libraryType });
  }
  if (action === "reviewOne") return startAndRender("review", { chars: [el.dataset.char], practiceType: el.dataset.type || "stroke" });
  if (action === "newBank") return fillBankForm();
  if (action === "saveBank") return saveBank();
  if (action === "editBank") return editBank(el.dataset.id);
  if (action === "practiceBank") {
    const bank = app.customBanks.find((b) => b.id === el.dataset.id);
    return startAndRender("entries", bankEntries(bank));
  }
  if (action === "resetData") return confirmReset();
}

async function startAndRender(type, payload) {
  createSession(type, payload);
  await ensureItemStrokeData(app.session.items[0]);
  app.view = "practice";
  render();
  setTimeout(speakCurrent, 300);
}

function createSession(type, payload) {
  let items = [];
  let practiceType = app.settings.practiceType || "stroke";
  if (type === "book") {
    items = app.curriculum[payload].units.flatMap((u) => u.lessons.flatMap((l) => l.chars)).map((char) => ({ type: "char", char }));
  } else if (type === "lesson") {
    items = app.curriculum[payload.book].units[payload.unit].lessons[payload.lesson].chars.map((char) => ({ type: "char", char }));
  } else if (type === "word") {
    items = WORDS.map((w) => ({ type: "word", text: w.text, pinyin: w.pinyin }));
  } else if (type === "entries") {
    items = itemsFromEntries(payload || []);
  } else if (type === "chars") {
    items = (payload || []).map((char) => ({ type: "char", char }));
  } else if (type === "review") {
    const reviewPayload = Array.isArray(payload) ? { chars: payload, practiceType: "stroke" } : (payload || {});
    practiceType = reviewPayload.practiceType || "stroke";
    items = (reviewPayload.chars || []).map((char) => ({ type: "char", char }));
  } else {
    const chars = [...LOW_GRADE_CHARS].sort(() => Math.random() - 0.5).slice(0, app.settings.count).map((char) => ({ type: "char", char }));
    const wordItems = WORDS.map((word) => ({ type: "word", text: word.text, pinyin: word.pinyin })).slice(0, Math.min(2, app.settings.count));
    items = app.settings.mode === "mixed" ? [...chars, ...wordItems].sort(() => Math.random() - 0.5) : chars;
  }
  if (!items.length) items = [{ type: "char", char: "一" }];
  app.session = {
    source: type === "review" ? "review" : "practice",
    practiceType,
    items: items.slice(0, Math.max(1, app.settings.count)),
    index: 0,
    startedAt: Date.now(),
    usedHint: false,
    correct: 0,
    wrong: 0,
    unfamiliar: 0,
    done: false,
    awaitingNext: false,
    latestResults: []
  };
}

class HanziWriter {
  constructor(root) {
    this.root = root;
    this.char = root.dataset.char;
    this.gridCanvas = $(".grid-canvas", root);
    this.standardCanvas = $(".standard-canvas", root);
    this.inkCanvas = $(".ink-canvas", root);
    this.gridCtx = this.gridCanvas.getContext("2d");
    this.standardCtx = this.standardCanvas.getContext("2d");
    this.inkCtx = this.inkCanvas.getContext("2d");
    this.strokes = [];
    this.current = null;
    this.activePointer = null;
    this.resize = this.resize.bind(this);
    new ResizeObserver(this.resize).observe($(".grid-wrap", root));
    this.bind();
    this.resize();
  }

  bind() {
    this.inkCanvas.addEventListener("pointerdown", (e) => this.start(e));
    this.inkCanvas.addEventListener("pointermove", (e) => this.move(e));
    this.inkCanvas.addEventListener("pointerup", (e) => this.end(e));
    this.inkCanvas.addEventListener("pointercancel", (e) => this.end(e));
    this.inkCanvas.addEventListener("lostpointercapture", () => {
      if (this.current?.points.length > 1) this.finishStroke();
    });
  }

  resize() {
    const rect = this.gridCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    [this.gridCanvas, this.standardCanvas, this.inkCanvas].forEach((canvas) => {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    });
    this.gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.standardCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.inkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.drawGrid();
    this.drawStandard();
    this.redrawInk();
  }

  drawStandard() {
    const rect = this.standardCanvas.getBoundingClientRect();
    const ctx = this.standardCtx;
    ctx.clearRect(0, 0, rect.width, rect.height);
    if (this.root.dataset.practiceType === "dictation") return;
    const info = dataFor(this.char);
    if (info.source === "hanzi-writer-data") {
      info.paths.forEach((pathData) => drawHanziPath(ctx, pathData, "rgba(29, 36, 51, 0.12)", rect.width, rect.height));
      return;
    }
    ensureStrokeData(this.char).then(() => this.drawStandard()).catch(() => {});
  }

  drawGrid() {
    const { width, height } = this.gridCanvas.getBoundingClientRect();
    const ctx = this.gridCtx;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--grid-red").trim();
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  point(e) {
    const rect = this.inkCanvas.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
    const y = Math.min(rect.height, Math.max(0, e.clientY - rect.top));
    return {
      x: x / rect.width,
      y: y / rect.height,
      p: e.pressure || (e.pointerType === "touch" ? 0.45 : 0.7),
      t: performance.now()
    };
  }

  start(e) {
    e.preventDefault();
    this.activePointer = e.pointerId;
    this.inkCanvas.setPointerCapture(e.pointerId);
    this.current = { points: [this.point(e)] };
  }

  move(e) {
    if (this.activePointer !== e.pointerId || !this.current) return;
    e.preventDefault();
    const next = this.point(e);
    const last = this.current.points[this.current.points.length - 1];
    if (distance(last, next) < 0.003) return;
    this.current.points.push(next);
    this.drawSegment(last, next);
  }

  end(e) {
    if (this.activePointer !== e.pointerId || !this.current) return;
    e.preventDefault();
    this.current.points.push(this.point(e));
    this.finishStroke();
    this.activePointer = null;
  }

  finishStroke() {
    if (!this.current) return;
    if (pathLength(this.current.points) > 0.01) this.strokes.push(this.current);
    app.lastWriter = this;
    this.current = null;
    this.redrawInk();
  }

  drawSegment(a, b) {
    const rect = this.inkCanvas.getBoundingClientRect();
    const ctx = this.inkCtx;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#20242c";
    ctx.lineWidth = Math.max(3, 7 * ((a.p + b.p) / 2));
    ctx.beginPath();
    ctx.moveTo(a.x * rect.width, a.y * rect.height);
    ctx.lineTo(b.x * rect.width, b.y * rect.height);
    ctx.stroke();
  }

  redrawInk() {
    const rect = this.inkCanvas.getBoundingClientRect();
    const ctx = this.inkCtx;
    ctx.clearRect(0, 0, rect.width, rect.height);
    this.strokes.forEach((stroke) => drawStrokePoints(ctx, stroke.points, rect.width, rect.height, "#20242c"));
    if (this.current) drawStrokePoints(ctx, this.current.points, rect.width, rect.height, "#20242c");
  }

  undo() {
    this.strokes.pop();
    this.redrawInk();
  }

  clear() {
    this.strokes = [];
    this.current = null;
    this.redrawInk();
  }
}

function drawStrokePoints(ctx, points, width, height, color, alpha = 1) {
  if (points.length < 2) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    ctx.lineWidth = Math.max(3, 7 * ((a.p + b.p) / 2));
    ctx.beginPath();
    ctx.moveTo(a.x * width, a.y * height);
    ctx.lineTo(b.x * width, b.y * height);
    ctx.stroke();
  }
  ctx.restore();
}

function initWriters() {
  app.currentWriters = $$(".write-cell").map((cell) => new HanziWriter(cell));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pathLength(points) {
  return points.slice(1).reduce((sum, p, i) => sum + distance(points[i], p), 0);
}

function simplify(points, threshold = 0.035) {
  if (points.length <= 3) return points;
  const result = [points[0]];
  for (const point of points.slice(1, -1)) {
    if (distance(result[result.length - 1], point) >= threshold) result.push(point);
  }
  result.push(points[points.length - 1]);
  return result;
}

function classifyStroke(stroke) {
  const points = simplify(stroke.points);
  const first = points[0];
  const last = points[points.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const len = pathLength(points);
  const direct = Math.hypot(dx, dy);
  const turns = turnCount(points);
  if (len < 0.075) return "dian";
  if (turns >= 1 || len / Math.max(direct, 0.001) > 1.35) {
    const firstDir = direction(points[0], points[Math.min(2, points.length - 1)]);
    const lastDir = direction(points[Math.max(0, points.length - 3)], last);
    if (firstDir === "heng" && lastDir === "shu") return "hengzhe";
    if (firstDir === "heng" && lastDir === "pie") return "hengpie";
    if (firstDir === "shu" && lastDir === "heng") return "shuzhe";
    if (lastDir === "ti") return firstDir === "shu" ? "shuti" : "hengzheti";
    if (lastDir === "gou") return firstDir === "shu" ? "shugou" : "hengzhegou";
    return "zhe";
  }
  return direction(first, last);
}

function direction(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  if (ady > adx * 1.8 && dy > 0) return "shu";
  if (adx > ady * 1.8 && dx > 0) return "heng";
  if (dx < 0 && dy > 0) return "pie";
  if (dx > 0 && dy > 0) return "na";
  if (dx > 0 && dy < 0) return "ti";
  if (dy < 0 && ady > adx) return "gou";
  return adx >= ady ? "heng" : "shu";
}

function turnCount(points) {
  let count = 0;
  for (let i = 2; i < points.length; i++) {
    const a = Math.atan2(points[i - 1].y - points[i - 2].y, points[i - 1].x - points[i - 2].x);
    const b = Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x);
    let diff = Math.abs(a - b);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    if (diff > 0.85) count++;
  }
  return count;
}

function compatible(expected, actual) {
  if (expected === actual) return true;
  const loosePairs = [
    ["ti", "heng"],
    ["dian", "pie"],
    ["na", "dian"],
    ["hengzhegou", "hengzhe"],
    ["shugou", "shu"],
    ["shuwangou", "shuzhe"],
    ["henggou", "heng"],
    ["wangou", "zhe"],
    ["xiegou", "na"]
  ];
  return loosePairs.some(([a, b]) => (a === expected && b === actual) || (b === expected && a === actual));
}

function mergeTinyStrokes(strokes, targetCount) {
  const copy = strokes.map((s) => ({ ...s, len: pathLength(s.points) }));
  while (copy.length > targetCount) {
    let minIndex = copy.findIndex((s) => s.len < 0.06);
    if (minIndex < 0) break;
    const neighbor = minIndex > 0 ? minIndex - 1 : 1;
    copy[neighbor].points = [...copy[neighbor].points, ...copy[minIndex].points].sort((a, b) => a.t - b.t);
    copy.splice(minIndex, 1);
  }
  return copy;
}

function validateChar(char, strokes) {
  if (!hasStrokeData(char)) {
    return {
      ok: false,
      reason: "暂未收录标准笔画",
      results: [{ ok: false, expected: "unsupported", actual: "", reason: "该字没有标准笔画数据，不能校验" }]
    };
  }
  const standard = dataFor(char).strokes;
  const merged = mergeTinyStrokes(strokes, standard.length);
  const actual = merged.map(classifyStroke);
  const results = [];
  if (merged.length !== standard.length) {
    return {
      ok: false,
      reason: "笔画数量不对",
      results: standard.map((s, i) => ({ ok: false, expected: s, actual: actual[i], reason: "笔画数量不对" }))
    };
  }
  for (let i = 0; i < standard.length; i++) {
    const orderOk = Boolean(actual[i]);
    const typeOk = app.settings.strictness === "loose" ? orderOk : compatible(standard[i], actual[i]);
    results.push({
      ok: orderOk && typeOk,
      expected: standard[i],
      actual: actual[i],
      reason: typeOk ? "" : "笔画类型或方向错误"
    });
  }
  return {
    ok: results.every((r) => r.ok),
    reason: results.every((r) => r.ok) ? "正确" : "笔画类型错误 / 笔顺错误",
    results
  };
}

async function submitAnswer() {
  if (app.session.awaitingNext) return;
  const item = app.session.items[app.session.index];
  const chars = item.type === "word" ? [...item.text] : [item.char];
  await Promise.all(chars.map((char) => ensureStrokeData(char).catch(() => null)));
  const validations = chars.map((char, index) => validateChar(char, app.currentWriters[index].strokes));
  const ok = validations.every((v) => v.ok);
  $("#resultList").innerHTML = validations.map((validation, charIndex) => `
    <div>
      <h3>${chars[charIndex]} · ${validation.reason}</h3>
      ${validation.results.map((r, i) => `
        <div class="stroke-result">
          <span class="mark ${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"}</span>
          <div>第 ${i + 1} 笔：标准 ${STROKE_NAMES[r.expected] || r.expected}，识别 ${STROKE_NAMES[r.actual] || "未识别"}${r.reason ? ` · ${r.reason}` : ""}</div>
        </div>
      `).join("")}
    </div>
  `).join("") + `<button class="button secondary" data-action="nextQuestion">${app.session.index + 1 >= app.session.items.length ? "查看总结" : "下一个"}</button>`;
  $("#resultList [data-action='nextQuestion']")?.addEventListener("click", nextQuestion);
  playSound(ok);
  app.session.awaitingNext = true;
  const submitButton = $("[data-action='submit']");
  if (submitButton) submitButton.disabled = true;
  if (ok) {
    app.session.correct += chars.length;
    await markReview(chars, true);
  } else {
    app.session.wrong += chars.length;
    await markReview(chars, false);
  }
}

async function nextQuestion() {
  if (!app.session?.awaitingNext) return;
  app.session.awaitingNext = false;
  app.session.index++;
  if (app.session.index >= app.session.items.length) {
    app.session.done = true;
    await saveRecord();
  } else {
    await ensureItemStrokeData(app.session.items[app.session.index]);
  }
  render();
  if (!app.session.done) speakCurrent();
}

async function saveRecord() {
  const s = app.session;
  const record = {
    id: String(Date.now()),
    createdAt: Date.now(),
    practiceType: s.practiceType,
    total: s.correct + s.wrong,
    correct: s.correct,
    wrong: s.wrong,
    unfamiliar: s.unfamiliar,
    duration: Date.now() - s.startedAt,
    usedHint: s.usedHint
  };
  await db.put("records", record);
  app.records.push(record);
}

async function markReview(chars, correct) {
  const libraryType = app.session?.practiceType || "stroke";
  for (const char of chars) {
    const id = `${libraryType}:${char}`;
    let item = app.mistakes.find((m) => m.id === id || (m.char === char && (m.libraryType || "stroke") === libraryType));
    if (correct) {
      if (item) {
        item.ease = Math.min(6, (item.ease || 1) + 1);
        item.nextReview = Date.now() + item.ease * 24 * 60 * 60 * 1000;
        await db.put("mistakes", item);
      }
      continue;
    }
    if (!item) {
      item = { id, char, libraryType, count: 0, ease: 1 };
      app.mistakes.push(item);
    }
    item.id = id;
    item.libraryType = libraryType;
    item.count += 1;
    item.ease = Math.max(1, (item.ease || 1) - 0.5);
    item.lastWrong = Date.now();
    item.nextReview = Date.now() + Math.max(4, 24 / item.count) * 60 * 60 * 1000;
    await db.put("mistakes", item);
  }
}

function undoStroke() {
  if (app.lastWriter) {
    app.lastWriter.undo();
    return;
  }
  app.currentWriters[0]?.undo();
}

function clearInk() {
  app.currentWriters.forEach((w) => w.clear());
}

function speakCurrent() {
  const item = app.session?.items[app.session.index];
  if (!item || !("speechSynthesis" in window)) return;
  if (!app.voices.length) prepareVoices();
  speechSynthesis.cancel();
  const text = item.type === "word" ? item.text : item.char;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.voice = pickChineseVoice();
  utterance.rate = 0.72;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}

function pickChineseVoice() {
  const voices = app.voices.length ? app.voices : speechSynthesis.getVoices();
  const preferred = [
    "Ting-Ting",
    "Tingting",
    "Mei-Jia",
    "Meijia",
    "Xiaoxiao",
    "Yunxi",
    "Google 普通话",
    "Google 國語",
    "Google Mandarin",
    "普通话",
    "Mandarin",
    "Chinese"
  ];
  for (const keyword of preferred) {
    const match = voices.find((voice) => `${voice.name} ${voice.lang}`.toLowerCase().includes(keyword.toLowerCase()));
    if (match) return match;
  }
  return voices.find((voice) => voice.lang === "zh-CN") || voices.find((voice) => voice.lang.startsWith("zh")) || null;
}

function playSound(ok) {
  if (!app.settings.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = ok ? 660 : 220;
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  osc.start();
  osc.stop(ctx.currentTime + 0.24);
}

function showOrder() {
  const item = app.session.items[app.session.index];
  const char = item.type === "word" ? item.text[0] : item.char;
  app.session.usedHint = true;
  app.session.unfamiliar += 1;
  app.animation = { char };
  app.view = "animation";
  render();
}

function initAnimation(char) {
  cancelAnimation();
  app.animation = { char, start: performance.now(), elapsed: 0, raf: 0 };
  const box = $(".anim-box");
  if (!box) return;
  const grid = $(".grid-canvas", box);
  const canvas = $(".anim-canvas", box);
  setupCanvas(grid);
  setupCanvas(canvas);
  drawGridOn(grid);
  drawAnimationFrame(0);
  tickAnimation();
  ensureStrokeData(char).then(() => {
    if (app.animation?.char === char) {
      app.animation.start = performance.now();
      app.animation.elapsed = 0;
      drawAnimationFrame(0);
    }
  }).catch(() => {});
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawGridOn(canvas) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.strokeStyle = "#d53b35";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, rect.width - 3, rect.height - 3);
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(rect.width / 2, 0);
  ctx.lineTo(rect.width / 2, rect.height);
  ctx.moveTo(0, rect.height / 2);
  ctx.lineTo(rect.width, rect.height / 2);
  ctx.moveTo(0, 0);
  ctx.lineTo(rect.width, rect.height);
  ctx.moveTo(rect.width, 0);
  ctx.lineTo(0, rect.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function cancelAnimation() {
  if (app.animation?.raf) cancelAnimationFrame(app.animation.raf);
}

function tickAnimation() {
  if (!app.animation) return;
  app.animation.elapsed = performance.now() - app.animation.start;
  drawAnimationFrame(app.animation.elapsed);
  app.animation.raf = requestAnimationFrame(tickAnimation);
}

function drawAnimationFrame(elapsed) {
  const canvas = $(".anim-canvas");
  if (!canvas || !app.animation) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const info = dataFor(app.animation.char);
  if (info.source !== "hanzi-writer-data") {
    ctx.clearRect(0, 0, rect.width, rect.height);
    const infoNode = $("#strokeInfo");
    if (infoNode) infoNode.textContent = "正在加载标准笔画...";
    return;
  }
  const perStroke = 820 / app.settings.animationSpeed;
  const total = info.paths.length * perStroke;
  const cycle = total + 850;
  const activeElapsed = elapsed % cycle;
  const progress = Math.min(1, activeElapsed / total);
  ctx.clearRect(0, 0, rect.width, rect.height);
  if (info.medians?.length) {
    drawHanziWriterAnimation(ctx, info, progress, rect.width, rect.height);
  } else {
    drawGlyphStrokeTrace(ctx, app.animation.char, info.paths, info.widths, progress, rect.width, rect.height);
  }
  const currentIndex = Math.min(info.strokes.length - 1, Math.floor(progress * info.strokes.length));
  const label = `自动循环 · 第 ${currentIndex + 1} 笔 / 共 ${info.strokes.length} 笔 · ${STROKE_NAMES[info.strokes[currentIndex]]}`;
  const infoNode = $("#strokeInfo");
  if (infoNode) infoNode.textContent = label;
}

function withHanziTransform(ctx, width, height) {
  const scale = Math.min(width, height) / 1024;
  const offsetX = (width - 1024 * scale) / 2;
  const offsetY = (height - 1024 * scale) / 2;
  ctx.translate(offsetX, offsetY + 900 * scale);
  ctx.scale(scale, -scale);
}

function drawHanziPath(ctx, pathData, color, width, height) {
  ctx.save();
  withHanziTransform(ctx, width, height);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(pathData));
  ctx.restore();
}

function drawMedianMask(maskCtx, median, local, width, height) {
  if (!median?.length || local <= 0) return;
  maskCtx.save();
  withHanziTransform(maskCtx, width, height);
  maskCtx.strokeStyle = "#000";
  maskCtx.lineWidth = 115;
  maskCtx.lineCap = "round";
  maskCtx.lineJoin = "round";
  maskCtx.beginPath();
  maskCtx.moveTo(median[0][0], median[0][1]);
  for (let i = 1; i < median.length; i++) maskCtx.lineTo(median[i][0], median[i][1]);
  if (local < 1) maskCtx.setLineDash([1300 * local, 1300]);
  maskCtx.stroke();
  maskCtx.restore();
}

function drawPartialHanziStroke(ctx, pathData, median, local, width, height) {
  const stroke = document.createElement("canvas");
  const mask = document.createElement("canvas");
  stroke.width = mask.width = Math.ceil(width);
  stroke.height = mask.height = Math.ceil(height);
  const strokeCtx = stroke.getContext("2d");
  const maskCtx = mask.getContext("2d");
  drawHanziPath(strokeCtx, pathData, "#20242c", width, height);
  drawMedianMask(maskCtx, median, local, width, height);
  strokeCtx.globalCompositeOperation = "destination-in";
  strokeCtx.drawImage(mask, 0, 0);
  ctx.drawImage(stroke, 0, 0, width, height);
}

function drawHanziWriterAnimation(ctx, info, progress, width, height) {
  info.paths.forEach((pathData) => drawHanziPath(ctx, pathData, "rgba(29,36,51,0.12)", width, height));
  info.paths.forEach((pathData, index) => {
    const start = index / info.paths.length;
    const end = (index + 1) / info.paths.length;
    const local = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    if (local <= 0) return;
    if (local >= 1) drawHanziPath(ctx, pathData, "#20242c", width, height);
    else drawPartialHanziStroke(ctx, pathData, info.medians[index], local, width, height);
  });
}

function drawGlyphStrokeTrace(ctx, char, paths, widths, progress, width, height) {
  if (progress <= 0) return;
  const mask = document.createElement("canvas");
  const glyph = document.createElement("canvas");
  mask.width = glyph.width = Math.ceil(width);
  mask.height = glyph.height = Math.ceil(height);
  const maskCtx = mask.getContext("2d");
  const glyphCtx = glyph.getContext("2d");
  const scale = width / 400;
  paths.forEach((pathData, index) => {
    const start = index / paths.length;
    const end = (index + 1) / paths.length;
    const local = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    if (local <= 0) return;
    maskCtx.save();
    maskCtx.scale(scale, scale);
    maskCtx.lineWidth = widths?.[index] || 40;
    maskCtx.lineCap = "round";
    maskCtx.lineJoin = "round";
    maskCtx.strokeStyle = "#000";
    if (local < 1) maskCtx.setLineDash([920 * local, 920]);
    maskCtx.stroke(new Path2D(pathData));
    maskCtx.restore();
  });
  glyphCtx.fillStyle = "#20242c";
  setTraceFont(glyphCtx, width);
  glyphCtx.fillText(char, width / 2, height / 2 + width * 0.015);
  glyphCtx.globalCompositeOperation = "destination-in";
  glyphCtx.drawImage(mask, 0, 0);
  ctx.drawImage(glyph, 0, 0, width, height);
}

function setTraceFont(ctx, width) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.round(width * 0.78)}px "STKaiti", "KaiTi", "Songti SC", "Kaiti SC", serif`;
}

function fillBankForm(bank = null) {
  $("#bankFormTitle").textContent = bank ? "编辑字库" : "新建字库";
  $("#bankName").value = bank?.name || "";
  $("#bankChars").value = bankEntries(bank).join(" ");
  $("#bankName").dataset.id = bank?.id || "";
}

async function saveBank() {
  const id = $("#bankName").dataset.id || String(Date.now());
  const entries = normalizeBankEntries($("#bankChars").value);
  const bank = {
    id,
    name: $("#bankName").value.trim() || "未命名字库",
    entries,
    chars: normalizeChars(entries.join(""))
  };
  await db.put("customBanks", bank);
  const index = app.customBanks.findIndex((b) => b.id === id);
  if (index >= 0) app.customBanks[index] = bank;
  else app.customBanks.push(bank);
  render();
}

function editBank(id) {
  const bank = app.customBanks.find((b) => b.id === id);
  if (bank) fillBankForm(bank);
}

async function saveSettings() {
  await db.put("settings", { id: "main", value: app.settings });
}

function confirmReset() {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal">
      <h2>确认重置数据？</h2>
      <p class="small-text">这会清除设置、练习记录、练习库和自定义字库。</p>
      <div class="toolbar">
        <button class="button danger" id="confirmReset">确认重置</button>
        <button class="button ghost" id="cancelReset">取消</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  $("#cancelReset", backdrop).addEventListener("click", () => backdrop.remove());
  $("#confirmReset", backdrop).addEventListener("click", async () => {
    await Promise.all(["settings", "records", "mistakes", "customBanks"].map((store) => db.clear(store)));
    app.settings = { ...DEFAULT_SETTINGS };
    app.records = [];
    app.mistakes = [];
    app.customBanks = [];
    backdrop.remove();
    render();
  });
}

function formatDuration(ms) {
  const sec = Math.round(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}分${String(s).padStart(2, "0")}秒`;
}

boot().catch((error) => {
  console.error(error);
  $("#app").innerHTML = `<main class="screen"><div class="card"><h2>加载失败</h2><p>${error.message}</p></div></main>`;
});
