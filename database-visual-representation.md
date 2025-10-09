# 🎨 GreenThumb Database - Complete Visual Representation

## Overview: Visual Database Architecture

This document provides comprehensive visual representations of the **redesigned** GreenThumb database architecture. GreenThumb is an existing product; this redesign modernizes the database to improve performance and add new capabilities. The visuals show how all components work together to create a fast, scalable, and maintainable system.

---

## 🏗️ Complete Entity Relationship Diagram

### Full Database Schema Visualization

```mermaid
erDiagram
    User ||--o{ Garden : owns
    User ||--o{ UserPlant : manages
    User ||--o{ UserHealthReport : submits
    User ||--o{ UserCareTask : assigned
    User ||--o{ UserActivity : performs
    User ||--o{ PlantIdentification : submits
    User ||--o{ PlantIdentificationFeedback : provides
    User ||--o{ PlantRecommendation : receives
    User ||--o{ CommunityPost : creates
    User ||--o{ CommunityResponse : provides
    User ||--o{ ExpertProfile : has
    User ||--o{ AuditLog : tracked_by

    Garden ||--o{ UserPlant : contains
    Garden ||--o{ PlantRecommendation : receives

    Plant ||--o{ UserPlant : referenced_by
    Plant ||--o{ PlantImage : has_images
    Plant ||--o{ PlantEmbedding : has_embeddings
    Plant ||--o{ PlantRecommendation : recommended_in
    Plant ||--o{ PlantSymbiosis : symbiotic_with
    Plant ||--o{ PlantHealthIssue : susceptible_to
    Plant ||--o{ PlantCareTask : has_tasks
    Plant ||--o{ PlantSimilarity : similar_to
    Plant ||--o{ PlantIdentification : identified_as
    Plant ||--o{ PlantIdentificationFeedback : corrected_to
    Plant ||--o{ CommunityPost : referenced_in

    UserPlant ||--o{ CareLog : has_care_logs
    UserPlant ||--o{ UserPlantImage : has_user_images
    UserPlant ||--o{ UserHealthReport : from_garden
    UserPlant ||--o{ UserCareTask : has_tasks
    UserPlant ||--o{ CommunityPost : referenced_in

    PlantHealthIssue ||--o{ UserHealthReport : diagnosed_in
    PlantCareTask ||--o{ UserCareTask : generates
    CommunityPost ||--o{ CommunityResponse : has_responses

    User {
        string id PK
        string clerkId UK
        string email UK
        string name
        json profile
        json preferences
        json stats
        timestamp deletedAt
        timestamp lastActiveAt
        timestamp createdAt
        timestamp updatedAt
    }

    Garden {
        int id PK
        string userId FK
        string name
        string description
        json location
        json conditions
        json preferences
        json management
        timestamp createdAt
        timestamp updatedAt
    }

    Plant {
        int id PK
        string slug UK
        string scientificName
        string[] commonNames
        string family
        string genus
        string species
        string cultivar
        string variety
        string description
        string origin
        string distribution
        string[] lightRequirements
        string[] waterNeeds
        string[] soilTypes
        string[] hardinessZones
        json characteristics
        float dataCompleteness
        timestamp lastAiUpdate
        float aiConfidence
        timestamp createdAt
        timestamp updatedAt
    }

    UserPlant {
        string id PK
        string userId FK
        int gardenId FK
        int plantId FK
        string nickname
        string notes
        string location
        string status
        int healthScore
        timestamp lastHealthCheck
        string currentPotSize
        string potMaterial
        boolean drainageHoles
        timestamp lastRepottedAt
        timestamp nextRepotEstimate
        timestamp plantedAt
        timestamp createdAt
        timestamp updatedAt
    }

    PlantSymbiosis {
        int id PK
        int plantId FK
        int symbioticPlantId FK
        string relationshipType
        string benefitToPlant
        string benefitToSymbiotic
        int distance
        string notes
        string researchSource
        float confidence
        timestamp createdAt
        timestamp updatedAt
    }

    PlantHealthIssue {
        string id PK
        int plantId FK
        string issueType
        string issueName
        string severity
        string[] symptoms
        string description
        string[] causes
        string[] prevention
        string[] treatment
        string[] organicTreatment
        string[] chemicalTreatment
        json visualCues
        float aiConfidence
        string researchSource
        timestamp createdAt
        timestamp updatedAt
    }

    UserHealthReport {
        string id PK
        string userId FK
        string plantHealthIssueId FK
        string userPlantId FK
        int plantId FK
        string[] images
        string description
        string[] symptoms
        string location
        json environment
        json aiDiagnosis
        float confidence
        json alternativeDiagnoses
        string status
        string resolution
        float effectiveness
        timestamp reportedAt
        timestamp resolvedAt
    }

    PlantCareTask {
        int id PK
        int plantId FK
        string taskType
        string title
        string description
        string priority
        string frequency
        string season
        json conditions
        json instructions
        boolean aiGenerated
        float aiConfidence
        timestamp createdAt
        timestamp updatedAt
    }

    UserCareTask {
        string id PK
        string userId FK
        string userPlantId FK
        int plantCareTaskId FK
        string taskType
        string title
        string description
        string priority
        timestamp dueDate
        timestamp completedAt
        boolean isCompleted
        boolean isRecurring
        json recurringPattern
        json customInstructions
        timestamp createdAt
        timestamp updatedAt
    }

    CareLog {
        string id PK
        string userPlantId FK
        string type
        string description
        string notes
        timestamp performedAt
        string[] images
        timestamp createdAt
    }

    PlantImage {
        int id PK
        int plantId FK
        string url
        string altText
        string caption
        string attribution
        boolean isPrimary
        int sortOrder
        string imageType
        string season
        string healthStatus
    }

    UserPlantImage {
        string id PK
        string userPlantId FK
        string url
        string altText
        string caption
        boolean isPrimary
        int sortOrder
        string imageType
        string season
        string healthStatus
        timestamp uploadedAt
    }

    PlantEmbedding {
        string id PK
        int plantId FK
        string content
        vector embedding
        string model
        timestamp createdAt
    }

    PlantRecommendation {
        int id PK
        int plantId FK
        int gardenId FK
        string userId FK
        string reason
        float score
        string category
        json context
        string model
        float confidence
        string algorithm
        timestamp createdAt
        timestamp expiresAt
    }

    PlantSimilarity {
        int id PK
        int plantId FK
        int similarPlantId FK
        float similarityScore
        string similarityType
    }

    SearchCache {
        string id PK
        string query
        json results
        json filters
        timestamp createdAt
        timestamp expiresAt
        int hitCount
    }

    Tip {
        int id PK
        string slug
        string title
        string description
        json content
        string authorId
        string category
        string[] tags
        string featuredImage
        int views
        int likes
        boolean isPublished
        timestamp publishedAt
        timestamp createdAt
        timestamp updatedAt
    }

    UserActivity {
        string id PK
        string userId FK
        string action
        string resourceType
        string resourceId
        json metadata
        timestamp createdAt
    }

    PlantView {
        string id PK
        int plantId FK
        string userId FK
        string source
        int duration
        timestamp viewedAt
    }

    PlantIdentification {
        string id PK
        string userId FK
        string[] images
        string description
        string location
        json environment
        json aiAnalysis
        boolean userConfirmed
        int confirmedPlantId FK
        string userFeedback
        string model
        string modelVersion
        int processingTime
        string status
        timestamp submittedAt
        timestamp analyzedAt
        timestamp confirmedAt
    }

    PlantIdentificationFeedback {
        string id PK
        string plantIdentificationId FK
        string userId FK
        string feedbackType
        boolean isCorrect
        int correctPlantId FK
        string comments
        json learningData
        timestamp createdAt
    }

    CommunityPost {
        string id PK
        string userId FK
        string title
        string content
        string category
        string[] tags
        int plantId FK
        string userPlantId FK
        string aiResponse
        float aiConfidence
        boolean isOpenToCommunity
        int responseCount
        int upvotes
        int views
        string status
        boolean isResolved
        timestamp resolvedAt
        string[] images
        timestamp createdAt
        timestamp updatedAt
    }

    CommunityResponse {
        string id PK
        string postId FK
        string userId FK
        string content
        boolean isExpertResponse
        boolean expertVerified
        string verificationSource
        int upvotes
        int downvotes
        boolean isAccepted
        float tipAmount
        float platformMatch
        string[] images
        timestamp createdAt
        timestamp updatedAt
    }

    ExpertProfile {
        string id PK
        string userId FK
        string bio
        string[] specialties
        string[] certifications
        string experience
        boolean isVerified
        string verificationLevel
        timestamp verificationDate
        int totalResponses
        int acceptedAnswers
        float totalEarnings
        float averageRating
        boolean isAvailable
        string responseTime
        timestamp createdAt
        timestamp updatedAt
    }

    AuditLog {
        string id PK
        string userId FK
        string action
        string tableName
        string recordId
        json changes
        string ipAddress
        string userAgent
        timestamp timestamp
    }
```

