import { useEffect, useState } from "react";

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Simple demo data for student dashboard
  const [stats, setStats] = useState({
    alumni: 12,
    sessions: 3,
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login if no user
      window.location.href = '/login';
      return;
    }
    
    // In a real implementation, this would fetch from backend
    console.log("Student dashboard loaded for:", user.email);
  }, [user]);

  return (
    <div className="page">
      <h2>Hello, {user?.name || 'Student'} 👋</h2>
      <p style={{ opacity: 0.7 }}>Here's your learning overview</p>

      <div className="grid">
        <div className="stat-card">
          <h1>{stats.alumni}</h1>
          <p>Available Alumni</p>
          <span className="status approved">Ready to Connect</span>
        </div>

        <div className="stat-card">
          <h1>{stats.sessions}</h1>
          <p>My Sessions</p>
          <span className="status completed">Active</span>
        </div>
      </div>

      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}>
        <h3>Get Started</h3>
        <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
          <button className="primary">Find Alumni</button>
          <button className="secondary">Book Session</button>
          <button className="secondary">My Profile</button>
        </div>
      </div>

      {stats.sessions === 0 && (
        <p style={{ marginTop: "20px", opacity: 0.6 }}>
          You don't have any sessions yet.  
          Book a session with an alumni to get started 🚀
        </p>
      )}
    </div>
  );
};

export default StudentDashboard;