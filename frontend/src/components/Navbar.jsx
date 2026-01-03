import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3 className="logo">REConnect</h3>

      <div className="nav-links">
        {user.role === "student" && (
          <>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/find-alumni">Find Alumni</Link>
            <Link to="/student/my-sessions">My Sessions</Link>
            <Link to="/student/profile">Profile</Link>
            <Link to="/student/upcoming-sessions">Upcoming Sessions</Link>
          </>
        )}

        {user.role === "alumni" && (
          <>
            <Link to="/alumni/dashboard">Dashboard</Link>
            <Link to="/alumni/availability">Availability</Link>
            <Link to="/alumni/requests">Requests</Link>
            <Link to="/alumni/upcoming-sessions">Upcoming Sessions</Link>
            <Link to="/alumni/profile">Profile</Link>
          </>
        )}

        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
