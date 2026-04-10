# Todo Backend 

**Stack:** Node.js · Express · MongoDB · Mongoose · MVC Pattern  

---

## What We Are Building

A clean RESTful API for a Todo app using the **MVC (Model–View–Controller)** pattern. By the end of this workshop you will understand:
- How Express handles HTTP requests
- How Mongoose models map to MongoDB collections
- How to split code into Routes → Controllers → Models
- How middlewares work (CORS, JSON parsing, 404, error handling)

---

## Prerequisites

- Node.js installed (v18+)
- MongoDB running locally OR a MongoDB Atlas URI ready
- A REST client — Postman or Thunder Client (VS Code extension)

---

## Step 1 — Project Initialization

**What we're doing:** Setting up a new Node project and installing all dependencies.

```bash
mkdir todo-backend
cd todo-backend
npm init -y
```

Install production dependencies:
```bash
npm install express mongoose cors dotenv
```

Install dev dependency:
```bash
npm install --save-dev nodemon
```

Open `package.json` and update the `scripts` section:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

> **Explain to audience:**
> - `express` — our web framework
> - `mongoose` — ODM (Object Data Modeling) library for MongoDB
> - `cors` — allows cross-origin requests (frontend can talk to this backend)
> - `dotenv` — loads environment variables from a `.env` file
> - `nodemon` — auto-restarts server on file changes during development

---

## Step 2 — Folder Structure

**What we're doing:** Setting up a clean MVC structure before writing any code.

```
todo-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── todo.model.js
│   ├── controllers/
│   │   └── todo.controller.js
│   ├── routes/
│   │   └── todo.routes.js
│   └── middlewares/
│       ├── notFound.middleware.js
│       └── errorHandler.middleware.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

Create the folders:
```bash
mkdir -p src/config src/models src/controllers src/routes src/middlewares
```

> **Explain to audience:**
> MVC separates concerns. Model = data shape. Controller = business logic. Route = URL mapping. This makes code readable, testable, and easy to extend.

---

## Step 3 — Environment Variables

**What we're doing:** Storing sensitive config (like DB URL) outside the code.

Create `.env` in root:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo_db
```

Create `.gitignore` in root:
```
node_modules/
.env
```

> **Explain to audience:**
> Never hardcode DB URLs or secrets in code. `.env` keeps them separate. `.gitignore` ensures they don't get pushed to GitHub.

---

## Step 4 — Database Connection

**File:** `src/config/db.js`

```js
"use strict";

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

> **Explain to audience:**
> - We wrap the connection in `async/await` with `try/catch`
> - `process.exit(1)` stops the server if DB connection fails — no point running without a DB
> - We export this function to call it from `server.js`

---

## Step 5 — The Model

**File:** `src/models/todo.model.js`

```js
"use strict";

const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
```

> **Explain to audience:**
> - A **Schema** defines the shape/structure of documents in MongoDB
> - `required`, `trim`, `default` are built-in validators and options
> - `timestamps: true` auto-adds `createdAt` and `updatedAt` fields
> - `mongoose.model("Todo", todoSchema)` creates the model — Mongoose will create a `todos` collection in MongoDB automatically

---

## Step 6 — The Controller

**File:** `src/controllers/todo.controller.js`

The controller has one function per operation. Walk through each one:

### 6a. Get All Todos
```js
const getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
};
```

### 6b. Get Single Todo
```js
const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};
```

### 6c. Create Todo
```js
const createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ title, description });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};
```

### 6d. Update Todo
```js
const updateTodo = async (req, res, next) => {
  try {
    const { title, description, isCompleted } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, isCompleted },
      { new: true, runValidators: true }
    );
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};
```

### 6e. Delete Todo
```js
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      const error = new Error("Todo not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};
```

Add at the bottom:
```js
module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo };
```

> **Explain to audience:**
> - Each function handles one HTTP operation — this is the business logic layer
> - `req.params.id` — gets the `:id` from the URL
> - `req.body` — gets the JSON payload sent by the client
> - `next(error)` — passes errors to the error handler middleware
> - `{ new: true }` in update returns the updated document, not the old one
> - `runValidators: true` ensures schema validations run on updates too

---

## Step 7 — The Router

**File:** `src/routes/todo.routes.js`

```js
"use strict";