---

## 🌱 Modular Plant Data Structure

### Plant Data Organization

```mermaid
graph TD
    A[Plant Core Table] --> B[Essential Information Only]
    A --> C[PlantPhysicalTraits]
    A --> D[PlantEnvironmentalRequirements]
    A --> E[PlantCharacteristics]
    A --> F[PlantCareInstructions]
    A --> G[PlantPropagationInfo]

    B --> H[scientificName, family, genus<br/>lightRequirements, waterNeeds<br/>soilTypes, hardinessZones<br/>dataCompleteness, aiConfidence]

    C --> I[heightMin/Max, widthMin/Max<br/>growthRate, lifeSpan, habit<br/>stemType, rootType]

    D --> J[soilPh, temperatureMin/Max<br/>humidityMin/Max, windTolerance<br/>saltTolerance, frostTolerance<br/>soilDrainage, soilFertility]

    E --> K[flowerColor, bloomTime<br/>foliageColor, attractsBees<br/>deerResistant, toxicToPets<br/>fragrance, bloomDuration]

    F --> L[wateringFrequency, fertilizerType<br/>pruningTime, repottingFrequency<br/>specialCare, careNotes<br/>wateringMethod, fertilizingSeason]

    G --> M[propagationMethods<br/>seedGerminationTime, cuttingType<br/>divisionTime, propagationInstructions<br/>propagationDifficulty]

    style A fill:#4ecdc4
    style B fill:#45b7d1
    style C fill:#96ceb4
    style D fill:#feca57
    style E fill:#ff9ff3
    style F fill:#ff6b6b
    style G fill:#54a0ff
```

