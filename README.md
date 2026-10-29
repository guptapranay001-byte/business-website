# Vinay Agri Inputs (Tonk, Rajasthan)
## Agricultural E-Commerce & Centralized Enterprise Multi-Firm Management Platform

A real-world full-stack capstone project engineered for the family's agricultural distribution and retail operations in **Tonk, Rajasthan**. The platform unifies a public customer-facing agricultural e-commerce website with a centralized administrative management system governing all four family enterprises.

---

### The Four Operating Sister Enterprises

| # | Enterprise Firm Name | Code | Operating Specialty & Mandi Location |
|---|----------------------|------|---------------------------------------|
| 1 | **Vinay Agri Inputs** | `VAI` | Flagship hub for crop nutrition, bio-fertilizers, pesticides, and technical crop inputs (Near Krishi Upaj Mandi, Tonk). |
| 2 | **Gupta Traders and Auto Agencies** | `GTAA` | Tractor implements, automotive spares, diesel engine accessories, and mechanical farm tools (Old Bus Stand Road, Tonk). |
| 3 | **Vinay Khad Beej Bhandaar** | `VKBB` | Certified seeds, government-approved chemical fertilizers, and soil micro-nutrients (Subhash Chowk, Grain Market, Tonk). |
| 4 | **Gupta Traders, Tonk** | `GTT` | Commercial agricultural trading, bulk institutional supplies, and commodities distribution (Mandi Samiti Complex, Tonk). |

---

### System Architecture & Technology Stack

#### Frontend:
* **Framework:** React.js (v19) with modern hooks & functional components
* **Routing:** React Router DOM (v7)
* **Styling & UI:** Bootstrap 5, Bootstrap Icons, Custom Agricultural CSS Design System
* **Client Networking:** Axios REST client with environment-based base URL configuration
* **Build Tool:** Vite

#### Backend:
* **Platform:** Java (JDK 21 / 25 LTS)
* **Framework:** Spring Boot 3.3.5
* **REST & Web:** Spring Web (Spring MVC)
* **Persistence & ORM:** Spring Data JPA, Hibernate ORM
* **Security:** Spring Security 6.x (Stateless REST, configurable CORS, BCrypt)
* **Build System:** Apache Maven 3.9+
* **Validation:** Jakarta Validation API & Hibernate Validator

#### Database:
* **Production / Local:** MySQL 8.x with environment-driven credentials
* **Testing:** H2 in-memory MySQL emulation for fast, deterministic unit & integration tests

#### Testing:
* **Frameworks:** JUnit 5, Mockito, Spring Boot Test (`MockMvc`)

---

### Project Directory Structure

