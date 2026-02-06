import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Demo data for student dashboard
  const [stats, setStats] = useState({
    alumni: 12,
    sessions: 3,
    upcoming: 2,
    completed: 1
  });

  const [quickActions] = useState([
    {
      title: "Find Alumni",
      description: "Discover mentors matching your interests",
      icon: "👥",
      action: () => navigate("/student/find-alumni"),
      color: "primary"
    },
    {
      title: "Book Session",
      description: "Schedule a mentoring session",
      icon: "📅",
      action: () => navigate("/student/find-alumni"),
      color: "secondary"
    },
    {
      title: "My Profile",
      description: "Update your skills and interests",
      icon: "👤",
      action: () => navigate("/student/profile"),
      color: "success"
    },
    {
      title: "Upcoming Sessions",
      description: "View your scheduled meetings",
      icon: "⏰",
      action: () => navigate("/student/upcoming-sessions"),
      color: "warning"
    }
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // In a real implementation, this would fetch from backend
    console.log("Student dashboard loaded for:", user.email);
  }, [user, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          {getGreeting()}, {user?.name || "Student"} 👋
        </h1>
        <p className="page-subtitle">
          Here's your personalized learning overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.alumni}</div>
          <div className="stat-label">Available Alumni</div>
          <div className="badge badge-primary mt-sm">
            <span>✓</span> Ready to Connect
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.sessions}</div>
          <div className="stat-label">Total Sessions</div>
          <div className="flex gap-md mt-sm">
            <div className="badge badge-approved">
              <span>↑</span> {stats.upcoming} Upcoming
            </div>
            <div className="badge badge-completed">
              <span>✓</span> {stats.completed} Completed
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">85%</div>
          <div className="stat-label">Learning Progress</div>
          <div className="badge badge-success mt-sm">
            <span>↗</span> On Track
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">4.8</div>
          <div className="stat-label">Average Rating</div>
          <div className="badge badge-warning mt-sm">
            <span>★</span> Excellent
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="card mt-xl">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
          <p className="text-secondary">Get started with your mentoring journey</p>
        </div>
        
        <div className="card-content">
          <div className="grid grid-cols-2">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="card stat-card"
                style={{
                  cursor: "pointer",
                  transition: "all var(--transition-normal)"
                }}
                onClick={action.action}
              >
                <div className="stat-icon" style={{ fontSize: "2.5rem", marginBottom: "var(--spacing-md)" }}>
                  {action.icon}
                </div>
                <h3 className="stat-label" style={{ marginBottom: "var(--spacing-xs)" }}>
                  {action.title}
                </h3>
                <p className="text-secondary" style={{ fontSize: "var(--font-size-sm)", marginBottom: "var(--spacing-md)" }}>
                  {action.description}
                </p>
                <button className={`btn btn-${action.color} btn-sm`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-xl">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        
        <div className="card-content">
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-md p-md rounded" style={{ background: "var(--card-bg)" }}>
              <div className="user-avatar" style={{ width: "40px", height: "40px", fontSize: "var(--font-size-sm)" }}>
                JD
              </div>
              <div className="flex-1">
                <p className="mb-xs"><strong>John Doe</strong> approved your session request</p>
                <p className="text-tertiary text-sm">2 hours ago</p>
              </div>
              <div className="badge badge-approved">Approved</div>
            </div>
            
            <div className="flex items-center gap-md p-md rounded" style={{ background: "var(--card-bg)" }}>
              <div className="user-avatar" style={{ width: "40px", height: "40px", fontSize: "var(--font-size-sm)" }}>
                AS
              </div>
              <div className="flex-1">
                <p className="mb-xs"><strong>Alice Smith</strong> updated availability</p>
                <p className="text-tertiary text-sm">1 day ago</p>
              </div>
              <div className="badge badge-primary">New Slots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {stats.sessions === 0 && (
        <div className="card text-center mt-xl">
          <div style={{ fontSize: "4rem", marginBottom: "var(--spacing-lg)", opacity: 0.6 }}>
            🎓
          </div>
          <h3 className="mb-sm">Ready to Start Your Journey?</h3>
          <p className="text-secondary mb-lg">
            Book your first session with an alumni mentor to begin your professional development
          </p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/student/find-alumni")}
          >
            Find Your First Mentor
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;