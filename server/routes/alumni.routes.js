import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import db from "../db.js";

const router = express.Router();

/* =========================
   ALUMNI PROFILE
========================= */

router.get("/profile/:id", authenticateToken, async (req, res) => {
  const alumniId = req.params.id;

  const userStmt = await db.prepare('SELECT name, email FROM users WHERE user_id=?');
  const user = userStmt.get(alumniId);

  const profileStmt = await db.prepare(`
    SELECT domain, company, expertise,
           linkedin_url, coding_url, resume_url
    FROM alumni_profile
    WHERE alumni_id=?
  `);
  const profile = profileStmt.get(alumniId);

  // ✅ SAFE RESPONSE (handles first-time users)
  res.json({
    name: user?.name || "",
    email: user?.email || "",
    domain: profile?.domain || "",
    company: profile?.company || "",
    expertise: profile?.expertise || "",
    linkedin_url: profile?.linkedin_url || "",
    coding_url: profile?.coding_url || "",
    resume_url: profile?.resume_url || "",
  });
});

router.post("/profile", authenticateToken, async (req, res) => {
  const {
    alumni_id,
    domain,
    company,
    expertise,
    linkedin_url,
    coding_url,
    resume_url,
  } = req.body;

  const stmt = await db.prepare(`
    INSERT OR REPLACE INTO alumni_profile
      (alumni_id, domain, company, expertise,
       linkedin_url, coding_url, resume_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    alumni_id,
    domain,
    company,
    expertise,
    linkedin_url,
    coding_url,
    resume_url,
  );

  res.json({ message: "Alumni profile updated" });
});
/* =========================
   AVAILABILITY
========================= */

router.post("/availability", authenticateToken, async (req, res) => {
  const { alumni_id, date, start_time, end_time } = req.body;

  const stmt = await db.prepare(`
    INSERT INTO availability (alumni_id, date, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(alumni_id, date, start_time, end_time);

  res.json({ message: "Availability added" });
});

router.get("/availability/:alumniId", authenticateToken, async (req, res) => {
  const rowsStmt = await db.prepare(`
    SELECT availability_id, date, start_time, end_time
    FROM availability
    WHERE alumni_id=?
    ORDER BY date, start_time
  `);
  const rows = rowsStmt.all(req.params.alumniId);

  res.json(rows);
});

/* =========================
   PENDING REQUESTS
========================= */

router.get("/requests/:alumniId", authenticateToken, async (req, res) => {
  const rowsStmt = await db.prepare(`
    SELECT b.booking_id,
           u.name AS student_name,
           a.date, a.start_time, a.end_time,
           a.availability_id
    FROM bookings b
    JOIN users u ON u.user_id = b.student_id
    JOIN availability a ON a.availability_id = b.availability_id
    WHERE b.alumni_id=? AND b.status='pending'
  `);
  const rows = rowsStmt.all(req.params.alumniId);

  res.json(rows);
});

/* =========================
   APPROVE / REJECT REQUEST
========================= */

router.post("/requests/update", authenticateToken, async (req, res) => {
  const { booking_id, status, availability_id } = req.body;

  if (status === "approved") {
    // 1️⃣ get slot details before deleting availability
    const slotStmt = await db.prepare(`
      SELECT date, start_time, end_time
      FROM availability
      WHERE availability_id=?
    `);
    const slot = slotStmt.get(availability_id);

    // 2️⃣ generate Google Meet link (mock)
    const meetLink = `https://meet.google.com/${Math.random()
      .toString(36)
      .substring(2, 7)}-${Math.random()
      .toString(36)
      .substring(2, 6)}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    // 3️⃣ update booking with slot + meet link
    const updateStmt = await db.prepare(`
    UPDATE bookings
    SET status='approved',
        date=?,
        start_time=?,
        end_time=?,
        meet_link=?
    WHERE booking_id=?
    `);
    updateStmt.run(
      slot.date,
      slot.start_time,
      slot.end_time,
      meetLink,
      booking_id,
    );

    // 4️⃣ delete availability so it cannot be reused
    const deleteStmt = await db.prepare('DELETE FROM availability WHERE availability_id=?');
    deleteStmt.run(availability_id);
  } else {
    // rejected
    const updateStmt = await db.prepare('UPDATE bookings SET status=? WHERE booking_id=?');
    updateStmt.run(status, booking_id);
  }

  res.json({ message: `Booking ${status}` });
});

/* =========================
   UPCOMING SESSIONS
========================= */

router.get("/upcoming/:alumniId", authenticateToken, async (req, res) => {
  const rowsStmt = await db.prepare(`
    SELECT b.booking_id,
           u.name AS student_name,
           b.date, b.start_time, b.end_time
    FROM bookings b
    JOIN users u ON u.user_id = b.student_id
    WHERE b.alumni_id=?
      AND b.status='approved'
    ORDER BY b.date
  `);
  const rows = rowsStmt.all(req.params.alumniId);

  res.json(rows);
});

/* =========================
   COMPLETE SESSION
========================= */

router.post("/sessions/complete", authenticateToken, async (req, res) => {
  const { booking_id } = req.body;

  const stmt = await db.prepare(`
    UPDATE bookings
    SET status='completed'
    WHERE booking_id=?
  `);
  stmt.run(booking_id);

  res.json({ message: "Session marked as completed" });
});

/* =========================
   ALUMNI DASHBOARD STATS
========================= */

router.get("/dashboard/:alumniId", authenticateToken, async (req, res) => {
  const alumniId = req.params.alumniId;

  const pendingStmt = await db.prepare('SELECT COUNT(*) AS c FROM bookings WHERE alumni_id=? AND status=?');
  const pending = pendingStmt.get(alumniId, 'pending');

  const upcomingStmt = await db.prepare('SELECT COUNT(*) AS c FROM bookings WHERE alumni_id=? AND status=?');
  const upcoming = upcomingStmt.get(alumniId, 'approved');

  const completedStmt = await db.prepare('SELECT COUNT(*) AS c FROM bookings WHERE alumni_id=? AND status=?');
  const completed = completedStmt.get(alumniId, 'completed');

  res.json({
    pending: pending.c,
    upcoming: upcoming.c,
    completed: completed.c,
  });
});

export default router;