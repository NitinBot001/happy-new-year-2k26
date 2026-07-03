# School Management System — Architecture & Flow

This document maps the complete operational flow of the upgraded system — from authentication and role-based access, through fee collection and Razorpay payments, to reporting and notifications.

## Legend

| Shape | Meaning |
|-------|---------|
| Rounded | Start / End |
| Rectangle | Process / Step |
| Diamond | Decision point |
| Cylinder | Database |
| Double-bordered | External service |

---

## 1. System Architecture Overview

```mermaid
flowchart TB
    subgraph Frontend["Frontend - React"]
        AdminUI[Admin Dashboard]
        MgmtUI[Management Dashboard]
        TeacherUI[Teacher Dashboard]
        StaffUI[Support Staff Dashboard]
        StudentUI[Student Dashboard]
        ParentUI[Parent Dashboard]
    end

    subgraph Backend["Backend - FastAPI"]
        Auth[Auth Service]
        Perm[Permission Middleware]
        StudentAPI[Student CRUD API]
        FeesAPI[Fees API]
        ReportAPI[Report API]
        PayAPI[Payment API]
        NotifAPI[Notification API]
    end

    subgraph External["External Services"]
        Razorpay[(Razorpay Gateway)]
        WhatsApp[[WhatsApp - Future]]
        SMS[[SMS Gateway - Future]]
        Email[[Email Service]]
    end

    DB[(Database)]

    Frontend -->|HTTPS JWT| Auth
    Auth --> Perm
    Perm --> StudentAPI
    Perm --> FeesAPI
    Perm --> ReportAPI
    Perm --> PayAPI
    Perm --> NotifAPI

    StudentAPI --> DB
    FeesAPI --> DB
    ReportAPI --> DB
    PayAPI --> DB
    NotifAPI --> DB

    PayAPI <--> Razorpay
    NotifAPI -.-> WhatsApp
    NotifAPI -.-> SMS
    NotifAPI -.-> Email
```

Frontend roles talk to one shared FastAPI backend behind an auth + permission layer. Every module writes to one shared database. Payment goes to Razorpay; notifications route out to WhatsApp, SMS, and Email once providers are finalized.

---

## 2. Login and Role-Based Access Flow

```mermaid
flowchart TD
    Start([User opens app]) --> Login[Enter email or phone plus password]
    Login --> Validate{Credentials valid?}
    Validate -->|No| Error[Show error, retry]
    Error --> Login
    Validate -->|Yes| CheckRole[Fetch role and permissions from DB]
    CheckRole --> IssueJWT[Issue JWT with role and permissions claims]
    IssueJWT --> Redirect{Role type}
    Redirect -->|Admin| AdminDash[Admin Dashboard - full access]
    Redirect -->|Management| MgmtDash[Management Dashboard - reports and staff]
    Redirect -->|Teacher| TeacherDash[Teacher Dashboard - own class and attendance]
    Redirect -->|Support Staff| StaffDash[Peon or Driver Dashboard - tasks and own attendance]
    Redirect -->|Student| StudentDash[Student Dashboard - own data]
    Redirect -->|Parent| ParentDash[Parent Dashboard - linked children data]

    AdminDash --> APICall[Any API call]
    MgmtDash --> APICall
    TeacherDash --> APICall
    StaffDash --> APICall
    StudentDash --> APICall
    ParentDash --> APICall

    APICall --> MW{Permission Middleware checks JWT}
    MW -->|Authorized| Allow[Process request]
    MW -->|Not authorized| Deny[403 Forbidden]
```

One login endpoint for all roles. JWT carries role + permissions, and every subsequent API call is checked against those permissions — not against hardcoded role names.

---

## 3. Fees Module — End to End Flow

```mermaid
flowchart TD
    A[Admin creates Fee Structure] --> B[Define class wise and term wise amounts with due dates]
    B --> C[Assign Fee Structure to Students]
    C --> D[Fee record created per student - status PENDING]
    D --> E[Parent or Student logs in]
    E --> F[Views Due Fees on Dashboard]
    F --> G{Wants to pay now?}
    G -->|No| H[Reminder scheduled via Notification Service]
    G -->|Yes| I[Click Pay Now]
    I --> J[Backend creates Razorpay Order]
    J --> K[Frontend opens Razorpay Checkout]
    K --> L{Payment completed?}
    L -->|Failed or Cancelled| M[Status FAILED, user can retry]
    L -->|Success| N[Razorpay returns payment id, order id, signature]
    N --> O[Backend verifies signature using HMAC SHA256]
    O --> P[Razorpay Webhook sends server to server confirmation]
    P --> Q{Signature and Webhook both valid?}
    Q -->|No| R[Flag for manual reconciliation]
    Q -->|Yes| S[Update Fee record status to PAID]
    S --> T[Generate Receipt PDF]
    T --> U[Trigger Notification - WhatsApp, SMS or Email]
    U --> V[Payment reflected in Fee Collection Report]
```

