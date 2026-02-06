import db from "../db.js";

/**
 * Matching Agent
 * Recommends alumni based on student skills/interests and availability
 */
export const findMatchingAlumni = async (studentId) => {
  try {
    // 1. Get student skills and interests
    const studentStmt = db.prepare('SELECT skills, interests FROM student_profile WHERE student_id = ?');
    const student = studentStmt.get(studentId);

    if (!student) return [];

    // 2. Find matching alumni with free slots based on skills/interests
    const alumniStmt = db.prepare(`
      SELECT 
        u.user_id AS alumni_id,
        u.name,
        ap.company,
        ap.domain AS designation,
        COUNT(av.availability_id) AS free_slots
      FROM users u
      JOIN alumni_profile ap ON u.user_id = ap.alumni_id
      JOIN availability av ON av.alumni_id = u.user_id
      WHERE av.is_booked = 0
      AND (ap.domain LIKE ? OR ap.expertise LIKE ?)
      GROUP BY u.user_id
    `);
    const alumni = alumniStmt.all(`%${student.interests}%`, `%${student.skills}%`);

    return alumni;
  } catch (error) {
    console.error('Error in matching agent:', error.message);
    return [];
  }
};
