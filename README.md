# Microservices Project with Kafka

A microservices architecture project demonstrating event-driven communication using Kafka message broker, with Node.js/Express services and PostgreSQL database.

## 🏗️ Architecture

This project implements a microservices architecture with the following components:

- **Instructor Service** (Port 8080): Handles course creation/deletion requests, publishes events to Kafka, and can directly delete courses from the database
- **Student Service** (Port 8081): Consumes events from Kafka and manages course data in PostgreSQL
- **Kafka**: Message broker for asynchronous communication between services
- **Zookeeper**: Coordinates and manages Kafka cluster
- **PostgreSQL**: Database for storing course information

### Data Flow

**Adding a Course:**
```
Client → Instructor Service → Kafka → Student Service → PostgreSQL
```

**Deleting a Course:**
```
Client → Instructor Service → PostgreSQL (direct delete)
                ↓
            Kafka (notification)
                ↓
        Student Service (consumes notification)
```

## 🚀 Features

### Core Features
- Event-driven architecture using Kafka
- Asynchronous communication between microservices
- Direct database access for delete operations (Instructor Service)
- RESTful API endpoints
- PostgreSQL database integration
- Docker containerization
- Hot reload with nodemon
- Modern React frontend with Vite and Tailwind CSS

### Recent Improvements ✨
- ✅ **Input Validation** - Joi validation for all API endpoints with detailed error messages
- ✅ **Error Handling** - Comprehensive error handling middleware with proper HTTP status codes
- ✅ **Health Checks** - Health, readiness, and liveness endpoints for monitoring and orchestration
- ✅ **Enhanced Logging** - Improved logging with emojis and structured messages for better debugging
- ✅ **API Response Format** - Standardized JSON response format (`{ success, data, message }`)
- ✅ **Frontend Improvements** - Better error handling, loading states, and data display
- ✅ **CORS Support** - Full CORS support for frontend integration

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mostafa-7ussein/microservices_Academic_system.git
   cd microservices_Academic_system
   ```

2. **Start all services:**
   ```bash
   docker compose up -d
   ```

3. **Verify services are running:**
   ```bash
   docker compose ps
   ```

4. **Check logs:**
   ```bash
   docker compose logs -f
   ```

## 📡 API Endpoints

### Instructor Service (Port 8080)

#### Add Course
```http
POST http://localhost:8080/add-course
Content-Type: application/json

{
  "id": 1,
  "name": "Node.js Basics"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Course event sent to Kafka successfully",
  "data": {
    "id": 1,
    "name": "Node.js Basics"
  }
}
```

**Validation Rules:**
- `id`: Required, must be a positive integer
- `name`: Required, must be a string between 3-100 characters

**Flow:** Instructor Service → Kafka → Student Service → PostgreSQL

#### Delete Course
```http
DELETE http://localhost:8080/delete-course
Content-Type: application/json

{
  "id": 1,
  "name": "Node.js Basics"
}
```
**Response (Success):**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "id": 1
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

**Validation Rules:**
- `id`: Required, must be a positive integer
- `name`: Optional, string

**Flow:** Instructor Service → PostgreSQL (direct delete) → Kafka (notification) → Student Service

### Student Service (Port 8081)

#### Get Course
```http
GET http://localhost:8081/get-course?id=1
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Node.js Basics"
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

#### Get All Courses
```http
GET http://localhost:8081/get-all-courses
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Node.js Basics"
    },
    {
      "id": 2,
      "name": "React Advanced"
    }
  ]
}
```

### Health Check Endpoints

Both services provide health check endpoints for monitoring:

#### Health Check
```http
GET http://localhost:8080/health
GET http://localhost:8081/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "instructor-service",
  "timestamp": "2024-01-26T10:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": 12345678,
    "heapTotal": 5678901,
    "heapUsed": 3456789
  },
  "database": "connected",
  "kafka": "configured",
  "version": "1.0.0"
}
```

#### Readiness Check
```http
GET http://localhost:8080/ready
GET http://localhost:8081/ready
```

**Response:**
```json
{
  "status": "ready",
  "service": "instructor-service",
  "timestamp": "2024-01-26T10:00:00.000Z"
}
```

#### Liveness Check
```http
GET http://localhost:8080/live
GET http://localhost:8081/live
```

**Response:**
```json
{
  "status": "alive",
  "service": "instructor-service",
  "timestamp": "2024-01-26T10:00:00.000Z"
}
```

## 🧪 Testing

### Quick Start Scripts

**Windows PowerShell:**
```powershell
# Start the project
.\START_PROJECT.ps1

# Test the project
.\TEST_PROJECT.ps1

# Quick health check
.\QUICK_TEST.ps1
```

### Using cURL

**Add a course:**
```bash
curl -X POST http://localhost:8080/add-course \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Node.js Basics"}'
```

**Delete a course:**
```bash
curl -X DELETE http://localhost:8080/delete-course \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Node.js Basics"}'
```

**Get all courses:**
```bash
curl http://localhost:8081/get-all-courses
```

### Using PowerShell

**Add a course:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/add-course" -Method POST -ContentType "application/json" -Body '{"id": 1, "name": "Node.js Basics"}'
```

**Delete a course:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/delete-course" -Method DELETE -ContentType "application/json" -Body '{"id": 1, "name": "Node.js Basics"}'
```

