# CampusLens Backend API

> A campus social platform where students post issues and moments, the community votes, and top posts win rewards.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication-routes)
  - [Users](#user-routes)
  - [Posts](#post-routes)
  - [Comments](#comment-routes)
  - [Rewards](#reward-routes)
- [Database Schema](#database-schema)
- [Middleware Stack](#middleware-stack)
- [Error Handling](#error-handling)
- [Security](#security)

---

## Overview

CampusLens is a RESTful backend API built for campus communities. Students can:

- Register and log in with a unique username
- Post campus issues or moments — publicly or anonymously
- Like and dislike posts (mutually exclusive voting)
- Comment on posts with optional anonymity
- Compete for the top 3 posts by community vote score
- Win rewards distributed by admins

---

## Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Runtime        | Node.js (v18+)                          |
| Framework      | Express.js                              |
| Database       | MongoDB + Mongoose ODM                  |
| Authentication | JWT (jsonwebtoken) + bcryptjs           |
| File Uploads   | Multer + Cloudinary                     |
| Module System  | ES Modules (`"type": "module"`)         |
| Language       | JavaScript (strict, no TypeScript)      |

---

## Architecture

```
MVC Pattern
├── Models       → Mongoose schemas & business data rules
├── Controllers  → Business logic & response formatting
├── Routes       → URL mapping & middleware chaining
├── Middlewares  → Cross-cutting concerns (auth, errors)
└── Config       → External service connections
```

**Key Design Decisions:**
- **Username as Primary Key** — Human-readable, stable identifier used across all relations instead of `ObjectId`
- **Privacy Masking in Controllers** — Anonymous author data is replaced at the controller layer; the database always stores the real author
- **Atomic Engagement** — A single `findByIdAndUpdate` with `$pull` + `$addToSet` handles like/dislike mutual exclusion without race conditions
- **Concurrent Reward Distribution** — `Promise.all()` updates both the User and Post documents simultaneously

---

## Project Structure

```
campuse_lens/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── cloudinary.js        # Multer + Cloudinary storage
│   ├── models/
│   │   ├── User.js              # User schema (username as PK)
│   │   ├── Post.js              # Post schema (virtual score)
│   │   └── Comment.js           # Comment schema
│   ├── middlewares/
│   │   ├── authenticate.js      # JWT verification → req.user
│   │   ├── authorize.js         # Role-based access control
│   │   └── errorHandler.js      # Global error handler
│   ├── controllers/
│   │   ├── authController.js    # Register, Login
│   │   ├── userController.js    # Profile, Promote
│   │   ├── postController.js    # CRUD, Like/Dislike, Top Posts
│   │   ├── commentController.js # Create, List Comments
│   │   └── rewardController.js  # Distribute Reward
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   └── rewardRoutes.js
│   └── server.js                # App entry point
├── .env                         # Environment variables (git-ignored)
├── .gitignore
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd campuse_lens

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env .env.local
# fill in your values (see Environment Variables section)

# 4. Start development server
npm run dev
```

### Scripts

| Command       | Description                      |
|---------------|----------------------------------|
| `npm run dev` | Start with `node --watch` (auto-restart) |
| `npm start`   | Start production server          |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campuslens
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Never commit `.env` to version control.** It is already listed in `.gitignore`.

---

## API Reference

**Base URL:** `http://localhost:5000/api`

**Authentication:** Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

**Standard Response Shape:**
```json
{
  "success": true | false,
  "message": "Human readable message",
  "data": {}
}
```

---

### Authentication Routes

**`POST /api/auth/register`**

Register a new student account. Accepts `multipart/form-data` for avatar upload.

| Field      | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `username` | String | ✅       | 3–20 chars, lowercase    |
| `email`    | String | ✅       | Valid email address       |
| `password` | String | ✅       | Min 6 characters          |
| `avatar`   | File   | ❌       | Image file (jpg/png/gif/webp) |

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "username": "john_doe", "email": "john@example.com", "role": "student", "rewards": 0 },
    "token": "eyJhbGci..."
  }
}
```

---

**`POST /api/auth/login`**

Login with username and password. Returns a JWT token.

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": {}, "token": "eyJhbGci..." }
}
```

---

### User Routes

**`GET /api/users/profile/:username`** — Public

Returns full user profile (password excluded).

**`PATCH /api/users/promote/:username`** — 🔒 Admin only

Promotes a student to admin role.

```
Authorization: Bearer <admin_token>
```

**Response `200`:**
```json
{
  "success": true,
  "message": "john_doe has been promoted to admin"
}
```

---

### Post Routes

**`GET /api/posts`** — Public

Returns paginated list of all posts. Anonymous posts have author replaced with `"anonymous"`.

| Query Param | Default | Description        |
|-------------|---------|--------------------|
| `page`      | `1`     | Page number        |
| `limit`     | `10`    | Posts per page     |

**`GET /api/posts/top`** — Public

Returns top 3 posts sorted by score (`likes - dislikes`), excluding posts that have already won a reward.

**`GET /api/posts/:id`** — Public

Returns a single post by its MongoDB `_id`. Privacy masking applied if anonymous.

---

**`POST /api/posts`** — 🔒 Authenticated

Create a new post. Accepts `multipart/form-data` for image upload.

| Field         | Type    | Required | Description                  |
|---------------|---------|----------|------------------------------|
| `content`     | String  | ✅       | Max 1000 characters           |
| `isAnonymous` | Boolean | ❌       | `true` to hide identity       |
| `image`       | File    | ❌       | Image file                    |

**`PATCH /api/posts/:id`** — 🔒 Owner only

Update post content. Only the original author can edit.

```json
{ "content": "Updated content here" }
```

**`DELETE /api/posts/:id`** — 🔒 Owner only

Delete a post. Only the original author can delete.

**`POST /api/posts/:id/like`** — 🔒 Authenticated

Like a post. Automatically removes existing dislike. Idempotent.

**`POST /api/posts/:id/dislike`** — 🔒 Authenticated

Dislike a post. Automatically removes existing like. Idempotent.

---

### Comment Routes

**`POST /api/comments`** — 🔒 Authenticated

Add a comment to a post.

```json
{
  "postId": "64a1b2c3d4e5f6...",
  "content": "Great post!",
  "isAnonymous": false
}
```

**`GET /api/comments/post/:postId`** — Public

Get all comments for a specific post (newest first). Anonymous comments have author masked.

---

### Reward Routes

**`POST /api/rewards/distribute/:postId`** — 🔒 Admin only

Distribute 100 reward points to the author of the specified post. Uses `Promise.all()` to update the User's `rewards` count and the Post's `hasWonReward` flag simultaneously.

- Returns `400` if the post has already won a reward (idempotency check).

---

## Database Schema

### User

| Field       | Type   | Constraints                              |
|-------------|--------|------------------------------------------|
| `username`  | String | Required, Unique, 3–20 chars, lowercase  |
| `email`     | String | Required, Unique, valid email format      |
| `password`  | String | Required, min 6 chars, hashed (bcrypt)   |
| `avatar`    | String | Cloudinary URL, has default placeholder  |
| `role`      | String | `'student'` \| `'admin'`, default: student |
| `rewards`   | Number | Default: `0`                             |
| `createdAt` | Date   | Auto (timestamps)                        |

### Post

| Field          | Type     | Description                            |
|----------------|----------|----------------------------------------|
| `author`       | String   | Username reference (not ObjectId)      |
| `content`      | String   | Required, max 1000 chars               |
| `image`        | String   | Cloudinary URL, nullable               |
| `isAnonymous`  | Boolean  | Default: `false`                       |
| `likes`        | [String] | Array of usernames who liked           |
| `dislikes`     | [String] | Array of usernames who disliked        |
| `score`        | Virtual  | `likes.length - dislikes.length`       |
| `hasWonReward` | Boolean  | Default: `false`                       |

### Comment

| Field         | Type     | Description                        |
|---------------|----------|------------------------------------|
| `post`        | ObjectId | Reference to Post (`_id`)          |
| `author`      | String   | Username reference                 |
| `content`     | String   | Required, max 500 chars            |
| `isAnonymous` | Boolean  | Default: `false`                   |

---

## Middleware Stack

### Request Flow

```
Incoming Request
      ↓
cors() → express.json() → express.urlencoded()
      ↓
Route matching
      ↓
[authenticate()] → [authorize(['admin'])] → Controller
      ↓
Response / next(error)
      ↓
errorHandler (global, mounted last)
```

### authenticate.js

Reads `Authorization: Bearer <token>`, verifies JWT, finds user by `username` from the token payload, and attaches to `req.user`.

### authorize.js

A **middleware factory** — call it with an array of allowed roles: `authorize(['admin'])`. Returns a middleware that checks `req.user.role`.

### errorHandler.js

Catches and standardizes:
- Mongoose `ValidationError` → `400` with field-level messages
- Mongoose duplicate key (`code 11000`) → `400` with field name
- Mongoose `CastError` (bad ObjectId) → `400`
- All other errors → `500` (or custom `statusCode`)

---

## Security

| Concern              | Implementation                                    |
|----------------------|---------------------------------------------------|
| Password storage     | bcrypt with 10 salt rounds (pre-save hook)        |
| Token expiry         | JWT expires in 24 hours                           |
| Credential errors    | Generic "Invalid credentials" (no user enumeration) |
| Input validation     | Mongoose schema-level validation                  |
| Upload restrictions  | Cloudinary `allowed_formats` filter               |
| CORS                 | `cors()` middleware (configure origins for prod)  |
| Password in response | Removed via `toJSON()` override on User model     |

---

## Health Check

```
GET /health
```

```json
{
  "success": true,
  "message": "CampusLens API is running",
  "timestamp": "2026-04-09T17:14:37.000Z"
}
```
