# Todo List Application API Documentation

This document provides comprehensive documentation for the Todo List Application API, including examples using both cURL and Postman.

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Using cURL](#using-curl)
- [Using Postman](#using-postman)
- [Data Models](#data-models)

## API Endpoints

The API provides the following endpoints for managing tasks:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks/:id` | Retrieve a specific task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| PATCH | `/api/tasks/:id/toggle` | Toggle a task's status between "Pending" and "Completed" |
| DELETE | `/api/tasks/:id` | Delete a task |

## Using cURL

### 1. Get All Tasks

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

### 2. Get a Specific Task

```bash
curl http://localhost:3000/api/tasks/1
```

Example response:
```json
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
```

### 3. Create a New Task

```bash
curl -X POST -H "Content-Type: application/json" -d "{\"title\":\"New Task\",\"description\":\"This is a test task\",\"priority\":\"High\"}" http://localhost:3000/api/tasks
```

Example response:
```json
{
  "id": 3,
  "title": "New Task",
  "description": "This is a test task",
  "dueDate": null,
  "priority": "High",
  "category": "",
  "recurring": "None",
  "checklist": [],
  "notes": "",
  "status": "Pending",
  "createdAt": "2025-05-10 12:00:00"
}
```

### 4. Update a Task

```bash
curl -X PUT -H "Content-Type: application/json" -d "{\"title\":\"Updated Task\",\"description\":\"This task has been updated\",\"priority\":\"Medium\"}" http://localhost:3000/api/tasks/1
```

Example response:
```json
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
  "status": "Pending",
  "createdAt": "2025-05-10 10:51:58"
}
```

### 5. Toggle Task Status

```bash
curl -X PATCH http://localhost:3000/api/tasks/1/toggle
```

Example response:
```json
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
```

### 6. Delete a Task

```bash
curl -X DELETE http://localhost:3000/api/tasks/2
```

Example response:
```json
{
  "id": "2",
  "deleted": true
}
```

## Using Postman

### 1. Get All Tasks

- **Method**: GET
- **URL**: `http://localhost:3000/api/tasks`
- **Headers**: None required
- **Body**: None required

### 2. Get a Specific Task

- **Method**: GET
- **URL**: `http://localhost:3000/api/tasks/1`
- **Headers**: None required
- **Body**: None required

### 3. Create a New Task

- **Method**: POST
- **URL**: `http://localhost:3000/api/tasks`
- **Headers**: 
  - Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "title": "New Task",
  "description": "This is a test task",
  "priority": "High",
  "dueDate": "2025-06-01",
  "category": "Work",
  "recurring": "Weekly",
  "checklist": ["Step 1", "Step 2"],
  "notes": "Additional notes here"
}
```

### 4. Update a Task

- **Method**: PUT
- **URL**: `http://localhost:3000/api/tasks/1`
- **Headers**: 
  - Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "title": "Updated Task",
  "description": "This task has been updated",
  "priority": "Medium",
  "dueDate": "2025-06-15",
  "category": "Personal",
  "recurring": "None",
  "checklist": ["Updated Step 1", "Updated Step 2"],
  "notes": "Updated notes"
}
```

### 5. Toggle Task Status

- **Method**: PATCH
- **URL**: `http://localhost:3000/api/tasks/1/toggle`
- **Headers**: None required
- **Body**: None required

### 6. Delete a Task

- **Method**: DELETE
- **URL**: `http://localhost:3000/api/tasks/2`
- **Headers**: None required
- **Body**: None required

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
| checklist | Array | Array of subtasks or checklist items |
| notes | String | Additional notes for the task |
| status | String | Current status ("Pending" or "Completed") |
| createdAt | String | Timestamp when the task was created |

## Running the Application

1. Start the server:
```bash
cd server
npm install
npm start
```

2. The API will be available at `http://localhost:3000`