**Get all courses:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/get-all-courses" -Method GET
```

## 🗄️ Database

### Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** postgres
- **Username:** postgres
- **Password:** postgres

### Access Database

```bash
docker exec -it postgres psql -U postgres -d postgres
```

### View Courses

```sql
SELECT * FROM courses;
```

## 🏛️ Project Structure

```
microservices_project-main/
├── docker-compose.yml
├── README.md
├── .gitignore
├── START_PROJECT.ps1          # PowerShell script to start all services
├── TEST_PROJECT.ps1            # Comprehensive test script
├── QUICK_TEST.ps1              # Quick health check script
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
├── instructor/                 # Instructor microservice
│   ├── controllers/
│   │   ├── dbController.js
│   │   ├── instructorController.js
│   │   └── kafkaProducer.js
│   ├── middleware/
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validation.js      # Joi validation schemas
│   ├── models/
│   │   └── course.js
│   ├── routers/
│   │   ├── health.js          # Health check endpoints
│   │   └── router.js
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── student/                    # Student microservice
│   ├── controllers/
│   │   ├── kafkaConsumer.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validation.js      # Joi validation schemas
│   ├── models/
│   │   └── course.js
│   ├── routers/
│   │   ├── health.js          # Health check endpoints
│   │   └── router.js
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
└── data/
    ├── kafka/
    └── postgres/
```

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Joi** - Input validation library
- **Kafka** - Message broker
- **Kafka-node** - Kafka client for Node.js
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for PostgreSQL

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📊 Service Details

### Instructor Service

- **Port:** 8080
- **Responsibilities:**
  - Receive course creation/deletion requests
  - Publish events to Kafka topic for course creation
  - Direct database access for course deletion
  - Send notifications to Kafka after successful deletion
- **Database Access:** Yes (for delete operations)
- **Dependencies:** Express, Joi, Kafka-node, Sequelize, PostgreSQL
- **Features:**
  - Input validation with Joi
  - Health check endpoints
  - Enhanced error handling
  - Structured logging

### Student Service

- **Port:** 8081
- **Responsibilities:**
  - Consume events from Kafka
  - Manage course data in PostgreSQL (add operations)
  - Provide read endpoints for courses
  - Process delete notifications from Kafka
- **Database Access:** Yes (full CRUD operations)
- **Dependencies:** Express, Joi, Kafka-node, Sequelize, PostgreSQL
- **Features:**
  - Input validation with Joi
  - Health check endpoints
  - Enhanced error handling
  - Kafka consumer with improved logging

## 🔄 How It Works

### Adding a Course

1. Client sends a request to Instructor Service to add a course
2. Instructor Service publishes the event to Kafka topic `topic1`
3. Student Service consumes the event from Kafka
4. Student Service processes the event and saves it to PostgreSQL database
5. Client can read courses directly from Student Service

### Deleting a Course

1. Client sends a request to Instructor Service to delete a course
2. Instructor Service directly deletes the course from PostgreSQL database
3. Instructor Service publishes a delete notification to Kafka topic `topic1`
4. Student Service consumes the notification from Kafka
5. Student Service processes the notification (course already deleted by Instructor Service)

## 🛑 Stopping Services

```bash
# Stop all services
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove containers with volumes (deletes database data)
docker compose down -v
```

## 📝 Environment Variables

### Instructor Service
- `PORT=8080`
- `KAFKA_BOOTSTRAP_SERVERS=kafka:9092`
- `KAFKA_TOPIC=topic1`
- `POSTGRES_URL=postgres://postgres:postgres@postgres:5432/postgres`

### Student Service
- `PORT=8081`
- `POSTGRES_URL=postgres://postgres:postgres@postgres:5432/postgres`
- `KAFKA_BOOTSTRAP_SERVERS=kafka:9092`
- `KAFKA_TOPIC=topic1`

## 🐛 Troubleshooting

### Services not starting
```bash
# Check service status
docker compose ps

# View logs
docker compose logs [service-name]
```

### Database connection issues
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Verify PostgreSQL is running
docker compose ps postgres
```

### Kafka connection issues
```bash
# Check Kafka logs
docker compose logs kafka

# Verify Kafka is running
docker compose ps kafka
```

### Rebuild services after code changes
```bash
# Rebuild a specific service
docker compose build --no-cache [service-name]

# Restart the service
docker compose up -d [service-name]
```

### Validation Errors
If you receive validation errors, check the request format:
- Course ID must be a positive integer
- Course name must be between 3-100 characters
- All required fields must be provided

**Example Validation Error:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "id",
      "message": "Course ID must be a number"
    },
    {
      "field": "name",
      "message": "Course name must be at least 3 characters"
    }
  ]
}
```

## 📚 Additional Features

### Input Validation
All API endpoints use Joi for input validation:
- Automatic validation of request data
- Detailed error messages for invalid inputs
- Type checking and constraints
- Sanitization of input data

### Error Handling
Comprehensive error handling system:
- Global error handler middleware
- Proper HTTP status codes
- Structured error responses
- Development vs production error details

### Health Monitoring
Health check endpoints for:
- Service health status
- Database connectivity
- Kafka configuration
- Memory usage and uptime
- Readiness and liveness checks

### Frontend Application
Modern React frontend with:
- Real-time course list updates (auto-refresh every 3 seconds)
- Add/Delete course functionality
- Loading states and error messages
- Responsive design with Tailwind CSS
- Accessible at `http://localhost:3000`

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Repository

[GitHub Repository](https://github.com/mostafa-7ussein/microservices_Academic_system)
