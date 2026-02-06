import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
import { getBookingEndpoint } from "../../services/api";

const AlumniSlots = () => {
  const navigate = useNavigate();
  const { alumniId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [slots, setSlots] = useState([]);
  const [alumniInfo, setAlumniInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (alumniId) {
      fetchAlumniInfo();
      fetchSlots();
    }
  }, [alumniId]);

  const fetchAlumniInfo = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll just set some placeholder data
      setAlumniInfo({
        name: "Alumni Mentor",
        domain: "Professional Mentor",
        company: "Tech Company"
      });
    } catch (error) {
      console.error("Error fetching alumni info:", error);
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/student/alumni-slots/${alumniId}`);
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error("Slot fetch error:", error);
      showMessage("Failed to load available slots", "error");
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async (availability_id) => {
    setBookingLoading(availability_id);
    try {
      const payload = {
        student_id: user.user_id,
        availability_id,
        query: "Need career guidance"
      };

      const res = await fetch(getBookingEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok) {
        showMessage("Booking request sent successfully! Check your sessions page for updates.", "success");
        // Remove the booked slot from the list
        setSlots(prev => prev.filter(slot => slot.availability_id !== availability_id));
      } else {
        showMessage(data.message || "Booking failed", "error");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      showMessage("Network error occurred. Please try again.", "error");
    } finally {
      setBookingLoading(null);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTimeOfDay = (timeString) => {
    const [hours] = timeString.split(':').map(Number);
    if (hours < 12) return "Morning";
    if (hours < 17) return "Afternoon";
    return "Evening";
  };

  if (loading) {
    return (
      <div className="page">
        <div className="flex items-center justify-center" style={{ height: "200px" }}>
          <div className="loading"></div>
          <span className="ml-md">Loading available slots...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center gap-lg">
          <button 
            className="btn btn-outline"
            onClick={() => navigate(-1)}
            style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}
          >
            ← Back
          </button>
          <div>
            <h1 className="page-title mb-0">Book a Session</h1>
            <p className="page-subtitle mb-0">Select an available time slot</p>
          </div>
        </div>
      </div>

      {/* Alumni Header */}
      {alumniInfo && (
        <div className="card mb-xl">
          <div className="card-content">
            <div className="flex items-center gap-lg">
              <div 
                className="user-avatar"
                style={{
                  width: "70px",
                  height: "70px",
                  fontSize: "var(--font-size-xl)",
                  minWidth: "70px"
                }}
              >
                {getUserInitials(alumniInfo.name)}
              </div>
              <div>
                <h2 className="mb-xs">{alumniInfo.name}</h2>
                <div className="flex gap-md">
                  <span className="badge badge-primary">{alumniInfo.domain}</span>
                  <span className="badge badge-secondary">{alumniInfo.company}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message.text && (
        <div className={`alert alert-${message.type} mb-xl`}>
          {message.text}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-3 mb-xl">
        <div className="stat-card text-center">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{slots.length}</div>
          <div className="stat-label">Available Slots</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">
            {slots.length > 0 
              ? new Set(slots.map(s => new Date(s.date).toDateString())).size
              : 0}
          </div>
          <div className="stat-label">Different Days</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="stat-icon">🕐</div>
          <div className="stat-value text-primary">
            {slots.length > 0 
              ? getTimeOfDay(slots[0]?.start_time || "00:00")
              : '—'}
          </div>
          <div className="stat-label">Next Available</div>
        </div>
      </div>

      {/* Slots List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Available Time Slots</h2>
          <p className="text-secondary">
            {slots.length} {slots.length === 1 ? "slot" : "slots"} available
          </p>
        </div>

        <div className="card-content">
          {slots.length === 0 ? (
            <div className="text-center py-xl">
              <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-lg)", opacity: 0.6 }}>
                📅
              </div>
              <h3 className="mb-sm">No slots available</h3>
              <p className="text-secondary mb-lg">
                This alumni doesn't have any available slots at the moment.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/student/find-alumni")}
              >
                Find Other Mentors
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-lg">
              {slots.map((slot) => (
                <div 
                  key={slot.availability_id}
                  className="card"
                  style={{
                    borderLeft: "4px solid var(--success-500)",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="mb-sm">
                        {formatDate(slot.date)}
                      </h3>
                      
                      <div className="flex items-center gap-md mb-sm">
                        <span className="text-tertiary">⏰</span>
                        <span className="font-medium">
                          {slot.start_time} - {slot.end_time}
                        </span>
                        <span className="text-tertiary">•</span>
                        <span className="badge badge-primary">
                          {getTimeOfDay(slot.start_time)}
                        </span>
                      </div>
                      
                      <div className="text-tertiary text-sm">
                        Slot ID: {slot.availability_id}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="mb-md">
                        <span className="badge badge-success">Available</span>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => bookSlot(slot.availability_id)}
                        disabled={bookingLoading === slot.availability_id}
                      >
                        {bookingLoading === slot.availability_id ? (
                          <>
                            <span className="loading"></span>
                            Requesting...
                          </>
                        ) : (
                          "Request Session"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Tips */}
      <div className="card mt-xl">
        <div className="card-header">
          <h3 className="card-title mb-0">Booking Tips</h3>
        </div>
        <div className="card-content">
          <ul className="text-secondary" style={{ paddingLeft: "var(--spacing-lg)" }}>
            <li className="mb-sm">Book sessions in advance to secure your preferred time slot</li>
            <li className="mb-sm">Prepare specific questions or topics you'd like to discuss</li>
            <li className="mb-sm">Check your email for confirmation and meeting details</li>
            <li>Be respectful of the alumni's time and join sessions punctually</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlumniSlots;
