import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const studentLinks = [
    { path: "/student/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/student/find-alumni", label: "Find Alumni", icon: "👥" },
    { path: "/student/my-sessions", label: "My Sessions", icon: "📅" },
    { path: "/student/upcoming-sessions", label: "Upcoming", icon: "⏰" },
    { path: "/student/profile", label: "Profile", icon: "👤" }
  ];

  const alumniLinks = [
    { path: "/alumni/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/alumni/availability", label: "Availability", icon: "🕒" },
    { path: "/alumni/requests", label: "Requests", icon: "📥" },
    { path: "/alumni/upcoming-sessions", label: "Upcoming", icon: "⏰" },
    { path: "/alumni/profile", label: "Profile", icon: "👤" }
  ];

  const links = user.role === "student" ? studentLinks : alumniLinks;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={user.role === "student" ? "/student/dashboard" : "/alumni/dashboard"} className="nav-logo">
          🤝 REConnect
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <div className="nav-links">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActiveLink(link.path) ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-text">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="user-menu">
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            </div>
            <div className="user-avatar">
              {getUserInitials(user.name)}
            </div>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
