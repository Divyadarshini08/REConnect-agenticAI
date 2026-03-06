import db from "../db.js";

/**
 * Matching Agent
 * Recommends alumni based on student department and availability
 */
export const findMatchingAlumni = async (studentId) => {
  // 1. Get student department
  const [[student]] = await db.query(
    "SELECT department FROM student_profile WHERE student_id = ?",
    [studentId]
  );

  if (!student) return [];

  // 2. Find matching alumni with free slots
  const [alumni] = await db.query(`
    SELECT 
      u.user_id AS alumni_id,
      u.name,
      a.company,
      a.designation,o
      COUNT(av.availability_id) AS free_slots
    FROM users u
    JOIN alumni_profile a ON u.user_id = a.alumni_id
    JOIN availability av ON av.alumni_id = u.user_id
    WHERE av.is_booked = false
    AND a.designation LIKE ?
    GROUP BY u.user_id
  `, [`%${student.department}%`]);

  return alumni;
};
