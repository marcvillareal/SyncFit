# SyncFit Full-Stack Application

A complete workout tracking application with Spring Boot backend and React frontend.

**Pitch:** Log workouts, see weekly progress, compare with gym buddies.

## 🚀 Quick Start

### Prerequisites
- **Backend:** Java 17+, Maven 3.6+
- **Frontend:** Node.js 16+, npm

### Running the Full Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SyncFit
   ```

2. **Start the Backend (Terminal 1):**
   ```bash
   cd sync-fit-api
   mvn clean install
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080`

3. **Start the Frontend (Terminal 2):**
   ```bash
   cd sync-fit-client-side
   npm install
   npm run dev
   ```
   The React app will be available at `http://localhost:3000`

4. **Access the application:**
   - **Frontend:** `http://localhost:3000`
   - **API:** `http://localhost:8080`
   - **H2 Console:** `http://localhost:8080/h2-console`

### H2 Database Console
- **URL:** `jdbc:h2:mem:syncfitdb`
- **Username:** `sa`
- **Password:** `password`

## 🏗️ Project Structure

```
SyncFit/
├── sync-fit-api/                   # Spring Boot Backend
│   ├── src/main/java/com/syncfit/
│   │   ├── controller/             # REST Controllers
│   │   ├── service/               # Business Logic
│   │   ├── repository/            # Data Access Layer
│   │   ├── entity/                # JPA Entities
│   │   ├── dto/                   # Data Transfer Objects
│   │   └── exception/             # Exception Handling
│   └── pom.xml                    # Maven dependencies
└── sync-fit-client-side/          # React Frontend
    ├── src/
    │   ├── components/            # Reusable components
    │   ├── pages/                 # Page components
    │   ├── services/              # API communication
    │   ├── types/                 # TypeScript types
    │   └── hooks/                 # Custom hooks
    ├── package.json               # npm dependencies
    └── vite.config.ts             # Vite configuration
```

## 📋 API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### Health Check
```http
GET /health
```
Returns the API status and basic information.

#### Workouts

##### Get All Workouts
```http
GET /workouts
```
Returns all workouts ordered by date (most recent first).

##### Get Workouts by Week
```http
GET /workouts?week=YYYY-WW
```
**Example:** `GET /workouts?week=2024-W15`

##### Get Workouts by Exercise
```http
GET /workouts?exercise=bench press
```

##### Get Recent Workouts
```http
GET /workouts?days=7
```

##### Get Workout by ID
```http
GET /workouts/{id}
```

##### Create Workout
```http
POST /workouts
Content-Type: application/json

{
  "date": "2024-03-15",
  "exercise": "Bench Press",
  "sets": 3,
  "reps": 10,
  "weight": 80.5,
  "rpe": 8.0
}
```

##### Delete Workout
```http
DELETE /workouts/{id}
```

#### Statistics

##### Get Weekly Stats
```http
GET /stats?range=last4w
```
Returns volume and workout count for each week in the specified range.

**Range Options:**
- `last4w` - Last 4 weeks (default)
- `last8w` - Last 8 weeks
- `last12w` - Last 12 weeks
- Or any number: `4`, `8`, `12`

## 🧪 Sample API Requests

### cURL Examples

#### Create a Workout
```bash
curl -X POST http://localhost:8080/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-03-15",
    "exercise": "Bench Press",
    "sets": 3,
    "reps": 10,
    "weight": 80.5,
    "rpe": 8.0
  }'
```

#### Get Workouts for Current Week
```bash
curl "http://localhost:8080/workouts?week=2024-W11"
```

#### Get Weekly Statistics
```bash
curl "http://localhost:8080/stats?range=last4w"
```

#### Search by Exercise
```bash
curl "http://localhost:8080/workouts?exercise=squat"
```

### HTTP File Examples
Create a file `api-requests.http` for testing:

```http
### Health Check
GET http://localhost:8080/health

### Get All Workouts
GET http://localhost:8080/workouts

### Get Workouts by Week
GET http://localhost:8080/workouts?week=2024-W15

### Create Workout
POST http://localhost:8080/workouts
Content-Type: application/json

{
  "date": "2024-03-15",
  "exercise": "Squat",
  "sets": 4,
  "reps": 8,
  "weight": 100.0,
  "rpe": 9.0
}

### Get Weekly Stats
GET http://localhost:8080/stats?range=last4w

### Get Workout by ID
GET http://localhost:8080/workouts/1

### Delete Workout
DELETE http://localhost:8080/workouts/1
```

## 📊 Data Models

### Workout Entity
```json
{
  "id": 1,
  "date": "2024-03-15",
  "exercise": "Bench Press",
  "sets": 3,
  "reps": 10,
  "weight": 80.5,
  "rpe": 8.0,
  "createdAt": "2024-03-15"
}
```

### Weekly Stats Response
```json
[
  {
    "week": "2024-W11",
    "volume": 2400.0,
    "totalWorkouts": 5
  },
  {
    "week": "2024-W12",
    "volume": 2800.0,
    "totalWorkouts": 6
  }
]
```

