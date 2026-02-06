# REConnect Intent Agent Specification

## Overview
The Intent Agent is the first component of the REConnect multi-agent orchestration framework. It serves as the query interpretation interface that analyzes student requests and matches them with relevant alumni based on keyword-based domain recognition from the database.

## Core Functionality

### Primary Responsibilities
1. **Query Analysis**: Parse natural language student requests for domain keywords
2. **Keyword Extraction**: Identify technical domains and skills from queries
3. **Database Matching**: Search alumni profiles for keyword matches in expertise, domain, and description fields
4. **Ranking Algorithm**: Sort matched alumni by relevance and availability
5. **Structured Output Generation**: Convert matches into actionable format for downstream agents

### Technical Architecture

#### Input Processing
```
Student Query (Natural Language) 
→ Keyword Extraction 
→ Database Search 
→ Relevance Ranking 
→ Structured Output
```

#### Expected Input Format
```json
{
  "query": "I want guidance from someone working in AI",
  "user_id": "student_123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Output Format
```json
{
  "query": "I want guidance from someone working in AI",
  "extracted_keywords": ["AI", "Artificial Intelligence", "Machine Learning"],
  "matched_alumni": [
    {
      "alumni_id": 101,
      "name": "John Smith",
      "domain": "Artificial Intelligence",
      "expertise": "Machine Learning, Deep Learning, Computer Vision",
      "company": "TechCorp AI",
      "relevance_score": 0.95,
      "availability_count": 3
    },
    {
      "alumni_id": 102,
      "name": "Sarah Johnson",
      "domain": "Data Science",
      "expertise": "AI, Neural Networks, NLP",
      "company": "DataTech Solutions",
      "relevance_score": 0.87,
      "availability_count": 1
    }
  ],
  "total_matches": 2,
  "processing_time_ms": 45,
  "routing_info": {
    "next_agent": "matchmaking_agent",
    "priority": "high"
  }
}
```

## Implementation Requirements

### Technology Stack
- **Keyword Processing**: JavaScript string analysis and regex matching
- **Database Integration**: SQLite database queries with LIKE operations
- **Search Algorithm**: SQL-based fuzzy matching with keyword scoring
- **Language Support**: English (primary), with keyword dictionary expansion

### Database Integration Details

#### Alumni Profile Fields Used for Matching
```sql
-- Primary matching fields
SELECT alumni_id, name, domain, expertise, company
FROM alumni_profile 
WHERE expertise LIKE '%keyword%' 
   OR domain LIKE '%keyword%' 
   OR company LIKE '%keyword%'