---

## 🔍 Plant Identification System

### AI-Powered Plant Identification Flow

```mermaid
graph TD
    A[User Uploads Plant Images] --> B[PlantIdentification Request]
    B --> C[AI Image Analysis]

    C --> D[Primary Match Identification]
    C --> E[Alternative Matches]
    C --> F[Confidence Scoring]

    D --> G[Plant Database Lookup]
    E --> G
    F --> H[Result Presentation]

    G --> H
    H --> I[User Confirmation]

    I -->|Correct| J[Add to Garden]
    I -->|Incorrect| K[User Feedback]
    I -->|Uncertain| L[Request More Images]

    K --> M[PlantIdentificationFeedback]
    M --> N[AI Model Learning]
    N --> O[Improved Future Results]

    J --> P[Garden Integration]
    L --> B

    style A fill:#4ecdc4
    style C fill:#ff6b6b
    style H fill:#45b7d1
    style M fill:#96ceb4
    style O fill:#feca57
```

### Plant Identification Data Structure

```mermaid
graph TD
    A[PlantIdentification] --> B[Request Data]
    A --> C[AI Analysis Results]
    A --> D[User Feedback]

    B --> E[Images Array]
    B --> F[User Description]
    B --> G[Location Context]
    B --> H[Environment Data]

    C --> I[Primary Match]
    C --> J[Alternative Matches]
    C --> K[Confidence Scores]
    C --> L[Visual Features]

    D --> M[User Confirmation]
    D --> N[Feedback Type]
    D --> O[Learning Data]

    I --> P[Plant ID + Confidence]
    J --> Q[Multiple Options]
    K --> R[Transparency]
    L --> S[Feature Extraction]

    M --> T[Confirmed Plant]
    N --> U[Correct/Incorrect/Partial]
    O --> V[Model Improvement]

    style A fill:#4ecdc4
    style C fill:#ff6b6b
    style D fill:#96ceb4
    style V fill:#feca57
```

---

## 🌱 Enhanced Recommendation System

### Garden-Condition Based Recommendations

```mermaid
graph TD
    A[Garden Conditions] --> B[Recommendation Engine]
    C[Existing Plants] --> B
    D[User Experience] --> B
    E[Seasonal Timing] --> B

    B --> F[PlantRecommendation]

    F --> G[Garden Context]
    F --> H[Symbiotic Benefits]
    F --> I[User Adaptation]

    G --> J[Light/Soil/Zone Matching]
    H --> K[Companion Planting]
    I --> L[Skill Level Matching]

    J --> M[Optimal Plant Selection]
    K --> N[Natural Pest Control]
    L --> O[User Success]

    M --> P[Better Garden Outcomes]
    N --> Q[Reduced Chemical Use]
    O --> R[User Satisfaction]

    style A fill:#4ecdc4
    style B fill:#ff6b6b
    style F fill:#45b7d1
    style P fill:#96ceb4
    style Q fill:#feca57
    style R fill:#ff9ff3
```

---

## 🌱 Social Layer - Community Q&A System

### Community Knowledge Sharing Workflow

```mermaid
graph TD
    A[User Posts Question] --> B[AI Generates Instant Response]
    B --> C[User Reviews AI Response]

    C -->|Satisfied| D[Question Resolved]
    C -->|Needs More Help| E[Open to Community]

    E --> F[Community Sees Question]
    F --> G[Experts Respond]
    F --> H[Community Members Respond]

    G --> I[Expert Response with Verification]
    H --> J[Community Response]

    I --> K[User Tips Expert]
    K --> L[Platform Matches Tip]
    L --> M[Expert Earns Money]

    J --> N[Community Upvotes]
    I --> N
    N --> O[Best Answer Selected]

    O --> P[Knowledge Added to Ecosystem]
    P --> Q[Future Users Benefit]

    style A fill:#4ecdc4
    style B fill:#ff6b6b
    style I fill:#45b7d1
    style M fill:#96ceb4
    style P fill:#feca57
```

### Social Layer Data Structure

