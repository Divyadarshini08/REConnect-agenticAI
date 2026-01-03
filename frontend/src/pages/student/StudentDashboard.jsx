import { useEffect, useState } from "react";
import { API } from "../../utils/api";

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    alumni: 0,
    sessions: 0,
  });

  useEffect(() => {
    fetch(`${API}/api/student/dashboard/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        setStats({
          alumni: data.alumni || 0,
          sessions: data.sessions || 0,
        });
      })
      .catch(err => console.error("Dashboard error:", err));
  }, [user.user_id]);

  return (
    <div className="page">
      <h2>Hello 👋</h2>
      <p style={{ opacity: 0.7 }}>Here’s your learning overview</p>

      <div className="grid">
        <div className="stat-card">
          <h1>{stats.alumni}</h1>
          <p>Available Alumni</p>
        </div>

        <div className="stat-card">
          <h1>{stats.sessions}</h1>
          <p>My Sessions</p>
        </div>
      </div>

      {stats.sessions === 0 && (
        <p style={{ marginTop: "20px", opacity: 0.6 }}>
          You don’t have any sessions yet.  
          Book a session with an alumni to get started 🚀
        </p>
      )}
    </div>
  );
};

export default StudentDashboard;
