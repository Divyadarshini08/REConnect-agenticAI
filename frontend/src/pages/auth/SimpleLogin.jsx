import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SimpleLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    setError("");
    
    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Simple email validation
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    // For demo purposes, accept any credentials
    // In a real app, you would validate against backend
    const user = {
      email,
      role,
      name: email.split("@")[0], // Use email prefix as name
      id: Date.now() // Simple ID generation
    };

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
    // Navigate based on role
    if (role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/alumni/dashboard");
    }
  };

  return (
    <div className="page">
      <div className="card auth-card">
        <h2>Welcome to REConnect 👋</h2>
        <p style={{ opacity: 0.6 }}>Login to continue</p>

        <label>Role</label>
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="form-select"
        >
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          className="form-input"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="form-input"
        />

        {error && <p className="error">{error}</p>}

        <button className="primary" onClick={handleLogin}>
          Login
        </button>

        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f8ff", borderRadius: "8px" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#0066cc" }}>Demo Login Info:</h4>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Student:</strong> student@example.com / any password
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Alumni:</strong> alumni@example.com / any password
          </p>
          <p style={{ margin: "10px 0 0 0", fontSize: "12px", opacity: 0.7 }}>
            Note: This is a frontend-only demo. No backend validation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;