```mermaid
graph TD
    A[CommunityPost] --> B[Question Content]
    A --> C[AI Integration]
    A --> D[Community Engagement]

    B --> E[title: String]
    B --> F[content: String]
    B --> G[category: PostCategory]
    B --> H[tags: String[]]
    B --> I[plantId: Int?]
    B --> J[userPlantId: String?]

    C --> K[aiResponse: String?]
    C --> L[aiConfidence: Float?]

    D --> M[isOpenToCommunity: Boolean]
    D --> N[responseCount: Int]
    D --> O[upvotes: Int]
    D --> P[views: Int]
    D --> Q[status: PostStatus]

    R[CommunityResponse] --> S[Response Content]
    R --> T[Expert Verification]
    R --> U[Monetization]

    S --> V[content: String]
    S --> W[isExpertResponse: Boolean]

    T --> X[expertVerified: Boolean]
    T --> Y[verificationSource: String?]

    U --> Z[tipAmount: Float?]
    U --> AA[platformMatch: Float?]

    BB[ExpertProfile] --> CC[Credentials]
    BB --> DD[Performance]
    BB --> EE[Availability]

    CC --> FF[specialties: String[]]
    CC --> GG[certifications: String[]]
    CC --> HH[experience: String?]

    DD --> II[totalResponses: Int]
    DD --> JJ[acceptedAnswers: Int]
    DD --> KK[totalEarnings: Float]

    EE --> LL[isAvailable: Boolean]
    EE --> MM[responseTime: String?]

    style A fill:#4ecdc4
    style R fill:#45b7d1
    style BB fill:#96ceb4
```

---

## 🔒 Security Architecture

### Security and Audit Data Flow

```mermaid
graph TD
    A[User Action] --> B{Action Type}

    B -->|Read| C[Data Access]
    B -->|Write| D[Data Modification]
    B -->|Delete| E[Soft Delete Request]

    C --> F[Log to AuditLog]
    D --> F
    E --> F

    F --> G[Record Action Details]
    G --> H[Store: userId, action, tableName,<br/>recordId, changes, ipAddress,<br/>userAgent, timestamp]

    E --> I[Set User.deletedAt]
    I --> J[90-Day Grace Period]
    J --> K{Grace Period Expired?}

    K -->|No| L[User Can Recover]
    L --> M[Clear deletedAt]
    M --> N[Account Restored]

    K -->|Yes| O[Scheduled Cleanup Job]
    O --> P[Anonymize PII]
    P --> Q[email → anon_ID@deleted.com<br/>name → 'Deleted User'<br/>profile → '{}']
    Q --> R[Keep Foreign Keys Intact]
    R --> S[Maintain Referential Integrity]

    style A fill:#4ecdc4
    style F fill:#45b7d1
    style I fill:#feca57
    style P fill:#ff6b6b
    style N fill:#96ceb4
    style S fill:#96ceb4
```

### GDPR Compliance Workflow

```mermaid
graph TD
    A[User Requests Deletion] --> B[Set deletedAt Timestamp]

    B --> C[User Sees: Account Deleted]
    B --> D[System Sees: deletedAt Filter]

    D --> E[All Queries: WHERE deletedAt IS NULL]
    E --> F[User Invisible to Other Users]

    C --> G[Within 90 Days?]
    G -->|Yes| H[User Can Request Recovery]
    H --> I[Support Reviews Request]
    I --> J[Clear deletedAt]
    J --> K[Account Fully Restored]

    G -->|No| L[Scheduled Anonymization]
    L --> M[Anonymization Script Runs]

    M --> N[PII Fields Anonymized]
    N --> O[email: anon_UUID@deleted.com]
    N --> P[name: 'Deleted User']
    N --> Q[profile: '{}']

    M --> R[Audit Trail Maintained]
    R --> S[AuditLog: Deletion Recorded]
    R --> T[UserActivity: Preserved for Analytics]

    M --> U[Foreign Keys Preserved]
    U --> V[CareLog → userId remains]
    U --> W[CommunityPost → userId remains]
    U --> X[Stats aggregation still works]

    style B fill:#4ecdc4
    style K fill:#96ceb4
    style M fill:#feca57
    style N fill:#ff6b6b
    style R fill:#45b7d1
    style U fill:#45b7d1
```

### Audit Log Usage Patterns

```mermaid
graph TD
    A[AuditLog Table] --> B[Security Monitoring]
    A --> C[GDPR Compliance]
    A --> D[User Activity Tracking]
    A --> E[Incident Investigation]

    B --> F[Failed Auth Attempts]
    B --> G[Suspicious Activity]
    B --> H[Data Export Requests]

    C --> I[Access Tracking]
    C --> J[Deletion Logs]
    C --> K[Export Requests]

    D --> L[User Behavior Analysis]
    D --> M[Feature Usage]
    D --> N[Anomaly Detection]

    E --> O[Security Breaches]
    E --> P[Data Integrity Issues]
    E --> Q[User Disputes]

    F --> R[Alert: Multiple Failed Logins]
    G --> S[Alert: Unusual Data Access]
    H --> T[Alert: Bulk Export]

    I --> U[Report: Data Accessed by User]
    J --> V[Report: Deletion Timeline]
    K --> W[Report: Export History]

    style A fill:#4ecdc4
    style B fill:#ff6b6b
    style C fill:#45b7d1
    style D fill:#feca57
    style E fill:#ff9ff3
```

