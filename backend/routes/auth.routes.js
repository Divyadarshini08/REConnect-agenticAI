import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

/**
 * REGISTER
 */
console.log("✅ AUTH ROUTES FILE LOADED");
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    skills,
    interests,
    domain,
    company,
    expertise
  } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    // 1️⃣ Insert user
    const stmt = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, email, hash, role);

    // ✅ FIX: define userId
    const userId = result.lastInsertRowid;

    // 2️⃣ Student profile
    if (role === "student") {
      const stmt = db.prepare('INSERT INTO student_profile (student_id, skills, interests) VALUES (?, ?, ?)');
      stmt.run(userId, skills, interests);
    }

    // 3️⃣ Alumni profile (WITH registration data)
    if (role === "alumni") {
      const stmt = db.prepare('INSERT INTO alumni_profile (alumni_id, domain, company, expertise) VALUES (?, ?, ?, ?)');
      stmt.run(userId, domain, company, expertise);
    }

    res.status(201).json({
      user_id: userId,
      role,
      name
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Registration failed" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user_id: user.user_id,
      role: user.role,
      name: user.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});


export default router;