```text
business-website/
├── README.md                      # Comprehensive project guide and architecture documentation
├── .gitignore                     # Git exclusion rules (node_modules, target, .env, IDE files)
├── .env.example                   # Template for backend and frontend environment variables
├── backend/                       # Spring Boot Backend
│   ├── pom.xml                    # Maven configuration and dependencies
│   └── src/
│       ├── main/
│       │   ├── java/com/vinayagri/
│       │   │   ├── VinayAgriApplication.java      # Application entrypoint
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java            # Configurable CORS filter bean
│       │   │   │   └── DataInitializer.java       # Automatic enterprise data initializer
│       │   │   ├── security/
│       │   │   │   └── SecurityConfig.java        # SecurityFilterChain and endpoint protection
│       │   │   ├── controller/
│       │   │   │   ├── HealthController.java      # Health check and enterprise metadata API
│       │   │   │   └── FirmController.java        # Firm details REST API
│       │   │   ├── service/
│       │   │   │   ├── FirmService.java           # Business service interface
│       │   │   │   └── impl/FirmServiceImpl.java  # Service implementation with constructor DI
│       │   │   ├── repository/
│       │   │   │   ├── FirmRepository.java        # Spring Data JPA Firm repository
│       │   │   │   ├── CategoryRepository.java    # Category repository
│       │   │   │   ├── BrandRepository.java       # Brand / Agency repository
│       │   │   │   ├── ProductRepository.java     # Product repository
│       │   │   │   ├── InventoryRepository.java   # Firm-specific inventory repository
│       │   │   │   ├── UserRepository.java        # User repository
│       │   │   │   ├── OrderRepository.java       # Order repository
│       │   │   │   └── EnquiryRepository.java     # Quotation & Enquiry repository
│       │   │   ├── entity/
│       │   │   │   ├── Firm.java                  # 4 operating firms entity
│       │   │   │   ├── Category.java              # Agricultural category entity
│       │   │   │   ├── Brand.java                 # Brand & agency partner entity
│       │   │   │   ├── Product.java               # Agri product & technical specs entity
│       │   │   │   ├── Inventory.java             # Firm-specific batch & stock entity
│       │   │   │   ├── User.java                  # Roles: CUSTOMER, ADMIN, FIRM_MANAGER, STAFF
│       │   │   │   ├── Cart.java                  # User shopping cart entity
│       │   │   │   ├── CartItem.java              # Cart line item entity
│       │   │   │   ├── Order.java                 # Multi-firm order entity
│       │   │   │   ├── OrderItem.java             # Order line item entity
│       │   │   │   └── Enquiry.java               # Product & bulk quotation enquiry entity
│       │   │   ├── dto/
│       │   │   │   ├── ApiResponse.java           # Standard API response envelope
│       │   │   │   ├── HealthStatusDto.java       # Health metadata DTO
│       │   │   │   └── FirmResponseDto.java       # Firm response DTO
│       │   │   └── exception/
│       │   │       ├── GlobalExceptionHandler.java# @RestControllerAdvice global error handler
│       │   │       ├── ResourceNotFoundException.java # Entity not found exception
│       │   │       └── ErrorResponseDto.java      # Standard JSON error payload
│       │   └── resources/
│       │       └── application.properties         # Main MySQL environment configuration
│       └── test/
│           ├── java/com/vinayagri/
│           │   ├── VinayAgriApplicationTests.java # Context loading integration test
│           │   ├── HealthControllerTest.java      # MockMvc API endpoint test
│           │   └── FirmServiceTest.java           # JUnit 5 & Mockito service unit test
│           └── resources/
│               └── application.properties         # Isolated in-memory H2 test config
└── frontend/                      # React Frontend
    ├── package.json               # Node dependencies and scripts
    ├── vite.config.js             # Vite configuration
    ├── index.html                 # HTML5 template with SEO meta and Google Fonts
    └── src/
        ├── main.jsx               # React entry point with BrowserRouter & Bootstrap
        ├── App.jsx                # Main layout and route declarations
        ├── index.css              # Custom agricultural design system
        ├── services/
        │   └── api.js             # Axios API service client
        ├── components/
        │   ├── Navbar.jsx         # Navigation bar with live backend status pill
        │   └── Footer.jsx         # Footer with 4-firm details and architecture notes
        └── pages/
            ├── HomePage.jsx       # Multi-firm enterprise showcase & capabilities
            ├── ProductsPage.jsx   # Catalog with firm & category filters
            ├── CartPage.jsx       # Shopping cart with multi-firm attribution
            ├── EnquiryPage.jsx    # Bulk quotation and product enquiry form
            └── AdminDashboardPage.jsx # Centralized multi-firm admin portal
```

---

### Environment Variables

Configure these variables via shell exports, system environment, or a local `.env` file (see `.env.example`):

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `DB_HOST` | `localhost` | MySQL host address |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `vinay_agri_db` | MySQL database name |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | *(empty)* | MySQL password |
| `SERVER_PORT` | `8080` | Spring Boot server port |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed web origins |
| `JWT_SECRET` | *(secure fallback)* | JWT signing key |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Frontend API destination |

---

### Execution & Running Instructions

#### 1. Backend (Spring Boot)

Run unit and integration tests (uses isolated in-memory database):
```bash
cd backend
mvn clean test
```

Run the backend server:
```bash
cd backend
mvn spring-boot:run
```
*(With custom MySQL credentials:)*
```bash
DB_USER=your_user DB_PASSWORD=your_password mvn spring-boot:run
```
The backend starts at: `http://localhost:8080`
* Health Check API: `http://localhost:8080/api/health`
* Firms API: `http://localhost:8080/api/firms`

#### 2. Frontend (React + Vite)

Install dependencies:
```bash
cd frontend
npm install
```

Start development server:
```bash
npm run dev
```
The frontend starts at: `http://localhost:5173`

Build production bundle:
```bash
npm run build
```

---

### Baseline API Verification

Verify the backend foundation:
```bash
curl -s http://localhost:8080/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend service is operational",
  "data": {
    "status": "UP",
    "application": "Vinay Agri Inputs Multi-Firm Management Platform",
    "version": "1.0.0-SNAPSHOT",
    "location": "Tonk, Rajasthan, India",
    "managedFirms": [
      "Vinay Agri Inputs",
      "Gupta Traders and Auto Agencies",
      "Vinay Khad Beej Bhandaar",
      "Gupta Traders, Tonk"
    ],
    "timestamp": "..."
  }
}
```