```

#### Keyword Dictionary Structure
```javascript
const domainKeywords = {
  "AI": ["AI", "Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks"],
  "WebDev": ["Web Development", "React", "JavaScript", "Frontend", "Backend"],
  "DataScience": ["Data Science", "Analytics", "Statistics", "Big Data", "Python"],
  "Cybersecurity": ["Cybersecurity", "Network Security", "Information Security", "Encryption"],
  "Cloud": ["Cloud Computing", "AWS", "Azure", "GCP", "DevOps"],
  "UIUX": ["UI/UX", "User Interface", "User Experience", "Design", "Figma"]
};
```

### Query Processing Algorithm

#### Keyword Extraction Process
```javascript
const extractKeywords = (query) => {
  const normalizedQuery = query.toLowerCase();
  const foundKeywords = [];
  
  // Check each domain category
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
```

#### Database Search Implementation
```javascript
const searchAlumniByKeywords = async (keywords) => {
  const matches = [];
  
  for (const keywordObj of keywords) {
    const stmt = await db.prepare(`
      SELECT u.user_id as alumni_id, u.name, ap.domain, ap.expertise, ap.company,
             COUNT(av.availability_id) as availability_count
      FROM users u
      JOIN alumni_profile ap ON u.user_id = ap.alumni_id
      LEFT JOIN availability av ON av.alumni_id = u.user_id AND av.is_booked = 0
      WHERE (ap.expertise LIKE ? OR ap.domain LIKE ? OR ap.company LIKE ?)
      GROUP BY u.user_id
      ORDER BY COUNT(av.availability_id) DESC
    `);
    
    const results = await stmt.all(
      `%${keywordObj.keyword}%`, 
      `%${keywordObj.keyword}%`, 
      `%${keywordObj.keyword}%`
    );
    
    results.forEach(result => {
      matches.push({
        ...result,
        matched_keyword: keywordObj.keyword,
        relevance_score: calculateRelevance(result, keywordObj)
      });
    });
  }
  
  return deduplicateAndRank(matches);
};
```

### Domain Categories

#### Technical Domains
- **Artificial Intelligence** (AI, Machine Learning, Deep Learning, Neural Networks)
- **Web Development** (React, JavaScript, Frontend, Backend, Full-stack)
- **Data Science** (Analytics, Statistics, Big Data, Python, R)
- **Cybersecurity** (Network Security, Information Security, Encryption)
- **Cloud Computing** (AWS, Azure, GCP, DevOps, Infrastructure)
- **UI/UX Design** (User Interface, User Experience, Design, Figma)

#### Business Domains
- **Product Management** (Product Strategy, Roadmapping, Analytics)
- **Digital Marketing** (SEO, Content Marketing, Social Media)
- **Finance** (Financial Analysis, Investment, Accounting)
- **Entrepreneurship** (Startups, Business Development, Innovation)

## Error Handling & Fallbacks

### Error Scenarios
1. **No Keywords Found**: Return general alumni suggestions
2. **No Matches Found**: Suggest broadening search or manual browsing
3. **Database Connection Issues**: Fallback to cached keyword mappings
4. **Ambiguous Queries**: Ask for clarification with examples

### Fallback Logic
```javascript
const handleNoMatches = (query) => {
  return {
    message: "No exact matches found. Here are some suggestions:",
    suggestions: [
      "Try being more specific about the technology or domain",
      "Consider related fields (e.g., 'web development' instead of 'coding')",
      "Browse all available alumni manually",
      "Check popular mentorship categories"
    ],
    popular_categories: getPopularCategories()
  };
};
```

## Integration Points

### With Find Alumni Page
- Receives navigation from student dashboard
- Displays query input interface
- Shows matching results with alumni profiles
- Provides booking options for matched alumni

### With Matchmaking Agent
- Supplies ranked alumni list with relevance scores
- Provides keyword context for detailed matching
- Sends availability information

### With Scheduling Agent
- Indicates preferred alumni availability
- Provides timing constraints from availability data
- Supplies session preference information

## Performance Requirements

### Response Time Targets
- **Keyword Extraction**: < 10ms
- **Database Search**: < 100ms
- **Ranking Algorithm**: < 20ms
- **Overall Processing**: < 200ms

### Scalability Metrics
- **Concurrent Queries**: Support 100+ simultaneous requests
- **Database Size**: Efficient with 1000+ alumni profiles
- **Memory Usage**: < 50MB for keyword processing

## Security Considerations

### Data Privacy
- No storage of raw queries in production
- Anonymization of search patterns
- Compliance with educational privacy regulations

### Query Safety
- SQL injection prevention through prepared statements
- Input sanitization for search terms
- Rate limiting for excessive queries

## Testing Strategy

### Unit Tests
- Keyword extraction accuracy
- Database query performance
- Ranking algorithm validation
- Error handling scenarios

### Integration Tests
- Database connectivity and response handling
- End-to-end query processing
- Frontend-backend communication
- Fallback mechanism testing

### Performance Tests
- Response time under load
- Concurrent user handling
- Database query optimization
- Memory usage monitoring

## Monitoring & Logging

### Key Metrics to Track
- Query volume and patterns
- Match success rates
- Average response times
- Popular keyword searches
- User engagement metrics

### Logging Structure
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "student_123",
  "query": "I want AI mentorship",
  "extracted_keywords": ["AI"],
  "matches_found": 3,
  "processing_time_ms": 45,
  "success": true
}
```

## Future Enhancements

### Planned Improvements
1. **Semantic Search**: Beyond exact keyword matching
2. **Learning Algorithm**: Improve matching based on user feedback
3. **Multi-language Support**: Expand keyword dictionaries
4. **Contextual Understanding**: Consider student profile in matching
5. **Real-time Updates**: Live availability integration

### Research Directions
- Integration with student skill assessments
- Personalized matching algorithms
- Predictive keyword suggestion
- Cross-domain expertise recognition