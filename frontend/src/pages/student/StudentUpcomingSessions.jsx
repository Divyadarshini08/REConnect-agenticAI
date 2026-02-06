import { useEffect, useState } from "react";
import { API } from "../../utils/api";

const StudentUpcomingSessions = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (user?.user_id) {
      fetchSessions();
    }
  }, [user?.user_id]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/student/upcoming/${user.user_id}`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "name") {
      return a.alumni_name.localeCompare(b.alumni_name);
    }
    return 0;
  });

  const getTimeUntilSession = (sessionDate) => {
    const now = new Date();
    const sessionTime = new Date(sessionDate);
    const diffTime = sessionTime - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Session passed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  const isSessionSoon = (sessionDate, startTime) => {
    const sessionDateTime = new Date(`${sessionDate}T${startTime}`);
    const now = new Date();
    const diffHours = (sessionDateTime - now) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="flex items-center justify-center" style={{ height: "200px" }}>
          <div className="loading"></div>
          <span className="ml-md">Loading upcoming sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Upcoming Sessions</h1>
        <p className="page-subtitle">Your scheduled mentoring sessions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 mb-xl">
        <div className="stat-card text-center">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{sessions.length}</div>
          <div className="stat-label">Total Upcoming</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="stat-icon">⏰</div>
          <div className="stat-value text-warning">
            {sessions.filter(s => isSessionSoon(s.date, s.start_time)).length}
          </div>
          <div className="stat-label">Sessions Soon</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="stat-icon">🗓️</div>
          <div className="stat-value text-primary">
            {sessions.length > 0 
              ? new Date(Math.min(...sessions.map(s => new Date(s.date)))).toLocaleDateString('en-US', { month: 'short' })
              : '—'}
          </div>
          <div className="stat-label">Next Session</div>
        </div>
      </div>

      {/* Controls */}
      {sessions.length > 0 && (
        <div className="card mb-xl">
          <div className="card-content">
            <div className="flex flex-wrap gap-md items-center justify-between">
              <div>
                <h3 className="mb-0">Manage Sessions</h3>
                <p className="text-secondary mb-0">Sort and organize your upcoming sessions</p>
              </div>
              <div className="flex gap-sm">
                <label className="form-label mb-0">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ width: "auto", minWidth: "120px" }}
                >
                  <option value="date">Date</option>
                  <option value="name">Alumni Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Scheduled Sessions</h2>
          <p className="text-secondary">
            {sortedSessions.length} {sortedSessions.length === 1 ? "session" : "sessions"} scheduled
          </p>
        </div>

        <div className="card-content">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-xl">
              <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-lg)", opacity: 0.6 }}>
                🕐
              </div>
              <h3 className="mb-sm">No upcoming sessions</h3>
              <p className="text-secondary mb-lg">
                You don't have any scheduled sessions yet.
              </p>
              <button className="btn btn-primary">
                Book a Session
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-lg">
              {sortedSessions.map((session) => (
                <div 
                  key={session.booking_id}
                  className="card"
                  style={{
                    borderLeft: isSessionSoon(session.date, session.start_time) 
                      ? "4px solid var(--warning-500)" 
                      : "4px solid var(--primary-500)",
                    position: "relative"
                  }}
                >
                  {/* Session Soon Badge */}
                  {isSessionSoon(session.date, session.start_time) && (
                    <div 
                      className="badge badge-warning"
                      style={{
                        position: "absolute",
                        top: "var(--spacing-md)",
                        right: "var(--spacing-md)"
                      }}
                    >
                      ⏰ Session Soon
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="mb-sm">
                        Session with <span className="text-primary">{session.alumni_name}</span>
                      </h3>
                      
                      {session.company && (
                        <div className="flex items-center gap-md mb-sm">
                          <span className="text-tertiary">🏢</span>
                          <span className="badge badge-primary">{session.company}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-md mb-lg">
                        <div>
                          <div className="text-tertiary text-sm mb-xs">📅 Date</div>
                          <div className="font-medium">{new Date(session.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</div>
                        </div>
                        
                        <div>
                          <div className="text-tertiary text-sm mb-xs">⏰ Time</div>
                          <div className="font-medium">{session.start_time} - {session.end_time}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-md">
                        <span className="text-tertiary">⏳</span>
                        <span className="text-secondary">
                          {getTimeUntilSession(session.date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-md">
                      {session.meet_link ? (
                        <a
                          href={session.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          🎥 Join Session
                        </a>
                      ) : (
                        <div className="btn btn-outline disabled" style={{ opacity: 0.6 }}>
                          Meeting Link Pending
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-tertiary text-sm">Session ID</div>
                        <div className="font-mono text-sm">{session.booking_id}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      {sessions.length > 0 && (
        <div className="card mt-xl">
          <div className="card-header">
            <h3 className="card-title mb-0">Session Tips</h3>
          </div>
          <div className="card-content">
            <ul className="text-secondary" style={{ paddingLeft: "var(--spacing-lg)" }}>
              <li className="mb-sm">Prepare questions in advance for maximum value</li>
              <li className="mb-sm">Join 5-10 minutes early to test your connection</li>
              <li className="mb-sm">Have your camera and microphone ready</li>
              <li>Share your screen if discussing specific projects or code</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentUpcomingSessions;