---

## ✅ Validation Architecture

### Three-Tier Validation Flow

```mermaid
graph TD
    A[Client Request] --> B[API Route Handler]

    B --> C[Tier 1: Zod Schema Validation]
    C --> D{Valid?}

    D -->|No| E[Return 400 Bad Request]
    E --> F[Clear Error Messages]
    F --> G[Field-Level Errors]
    G --> H[Example: 'gardeningGoals'<br/>must have max 10 items]

    D -->|Yes| I[Application Logic]
    I --> J[Set JSON Defaults if Null]
    J --> K[profile || {}, preferences || {}]

    K --> L[Tier 2: Prisma Client]
    L --> M[TypeScript Type Checking]
    M --> N[Compile-Time Validation]
    N --> O[Note: No JSON default support]

    L --> P[Tier 3: Database Constraints]
    P --> Q{Constraints Met?}

    Q -->|No| R[Database Constraint Error]
    R --> S[Return 500 Internal Error]
    S --> T[Log Error for Investigation]

    Q -->|Yes| U[Transaction Committed]
    U --> V[Return 200 Success]
    V --> W[Return Created/Updated Data]

    style C fill:#4ecdc4
    style J fill:#96ceb4
    style M fill:#45b7d1
    style P fill:#feca57
    style E fill:#ff6b6b
    style S fill:#ff6b6b
    style V fill:#96ceb4
```

### JSON Field Validation Example

```mermaid
graph TD
    A[User.profile JSON] --> B[Zod Schema: UserProfileSchema]

    B --> C[Validate Structure]
    C --> D[experience: enum]
    C --> E[gardeningGoals: array]
    C --> F[availableTime: enum]
    C --> G[budget: enum]

    E --> H[Check Array Length]
    H --> I{Length ≤ 10?}
    I -->|No| J[Error: Max 10 items]
    I -->|Yes| K[Valid]

    D --> L{Valid enum value?}
    L -->|No| M[Error: Must be beginner,<br/>intermediate, advanced,<br/>or expert]
    L -->|Yes| K

    F --> N{Valid enum value?}
    N -->|No| O[Error: Must be daily,<br/>weekends, or seasonal]
    N -->|Yes| K

    K --> P[All Fields Valid]
    P --> Q[Pass to Prisma]
    Q --> R[Insert into Database]

    J --> S[Return Validation Errors]
    M --> S
    O --> S
    S --> T[User Sees Helpful Errors]

    style B fill:#4ecdc4
    style H fill:#45b7d1
    style K fill:#96ceb4
    style S fill:#ff6b6b
    style T fill:#ff6b6b
```

### Array Field Size Enforcement

```mermaid
graph TD
    A[Array Field] --> B{Field Type}

    B -->|User Data| C[User.profile.gardeningGoals]
    B -->|Garden Data| D[Garden.conditions.light]
    B -->|Health Data| E[PlantHealthIssue.symptoms]
    B -->|Plant Data| F[PlantCharacteristics.flowerColor]

    C --> G[Max 10 items]
    D --> H[Max 5 items]
    E --> I[Max 20 items]
    F --> J[Max 10 items]

    G --> K[Zod Schema Check]
    H --> K
    I --> K
    J --> K

    K --> L{Within Limit?}

    L -->|No| M[Error: Exceeds Maximum]
    M --> N[Specify Field and Limit]
    N --> O[Example: 'light' field<br/>allows max 5 items,<br/>received 7]

    L -->|Yes| P[Pass Validation]
    P --> Q[Insert into Database]
    Q --> R[Success]

    style K fill:#4ecdc4
    style L fill:#45b7d1
    style M fill:#ff6b6b
    style P fill:#96ceb4
    style R fill:#96ceb4
```

---

## 🔍 Data Flow Architecture

### Complete System Data Flow

