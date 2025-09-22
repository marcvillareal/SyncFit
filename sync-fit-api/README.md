# SyncFit Backend API

A Spring Boot REST API for tracking workouts, monitoring progress, and sharing fitness data with friends.

**Pitch:** Log workouts, see weekly progress, compare with gym buddies.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd SyncFit
   ```

2. **Build and run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **The API will be available at:**
   - Base URL: `http://localhost:8080`
   - H2 Console: `http://localhost:8080/h2-console`
   - Health Check: `http://localhost:8080/health`

### H2 Database Console
- **URL:** `jdbc:h2:mem:syncfitdb`
- **Username:** `sa`
- **Password:** `password`

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

## 📝 Development Notes

This backend provides all necessary endpoints for the SyncFit frontend application. The API follows REST conventions and includes proper error handling, validation, and CORS support for seamless frontend integration.

The H2 in-memory database resets on each restart, making it perfect for development and testing. For production, consider switching to PostgreSQL or MySQL.
