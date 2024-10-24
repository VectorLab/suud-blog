import Database from "better-sqlite3";
import path from "path";

export default defineEventHandler(async (event) => {
  const dbPath = path.join(process.cwd(), "blog.db");
  const db = new Database(dbPath, { verbose: console.log });

  try {
    db.exec("BEGIN TRANSACTION");

    // Articles and comments
    db.exec(`
      CREATE TABLE tempArt AS SELECT title, content, created_at FROM articles;
      CREATE TABLE tempComm AS SELECT article_id, author, content, created_at FROM comments;
      DROP TABLE articles;
      DROP TABLE comments;
      CREATE TABLE articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
      );
      INSERT INTO articles (title, content, created_at)
      SELECT title, content, created_at
      FROM tempArt
      ORDER BY created_at;
    `);

    const artMap = db.prepare(`
      SELECT temp.rowid as oldId, articles.id as newId
      FROM tempArt temp
      JOIN articles ON temp.title = articles.title AND temp.content = articles.content AND temp.created_at = articles.created_at
    `).all();

    const insertComm = db.prepare(`
      INSERT INTO comments (article_id, author, content, created_at)
      VALUES (?, ?, ?, ?)
    `);

    for (const map of artMap) {
      const comments = db.prepare(`
        SELECT author, content, created_at
        FROM tempComm
        WHERE article_id = ?
      `).all(map.oldId);

      for (const comm of comments) {
        insertComm.run(map.newId, comm.author, comm.content, comm.created_at);
      }
    }

    db.exec(`
      DROP TABLE tempArt;
      DROP TABLE tempComm;
    `);

    // Notes
    db.exec(`
      CREATE TABLE tempNotes AS SELECT symbol, type, datetime, price, quantity, strategy, marketSentiment, riskManagement, notes, reflection, chartImage, created_at FROM notes;
      DROP TABLE notes;
      CREATE TABLE notes (
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
      INSERT INTO notes (symbol, type, datetime, price, quantity, strategy, marketSentiment, riskManagement, notes, reflection, chartImage, created_at)
      SELECT symbol, type, datetime, price, quantity, strategy, marketSentiment, riskManagement, notes, reflection, chartImage, created_at
      FROM tempNotes
      ORDER BY datetime;
      DROP TABLE tempNotes;
    `);

    db.exec("COMMIT");
    
    return { success: true, message: "Database rebuild completed successfully" };
  } catch (error) {
    db.exec("ROLLBACK");
    console.log("Error during database rebuild:", error);
    return { success: false, message: "Error during database rebuild: " + error.message };
  } finally {
    db.close();
  }
});