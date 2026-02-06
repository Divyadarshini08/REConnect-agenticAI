import db from "../db.js";

/**
 * Notification Agent (Node-only baseline)
 */
export const sendNotification = async (userId, message) => {
  try {
    const stmt = db.prepare('INSERT INTO notifications(user_id, message) VALUES (?, ?)');
    stmt.run(userId, message);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};
