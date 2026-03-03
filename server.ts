import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("zoe_pehr.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges TEXT DEFAULT '[]',
    lessons TEXT DEFAULT '[]',
    avatar_config TEXT DEFAULT '{"color": "#10B981", "accessory": "none", "expression": "smile"}',
    daily_goal INTEGER DEFAULT 500
  )
`);

// Check if new columns exist (for existing databases)
try {
  db.prepare("SELECT daily_goal FROM user_progress LIMIT 1").get();
} catch (e) {
  db.exec("ALTER TABLE user_progress ADD COLUMN daily_goal INTEGER DEFAULT 500");
}

// Ensure initial row exists
const row = db.prepare("SELECT * FROM user_progress WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO user_progress (id, xp, level, badges, lessons) VALUES (1, 1250, 5, '[]', '[]')").run();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/progress", (req, res) => {
    const data = db.prepare("SELECT * FROM user_progress WHERE id = 1").get() as any;
    res.json({
      xp: data.xp,
      level: data.level,
      badges: JSON.parse(data.badges),
      lessons: JSON.parse(data.lessons),
      avatarConfig: JSON.parse(data.avatar_config || '{"color": "#10B981", "accessory": "none", "expression": "smile"}'),
      dailyGoal: data.daily_goal || 500
    });
  });

  app.post("/api/progress", (req, res) => {
    const { xp, level, badges, lessons, avatarConfig, dailyGoal } = req.body;
    db.prepare("UPDATE user_progress SET xp = ?, level = ?, badges = ?, lessons = ?, avatar_config = ?, daily_goal = ? WHERE id = 1")
      .run(xp, level, JSON.stringify(badges), JSON.stringify(lessons), JSON.stringify(avatarConfig), dailyGoal || 500);
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
