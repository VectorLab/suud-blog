import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "blog.db");
const db = new Database(dbPath, { verbose: console.log });

// 初始化数据库表
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      type TEXT NOT NULL,
      datetime TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      strategy TEXT,
      marketSentiment TEXT,
      riskManagement TEXT,
      notes TEXT,
      reflection TEXT,
      chartImage TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database initialized");
}

// 在模块加载时初始化数据库
initDb();

// 设置相关的数据库操作
export function getSetting(key) {
  return db.prepare("SELECT value FROM settings WHERE key = ?").get(key)?.value;
}

export function setSetting(key, value) {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
  );
  // 如果值是对象或数组，将其转换为 JSON 字符串
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
  stmt.run(key, stringValue);
}

export function getAllSettings() {
  return db.prepare("SELECT * FROM settings").all();
}

// 文章相关的数据库操作
export function getAllArticles() {
  return db.prepare("SELECT * FROM articles ORDER BY created_at DESC").all();
}

export function getArticleById(id) {
  return db.prepare("SELECT * FROM articles WHERE id = ?").get(id);
}

export function createArticle(title, content) {
  const stmt = db.prepare(
    "INSERT INTO articles (title, content) VALUES (?, ?)"
  );
  const info = stmt.run(title, content);
  return info.lastInsertRowid;
}

export function updateArticle(id, title, content, created_at) {
  const stmt = db.prepare(
    "UPDATE articles SET title = ?, content = ?, created_at = ? WHERE id = ?"
  );
  const info = stmt.run(title, content, created_at, id);
  return info.changes > 0 ? getArticleById(id) : null;
}

export function deleteArticle(id) {
  const stmt = db.prepare("DELETE FROM articles WHERE id = ?");
  const info = stmt.run(id);
  return info.changes;
}

// 评论相关的数据库操作
export function getCommentsByArticleId(articleId) {
  return db
    .prepare(
      "SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC"
    )
    .all(articleId);
}

export function createComment(articleId, author, content) {
  const stmt = db.prepare(
    "INSERT INTO comments (article_id, author, content) VALUES (?, ?, ?)"
  );
  const info = stmt.run(articleId, author, content);
  return info.lastInsertRowid;
}

export function deleteComment(commentId) {
  const stmt = db.prepare("DELETE FROM comments WHERE id = ?");
  const info = stmt.run(commentId);
  return info.changes;
}

// 笔记相关的数据库操作
export function getAllNotes() {
  return db.prepare("SELECT * FROM notes ORDER BY datetime DESC").all();
}

export function getNoteById(id) {
  return db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
}

export function createNote(noteData) {
  const stmt = db.prepare(`
    INSERT INTO notes (symbol, type, datetime, price, quantity, strategy, marketSentiment, riskManagement, notes, reflection, chartImage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    noteData.symbol,
    noteData.type,
    noteData.datetime,
    noteData.price,
    noteData.quantity,
    noteData.strategy,
    noteData.marketSentiment,
    noteData.riskManagement,
    noteData.notes,
    noteData.reflection,
    noteData.chartImage
  );
  return info.lastInsertRowid;
}

export function updateNote(id, noteData) {
  const stmt = db.prepare(`
    UPDATE notes SET
    symbol = ?, type = ?, datetime = ?, price = ?, quantity = ?,
    strategy = ?, marketSentiment = ?, riskManagement = ?,
    notes = ?, reflection = ?, chartImage = ?
    WHERE id = ?
  `);
  const info = stmt.run(
    noteData.symbol,
    noteData.type,
    noteData.datetime,
    noteData.price,
    noteData.quantity,
    noteData.strategy,
    noteData.marketSentiment,
    noteData.riskManagement,
    noteData.notes,
    noteData.reflection,
    noteData.chartImage,
    id
  );
  return info.changes > 0 ? getNoteById(id) : null;
}

export function deleteNote(id) {
  const stmt = db.prepare("DELETE FROM notes WHERE id = ?");
  const info = stmt.run(id);
  return info.changes;
}

// 确保在应用退出时关闭数据库连接
process.on("exit", () => db.close());