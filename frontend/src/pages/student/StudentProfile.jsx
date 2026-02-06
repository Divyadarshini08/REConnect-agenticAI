import { useEffect, useState } from "react";
import { API } from "../../utils/api";

const StudentProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    skills: "",
    interests: "",
    linkedin_url: "",
    coding_url: "",
    resume_url: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_id) {
      fetchProfile();
    }
  }, [user?.user_id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API}/api/student/profile/${user.user_id}`);
      const data = await response.json();
      setProfile(prev => ({ ...prev, ...data }));
    } catch (error) {
      showMessage("Failed to load profile", "error");
    }
  };

  const updateProfile = async () => {
    if (!isEditing) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/student/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, student_id: user.user_id }),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage("Profile updated successfully", "success");;
        setIsEditing(false);
      } else {
        showMessage(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      showMessage("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Student Profile</h1>
        <p className="page-subtitle">Manage your personal information and professional details</p>
      </div>

      <div className="card">
        {/* Profile Header */}
        <div className="card-header">
          <div className="flex items-center gap-lg">
            <div className="user-avatar" style={{ width: "80px", height: "80px", fontSize: "var(--font-size-2xl)" }}>
              {getUserInitials(profile.name || user?.name || "S")}
            </div>
            <div>
              <h2 className="mb-xs">{profile.name || user?.name || "Student"}</h2>
              <p className="text-secondary">{profile.email || user?.email || ""}</p>
              <div className="flex gap-md mt-sm">
                {profile.linkedin_url && (
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="badge badge-primary"
                  >
                    LinkedIn
                  </a>
                )}
                {profile.coding_url && (
                  <a 
                    href={profile.coding_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="badge badge-secondary"
                  >
                    Coding Profile
                  </a>
                )}
              </div>
            </div>
          </div>
          <div>
            <button 
              className={`btn ${isEditing ? "btn-secondary" : "btn-primary"}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`alert alert-${message.type} mt-md`}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <div className="card-content">
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  value={profile.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  value={profile.email || ""}
                  disabled
                  placeholder="Your email address"
                />
                <p className="text-tertiary text-sm mt-xs">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills</label>
            <textarea
              value={profile.skills || ""}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              disabled={!isEditing}
              placeholder="List your technical skills (e.g., React, JavaScript, Python)"
              rows="3"
              style={{ minHeight: "80px", resize: "vertical" }}
            />
            <p className="text-tertiary text-sm mt-xs">Separate skills with commas</p>
          </div>

          <div className="form-group">
            <label className="form-label">Interests</label>
            <textarea
              value={profile.interests || ""}
              onChange={(e) => handleInputChange("interests", e.target.value)}
              disabled={!isEditing}
              placeholder="What areas would you like to get mentorship in?"
              rows="3"
              style={{ minHeight: "80px", resize: "vertical" }}
            />
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">LinkedIn Profile</label>
                <input
                  value={profile.linkedin_url || ""}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Coding Profile</label>
                <input
                  value={profile.coding_url || ""}
                  onChange={(e) => handleInputChange("coding_url", e.target.value)}
                  disabled={!isEditing}
                  placeholder="GitHub, LeetCode, or portfolio URL"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resume URL</label>
            <input
              value={profile.resume_url || ""}
              onChange={(e) => handleInputChange("resume_url", e.target.value)}
              disabled={!isEditing}
              placeholder="Link to your resume or CV"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="card-footer flex justify-between items-center">
            <p className="text-secondary text-sm">
              Make sure to save your changes when you're done
            </p>
            <button
              className="btn btn-primary"
              onClick={updateProfile}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Profile Tips */}
      <div className="card mt-xl">
        <div className="card-header">
          <h3 className="card-title">Profile Tips</h3>
        </div>
        <div className="card-content">
          <ul className="text-secondary" style={{ paddingLeft: "var(--spacing-lg)" }}>
            <li className="mb-sm">Keep your skills and interests up to date for better mentor matches</li>
            <li className="mb-sm">Add links to your professional profiles for alumni to review</li>
            <li className="mb-sm">A complete profile increases your chances of getting accepted for sessions</li>
            <li>Regular updates help alumni understand your current goals and needs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
