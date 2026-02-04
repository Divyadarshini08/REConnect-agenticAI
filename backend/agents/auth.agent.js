import bcrypt from "bcrypt";
import db from "../db.js";

export const authenticateUser = async (email, password) => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);

    return isMatch ? user : null;
  } catch (error) {
    console.error('Authentication error:', error.message);
    return null;
  }
};
