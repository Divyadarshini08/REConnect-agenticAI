import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntentAgentPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [showExamples, setShowExamples] = useState(true);

  // Sample domain keywords for demonstration
  const domainKeywords = {
    "AI": ["AI", "Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks"],
    "WebDev": ["Web Development", "React", "JavaScript", "Frontend", "Backend", "Node.js"],
    "DataScience": ["Data Science", "Analytics", "Statistics", "Big Data", "Python", "R"],
    "Cybersecurity": ["Cybersecurity", "Network Security", "Information Security", "Encryption"],
    "Cloud": ["Cloud Computing", "AWS", "Azure", "GCP", "DevOps"],
    "UIUX": ["UI/UX", "User Interface", "User Experience", "Design", "Figma"]
  };

  // Sample alumni data for demonstration
  const sampleAlumni = [
    {
      alumni_id: 1,
      name: "Dr. Sarah Chen",
      domain: "Artificial Intelligence",
      expertise: "Machine Learning, Deep Learning, Computer Vision",
      company: "Google AI Research",
      availability_count: 3,
      relevance_score: 0.95
    },
    {
      alumni_id: 2,
      name: "Michael Rodriguez",
      domain: "Web Development",
      expertise: "React, Node.js, Full-stack Development",
      company: "Microsoft",
      availability_count: 2,
      relevance_score: 0.88
    },
    {
      alumni_id: 3,
      name: "Priya Sharma",
      domain: "Data Science",
      expertise: "Python, Machine Learning, Analytics",
      company: "Amazon",
      availability_count: 1,
      relevance_score: 0.92
    },
    {
      alumni_id: 4,
      name: "James Wilson",
      domain: "Cybersecurity",
      expertise: "Network Security, Ethical Hacking, Cloud Security",
      company: "IBM Security",
      availability_count: 4,
      relevance_score: 0.85
    }
  ];

  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setIsProcessing(true);
    setError("");
    setShowExamples(false);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Extract keywords from query
      const extractedKeywords = extractKeywords(query);
      
      if (extractedKeywords.length === 0) {
        setError("No relevant keywords found. Try terms like 'AI', 'Web Development', 'Data Science', etc.");
        setIsProcessing(false);
        return;
      }

      // Find matching alumni based on keywords
      const matchedAlumni = findMatchingAlumni(extractedKeywords);
      
      setResults(matchedAlumni);
    } catch (err) {
      setError("An error occurred while processing your request");
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractKeywords = (inputQuery) => {
    const normalizedQuery = inputQuery.toLowerCase();
    const foundKeywords = [];

    Object.entries(domainKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (normalizedQuery.includes(keyword.toLowerCase())) {
          foundKeywords.push({
            category: category,
            keyword: keyword,
            match_type: 'exact'
          });
        }
      });
    });

    return foundKeywords;
  };

  const findMatchingAlumni = (keywords) => {
    const matches = [];

    keywords.forEach(keywordObj => {
      const categoryMatches = sampleAlumni.filter(alumni => {
        const expertiseMatch = alumni.expertise.toLowerCase().includes(keywordObj.keyword.toLowerCase());
        const domainMatch = alumni.domain.toLowerCase().includes(keywordObj.keyword.toLowerCase());
        const companyMatch = alumni.company.toLowerCase().includes(keywordObj.keyword.toLowerCase());
        
        return expertiseMatch || domainMatch || companyMatch;
      });

      categoryMatches.forEach(match => {
        if (!matches.find(m => m.alumni_id === match.alumni_id)) {
          matches.push({
            ...match,
            matched_keyword: keywordObj.keyword,
            relevance_score: calculateRelevance(match, keywordObj)
          });
        }
      });
    });

    return matches.sort((a, b) => b.relevance_score - a.relevance_score);
  };

  const calculateRelevance = (alumni, keywordObj) => {
    let score = 0.5; // Base score
    
    // Boost score based on availability
    score += alumni.availability_count * 0.05;
    
    // Boost for exact domain matches
    if (alumni.domain.toLowerCase().includes(keywordObj.keyword.toLowerCase())) {
      score += 0.2;
    }
    
    // Boost for expertise matches
    if (alumni.expertise.toLowerCase().includes(keywordObj.keyword.toLowerCase())) {
      score += 0.15;
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
    setShowExamples(false);
  };

  const handleViewSlots = (alumniId) => {
    navigate(`/student/alumni/${alumniId}`);
  };

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setError("");
    setShowExamples(true);
  };

  return (
    <div className="page">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          🤖 Intent Agent - Find Your Perfect Mentor
        </h2>
        
        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "30px" }}>
          Describe what you're looking for, and our AI will match you with the most relevant alumni mentors
        </p>

        {/* Query Input Section */}
        <div className="card" style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I need help with Machine Learning and Python projects..."
              className="form-input"
              style={{ flex: 1, padding: "15px", fontSize: "16px" }}
              onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
              disabled={isProcessing}
            />
            <button
              className="primary"
              onClick={handleQuerySubmit}
              disabled={isProcessing}
              style={{ padding: "15px 25px", fontSize: "16px" }}
            >
              {isProcessing ? "🔍 Searching..." : "🔍 Find Mentors"}
            </button>
          </div>

          {error && (
            <div className="error" style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {/* Example Queries */}
          {showExamples && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "15px", color: "#667eea" }}>Try these examples:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px" }}>
                {[
                  "I want guidance in Artificial Intelligence and Machine Learning",
                  "Need help with React and Web Development projects",
                  "Looking for Data Science mentor with Python experience",
                  "Want cybersecurity advice for my network security project"
                ].map((example, index) => (
                  <button
                    key={index}
                    className="secondary"
                    onClick={() => handleExampleClick(example)}
                    style={{ 
                      padding: "12px", 
                      textAlign: "left", 
                      fontSize: "14px",
                      whiteSpace: "normal",
                      height: "auto"
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="card">
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <h3>🎯 Found {results.length} Matching Mentors</h3>
              <button 
                className="secondary" 
                onClick={handleReset}
                style={{ padding: "8px 16px" }}
              >
                New Search
              </button>
            </div>

            <div className="grid">
              {results.map((alumni, index) => (
                <div key={alumni.alumni_id} className="card" style={{ 
                  animation: `fadeInUp 0.3s ease ${index * 0.1}s both`,
                  position: "relative"
                }}>
                  <div style={{ 
                    position: "absolute", 
                    top: "10px", 
                    right: "10px",
                    background: "#667eea",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {Math.round(alumni.relevance_score * 100)}% Match
                  </div>

                  <h3 style={{ marginBottom: "10px", color: "#333" }}>{alumni.name}</h3>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <p><strong>🏢 Domain:</strong> {alumni.domain}</p>
                    <p><strong>🔧 Expertise:</strong> {alumni.expertise}</p>
                    <p><strong>💼 Company:</strong> {alumni.company}</p>
                    <p><strong>📅 Available Slots:</strong> {alumni.availability_count}</p>
                    <p style={{ fontSize: "14px", opacity: 0.7, marginTop: "8px" }}>
                      <strong>Matched on:</strong> "{alumni.matched_keyword}"
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="primary"
                      onClick={() => handleViewSlots(alumni.alumni_id)}
                      style={{ flex: 1 }}
                    >
                      View Available Slots
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {results.length === 0 && !isProcessing && !showExamples && (
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <h3 style={{ color: "#666", marginBottom: "15px" }}>No matches found</h3>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>
              Try using different keywords or browse our popular categories
            </p>
            <button className="secondary" onClick={handleReset}>
              Try Again
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
      `}</style>
    </div>
  );
};

export default IntentAgentPage;