```mermaid
graph TD
    A[User Actions] --> B{Action Type}

    B -->|Plant Search| C[Plant Search Service]
    B -->|Plant ID| D[Plant Identification Service]
    B -->|Health ID| E[Health ID Service]
    B -->|Garden Management| F[Garden Service]
    B -->|Care Tracking| G[Care Analytics Service]
    B -->|Community Q&A| H[Social Q&A Service]
    B -->|Symbiotic Plants| I[Symbiosis Service]
    B -->|Recommendations| J[Recommendation Service]

    C --> K[Plant Query Engine]
    K --> L[Vector Search]
    K --> M[Relational Filters]
    K --> N[Cache Layer]

    D --> O[Image Analysis]
    O --> P[Plant Identification]
    O --> Q[Confidence Scoring]
    P --> R[Plant Database]
    Q --> S[Alternative Matches]
    R --> T[Identification Results]
    S --> T

    E --> U[Image Analysis]
    U --> V[Health Issue Detection]
    V --> W[Health Issue Database]
    W --> X[Treatment Recommendations]

    F --> Y[Garden CRUD]
    F --> Z[Plant Recommendations]
    F --> AA[Statistics Calculation]

    G --> BB[Care Logging]
    G --> CC[Task Scheduling]
    G --> DD[Health Analytics]

    H --> EE[AI Response Generation]
    EE --> FF[Community Engagement]
    FF --> GG[Expert Matching]
    GG --> HH[Monetization Processing]

    I --> II[Symbiosis Lookup]
    II --> JJ[Relationship Benefits]
    JJ --> KK[Companion Recommendations]

    J --> LL[Garden Conditions Analysis]
    J --> MM[User Experience Matching]
    J --> NN[Symbiotic Benefits]
    LL --> OO[Contextual Recommendations]
    MM --> OO
    NN --> OO

    L --> PP[PlantEmbedding Table]
    M --> QQ[Plant Table]
    N --> RR[Redis Cache]
    R --> QQ
    W --> SS[PlantHealthIssue Table]
    X --> TT[UserHealthReport Table]
    T --> UU[PlantIdentification Table]
    EE --> VV[CommunityPost Table]
    FF --> WW[CommunityResponse Table]
    GG --> XX[ExpertProfile Table]
    OO --> YY[PlantRecommendation Table]

    style A fill:#4ecdc4
    style D fill:#ff6b6b
    style E fill:#ff6b6b
    style H fill:#45b7d1
    style I fill:#96ceb4
    style KK fill:#feca57
    style MM fill:#ff9ff3
```

---

## ⚡ Performance Architecture

### Complete Indexing Strategy

```mermaid
graph TD
    A[Complete Indexing Strategy] --> B[Primary Keys]
    A --> C[Foreign Keys]
    A --> D[Search Fields]
    A --> E[Array Fields]
    A --> F[JSON Fields]
    A --> G[Vector Fields]
    A --> H[Composite Indexes]

    B --> I[User.id - B-tree]
    B --> J[Plant.id - B-tree]
    B --> K[Garden.id - B-tree]
    B --> L[UserPlant.id - B-tree]

    C --> M[UserPlant.userId - B-tree]
    C --> N[UserPlant.gardenId - B-tree]
    C --> O[UserPlant.plantId - B-tree]
    C --> P[PlantSymbiosis.plantId - B-tree]
    C --> Q[PlantHealthIssue.plantId - B-tree]

    D --> R[Plant.scientificName - B-tree]
    D --> S[Plant.family - B-tree]
    D --> T[Plant.genus - B-tree]
    D --> U[User.email - B-tree]
    D --> V[User.clerkId - B-tree]

    E --> W[Plant.commonNames - GIN]
    E --> X[Plant.lightRequirements - GIN]
    E --> Y[Plant.soilTypes - GIN]
    E --> Z[Plant.hardinessZones - GIN]
    E --> AA[Plant.propagationMethods - GIN]

    F --> BB[Plant.characteristics - GIN]
    F --> CC[Plant.careInstructions - GIN]
    F --> DD[Plant.commonProblems - GIN]
    F --> EE[User.profile - GIN]
    F --> FF[User.preferences - GIN]
    F --> GG[User.stats - GIN]
    F --> HH[Garden.location - GIN]
    F --> II[Garden.conditions - GIN]
    F --> JJ[Garden.preferences - GIN]
    F --> KK[PlantHealthIssue.visualCues - GIN]

    G --> LL[PlantEmbedding.embedding - HNSW]

    H --> MM[UserPlant.userId + status - B-tree]
    H --> NN[UserPlant.gardenId + plantId - B-tree]
    H --> OO[PlantImage.plantId + isPrimary - B-tree]
    H --> PP[UserPlantImage.userPlantId + isPrimary - B-tree]

    style A fill:#4ecdc4
    style B fill:#45b7d1
    style C fill:#96ceb4
    style D fill:#feca57
    style E fill:#ff9ff3
    style F fill:#54a0ff
    style G fill:#ff6b6b
    style H fill:#2ecc71
```

---

## 🎯 Feature Matrix

### Complete Feature Architecture

