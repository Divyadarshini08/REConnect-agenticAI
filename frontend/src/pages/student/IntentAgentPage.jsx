import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DOMAIN_KEYWORDS,
  EXAMPLE_QUERIES,
  PROFESSIONAL_COLORS,
  ANIMATION_TIMINGS,
  AVAILABILITY_STATUS
} from "../../constants/intentAgentData";

// API service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiService = {
  async post(endpoint, data, token) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
  
  async get(endpoint, token) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

const IntentAgentPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [showExamples, setShowExamples] = useState(true);
  const [examples, setExamples] = useState(EXAMPLE_QUERIES);
  const [keywords, setKeywords] = useState([]);
  
  const token = localStorage.getItem('token');

  // Load example queries on component mount
  useEffect(() => {
    loadExamples();
  }, []);
  
  const loadExamples = async () => {
    try {
      const response = await apiService.get('/api/intent/examples', token);
      if (response.success) {
        setExamples(response.examples);
      }
    } catch (err) {
      console.error('Error loading examples:', err);
      setExamples(EXAMPLE_QUERIES);
    }
  };

  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      setError("Please enter a detailed query about your mentoring needs");
      return;
    }

    setIsProcessing(true);
    setError("");
    setShowExamples(false);
    setResults([]);
    setKeywords([]);

    try {
      const response = await apiService.post('/api/intent/match', { query }, token);
      
      if (response.success) {
        setResults(response.matches || []);
        setKeywords(response.keywords || []);
        
        if (response.matches && response.matches.length === 0) {
          setError(response.message || "No matching mentors found. Try different keywords or browse our expertise areas.");
        }
      } else {
        setError(response.message || "Unable to process your request. Please try again.");
      }
    } catch (err) {
      setError("Network error: Unable to connect to the mentoring service");
      console.error("API error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
    setShowExamples(false);
    setError("");
  };

  const handleViewProfile = (alumniId) => {
    navigate(`/student/alumni/${alumniId}`);
  };

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setError("");
    setKeywords([]);
    setShowExamples(true);
  };

  const getAvailabilityColor = (availabilityCount) => {
    if (availabilityCount >= 5) return PROFESSIONAL_COLORS.SUCCESS;
    if (availabilityCount >= 2) return PROFESSIONAL_COLORS.WARNING;
    return PROFESSIONAL_COLORS.DANGER;
  };

  const getAvailabilityStatus = (availabilityCount) => {
    if (availabilityCount >= 5) return AVAILABILITY_STATUS.HIGH;
    if (availabilityCount >= 2) return AVAILABILITY_STATUS.MEDIUM;
    if (availabilityCount > 0) return AVAILABILITY_STATUS.LOW;
    return AVAILABILITY_STATUS.BUSY;
  };

  const renderKeywords = () => {
    if (keywords.length === 0) return null;
    
    return (
      <div style={{ 
        marginBottom: "25px", 
        padding: "20px", 
        backgroundColor: `${PROFESSIONAL_COLORS.PRIMARY}08`,
        borderRadius: "12px",
        border: `1px solid ${PROFESSIONAL_COLORS.PRIMARY}20`
      }}>
        <h4 style={{ 
          margin: "0 0 15px 0", 
          color: PROFESSIONAL_COLORS.PRIMARY,
          fontSize: "18px",
          fontWeight: "600"
        }}>
          🔍 Detected Expertise Areas:
        </h4>
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "12px" 
        }}>
          {keywords.map((kw, index) => (
            <span 
              key={index}
              style={{
                background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.PRIMARY}, ${PROFESSIONAL_COLORS.SECONDARY})`,
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)"
              }}
            >
              {kw.term} <span style={{ opacity: 0.8, fontSize: "12px" }}>({kw.type})</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="page" style={{ 
      background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.BACKGROUND}, #e2e8f0)`,
      minHeight: "100vh",
      padding: "20px 0"
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        padding: "0 20px"
      }}>
        {/* Header Section */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "40px",
          padding: "30px",
          background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.CARD_BG}, #f1f5f9)`,
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{ 
            fontSize: "48px", 
            marginBottom: "15px",
            background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.PRIMARY}, ${PROFESSIONAL_COLORS.SECONDARY})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800"
          }}>
            🤖 AI Mentor Matching
          </div>
          <p style={{ 
            fontSize: "20px", 
            color: PROFESSIONAL_COLORS.TEXT_SECONDARY,
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Connect with industry experts who match your specific learning goals and career aspirations
          </p>
        </div>

        {/* Search Section */}
        <div style={{
          background: PROFESSIONAL_COLORS.CARD_BG,
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${PROFESSIONAL_COLORS.BACKGROUND}`
        }}>
          <div style={{ 
            display: "flex", 
            gap: "15px", 
            marginBottom: "25px",
            flexWrap: "wrap"
          }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your mentoring needs, skills you want to develop, or career guidance you're seeking..."
              className="form-input"
              style={{ 
                flex: 1, 
                padding: "18px 24px", 
                fontSize: "16px",
                borderRadius: "12px",
                border: `2px solid ${PROFESSIONAL_COLORS.BACKGROUND}`,
                minWidth: "300px"
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
              disabled={isProcessing}
            />
            <button
              className="primary"
              onClick={handleQuerySubmit}
              disabled={isProcessing}
              style={{ 
                padding: "18px 32px", 
                fontSize: "16px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.PRIMARY}, ${PROFESSIONAL_COLORS.SECONDARY})`,
                border: "none",
                color: "white",
                fontWeight: "600",
                cursor: isProcessing ? "not-allowed" : "pointer",
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              {isProcessing ? "🔍 Analyzing..." : "🔍 Find Mentors"}
            </button>
          </div>

          {error && (
            <div style={{ 
              padding: "20px", 
              borderRadius: "12px", 
              marginBottom: "25px",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b"
            }}>
              {error}
            </div>
          )}

          {/* Example Queries */}
          {showExamples && (
            <div style={{ marginTop: "25px" }}>
              <h3 style={{ 
                marginBottom: "20px", 
                color: PROFESSIONAL_COLORS.TEXT_PRIMARY,
                fontSize: "20px",
                fontWeight: "600"
              }}>
                💡 Popular Mentoring Requests:
              </h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
                gap: "15px" 
              }}>
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    style={{ 
                      padding: "20px", 
                      textAlign: "left", 
                      fontSize: "15px",
                      background: PROFESSIONAL_COLORS.BACKGROUND,
                      border: `1px solid ${PROFESSIONAL_COLORS.BACKGROUND}`,
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: ANIMATION_TIMINGS.CARD_HOVER,
                      color: PROFESSIONAL_COLORS.TEXT_PRIMARY,
                      height: "auto",
                      lineHeight: "1.5"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div style={{
            background: PROFESSIONAL_COLORS.CARD_BG,
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: `1px solid ${PROFESSIONAL_COLORS.BACKGROUND}`
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "25px",
              flexWrap: "wrap",
              gap: "15px"
            }}>
              <h2 style={{ 
                margin: 0,
                color: PROFESSIONAL_COLORS.TEXT_PRIMARY,
                fontSize: "24px",
                fontWeight: "700"
              }}>
                🎯 Found {results.length} Matching Mentors
              </h2>
              <button 
                onClick={handleReset}
                style={{ 
                  padding: "12px 24px",
                  background: "transparent",
                  border: `2px solid ${PROFESSIONAL_COLORS.SECONDARY}`,
                  color: PROFESSIONAL_COLORS.SECONDARY,
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = PROFESSIONAL_COLORS.SECONDARY;
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = PROFESSIONAL_COLORS.SECONDARY;
                }}
              >
                New Search
              </button>
            </div>
            
            {renderKeywords()}
            
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
              gap: "25px"
            }}>
              {results.map((alumni, index) => (
                <div 
                  key={alumni.id} 
                  style={{ 
                    background: PROFESSIONAL_COLORS.CARD_BG,
                    borderRadius: "16px",
                    padding: "25px",
                    position: "relative",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${PROFESSIONAL_COLORS.BACKGROUND}`,
                    animation: `fadeInUp ${ANIMATION_TIMINGS.FADE_IN} ${index * 0.1}s both`,
                    transition: ANIMATION_TIMINGS.CARD_HOVER
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  {/* Match Score Badge */}
                  <div style={{ 
                    position: "absolute", 
                    top: "20px", 
                    right: "20px",
                    background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.PRIMARY}, ${PROFESSIONAL_COLORS.SECONDARY})`,
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                  }}>
                    {Math.round(alumni.relevanceScore * 100)}% Match
                  </div>

                  {/* Profile Header */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ 
                      margin: "0 0 8px 0", 
                      color: PROFESSIONAL_COLORS.TEXT_PRIMARY,
                      fontSize: "20px",
                      fontWeight: "700"
                    }}>
                      {alumni.name}
                    </h3>
                    <p style={{ 
                      margin: 0,
                      color: PROFESSIONAL_COLORS.PRIMARY,
                      fontSize: "16px",
                      fontWeight: "600"
                    }}>
                      {alumni.domain} Expert
                    </p>
                  </div>

                  {/* Profile Details */}
                  <div style={{ marginBottom: "25px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginBottom: "15px" 
                    }}>
                      <span style={{ 
                        width: "8px", 
                        height: "8px", 
                        background: PROFESSIONAL_COLORS.SUCCESS,
                        borderRadius: "50%",
                        marginRight: "12px"
                      }}></span>
                      <p style={{ margin: 0, color: PROFESSIONAL_COLORS.TEXT_SECONDARY }}>
                        <strong>🏢 Company:</strong> {alumni.company}
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: "15px" }}>
                      <p style={{ 
                        margin: "0 0 8px 0", 
                        color: PROFESSIONAL_COLORS.TEXT_SECONDARY,
                        fontWeight: "600"
                      }}>
                        🔧 Core Expertise:
                      </p>
                      <p style={{ 
                        margin: 0, 
                        color: PROFESSIONAL_COLORS.TEXT_PRIMARY,
                        lineHeight: "1.6"
                      }}>
                        {alumni.expertise}
                      </p>
                    </div>

                    <div style={{ 
                      display: "flex", 
                      alignItems: "center",
                      marginBottom: "15px"
                    }}>
                      <span style={{ 
                        width: "8px", 
                        height: "8px", 
                        background: getAvailabilityColor(3), // Default value
                        borderRadius: "50%",
                        marginRight: "12px"
                      }}></span>
                      <p style={{ margin: 0, color: PROFESSIONAL_COLORS.TEXT_SECONDARY }}>
                        <strong>📅 Availability:</strong> {getAvailabilityStatus(3)}
                      </p>
                    </div>

                    {alumni.matchedKeywords && alumni.matchedKeywords.length > 0 && (
                      <div style={{ 
                        marginTop: "15px",
                        padding: "12px",
                        background: `${PROFESSIONAL_COLORS.PRIMARY}08`,
                        borderRadius: "8px"
                      }}>
                        <p style={{ 
                          margin: 0, 
                          fontSize: "14px", 
                          color: PROFESSIONAL_COLORS.TEXT_SECONDARY 
                        }}>
                          <strong>🎯 Matched on:</strong> {alumni.matchedKeywords.map(kw => `"${kw.term}"`).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: "flex", 
                    gap: "12px",
                    flexWrap: "wrap"
                  }}>
                    <button
                      onClick={() => handleViewProfile(alumni.id)}
                      style={{
                        flex: 1,
                        minWidth: "160px",
                        padding: "14px 20px",
                        background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.PRIMARY}, ${PROFESSIONAL_COLORS.SECONDARY})`,
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        fontSize: "15px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      View Profile & Schedule
                    </button>
                    
                    {alumni.linkedin_url && (
                      <a
                        href={alumni.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "14px 20px",
                          background: PROFESSIONAL_COLORS.BACKGROUND,
                          color: PROFESSIONAL_COLORS.TEXT_PRIMARY,
                          textDecoration: "none",
                          borderRadius: "10px",
                          fontWeight: "600",
                          fontSize: "15px",
                          textAlign: "center",
                          border: `1px solid ${PROFESSIONAL_COLORS.BACKGROUND}`,
                          transition: "all 0.2s ease",
                          minWidth: "120px"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = PROFESSIONAL_COLORS.PRIMARY;
                          e.target.style.color = "white";
                        }}
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {results.length === 0 && !isProcessing && !showExamples && (
          <div style={{
            background: PROFESSIONAL_COLORS.CARD_BG,
            borderRadius: "16px",
            padding: "50px 30px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: `1px solid ${PROFESSIONAL_COLORS.BACKGROUND}`
          }}>
            <div style={{ 
              fontSize: "60px", 
              marginBottom: "20px",
              opacity: 0.6
            }}>
              🤔
            </div>
            <h3 style={{ 
              color: PROFESSIONAL_COLORS.TEXT_SECONDARY, 
              marginBottom: "15px",
              fontSize: "24px",
              fontWeight: "600"
            }}>
              No matching mentors found
            </h3>
            <p style={{ 
              color: PROFESSIONAL_COLORS.TEXT_SECONDARY, 
              marginBottom: "25px",
              fontSize: "16px",
              maxWidth: "500px",
              margin: "0 auto 25px"
            }}>
              Try using different keywords, or explore our expertise categories below
            </p>
            <button 
              onClick={handleReset}
              style={{
                padding: "14px 32px",
                background: `linear-gradient(135deg, ${PROFESSIONAL_COLORS.PRIMARY}, ${PROFESSIONAL_COLORS.SECONDARY})`,
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.3)";
              }}
            >
              Try Different Keywords
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-input:focus {
          outline: none;
          border-color: ${PROFESSIONAL_COLORS.PRIMARY};
          box-shadow: 0 0 0 3px ${PROFESSIONAL_COLORS.PRIMARY}20;
        }
      `}</style>
    </div>
  );
};

export default IntentAgentPage;