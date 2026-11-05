
import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// DATABASE
const db = new Database(path.join(__dirname, "evolve3.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY,
    display_name TEXT,
    bio TEXT DEFAULT '',
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tribes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tribe_members (
    user_id INTEGER NOT NULL,
    tribe_id TEXT NOT NULL,
    joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, tribe_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(tribe_id) REFERENCES tribes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS missions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS mission_progress (
    user_id INTEGER NOT NULL,
    mission_id TEXT NOT NULL,
    completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, mission_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(mission_id) REFERENCES missions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);
// CHECK FOR PROFILE COMPLETION TRACKING COLUMN
const profileColumns = db.pragma("table_info(profiles)");

if (!profileColumns.some(column => column.name === "profile_updated_at")) {
  db.exec("ALTER TABLE profiles ADD COLUMN profile_updated_at TEXT");
}

// STARTER TRIBES
const starterTribes = [
  ["builders-dao", "Builders DAO", "A community for builders and developers."],
  ["nft-creators", "NFT Creators", "A space for digital creators."],
  ["defi-explorers", "DeFi Explorers", "Explore decentralized finance."],
  ["governance-guild", "Governance Guild", "Discuss community governance."]
];

const addTribe = db.prepare(
  "INSERT OR IGNORE INTO tribes (id, name, description) VALUES (?, ?, ?)"
);

for (const tribe of starterTribes) {
  addTribe.run(...tribe);
}

// STARTER MISSIONS
const starterMissions = [
  ["complete-profile", "Complete your profile", "Add your profile information."],
  ["join-tribe", "Join your first tribe", "Become part of a community."],
  ["explore-dashboard", "Explore EVOLVE3", "Explore your dashboard."]
];

const addMission = db.prepare(
  "INSERT OR IGNORE INTO missions (id, title, description) VALUES (?, ?, ?)"
);

for (const mission of starterMissions) {
  addMission.run(...mission);
}

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "evolve3.sid",
    secret: process.env.SESSION_SECRET || "change-this-before-online-deployment",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Serve existing frontend files
app.use(express.static(__dirname));

// AUTHENTICATION CHECK
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Please log in first."
    });
  }

  next();
}

