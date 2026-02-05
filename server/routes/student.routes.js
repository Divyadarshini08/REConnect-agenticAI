import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import db from "../db.js";

const router = express.Router();

/**
 * GET student profile
 */
router.get("/profile/:id", authenticateToken, async (req, res) => {
  const studentId = req.params.id;

  const userStmt = await db.prepare('SELECT name, email FROM users WHERE user_id = ?');
  const user = userStmt.get(studentId);

  const profileStmt = await db.prepare('SELECT skills, interests, linkedin_url, coding_url, resume_url FROM student_profile WHERE student_id = ?');
  const profile = profileStmt.get(studentId);

  res.json({
    name: user?.name || "",
    email: user?.email || "",
    skills: profile?.skills || "",
    interests: profile?.interests || "",
    linkedin_url: profile?.linkedin_url || "",
    coding_url: profile?.coding_url || "",
    resume_url: profile?.resume_url || "",
  });
});

/**
 * UPDATE student profile
 */
router.post("/profile", authenticateToken, async (req, res) => {
  const {
    student_id,
    skills,
    interests,
    linkedin_url,
    coding_url,
    resume_url,
  } = req.body;

  const stmt = await db.prepare(`INSERT OR REPLACE INTO student_profile
     (student_id, skills, interests, linkedin_url, coding_url, resume_url)
     VALUES (?, ?, ?, ?, ?, ?)`);
  stmt.run(student_id, skills, interests, linkedin_url, coding_url, resume_url);

  res.json({ message: "Student profile updated" });
});

/**
 * STUDENT DASHBOARD
 */
router.get("/dashboard/:studentId", authenticateToken, async (req, res) => {
  const studentId = req.params.studentId;

  const studentStmt = await db.prepare('SELECT skills, interests FROM student_profile WHERE student_id=?');
  const student = studentStmt.get(studentId);

  if (!student) {
    return res.json({ alumni: 0, sessions: 0 });
  }

  const alumniCountStmt = await db.prepare(`
    SELECT COUNT(DISTINCT u.user_id) AS count
    FROM users u
    JOIN alumni_profile ap ON ap.alumni_id = u.user_id
    JOIN availability av ON av.alumni_id = u.user_id
    WHERE u.role='alumni'
      AND av.is_booked=0
      AND (ap.domain LIKE ? OR ap.expertise LIKE ?)
  `);
  const alumniCount = alumniCountStmt.get(`%${student.interests}%`, `%${student.skills}%`);

  const sessionsCountStmt = await db.prepare('SELECT COUNT(*) AS count FROM bookings WHERE student_id=?');
  const sessionsCount = sessionsCountStmt.get(studentId);

  res.json({
    alumni: alumniCount?.count || 0,
    sessions: sessionsCount?.count || 0,
  });
});

/**
 * AVAILABLE ALUMNI (MATCHED)
 */
router.get("/available-alumni/:studentId", authenticateToken, async (req, res) => {
  const studentId = req.params.studentId;

  const studentStmt = await db.prepare('SELECT skills, interests FROM student_profile WHERE student_id=?');
  const student = studentStmt.get(studentId);

  if (!student) return res.json([]);

  const rowsStmt = await db.prepare(`
    SELECT DISTINCT
      u.user_id AS alumni_id,
      u.name,
      ap.domain,
      ap.company
    FROM users u
    JOIN alumni_profile ap ON ap.alumni_id = u.user_id
    JOIN availability av ON av.alumni_id = u.user_id
    WHERE u.role='alumni'
      AND av.is_booked=0
      AND (ap.domain LIKE ? OR ap.expertise LIKE ?)
  `);
  const rows = rowsStmt.all(`%${student.interests}%`, `%${student.skills}%`);

  res.json(rows);
});

/**
 * ALUMNI SLOTS (student view)
 */
router.get("/alumni-slots/:alumniId", authenticateToken, async (req, res) => {
  const rowsStmt = await db.prepare(`
    SELECT availability_id, date, start_time, end_time
    FROM availability
    WHERE alumni_id=? AND is_booked=0
  `);
  const rows = rowsStmt.all(req.params.alumniId);

  res.json(rows);
});

/**
 * STUDENT SESSIONS
 */
router.get("/sessions/:studentId", authenticateToken, async (req, res) => {
  const rowsStmt = await db.prepare(`
    SELECT b.booking_id, b.status,
           u.name AS alumni_name,
           av.date, av.start_time, av.end_time
    FROM bookings b
    JOIN users u ON u.user_id = b.alumni_id
    JOIN availability av ON av.availability_id = b.availability_id
    WHERE b.student_id = ?
    ORDER BY av.date
  `);
  const rows = rowsStmt.all(req.params.studentId);

  res.json(rows);
});

/**
 * STUDENT UPCOMING SESSIONS
 */
router.get("/upcoming/:studentId", authenticateToken, async (req, res) => {
  const rowsStmt = await db.prepare(`
    SELECT b.booking_id,
           b.date, b.start_time, b.end_time,
           b.meet_link,
           u.name AS alumni_name,
           ap.company
    FROM bookings b
    JOIN users u ON u.user_id = b.alumni_id
    LEFT JOIN alumni_profile ap ON ap.alumni_id = b.alumni_id
    WHERE b.student_id = ?
      AND b.status = 'approved'
    ORDER BY b.date
  `);
  const rows = rowsStmt.all(req.params.studentId);

  res.json(rows);
});

export default router;