const express = require("express");
const router = express.Router();
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
```

> **Explain to audience:**
> - `express.Router()` creates a mini-app that handles only these routes
> - The router does NOT know the base path (`/api/todos`) — that's set in `server.js`
> - This separation means we can move routes around without touching controller logic

---

## Step 8 — Middlewares

**What we're doing:** Writing two custom middlewares — one for 404 routes, one for all errors.

### 8a. Not Found Middleware
**File:** `src/middlewares/notFound.middleware.js`

```js
"use strict";

const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFound;
```

### 8b. Error Handler Middleware
**File:** `src/middlewares/errorHandler.middleware.js`

```js
"use strict";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
```

> **Explain to audience:**
> - Middleware functions have access to `(req, res, next)`
> - **Error handling middleware** has 4 parameters `(err, req, res, next)` — Express identifies it by the 4th argument
> - The `notFound` middleware catches any request that didn't match a route above it
> - The `errorHandler` is the single place where all errors are returned to the client — clean and consistent
> - We hide the stack trace in production for security

---

## Step 9 — The Entry Point

**File:** `server.js`

```js
"use strict";

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const todoRoutes = require("./src/routes/todo.routes");
const notFound = require("./src/middlewares/notFound.middleware");
const errorHandler = require("./src/middlewares/errorHandler.middleware");

dotenv.config();
connectDB();

const app = express();

// Built-in Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/todos", todoRoutes);

// 404 Middleware
app.use(notFound);

// Error Handler Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

> **Explain to audience:**
> - `dotenv.config()` must be called before anything else that uses env vars
> - `app.use(express.json())` parses incoming JSON bodies — without this, `req.body` is undefined
> - `app.use(cors())` allows any origin to call this API (fine for dev)
> - Middleware and routes are registered in ORDER — order matters in Express
> - `notFound` goes AFTER all real routes
> - `errorHandler` goes LAST — it catches everything passed via `next(error)`

---

## Step 10 — Run the Server

```bash
npm run dev
```

Expected terminal output:
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

---

## Step 11 — Test the API (Postman / Thunder Client)

### Create a Todo
```
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "Learn Express",
  "description": "Understand routing and middleware"
}
```

### Get All Todos
```
GET http://localhost:5000/api/todos
```

### Get Single Todo
```
GET http://localhost:5000/api/todos/<id>
```

### Update a Todo
```
PUT http://localhost:5000/api/todos/<id>
Content-Type: application/json

{
  "isCompleted": true
}
```

### Delete a Todo
```
DELETE http://localhost:5000/api/todos/<id>
```

---

## API Reference

| Method | Endpoint           | Body Required         | Description         |
|--------|--------------------|-----------------------|---------------------|
| GET    | /api/todos         | —                     | Get all todos       |
| GET    | /api/todos/:id     | —                     | Get one todo        |
| POST   | /api/todos         | `title`, `description`| Create a todo       |
| PUT    | /api/todos/:id     | any field to update   | Update a todo       |
| DELETE | /api/todos/:id     | —                     | Delete a todo       |

---

## Key Concepts Recap

| Concept | Where it lives | What it does |
|---|---|---|
| Schema / Model | `models/` | Defines data shape, talks to MongoDB |
| Controller | `controllers/` | Business logic — reads/writes data |
| Router | `routes/` | Maps URLs to controller functions |
| Middleware | `middlewares/` | Runs between request and response |
| `next(error)` | Controllers | Forwards errors to error handler |
| `express.json()` | server.js | Parses JSON request bodies |
| `cors()` | server.js | Allows cross-origin requests |

---

## What's Next (Future Sessions)

- Adding JWT-based Authentication (register/login)
- Role-based access control
- Input validation with `express-validator`
- Pagination and filtering on GET all
- Deploying to Render / Railway