Covers the full lifecycle: fee structure creation by Admin, assignment to students, payment initiation, Razorpay checkout, webhook-based confirmation, and receipt generation.

---

## 4. Razorpay Payment — Technical Sequence

```mermaid
sequenceDiagram
    participant P as Parent or Student
    participant B as Backend FastAPI
    participant R as Razorpay

    P->>B: POST create-order with fee id
    B->>B: Calculate amount from fee record
    B->>R: Create Order API call
    R-->>B: order id
    B-->>P: order id and Razorpay key
    P->>R: Open Razorpay Checkout
    R-->>P: payment id and signature on success
    P->>B: POST verify with payment id order id signature
    B->>B: Verify signature using secret key
    R->>B: Webhook - payment captured event
    B->>B: Cross check webhook against verified payment
    B->>B: Update fee status to PAID
    B-->>P: Payment confirmed with receipt link
```

Detailed request/response sequence between frontend, backend, and Razorpay — signature verification plus webhook cross-check means frontend confirmation alone is never trusted.

---

## 5. CRUD Operations Pattern (Student shown, same pattern for Fees, Users, every module)

```mermaid
flowchart TD
    subgraph CREATE["CREATE - POST"]
        C1[POST students] --> C2[Validate via StudentCreate schema]
        C2 --> C3{Valid?}
        C3 -->|No| C4[422 Validation Error]
        C3 -->|Yes| C5[Save to DB]
        C5 --> C6[201 Created plus StudentResponse]
    end

    subgraph READ["READ - GET"]
        R1[GET students or students by id] --> R2[Check Permission]
        R2 --> R3[Query DB with filters and pagination]
        R3 --> R4[200 OK plus StudentResponse]
    end

    subgraph UPDATE["UPDATE - PATCH"]
        U1[PATCH students by id] --> U2[Validate via StudentUpdate schema]
        U2 --> U3{Record exists?}
        U3 -->|No| U4[404 Not Found]
        U3 -->|Yes| U5[Update fields in DB]
        U5 --> U6[200 OK plus updated StudentResponse]
    end

    subgraph DELETE["DELETE"]
        D1[DELETE students by id] --> D2{Record exists?}
        D2 -->|No| D3[404 Not Found]
        D2 -->|Yes| D4[Soft delete - is_active false]
        D4 --> D5[204 No Content]
    end
```

Standard pattern reused across Student, Fees, Users, every module — schema validation, permission check, and proper HTTP status codes so Swagger docs stay accurate.

---

## 6. Report Generation Flow

```mermaid
flowchart TD
    A[User selects Report Type] --> B{Report Type}
    B -->|Fee Collection| C1[Filter by date range, class, payment status]
    B -->|Attendance| C2[Filter by date range, class, student or staff]
    B -->|Academic| C3[Filter by exam, term, class, subject]

    C1 --> D[Query DB and aggregate data]
    C2 --> D
    C3 --> D

    D --> E{Export format}
    E -->|PDF| F1[Generate PDF]
    E -->|Excel| F2[Generate Excel]
    E -->|View only| F3[Return JSON for table display]

    F1 --> G[Download link returned]
    F2 --> G
    F3 --> H[Render table in dashboard]
```

Covers Fee Collection, Attendance, and Academic reports — filter, aggregate, export as PDF/Excel or view inline.

---

## 7. Notification Service Flow

```mermaid
flowchart TD
    A[Event Trigger] --> B{Event Type}
    B -->|Fee Due Reminder| C1[Fees Module]
    B -->|Attendance Alert - absent| C2[Attendance Module]
    B -->|Payment Confirmation| C3[Payment Module]
    B -->|Announcement| C4[Admin or Management]

    C1 --> D[Notification Service - central queue]
    C2 --> D
    C3 --> D
    C4 --> D

    D --> E{Channel selected}
    E -->|WhatsApp| F1[WhatsApp Business API - provider TBD]
    E -->|SMS| F2[SMS Gateway - provider TBD]
    E -->|Email| F3[SMTP or Email Service]

    F1 --> G[Log status sent or failed]
    F2 --> G
    F3 --> G
    G --> H[Retry queue if failed]
```

One central queue triggered by events (fee due, absence, payment success, announcements). WhatsApp/SMS providers marked TBD since none finalized yet; Email can start immediately via SMTP.

---

## Next Steps
- ER diagram with full DB schema and relationships
- Module-wise API endpoint list (Swagger-ready)
- Existing website stack confirmation — needed before migration plan is finalized