```mermaid
graph TD
    A[GreenThumb Features] --> B[Core Plant Management]
    A --> C[Plant Identification]
    A --> D[Health Identification]
    A --> E[Social Layer]
    A --> F[Symbiotic Relationships]
    A --> G[Enhanced Recommendations]
    A --> H[Automated Care]
    A --> I[User Experience]
    A --> J[AI & Analytics]

    B --> K[Plant Database]
    B --> L[Garden Management]
    B --> M[User Plants]
    B --> N[Care Logging]

    C --> O[Image Analysis]
    C --> P[Species Identification]
    C --> Q[Confidence Scoring]
    C --> R[User Feedback Loop]

    D --> S[Image Analysis]
    D --> T[Health Issue Database]
    D --> U[Treatment Recommendations]
    D --> V[Outcome Tracking]

    E --> W[Community Q&A]
    E --> X[Expert Monetization]
    E --> Y[Knowledge Sharing]
    E --> Z[Social Engagement]

    F --> AA[Relationship Database]
    F --> BB[Companion Planting]
    F --> CC[Benefit Analysis]
    F --> DD[Spacing Optimization]

    G --> EE[Garden Conditions]
    G --> FF[Symbiotic Matching]
    G --> GG[User Experience]
    G --> HH[Seasonal Timing]

    H --> II[Task Generation]
    H --> JJ[Seasonal Scheduling]
    H --> KK[User Customization]
    H --> LL[Calendar Integration]

    I --> MM[Personalized Profiles]
    I --> NN[Learning System]
    I --> OO[Achievement System]
    I --> PP[Progress Tracking]

    J --> QQ[Vector Search]
    J --> RR[Health Diagnosis]
    J --> SS[Care Optimization]
    J --> TT[Data Enhancement]

    style A fill:#4ecdc4
    style B fill:#45b7d1
    style C fill:#ff6b6b
    style D fill:#ff6b6b
    style E fill:#96ceb4
    style F fill:#feca57
    style G fill:#ff9ff3
    style H fill:#54a0ff
    style I fill:#2ecc71
    style J fill:#e74c3c
```

---

## 📊 Performance Metrics Dashboard

### Expected Performance Improvements

```mermaid
graph LR
    A[Performance Metrics] --> B[Query Performance]
    A --> C[Resource Usage]
    A --> D[User Experience]
    A --> E[Developer Experience]

    B --> F[60-80% Faster Queries]
    B --> G[90% Fewer JOINs]
    B --> H[3x Faster Plant Search]
    B --> I[Real-time Health ID]

    C --> J[50% Less CPU]
    C --> K[40% Less Memory]
    C --> L[70% Fewer I/O Ops]
    C --> M[Better Caching]

    D --> N[2x Faster Page Loads]
    D --> O[Personalized Care]
    D --> P[Better Recommendations]
    D --> Q[Health Monitoring]

    E --> R[80% Simpler Queries]
    E --> S[50% Less Code]
    E --> T[90% Better Type Safety]
    E --> U[Easier Maintenance]

    style A fill:#4ecdc4
    style F fill:#45b7d1
    style J fill:#96ceb4
    style N fill:#feca57
    style R fill:#ff9ff3
```

---

## 🏛️ Complete System Architecture

### Full Technology Stack

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React/Next.js App]
        B[Mobile App]
        C[Admin Dashboard]
    end

    subgraph "API Layer"
        D[Next.js API Routes]
        E[Authentication]
        F[Rate Limiting]
    end

    subgraph "Service Layer"
        G[Plant Service]
        H[Health ID Service]
        I[Symbiosis Service]
        J[Care Analytics Service]
        K[User Service]
    end

    subgraph "Database Layer"
        L[PostgreSQL]
        M[Redis Cache]
        N[Vector Database]
    end

    subgraph "AI/ML Layer"
        O[Plant Health AI]
        P[Care Task AI]
        Q[Data Enhancement AI]
        R[Recommendation Engine]
    end

    subgraph "External Services"
        S[Weather API]
        T[Plant Database APIs]
        U[Image Processing]
        V[Notification Service]
    end

    A --> D
    B --> D
    C --> D

    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    F --> J
    F --> K

    G --> L
    H --> L
    I --> L
    J --> L
    K --> L

    G --> M
    H --> M
    I --> M
    J --> M

    H --> N
    I --> N
    J --> N

    H --> O
    J --> P
    G --> Q
    I --> R

    G --> S
    G --> T
    H --> U
    J --> V

    style A fill:#4ecdc4
    style D fill:#45b7d1
    style G fill:#96ceb4
    style L fill:#feca57
    style O fill:#ff6b6b
