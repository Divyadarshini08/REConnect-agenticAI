import { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const MySessions = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.user_id) {
      fetchSessions();
    }
  }, [user?.user_id, filter]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/student/sessions/${user.user_id}`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge-pending",
      approved: "badge-approved",
      rejected: "badge-rejected",
      completed: "badge-completed"
    };
    
    return (
      <span className={`badge ${statusClasses[status] || "badge-primary"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredSessions = sessions.filter(session => 
    filter === "all" ? true : session.status === filter
  );

  const getSessionStats = () => {
    return sessions.reduce((acc, session) => {
      acc[session.status] = (acc[session.status] || 0) + 1;
      return acc;
    }, {});
  };

  const stats = getSessionStats();

  if (loading) {
    return (
      <div className="page">
        <div className="flex items-center justify-center" style={{ height: "200px" }}>
          <div className="loading"></div>
          <span className="ml-md">Loading sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Sessions</h1>
        <p className="page-subtitle">Track all your mentoring sessions and requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 mb-xl">
        <div className="stat-card text-center">
          <div className="stat-value">{sessions.length}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card text-center">
          <div className="stat-value text-warning">{stats.pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card text-center">
          <div className="stat-value text-success">{stats.approved || 0}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card text-center">
          <div className="stat-value text-primary">{stats.completed || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card mb-xl">
        <div className="card-content">
          <div className="flex flex-wrap gap-md items-center">
            <h3 className="mb-0 mr-lg">Filter by status:</h3>
            <div className="flex gap-sm flex-wrap">
              <button
                className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFilter("all")}
              >
                All ({sessions.length})
              </button>
              <button
                className={`btn btn-sm ${filter === "pending" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFilter("pending")}
              >
                Pending ({stats.pending || 0})
              </button>
              <button
                className={`btn btn-sm ${filter === "approved" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFilter("approved")}
              >
                Approved ({stats.approved || 0})
              </button>
              <button
                className={`btn btn-sm ${filter === "completed" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFilter("completed")}
              >
                Completed ({stats.completed || 0})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Session History</h2>
          <p className="text-secondary">
            {filteredSessions.length} {filteredSessions.length === 1 ? "session" : "sessions"} found
          </p>
        </div>

        <div className="card-content">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-xl">
              <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-lg)", opacity: 0.6 }}>
                📅
              </div>
              <h3 className="mb-sm">No sessions found</h3>
              <p className="text-secondary mb-lg">
                {filter === "all" 
                  ? "You haven't booked any sessions yet." 
                  : `No ${filter} sessions found.`}
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/student/find-alumni")}
              >
                Book Your First Session
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              {filteredSessions.map((session) => (
                <div 
                  key={session.booking_id} 
                  className="card"
                  style={{
                    borderLeft: "4px solid var(--primary-500)",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="mb-sm">
                        Session with <span className="text-primary">{session.alumni_name || `Alumni #${session.alumni_id}`}</span>
                      </h3>
                      
                      {session.date && (
                        <div className="flex items-center gap-md mb-sm">
                          <span className="text-tertiary">📅</span>
                          <span>{session.date}</span>
                          <span className="text-tertiary">•</span>
                          <span>{session.start_time} - {session.end_time}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-md">
                        <span className="text-tertiary">📍</span>
                        <span>Session ID: {session.booking_id}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-sm">
                      {getSessionStatusBadge(session.status)}
                      {session.status === "approved" && (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate("/student/upcoming-sessions")}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {sessions.length > 0 && (
        <div className="card mt-xl">
          <div className="card-content text-center">
            <h3 className="mb-md">Need more mentoring sessions?</h3>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/student/find-alumni")}
            >
              Find More Alumni Mentors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessions;
