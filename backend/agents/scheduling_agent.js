import db from "../db.js";

/**
 * Scheduling Agent
 * Schedules a session between student and alumni
 */
export const scheduleSession = async ({
    studentId,
    alumniId,
    preferredDate
}) => {

    // 1. Fetch an available slot for alumni
    const [[slot]] = await db.query(
        `
    SELECT availability_id, start_time, end_time
    FROM availability
    WHERE alumni_id = ?
      AND is_booked = false
      AND DATE(start_time) = ?
    ORDER BY start_time ASC
    LIMIT 1
    `,
        [alumniId, preferredDate]
    );

    if (!slot) {
        return {
            success: false,
            reason: "NO_SLOTS_AVAILABLE"
        };
    }

    // 2. Lock & book the slot
    await db.query(
        `
    UPDATE availability
    SET is_booked = true
    WHERE availability_id = ?
    `,
        [slot.availability_id]
    );

    // 3. Create session
    await db.query(
        `
    INSERT INTO sessions (
      student_id,
      alumni_id,
      availability_id,
      start_time,
      end_time,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
        [
            studentId,
            alumniId,
            slot.availability_id,
            slot.start_time,
            slot.end_time,
            "CONFIRMED"
        ]
    );

    return {
        success: true,
        session: {
            alumniId,
            start_time: slot.start_time,
            end_time: slot.end_time,
            status: "CONFIRMED"
        }
    };
};
        