// ACTIVITY HELPER
function recordActivity(userId, message) {
  db.prepare(
    "INSERT INTO activity (user_id, message) VALUES (?, ?)"
  ).run(userId, message);
}

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "EVOLVE3 backend is running."
  });
});

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a username, email, and password."
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 2 || cleanUsername.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 2 and 30 characters."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 characters."
      });
    }

    const existingUser = db.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).get(cleanEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `).run(cleanUsername, cleanEmail, hashedPassword);

    const userId = Number(result.lastInsertRowid);

    db.prepare(`
      INSERT INTO profiles (user_id, display_name)
      VALUES (?, ?)
    `).run(userId, cleanUsername);

    recordActivity(userId, "Created an EVOLVE3 account.");

    req.session.userId = userId;

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: userId,
        username: cleanUsername,
        email: cleanEmail
      }
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create your account."
    });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Enter your email and password."
      });
    }

    const user = db.prepare(
      "SELECT * FROM users WHERE email = ?"
    ).get(email.trim().toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password."
      });
    }

    req.session.userId = user.id;

    res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Could not log in."
    });
  }
});

// LOGOUT
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Could not log out."
      });
    }

    res.clearCookie("evolve3.sid");

    res.json({
      success: true,
      message: "Logged out successfully."
    });
  });
});

// CURRENT USER
app.get("/api/me", requireLogin, (req, res) => {
  const user = db.prepare(`
    SELECT users.id, users.username, users.email,
           profiles.display_name, profiles.bio
    FROM users
    LEFT JOIN profiles ON profiles.user_id = users.id
    WHERE users.id = ?
  `).get(req.session.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found."
    });
  }

  res.json({ success: true, user });
});

// UPDATE PROFILE
app.put("/api/profile", requireLogin, (req, res) => {
  const { display_name, bio } = req.body;

  if (
    typeof display_name !== "string" ||
    typeof bio !== "string" ||
    display_name.trim().length < 2 ||
    display_name.trim().length > 40 ||
    bio.length > 250
  ) {
    return res.status(400).json({
      success: false,
      message: "Please check your profile details."
    });
  }

  db.prepare(`
   UPDATE profiles
SET display_name = ?, bio = ?, profile_updated_at = CURRENT_TIMESTAMP
WHERE user_id = ?
  `).run(display_name.trim(), bio.trim(), req.session.userId);

  recordActivity(req.session.userId, "Updated their profile.");

  res.json({
    success: true,
    message: "Profile updated."
  });
});

// GET TRIBES
app.get("/api/tribes", (req, res) => {
  const tribes = db.prepare(`
    SELECT
      t.id,
      t.name,
      t.description,

      (
        SELECT COUNT(*)
        FROM tribe_members tm
        WHERE tm.tribe_id = t.id
      ) AS members,

      CASE
        WHEN EXISTS (
          SELECT 1
          FROM tribe_members mine
          WHERE mine.tribe_id = t.id
          AND mine.user_id = ?
        )
        THEN 1
        ELSE 0
      END AS joined

    FROM tribes t
    ORDER BY t.name
  `).all(req.session.userId || -1);

  res.json({ success: true, tribes });
});

// JOIN A TRIBE
app.post("/api/tribes/:id/join", requireLogin, (req, res) => {
  const tribe = db.prepare(
    "SELECT * FROM tribes WHERE id = ?"
  ).get(req.params.id);

  if (!tribe) {
    return res.status(404).json({
      success: false,
      message: "Tribe not found."
    });
  }

  const result = db.prepare(`
    INSERT OR IGNORE INTO tribe_members (user_id, tribe_id)
    VALUES (?, ?)
  `).run(req.session.userId, tribe.id);

  if (result.changes > 0) {
    recordActivity(req.session.userId, `Joined ${tribe.name}.`);
  }

  res.json({
    success: true,
    message: result.changes > 0
      ? `You joined ${tribe.name}.`
      : "You have already joined this tribe."
  });
});

// GET MISSIONS
app.get("/api/missions", requireLogin, (req, res) => {
  const missions = db.prepare(`
    SELECT missions.id, missions.title, missions.description,
           mission_progress.completed_at,
           CASE WHEN mission_progress.user_id IS NULL
                THEN 0 ELSE 1 END AS completed
    FROM missions
    LEFT JOIN mission_progress
      ON missions.id = mission_progress.mission_id
      AND mission_progress.user_id = ?
    ORDER BY missions.title
  `).all(req.session.userId);

  res.json({ success: true, missions });
});

// COMPLETE A MISSION — VERIFY BEFORE SAVING
app.post("/api/missions/:id/complete", requireLogin, (req, res) => {
  const userId = req.session.userId;
  const missionId = req.params.id;

  const mission = db.prepare(
    "SELECT * FROM missions WHERE id = ?"
  ).get(missionId);

  if (!mission) {
    return res.status(404).json({
      success: false,
      message: "Mission not found."
    });
  }

  let eligible = false;

  if (missionId === "complete-profile") {
    const profile = db.prepare(`
      SELECT profile_updated_at
      FROM profiles
      WHERE user_id = ?
    `).get(userId);

    eligible = Boolean(profile && profile.profile_updated_at);
  }

  else if (missionId === "join-tribe") {
    const membership = db.prepare(`
      SELECT 1
      FROM tribe_members
      WHERE user_id = ?
      LIMIT 1
    `).get(userId);

    eligible = Boolean(membership);
  }

  else if (missionId === "explore-dashboard") {
    // This mission is triggered by the frontend Explore action.
    eligible = true;
  }

  if (!eligible) {
    return res.status(409).json({
      success: false,
      completed: false,
      message: "Mission incomplete. Complete the required action first."
    });
  }

  const result = db.prepare(`
    INSERT OR IGNORE INTO mission_progress (user_id, mission_id)
    VALUES (?, ?)
  `).run(userId, missionId);

  if (result.changes > 0) {
    recordActivity(userId, `Completed: ${mission.title}.`);
  }

  res.json({
    success: true,
    completed: true,
    message: result.changes > 0
      ? "Mission completed successfully!"
      : "You already completed this mission."
  });
});

// GET USER ACTIVITY
app.get("/api/activity", requireLogin, (req, res) => {
  const activities = db.prepare(`
    SELECT message, created_at
    FROM activity
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT 30
  `).all(req.session.userId);

  res.json({ success: true, activities });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`EVOLVE3 running at http://localhost:${PORT}`);
});
