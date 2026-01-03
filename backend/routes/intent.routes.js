import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/intent", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { query, preferred_slots } = req.body;

    const response = await axios.post(
      "http://localhost:5678/webhook/reconnect-orchestrator",
      {
        query,
        preferred_slots
      },
      { timeout: 5000 }
    );

    console.log("N8N RESPONSE:", response.data);

    res.json(response.data);

  } catch (error) {
    console.error("==== INTENT ROUTE ERROR ====");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response?.data);
    console.error("Config URL:", error.config?.url);

    res.status(500).json({
      error: "Intent agent failed",
      details: error.message
    });
  }
});

export default router;