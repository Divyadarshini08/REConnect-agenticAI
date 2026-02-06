import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * STUDENT BOOKING REQUEST
 */
router.post("/request", async (req, res) => {
  const { student_id, availability_id } = req.body;

  const slotStmt = db.prepare('SELECT * FROM availability WHERE availability_id=? AND is_booked=0');
  const slot = slotStmt.get(availability_id);

  if (!slot) {
    return res.status(400).json({ message: "Slot not available" });
  }

  const stmt = db.prepare('INSERT INTO bookings (student_id, alumni_id, availability_id, status) VALUES (?, ?, ?, ?)');
  stmt.run(student_id, slot.alumni_id, availability_id, 'pending');

  res.json({ message: "Booking request sent. Awaiting approval." });
});

export default router;
