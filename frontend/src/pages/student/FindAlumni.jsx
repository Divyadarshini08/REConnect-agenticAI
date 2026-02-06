import { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const FindAlumni = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    if (user?.user_id) {
      fetchAlumni();
    }
  }, [user?.user_id]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/student/available-alumni/${user.user_id}`);
      const data = await response.json();
      setAlumni(data);
    } catch (error) {
      console.error("Error loading alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueDomains = () => {
    const domains = [...new Set(alumni.map(a => a.domain))];
    return domains.sort();
  };

  const filteredAlumni = alumni
    .filter(alum => {
      const matchesSearch = alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alum.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alum.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alum.expertise?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = domainFilter === "all" || alum.domain === domainFilter;
      return matchesSearch && matchesDomain;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "domain") {
        return a.domain.localeCompare(b.domain);
      } else if (sortBy === "company") {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="flex items-center justify-center" style={{ height: "200px" }}>
          <div className="loading"></div>
          <span className="ml-md">Finding available alumni...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Find Alumni Mentors</h1>
        <p className="page-subtitle">Connect with industry professionals who match your interests</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 mb-xl">
        <div className="stat-card text-center">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{alumni.length}</div>
          <div className="stat-label">Total Available</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{getUniqueDomains().length}</div>
          <div className="stat-label">Domains</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">
            {new Set(alumni.map(a => a.company)).size}
          </div>
          <div className="stat-label">Companies</div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="card mb-xl">
        <div className="card-content">
          <div className="grid grid-cols-3 gap-lg">
            {/* Search */}
            <div className="form-group">
              <label className="form-label">Search Alumni</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, domain, or company..."
              />
            </div>

            {/* Domain Filter */}
            <div className="form-group">
              <label className="form-label">Filter by Domain</label>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Domains</option>
                {getUniqueDomains().map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="name">Name</option>
                <option value="domain">Domain</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="card mb-lg">
        <div className="card-content">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="mb-0">
                {filteredAlumni.length} {filteredAlumni.length === 1 ? "Alumnus" : "Alumni"} Found
              </h2>
              <p className="text-secondary mb-0">
                {searchTerm && `Searching for "${searchTerm}"`}
                {domainFilter !== "all" && ` in ${domainFilter}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-secondary">Matching your profile</div>
              <div className="text-primary font-medium">Based on your interests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length === 0 ? (
        <div className="card text-center py-xl">
          <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-lg)", opacity: 0.6 }}>
            🔍
          </div>
          <h3 className="mb-sm">No alumni found</h3>
          <p className="text-secondary mb-lg">
            {searchTerm || domainFilter !== "all"
              ? "Try adjusting your search criteria"
              : "No alumni are currently available for mentoring"}
          </p>
          {(searchTerm || domainFilter !== "all") && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm("");
                setDomainFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid">
          {filteredAlumni.map((alum) => (
            <div 
              key={alum.alumni_id} 
              className="card"
              style={{
                transition: "all var(--transition-normal)",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/student/alumni/${alum.alumni_id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
            >
              {/* Header with Avatar */}
              <div className="flex items-center gap-lg mb-lg">
                <div 
                  className="user-avatar"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "var(--font-size-lg)",
                    minWidth: "60px"
                  }}
                >
                  {getUserInitials(alum.name)}
                </div>
                <div>
                  <h3 className="mb-xs">{alum.name}</h3>
                  <div className="badge badge-primary">{alum.domain} Expert</div>
                </div>
              </div>

              {/* Company Info */}
              <div className="flex items-center gap-md mb-md">
                <span className="text-tertiary">🏢</span>
                <span className="font-medium">{alum.company}</span>
              </div>

              {/* Expertise */}
              {alum.expertise && (
                <div className="mb-lg">
                  <div className="text-tertiary text-sm mb-xs">🔧 Expertise</div>
                  <p className="text-secondary mb-0">{alum.expertise}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-between items-center pt-md" style={{ borderTop: "1px solid var(--card-border)" }}>
                <div className="text-tertiary text-sm">
                  Click to view available slots
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/alumni/${alum.alumni_id}`);
                  }}
                >
                  View Slots →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="card mt-xl">
        <div className="card-header">
          <h3 className="card-title mb-0">Finding the Right Mentor</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-3 gap-lg">
            <div>
              <h4 className="text-primary mb-sm">🎯 Match Your Goals</h4>
              <p className="text-secondary text-sm">Look for alumni whose expertise aligns with your career objectives</p>
            </div>
            <div>
              <h4 className="text-primary mb-sm">🏢 Consider Industry</h4>
              <p className="text-secondary text-sm">Choose mentors from companies or industries you're interested in</p>
            </div>
            <div>
              <h4 className="text-primary mb-sm">💬 Check Availability</h4>
              <p className="text-secondary text-sm">View their available slots to find a time that works for you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindAlumni;
