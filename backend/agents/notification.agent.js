import db from "../db.js";

/**
 * Notification Agent (Node-only baseline)
 */
export const sendNotification = async (userId, message) => {
  try {
    await db.query(
      "INSERT INTO notifications(user_id, message) VALUES (?, ?)",
      [userId, message]
    );
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};
