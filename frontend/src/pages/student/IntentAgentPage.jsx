import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DOMAIN_KEYWORDS,
  EXAMPLE_QUERIES,
  PROFESSIONAL_TITLES,
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
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showExamples, setShowExamples] = useState(true);
  const [examples, setExamples] = useState(EXAMPLE_QUERIES);
  const [keywords, setKeywords] = useState([]);
  const [matchedAlumni, setMatchedAlumni] = useState([]);
  
  const token = localStorage.getItem('token');

  // Load example queries on component mount
  useEffect(() => {
    setExamples(EXAMPLE_QUERIES);
  }, []);

  // Generate mock alumni data based on domain keywords
  const generateMockAlumniData = () => {
    const alumniData = [];
    const companies = [
      "Google", "Microsoft", "Amazon", "Meta", "Apple", 
      "Netflix", "Tesla", "IBM", "Oracle", "Salesforce"
    ];
    
    Object.entries(DOMAIN_KEYWORDS).forEach(([domainKey, keywords], index) => {
      const domainName = domainKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Create 2-3 alumni per domain
      const alumniCount = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < alumniCount; i++) {
        const alumniId = index * 10 + i + 1;
        const companyName = companies[Math.floor(Math.random() * companies.length)];
        const title = PROFESSIONAL_TITLES[Math.floor(Math.random() * PROFESSIONAL_TITLES.length)];
        
        alumniData.push({
          id: alumniId,
          name: `${['Alex', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Cameron', 'Drew'][Math.floor(Math.random() * 8)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)]}`,
          domain: domainName,
          company: companyName,
          expertise: keywords.slice(0, 3).join(', '),
          title: title,
          relevanceScore: 0.7 + Math.random() * 0.25, // 70-95%
          availability: Math.floor(Math.random() * 6), // 0-5 slots
          matchedKeywords: [],
          linkedin_url: `https://linkedin.com/in/alumni${alumniId}`
        });
      }
    });
    
    return alumniData;
  };

  const handleQuerySubmit = () => {
    if (!query.trim()) {
      showMessage("Please enter a detailed query about your mentoring needs", "error");
      return;
    }

    setIsProcessing(true);
    setMessage({ text: "", type: "" });
    setShowExamples(false);
    setResults([]);
    setKeywords([]);
    setMatchedAlumni([]);

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Extract keywords from query
        const extractedKeywords = extractKeywordsFromQuery(query);
        setKeywords(extractedKeywords);
        
        // Find matching alumni
        const matchedResults = findMatchingAlumni(extractedKeywords);
        setMatchedAlumni(matchedResults);
        setResults(matchedResults);
        
        if (matchedResults.length === 0) {
          showMessage("No matching mentors found. Try different keywords or browse our expertise areas.", "warning");
        } else {
          showMessage(`Found ${matchedResults.length} matching mentors!`, "success");
        }
      } catch (err) {
        showMessage("Error processing your request. Please try again.", "error");
        console.error("Processing error:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 800);
  };

  // Extract keywords from user query
  const extractKeywordsFromQuery = (queryText) => {
    const normalizedQuery = queryText.toLowerCase();
    const foundKeywords = [];
    
    Object.entries(DOMAIN_KEYWORDS).forEach(([domainKey, domainKeywords]) => {
      domainKeywords.forEach(keyword => {
        const normalizedKeyword = keyword.toLowerCase();
        if (normalizedQuery.includes(normalizedKeyword)) {
          foundKeywords.push({
            term: keyword,
            type: domainKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            domain: domainKey
          });
        }
      });
    });
    
    return foundKeywords;
  };

  // Find alumni matching the extracted keywords
  const findMatchingAlumni = (keywords) => {
    if (keywords.length === 0) return [];
    
    const allAlumni = generateMockAlumniData();
    const matchedAlumni = [];
    
    keywords.forEach(keywordObj => {
      const domainKey = keywordObj.domain;
      const domainName = keywordObj.type;
      
      // Find alumni in this domain
      const domainAlumni = allAlumni.filter(alumni => 
        alumni.domain.toLowerCase() === domainName.toLowerCase()
      );
      
      // Add matched keywords to each alumni
      domainAlumni.forEach(alumni => {
        const existingAlumni = matchedAlumni.find(a => a.id === alumni.id);
        if (existingAlumni) {
          // Add to existing match
          if (!existingAlumni.matchedKeywords.find(kw => kw.term === keywordObj.term)) {
            existingAlumni.matchedKeywords.push(keywordObj);
            existingAlumni.relevanceScore = Math.min(0.95, existingAlumni.relevanceScore + 0.1);
          }
        } else {
          // Add new match
          matchedAlumni.push({
            ...alumni,
            matchedKeywords: [keywordObj]
          });
        }
      });
    });
    
    // Sort by relevance score
    return matchedAlumni.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
    setShowExamples(false);
    setMessage({ text: "", type: "" });
    // Auto-submit the example query
    setTimeout(() => {
      handleQuerySubmit();
    }, 300);
  };

  const handleViewProfile = (alumniId) => {
    navigate(`/student/alumni/${alumniId}`);
  };

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setMessage({ text: "", type: "" });
    setKeywords([]);
    setShowExamples(true);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    if (type !== "error") {
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
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
      <div className="card mb-lg">
        <h3 className="card-title mb-md">🔍 Detected Expertise Areas</h3>
        <div className="flex flex-wrap gap-md">
          {keywords.map((kw, index) => (
            <span 
              key={index}
              className="badge badge-primary"
            >
              {kw.term} <span className="text-tertiary" style={{ fontSize: "0.8em" }}>({kw.type})</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="page">
        {/* Header Section */}
        <div className="page-header text-center mb-xl">
          <h1 className="page-title mb-sm">🤖 AI Mentor Matching</h1>
          <p className="page-subtitle" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Connect with industry experts who match your specific learning goals and career aspirations
          </p>
        </div>

        {/* Search Section */}
        <div className="card mb-xl">
          <div className="form-group mb-lg">
            <label className="form-label">Describe your mentoring needs</label>
            <div className="flex gap-md flex-wrap">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your mentoring needs, skills you want to develop, or career guidance you're seeking..."
                className="form-input"
                style={{ flex: 1, minWidth: "300px" }}
                onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                disabled={isProcessing}
              />
              <button
                className={`btn btn-primary ${isProcessing ? "disabled" : ""}`}
                onClick={handleQuerySubmit}
                disabled={isProcessing}
                style={{ minWidth: "160px" }}
              >
                {isProcessing ? (
                  <>
                    <span className="loading"></span>
                    Analyzing...
                  </>
                ) : (
                  "🔍 Find Mentors"
                )}
              </button>
            </div>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type} mb-lg`}>
              {message.text}
            </div>
          )}

          {/* Example Queries */}
          {showExamples && (
            <div className="mt-lg">
              <h3 className="mb-md">💡 Popular Mentoring Requests</h3>
              <div className="grid">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="card text-left"
                    style={{
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                      height: "auto",
                      lineHeight: "1.5"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
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
          <div className="card">
            <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
              <h2 className="mb-0">🎯 Found {results.length} Matching Mentors</h2>
              <button 
                onClick={handleReset}
                className="btn btn-outline"
              >
                New Search
              </button>
            </div>
            
            {renderKeywords()}
            
            <div className="grid">
              {results.map((alumni, index) => (
                <div 
                  key={alumni.id} 
                  className="card"
                  style={{
                    position: "relative",
                    transition: "all var(--transition-normal)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                >
                  {/* Match Score Badge */}
                  <div className="badge badge-primary" 
                    style={{
                      position: "absolute",
                      top: "var(--spacing-md)",
                      right: "var(--spacing-md)"
                    }}>
                    {Math.round(alumni.relevanceScore * 100)}% Match
                  </div>

                  {/* Profile Header */}
                  <div className="mb-lg">
                    <h3 className="mb-xs">{alumni.name}</h3>
                    <p className="text-primary font-medium mb-0">{alumni.domain} Expert</p>
                  </div>

                  {/* Profile Details */}
                  <div className="mb-lg">
                    <div className="flex items-center mb-sm">
                      <span className="text-success mr-sm">●</span>
                      <p className="text-secondary mb-0">
                        <strong>🏢 Company:</strong> {alumni.company}
                      </p>
                    </div>
                    
                    <div className="mb-sm">
                      <p className="text-secondary font-medium mb-xs">
                        🔧 Core Expertise:
                      </p>
                      <p className="mb-0">
                        {alumni.expertise}
                      </p>
                    </div>

                    <div className="flex items-center mb-sm">
                      <span className="text-success mr-sm">●</span>
                      <p className="text-secondary mb-0">
                        <strong>📅 Availability:</strong> {getAvailabilityStatus(3)}
                      </p>
                    </div>

                    {alumni.matchedKeywords && alumni.matchedKeywords.length > 0 && (
                      <div className="card" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                        <p className="text-secondary mb-0" style={{ fontSize: "0.875rem" }}>
                          <strong>🎯 Matched on:</strong> {alumni.matchedKeywords.map(kw => `"${kw.term}"`).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-md flex-wrap">
                    <button
                      onClick={() => handleViewProfile(alumni.id)}
                      className="btn btn-primary flex-1"
                      style={{ minWidth: "160px" }}
                    >
                      View Profile & Schedule
                    </button>
                                      
                    {alumni.linkedin_url && (
                      <a
                        href={alumni.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline text-center"
                        style={{ minWidth: "120px" }}
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
          <div className="card text-center py-xl">
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "var(--spacing-lg)",
              opacity: 0.6
            }}>
              🤔
            </div>
            <h3 className="mb-sm">No matching mentors found</h3>
            <p className="text-secondary mb-lg" style={{ maxWidth: "500px", margin: "0 auto 25px" }}>
              Try using different keywords, or explore our expertise categories below
            </p>
            <button 
              onClick={handleReset}
              className="btn btn-primary"
            >
              Try Different Keywords
            </button>
          </div>
        )}
    </div>
  );
};

export default IntentAgentPage;