## ✅ Validation Rules

- **Date:** Required, valid date format (YYYY-MM-DD)
- **Exercise:** Required, 2-100 characters
- **Sets:** Required, 1-50
- **Reps:** Required, 1-1000
- **Weight:** Required, greater than 0, max 1000kg
- **RPE:** Required, 1.0-10.0 (Rate of Perceived Exertion)

## 🔧 Technical Details

### Tech Stack
- **Framework:** Spring Boot 3.1.5
- **Database:** H2 (in-memory)
- **ORM:** Spring Data JPA
- **Validation:** Bean Validation (Hibernate Validator)
- **Build Tool:** Maven

### Project Structure
```
src/main/java/com/syncfit/
├── SyncFitApplication.java          # Main application class
├── controller/                      # REST Controllers
│   ├── WorkoutController.java
│   ├── StatsController.java
│   └── HealthController.java
├── service/                         # Business Logic
│   └── WorkoutService.java
├── repository/                      # Data Access Layer
│   └── WorkoutRepository.java
├── entity/                          # JPA Entities
│   └── Workout.java
├── dto/                            # Data Transfer Objects
│   ├── WorkoutCreateRequest.java
│   └── WeeklyStats.java
└── exception/                      # Exception Handling
    ├── ResourceNotFoundException.java
    └── GlobalExceptionHandler.java
```

### Features Implemented
✅ RESTful API with proper HTTP methods and status codes  
✅ Input validation with detailed error messages  
✅ Week-based filtering (ISO week format)  
✅ Volume calculation (sets × reps × weight)  
✅ CORS enabled for frontend integration  
✅ Global exception handling  
✅ H2 database with JPA/Hibernate  
✅ Comprehensive logging and error handling  

## 🚧 Future Enhancements (Stretch Goals)

- **User Authentication:** JWT-based auth system
- **Friend System:** Follow friends and compare stats
- **Streaks:** Track consecutive workout days
- **Exercise Database:** Predefined exercise library
- **Personal Records:** Track PRs automatically
- **Workout Templates:** Save and reuse workout routines

## 🎯 Frontend Features

The React frontend provides a modern, responsive interface with:

### Key Screens & Components
- **Workouts List** (`/`) - View all workouts with filtering by week/exercise
- **Add Workout** (`/add`) - Form to log new workouts with validation
- **Progress** (`/progress`) - Charts and stats showing weekly volume trends
- **Workout Detail** (`/workout/:id`) - Detailed view of individual workouts

### Technical Features
✅ **React Router** - Client-side routing with proper navigation  
✅ **TypeScript** - Type-safe development with full API integration  
✅ **Responsive Design** - Mobile-first CSS with flexbox/grid layouts  
✅ **API Integration** - Axios-based service layer with error handling  
✅ **State Management** - React hooks for local and server state  
✅ **Form Validation** - Client-side validation with real-time feedback  
✅ **Loading States** - User-friendly loading and error states  
✅ **Accessibility** - Semantic HTML, proper labels, keyboard navigation  

### Frontend Commands
```bash
cd sync-fit-client-side

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# The frontend automatically proxies API calls to localhost:8080
```

### API Integration
The frontend communicates with the backend through a service layer (`src/services/workoutService.ts`) that handles:
- GET `/workouts` - List workouts with optional filtering
- POST `/workouts` - Create new workouts
- GET `/workouts/:id` - Get workout details
- DELETE `/workouts/:id` - Delete workouts
- GET `/stats` - Get weekly progress statistics

## 📝 Development Notes

This is a complete full-stack application with proper separation between backend API and frontend client. The React app includes modern development practices:

- **Vite** for fast development and building
- **TypeScript** for type safety
- **React Router** for client-side routing
- **Responsive CSS** for mobile compatibility
- **Error boundaries** for graceful error handling

The backend API is fully CORS-enabled and provides comprehensive validation and error responses perfect for frontend consumption.

## 🛠️ Development Guide

### Adding New Features

1. **Backend (API endpoint):**
   - Add new entity/DTO classes
   - Create repository methods
   - Implement service logic
   - Add controller endpoints
   - Update exception handling

2. **Frontend (React component):**
   - Add TypeScript types
   - Create service methods
   - Build React components
   - Add routing if needed
   - Style with CSS

### Common Development Tasks

**Add a new workout field:**
1. Update `Workout` entity and `WorkoutCreateRequest` DTO
2. Add validation annotations
3. Update repository queries if needed
4. Modify frontend types and forms
5. Update API documentation

**Add a new page:**
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Add navigation link in `Navigation.tsx`
4. Style the component

### Troubleshooting

**Backend not starting?**
- Check Java version (17+)
- Verify Maven installation
- Look for port conflicts (8080)

**Frontend not connecting to API?**
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify API proxy configuration in `vite.config.ts`

**Build failures?**
- Run `npm run lint` to check for TypeScript errors
- Ensure all imports are correct
- Check that all components are exported properly
