import { useEffect, useState } from "react";

const AlumniDashboard = () => {
  // ✅ FIX: define user
  const user = JSON.parse(localStorage.getItem("user"));

  // Simple demo data for alumni dashboard
  const [stats, setStats] = useState({
    pending: 3,
    upcoming: 2,
    completed: 15,
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login if no user
      window.location.href = '/login';
      return;
    }
    
    // In a real implementation, this would fetch from backend
    console.log("Alumni dashboard loaded for:", user.email);
  }, [user]);

  return (
    <div className="page">
      <h2>Welcome back, {user?.name || 'Alumni'} 👋</h2>
      <p style={{ opacity: 0.7 }}>Here's your session overview</p>

      <div className="grid">
        <div className="stat-card">
          <h1>{stats.pending}</h1>
          <p>Pending Requests</p>
          <span className="status pending">Action Required</span>
        </div>

        <div className="stat-card">
          <h1>{stats.upcoming}</h1>
          <p>Upcoming Sessions</p>
          <span className="status approved">Scheduled</span>
        </div>

        <div className="stat-card">
          <h1>{stats.completed}</h1>
          <p>Completed Sessions</p>
          <span className="status completed">Finished</span>
        </div>
      </div>

      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}>
        <h3>Quick Actions</h3>
        <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
          <button className="primary">Set Availability</button>
          <button className="secondary">View Requests</button>
          <button className="secondary">My Profile</button>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;