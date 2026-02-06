import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SimpleRegister = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
    interests: "",
    domain: "",
    company: "",
    expertise: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    setError("");

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    // Simple registration - just store in localStorage for demo
    const user = {
      name: form.name,
      email: form.email,
      role: role,
      user_id: Date.now(),
      id: Date.now(),
      skills: form.skills,
      interests: form.interests,
      domain: form.domain,
      company: form.company,
      expertise: form.expertise
    };

    // Store user data
    localStorage.setItem("registeredUsers", JSON.stringify([
      ...(JSON.parse(localStorage.getItem("registeredUsers") || "[]")),
      user
    ]));

    alert("Registration successful! You can now login.");
    navigate("/login");
  };

  return (
    <div className="page card auth-card">
      <h2>Create Account</h2>

      <label>Role</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="alumni">Alumni</option>
      </select>

      <label>Name</label>
      <input name="name" onChange={handleChange} required />

      <label>Email</label>
      <input name="email" type="email" onChange={handleChange} required />

      <label>Password</label>
      <input
        name="password"
        type="password"
        onChange={handleChange}
        required
      />

      <label>Confirm Password</label>
      <input
        name="confirmPassword"
        type="password"
        onChange={handleChange}
        required
      />

      {role === "student" && (
        <>
          <label>Skills</label>
          <input name="skills" onChange={handleChange} placeholder="e.g., JavaScript, Python, React" />

          <label>Key Interests</label>
          <input name="interests" onChange={handleChange} placeholder="e.g., Web Development, AI, Data Science" />
        </>
      )}

      {role === "alumni" && (
        <>
          <label>Domain of Work</label>
          <input name="domain" onChange={handleChange} placeholder="e.g., Software Engineering" />

          <label>Company</label>
          <input name="company" onChange={handleChange} placeholder="Current company" />

          <label>Expertise</label>
          <input name="expertise" onChange={handleChange} placeholder="e.g., Full-stack Development, Machine Learning" />
        </>
      )}

      {error && <p className="error">{error}</p>}

      <button className="primary" onClick={handleRegister}>
        Register
      </button>

      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f8ff", borderRadius: "8px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#0066cc" }}>Demo Registration:</h4>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          This is a frontend-only demo. Registration data is stored locally.
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          No backend connection required.
        </p>
      </div>
    </div>
  );
};

export default SimpleRegister;