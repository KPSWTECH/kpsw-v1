import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "kpsw-secret-key-123";

// Database Initialization
const db = new Database("kpsw.db");
db.pragma("foreign_keys = ON");

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'contributor', 'viewer')) NOT NULL,
    family_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id)
  );

  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    dob DATE,
    dod DATE,
    marriage_anniversary DATE,
    gender TEXT,
    native_village TEXT,
    gotra TEXT,
    bio TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id)
  );

  CREATE TABLE IF NOT EXISTS relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    relative_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('parent', 'child', 'spouse')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (relative_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    member_id INTEGER,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by INTEGER NOT NULL,
    access_level TEXT CHECK(access_level IN ('admin', 'contributor', 'viewer')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    event_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

// --- API Routes ---

// Auth
app.post("/api/auth/register", async (req, res) => {
  const { email, password, familyName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const familyResult = db.prepare("INSERT INTO families (name) VALUES (?)").run(familyName);
    const familyId = familyResult.lastInsertRowid;

    const userResult = db.prepare(
      "INSERT INTO users (email, password_hash, role, family_id) VALUES (?, ?, 'admin', ?)"
    ).run(email, hashedPassword, familyId);

    res.status(201).json({ message: "Admin registered successfully", familyId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, familyId: user.family_id },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token, user: { id: user.id, email: user.email, role: user.role, familyId: user.family_id } });
});

// Family Members
app.get("/api/members", authenticateToken, (req: any, res) => {
  const members = db.prepare("SELECT * FROM members WHERE family_id = ?").all(req.user.familyId);
  res.json(members);
});

app.post("/api/members", authenticateToken, authorize(["admin", "contributor"]), upload.single("photo"), (req: any, res) => {
  const { full_name, dob, dod, marriage_anniversary, gender, native_village, gotra, bio } = req.body;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = db.prepare(`
      INSERT INTO members (family_id, full_name, dob, dod, marriage_anniversary, gender, native_village, gotra, bio, photo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.familyId, full_name, dob, dod, marriage_anniversary, gender, native_village, gotra, bio, photo_url);

    db.prepare("INSERT INTO audit_logs (family_id, user_id, action, details) VALUES (?, ?, ?, ?)")
      .run(req.user.familyId, req.user.id, "CREATE_MEMBER", `Added member: ${full_name}`);

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Relationships
app.get("/api/relationships", authenticateToken, (req: any, res) => {
  const relationships = db.prepare(`
    SELECT r.* FROM relationships r
    JOIN members m ON r.member_id = m.id
    WHERE m.family_id = ?
  `).all(req.user.familyId);
  res.json(relationships);
});

app.post("/api/relationships", authenticateToken, authorize(["admin", "contributor"]), (req: any, res) => {
  const { member_id, relative_id, type } = req.body;
  try {
    db.prepare("INSERT INTO relationships (member_id, relative_id, type) VALUES (?, ?, ?)")
      .run(member_id, relative_id, type);
    res.status(201).json({ message: "Relationship added" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Documents
app.get("/api/documents", authenticateToken, (req: any, res) => {
  const documents = db.prepare("SELECT * FROM documents WHERE family_id = ?").all(req.user.familyId);
  // Filter by role
  const filtered = documents.filter((doc: any) => {
    if (req.user.role === "admin") return true;
    if (req.user.role === "contributor") return doc.access_level !== "admin";
    return doc.access_level === "viewer";
  });
  res.json(filtered);
});

app.post("/api/documents", authenticateToken, authorize(["admin", "contributor"]), upload.single("file"), (req: any, res) => {
  const { title, type, member_id, access_level } = req.body;
  const file_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!file_path) return res.status(400).json({ error: "File is required" });

  try {
    const result = db.prepare(`
      INSERT INTO documents (family_id, member_id, title, type, file_path, uploaded_by, access_level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.familyId, member_id || null, title, type, file_path, req.user.id, access_level);

    db.prepare("INSERT INTO audit_logs (family_id, user_id, action, details) VALUES (?, ?, ?, ?)")
      .run(req.user.familyId, req.user.id, "UPLOAD_DOCUMENT", `Uploaded document: ${title}`);

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Audit Logs
app.get("/api/audit-logs", authenticateToken, authorize(["admin"]), (req: any, res) => {
  const logs = db.prepare(`
    SELECT a.*, u.email FROM audit_logs a
    JOIN users u ON a.user_id = u.id
    WHERE a.family_id = ?
    ORDER BY a.created_at DESC
  `).all(req.user.familyId);
  res.json(logs);
});

// Stats
app.get("/api/stats", authenticateToken, (req: any, res) => {
  const memberCount = db.prepare("SELECT COUNT(*) as count FROM members WHERE family_id = ?").get(req.user.familyId);
  const docCount = db.prepare("SELECT COUNT(*) as count FROM documents WHERE family_id = ?").get(req.user.familyId);
  const recentLogs = db.prepare(`
    SELECT a.*, u.email FROM audit_logs a
    JOIN users u ON a.user_id = u.id
    WHERE a.family_id = ?
    ORDER BY a.created_at DESC LIMIT 5
  `).all(req.user.familyId);
  
  res.json({
    memberCount: (memberCount as any).count,
    docCount: (docCount as any).count,
    recentLogs
  });
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
