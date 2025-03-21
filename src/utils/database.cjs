const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

exports.dbPromise = open({
  filename: './.data/charts.db',
  driver: sqlite3.Database
});

exports.initializeDatabase = async function() {
  const db = await exports.dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expires INTEGER NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS googleusers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleId TEXT NOT NULL,
      username VARCHAR(40) NOT NULL DEFAULT "dkp_anonymous",
      UNIQUE(googleId, username)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleUserId INTEGER NOT NULL,
      contentType INTEGER NOT NULL,
      title TEXT,
      publisher TEXT,
      description TEXT,
      downloadUrl TEXT,
      imageUrl TEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      downloadCount INTEGER DEFAULT 0,
      voteAverageScore REAL DEFAULT 0,
      hasLua BOOLEAN DEFAULT FALSE,
      diff1 INTEGER DEFAULT 0,
      diff2 INTEGER DEFAULT 0,
      diff3 INTEGER DEFAULT 0,
      diff4 INTEGER DEFAULT 0,
      diff5 INTEGER DEFAULT 0,
      FOREIGN KEY(googleUserId) REFERENCES googleusers(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contentId INTEGER NOT NULL,
      userId TEXT NOT NULL,
      name TEXT,
      score INTEGER,
      comment TEXT,
      like INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      FOREIGN KEY(contentId) REFERENCES contents(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      userId TEXT NOT NULL,
      voteId INTEGER NOT NULL,
      PRIMARY KEY(userId, voteId),
      FOREIGN KEY(voteId) REFERENCES votes(id)
    )
  `);
};
