import db from "../db.js";

export const createBooking = async (studentId, availabilityId) => {
  try {
    const slotStmt = db.prepare('SELECT * FROM availability WHERE availability_id=? AND is_booked=0');
    const slot = slotStmt.get(availabilityId);
    if (!slot) return false;

    const stmt = db.prepare('INSERT INTO bookings(student_id, alumni_id, availability_id, status) VALUES (?, ?, ?, ?)');
    stmt.run(studentId, slot.alumni_id, availabilityId, 'pending');

    return true;
  } catch (error) {
    console.error('Error creating booking:', error.message);
    return false;
  }
};
