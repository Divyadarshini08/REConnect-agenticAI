import express from "express";
import axios from "axios";
import db from "../db.js";

const router = express.Router();

router.post("/agent/book", async (req, res) => {
  try {
    const { query, preferred_slots, student_id } = req.body;

    // Call n8n (agents live here)
    const { data } = await axios.post(
      "http://localhost:5678/webhook/reconnect-orchestrator",
      { query, preferred_slots }
    );

    // Persist agent decision
    await db.query(
      `INSERT INTO bookings 
       (student_id, alumni_id, slot, intent, policy)
       VALUES (?, ?, ?, ?, ?)`,
      [
        student_id,
        data.matched_alumni.id,
        data.scheduled_slot,
        data.intent,
        data.system_policy
      ]
    );

    res.json({
      source: "agentic",
      ...data
    });

  } catch (err) {
    console.error("Agent gateway error:", err.message);
    res.status(500).json({ error: "Agent booking failed" });
  }
});

export default router;
