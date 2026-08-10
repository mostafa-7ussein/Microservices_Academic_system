> **Quick summary:** Event-driven microservices (Node.js + Kafka + PostgreSQL) orchestrated with Docker Compose. Useful demo of service boundaries, async messaging, and containerized local delivery.
# Microservices Project with Kafka

A microservices architecture project demonstrating event-driven communication using Kafka message broker, with Node.js/Express services and PostgreSQL database.

## 🏗️ Architecture

This project implements a microservices architecture with the following components:

- **Frontend** (Port 3000): React application providing user interface for course management
- **Instructor Service** (Port 8080): Handles course creation/deletion requests, publishes events to Kafka, and can directly delete courses from the database
- **Student Service** (Port 8081): Consumes events from Kafka and manages course data in PostgreSQL
- **Kafka**: Message broker for asynchronous communication between services
- **Zookeeper**: Coordinates and manages Kafka cluster
- **PostgreSQL**: Database for storing course information

### Data Flow

**Adding a Course:**
```
Frontend → Instructor Service → Kafka → Student Service → PostgreSQL
```

**Deleting a Course:**
```
Frontend → Instructor Service → PostgreSQL (direct delete)
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

## 🎨 Frontend Application

### Overview

The frontend is a modern React application built with Vite and Tailwind CSS, providing a user-friendly interface for managing courses in the microservices system.

### Access

- **URL:** `http://localhost:3000`
- **Port:** 3000
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS

### Features

#### User Interface
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Clean, gradient-based design with smooth transitions
- **Real-time Updates** - Automatically refreshes course list every 3 seconds
- **Loading States** - Visual feedback during API operations
- **Error Handling** - User-friendly error messages with dismissible alerts
- **Success Notifications** - Confirmation messages for successful operations

#### Functionality
- **Add Courses** - Form to create new courses with ID and name validation
- **View Courses** - Display all courses in a scrollable list
- **Delete Courses** - Remove courses with confirmation dialog
- **Manual Refresh** - Button to manually refresh the course list
- **System Architecture Display** - Visual representation of data flow

### Frontend Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles and Tailwind imports
│   └── services/
│       └── api.js           # API service layer for backend communication
├── Dockerfile               # Container configuration
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

### API Integration

The frontend communicates with both microservices:

- **Instructor Service (Port 8080):**
  - `POST /add-course` - Create new courses
  - `DELETE /delete-course` - Remove courses

- **Student Service (Port 8081):**
  - `GET /get-all-courses` - Fetch all courses
  - `GET /get-course?id={id}` - Get specific course

### Environment Variables

The frontend uses environment variables for API endpoints:

```env
VITE_INSTRUCTOR_API=http://localhost:8080
VITE_STUDENT_API=http://localhost:8081
```

These can be configured in `docker-compose.yml` or via `.env` file for local development.

### Development

#### Running Locally (without Docker)

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default port).

#### Building for Production

```bash
cd frontend
npm run build
```

The production build will be in the `dist/` directory.

### User Flow

#### Adding a Course
1. User enters Course ID and Course Name in the form
2. Clicks "Add Course" button
3. Frontend sends POST request to Instructor Service
4. Instructor Service publishes event to Kafka
5. Student Service consumes event and saves to database
6. Frontend auto-refreshes after 2 seconds to show new course

#### Deleting a Course
1. User clicks "Delete" button on a course card
2. Confirmation dialog appears
3. On confirmation, frontend sends DELETE request to Instructor Service
4. Instructor Service deletes from database and notifies Kafka
5. Frontend auto-refreshes after 1 second to reflect changes

#### Viewing Courses
- Courses are automatically fetched on page load
- List refreshes every 3 seconds to show real-time updates
- Manual refresh button available for immediate updates

### Technologies

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.0** - HTTP client for API requests

### Styling Features

- Gradient backgrounds (blue to indigo)
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Card-based design with shadows
- Hover effects and transitions
- Color-coded alerts (green for success, red for errors)
- Scrollable course list with max height

## 🧪 Testing

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

### Frontend Service

- **Port:** 3000
- **Responsibilities:**
  - Provide user interface for course management
  - Communicate with Instructor Service for add/delete operations
  - Communicate with Student Service for reading courses
  - Display real-time course updates
- **Database Access:** No (communicates via API only)
- **Dependencies:** React, Vite, Tailwind CSS, Axios
- **Features:**
  - Responsive design with Tailwind CSS
  - Real-time auto-refresh (every 3 seconds)
  - Loading states and error handling
  - Form validation
  - Confirmation dialogs for destructive actions

## 🔄 How It Works

### Adding a Course

1. User submits course form in Frontend (Port 3000)
2. Frontend sends POST request to Instructor Service (Port 8080)
3. Instructor Service validates input and publishes the event to Kafka topic `topic1`
4. Student Service (Port 8081) consumes the event from Kafka
5. Student Service processes the event and saves it to PostgreSQL database
6. Frontend auto-refreshes and displays the new course from Student Service

### Deleting a Course

1. User clicks delete button in Frontend (Port 3000)
2. Frontend sends DELETE request to Instructor Service (Port 8080)
3. Instructor Service directly deletes the course from PostgreSQL database
4. Instructor Service publishes a delete notification to Kafka topic `topic1`
5. Student Service (Port 8081) consumes the notification from Kafka
6. Student Service processes the notification (course already deleted by Instructor Service)
7. Frontend auto-refreshes to reflect the deletion

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

### Frontend Service
- `VITE_INSTRUCTOR_API=http://localhost:8080`
- `VITE_STUDENT_API=http://localhost:8081`

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