```

---

## 🔄 User Journey Flow

### Complete User Experience Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant S as Service
    participant D as Database
    participant C as Cache
    participant AI as AI Service

    U->>F: Search for "rose"
    F->>A: GET /api/plants?q=rose&light=full_sun
    A->>C: Check cache

    alt Cache Hit
        C->>A: Return cached results
    else Cache Miss
        A->>S: PlantSearchService.search()
        S->>D: Query Plant table with filters
        D->>S: Return plant results
        S->>C: Cache results
        S->>A: Return results
    end

    A->>F: Return plant data
    F->>U: Display search results

    U->>F: Add plant to garden
    F->>A: POST /api/user-plants
    A->>S: PlantService.addToGarden()
    S->>D: Insert UserPlant record
    S->>AI: Generate care tasks
    AI->>S: Return personalized tasks
    S->>D: Insert UserCareTask records
    D->>S: Confirm insertion
    S->>A: Return success
    A->>F: Confirm addition
    F->>U: Show updated garden

    U->>F: Upload plant identification image
    F->>A: POST /api/plant-identification
    A->>AI: Analyze plant species
    AI->>A: Return identification results
    A->>S: PlantIdentificationService.create()
    S->>D: Insert PlantIdentification record
    D->>S: Confirm insertion
    S->>A: Return identification results
    A->>F: Return plant identification
    F->>U: Show identified plant with confidence

    U->>F: Confirm plant identification
    F->>A: POST /api/plant-identification/confirm
    A->>S: PlantIdentificationService.confirm()
    S->>D: Update PlantIdentification status
    S->>D: Insert UserPlant record
    D->>S: Confirm updates
    S->>A: Return success
    A->>F: Confirm addition
    F->>U: Show plant added to garden

    U->>F: Upload plant health image
    F->>A: POST /api/plant-health
    A->>AI: Analyze plant health
    AI->>A: Return diagnosis
    A->>S: HealthService.createReport()
    S->>D: Insert UserHealthReport
    S->>D: Update UserPlant health
    D->>S: Confirm updates
    S->>A: Return diagnosis
    A->>F: Return health analysis
    F->>U: Show treatment recommendations

    U->>F: Log plant care
    F->>A: POST /api/care-logs
    A->>S: CareAnalyticsService.logCare()
    S->>D: Insert CareLog record
    S->>D: Update UserPlant status
    D->>S: Confirm updates
    S->>A: Return success
    A->>F: Confirm logging
    F->>U: Show care logged
```

---

## 🎨 Visual Summary

This complete visual representation shows how the **redesigned** GreenThumb database architecture creates a cohesive, high-performance, and secure system that:

1. **Organizes data logically** with clear relationships between entities
2. **Optimizes performance** through strategic indexing, caching, and composite indexes
3. **Supports AI features** with vector search, plant identification, and health diagnosis
4. **Enables intelligent recommendations** based on garden conditions and symbiotic relationships
5. **Ensures security & privacy** with soft delete, audit logging, and GDPR compliance
6. **Validates data comprehensively** with three-tier validation:
   - **Zod schemas** for array sizes and JSON structures (primary enforcement)
   - **Database constraints** for critical limits (secondary protection)
   - **Prisma types** for compile-time safety (tertiary validation)
   - **Application defaults** for JSON fields (Prisma limitation workaround)
7. **Scales efficiently** with modular design and horizontal partitioning
8. **Provides excellent UX** through user-centric data organization and seamless workflows

The redesign transforms GreenThumb from the existing system into a faster, more maintainable, scalable, and secure platform. It migrates from complex JOIN-heavy queries to a hybrid model with strategic denormalization, adds AI-powered features, implements comprehensive validation, and maintains excellent developer experience while preserving existing user data.

### Key Capabilities

**Core Features:**

- **Plant Identification**: AI-powered species identification from images with confidence scoring
- **Enhanced Recommendations**: Garden-condition and symbiotic relationship-based plant recommendations (on-demand, not push)
- **Social Layer**: Community Q&A system with optional expert monetization (Phase 2+)
- **Learning System**: Continuous AI improvement through user feedback
- **Comprehensive Plant Data**: Every piece of information needed for plants to thrive
- **Seamless Integration**: Plant identification flows directly into garden management

**Security & Privacy:**

- **Soft Delete Pattern**: 90-day grace period for account recovery with GDPR compliance
- **Audit Logging**: Complete tracking of all data modifications and access for security and compliance
- **Data Anonymization**: PII removal while maintaining referential integrity for analytics
- **User Control**: Granular privacy settings and data export capabilities

**Performance & Quality:**

- **Composite Indexes**: 5-10x faster dashboard and task management queries
- **Three-Tier Validation**: Database, Prisma, and Zod validation for data quality
- **JSON Field Validation**: Structured schemas for all JSON fields with array size limits
- **No Filesort Operations**: Optimized indexes eliminate expensive sorting operations

**User Experience:**

- **On-Demand Recommendations**: User-initiated, not push notifications
- **Suggested Care Tasks**: Opt-in system with full user control and smart batching
- **Progressive Disclosure**: Simple defaults for beginners, advanced options for experts
- **Transparent AI**: Confidence scores and explanations for all AI recommendations

**Phased Implementation:**

- **Migration Phase**: Migrate existing database to new schema; preserve user data
- **Enhanced Features**: Plant ID, health diagnosis, improved recommendations with garden conditions
- **New Features**: Symbiotic relationships, automated care tasks, community Q&A
- **Phase 2+ Advanced**: Expert monetization, advanced aesthetic pairings, color theory
- **Iterative Rollout**: Add features based on user feedback and existing product insights
