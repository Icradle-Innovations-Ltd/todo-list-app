# Todo List Application

A comprehensive task management application with a modern React frontend and Express backend.

![Todo List App](https://via.placeholder.com/800x400?text=Todo+List+App)

## Overview

The Todo List Application

A comprehensive task management application with a modern React frontend and Express backend.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/todo-list-app.git
cd todo-list-app

# Install dependencies
npm run setup

# Start development servers
npm run dev
```

Visit http://localhost:5173 in your browser to use the application.

## Screenshots

<div align="center">
  <img src="https://via.placeholder.com/400x250?text=Task+List+View" alt="Task List View" width="400"/>
  <img src="https://via.placeholder.com/400x250?text=Add+Task+Form" alt="Add Task Form" width="400"/>
  <img src="https://via.placeholder.com/400x250?text=Task+Details" alt="Task Details" width="400"/>
  <img src="https://via.placeholder.com/400x250?text=Dark+Mode" alt="Dark Mode" width="400"/>
</div>

*Note: Replace these placeholder images with actual screenshots of your application.*

## Overview

The Todo List Application is a full-stack web application designed to help users manage their tasks efficiently. It features a responsive user interface built with React and a robust backend API powered by Express and SQLite. The application supports various task management features including task creation, categorization, priority setting, recurring tasks, and checklist functionality.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
   is a full-stack web application designed to help users manage their tasks efficiently. It features a responsive user interface built with React and a robust backend API powered by Express and SQLite. The application supports various task management features including task creation, categorization, priority setting, recurring tasks, and checklist functionality.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [API Endpoints](#api-endpoints)
  - [Using cURL](#using-curl)
  - [Using Postman](#using-postman)
- [Data Models](#data-models)
- [Frontend Features](#frontend-features)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Properties**: Set title, description, due date, priority, category, and status
- **Checklists**: Add subtasks as checklist items within a task
- **Recurring Tasks**: Set tasks to repeat on a schedule (daily, weekly, monthly)
- **Notes**: Add detailed notes to tasks
- **Categories**: Organize tasks by custom categories
- **Priority Levels**: Assign Low, Medium, or High priority to tasks
- **Status Tracking**: Toggle tasks between Pending and Completed states
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
- **React Icons**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for building the API
- **SQLite3**: Lightweight database for data storage
- **CORS**: Middleware for handling Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

### Development Tools
- **Nodemon**: Auto-restart server during development
- **PostCSS**: CSS transformation tool
- **Autoprefixer**: Add vendor prefixes to CSS

## Project Structure

The project follows a client-server architecture with separate directories for frontend and backend code:

```
todo-list-app/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main application component
│   │   └── index.jsx       # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend Express application
│   ├── data/               # Database files
│   ├── src/                # Source code
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies
│
└── README.md               # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Icradle-Innovations-Ltd/todo-list-app.git
cd todo-list-app
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a separate terminal, start the frontend development server:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

### Production Mode

1. Build the frontend:
```bash
cd client
npm run build
```

2. Start the backend server:
```bash
cd ../server
npm start
```

3. The application will be available at `http://localhost:3000`.

## API Documentation

The Todo List Application provides a RESTful API for managing tasks.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks/:id` | Retrieve a specific task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| PATCH | `/api/tasks/:id/toggle` | Toggle a task's status between "Pending" and "Completed" |
| DELETE | `/api/tasks/:id` | Delete a task |

### Using cURL

#### 1. Get All Tasks

```bash
curl http://localhost:3000/api/tasks
```

Example response:
```json
[
  {
    "id": 1,
    "title": "Updated Task",
    "description": "This task has been updated",
    "dueDate": null,
    "priority": "Medium",
    "category": "",
    "recurring": "None",
    "checklist": [],
    "notes": "",
    "status": "Completed",
    "createdAt": "2025-05-10 10:51:58"
  }
]
```

#### 2. Get a Specific Task

```bash
curl http://localhost:3000/api/tasks/1
```

#### 3. Create a New Task

```bash
curl -X POST -H "Content-Type: application/json" -d "{\"title\":\"New Task\",\"description\":\"This is a test task\",\"priority\":\"High\",\"checklist\":[{\"text\":\"Step 1\",\"completed\":false},{\"text\":\"Step 2\",\"completed\":false}]}" http://localhost:3000/api/tasks
```

#### 4. Update a Task

```bash
curl -X PUT -H "Content-Type: application/json" -d "{\"title\":\"Updated Task\",\"description\":\"This task has been updated\",\"priority\":\"Medium\"}" http://localhost:3000/api/tasks/1
```

#### 5. Toggle Task Status

```bash
curl -X PATCH http://localhost:3000/api/tasks/1/toggle
```

#### 6. Delete a Task

```bash
curl -X DELETE http://localhost:3000/api/tasks/2
```

### Using Postman

Detailed instructions for using Postman with the API are available in the [Postman Collection](https://www.postman.com/your-collection-link).

## Data Models

### Task Object

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Unique identifier for the task (auto-generated) |
| title | String | Title of the task (required) |
| description | String | Detailed description of the task |
| dueDate | String | Due date for the task (ISO format) |
| priority | String | Priority level (e.g., "Low", "Medium", "High") |
| category | String | Category or tag for the task |
| recurring | String | Recurrence pattern (e.g., "None", "Daily", "Weekly") |
| checklist | Array | Array of checklist items with text and completed status |
| notes | String | Additional notes for the task |
| status | String | Current status ("Pending" or "Completed") |
| createdAt | String | Timestamp when the task was created |

## Frontend Features

### Components

- **TaskList**: Displays all tasks with filtering and sorting options
- **TaskForm**: Form for creating and editing tasks
- **TaskItem**: Individual task display with actions
- **ChecklistItem**: Subtask component with completion toggle
- **CategoryFilter**: Filter tasks by category
- **PrioritySelector**: Set task priority with visual indicators
- **DatePicker**: Calendar component for selecting due dates
- **ThemeToggle**: Switch between light and dark modes

### State Management

The application uses React's built-in state management with hooks:
- `useState` for component-level state
- `useEffect` for side effects like API calls
- Custom hooks for reusable logic

### API Integration

The frontend communicates with the backend API using Axios:
- Fetch tasks on component mount
- Create, update, and delete tasks with form submissions
- Real-time updates when task status changes

## Future Enhancements

- User authentication and authorization
- Task sharing and collaboration
- Email/push notifications for due dates
- Drag-and-drop task reordering
- Data export/import functionality
- Mobile applications (React Native)
- Advanced filtering and search capabilities
- Task analytics and reporting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.