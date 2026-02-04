import db from "../db.js";

export const logMetric = async (type, value) => {
  try {
    const stmt = db.prepare('INSERT INTO metrics (type, value) VALUES (?, ?)');
    stmt.run(type, value);
  } catch (error) {
    // Silently fail on metric logging errors to not affect main functionality
    console.debug && console.debug("Metric logging failed:", error.message);
  }
};
