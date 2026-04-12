# CampusLens Backend API 🚀

Welcome to the backend repository of **CampusLens** — the lively social and memory-sharing platform for college campuses! This backend is built using modern Node.js features with ES Modules, Express.js, and MongoDB.

---

##  Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Media Uploads:** Cloudinary & Multer

---

##  Folder Structure

```text
backend/
├── src/
│   ├── config/          # Configurations (DB, Cloudinary, Env)
│   ├── controllers/     # Route logic functions
│   ├── middlewares/     # Auth, error handling, etc.
│   ├── models/          # Mongoose Schemas (User, Post, Comment)
│   ├── routes/          # Express route definitions
│   └── server.js        # App entry point
├── .env                 # Environment variables
├── package.json         # Project metadata and dependencies
```

---

##  Environment Configuration

Ensure you have a `.env` file in the `backend/` directory with the following format:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

##  Getting Started

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

---

##  API Postman Docs & Endpoints

Use this section to test the endpoints in **Postman** or **Insomnia**. The base URL is `http://localhost:5000`.

###  Authorization Header
For any route marked **🔒 Private**, you must include an authorization header with the JWT token retrieved from `/api/auth/login`.

**Header Name:** `Authorization`  
**Header Value:** `Bearer YOUR_JWT_TOKEN_HERE`

---

### 🟢 1. Authentication Routes

#### **Register a New User**
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Type:** `multipart/form-data` *(Because it handles image uploads)*
- **Body Fields:**
  - `username` (Text) - Required
  - `email` (Text) - Required
  - `password` (Text) - Required
  - `avatar` (File) - Optional image file
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": { "user": { ... }, "token": "jwt_token_here" }
  }
  ```

#### **Login User**
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Type:** `application/json`
- **Body Fields:**
  - `username` (String) - Required
  - `password` (String) - Required
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": { "user": { ... }, "token": "jwt_token_here" }
  }
  ```

---

### 🟢 2. User Routes

#### **Get User Profile**
- **Endpoint:** `GET /api/users/profile/:username`
- **Access:** Public
- **URL Params:** `username` (e.g., `/api/users/profile/johndoe`)

---

### 🟢 3. Post Routes

#### **Get All Posts (with Pagination)**
- **Endpoint:** `GET /api/posts`
- **Access:** Public
- **Query Params (Optional):** `?page=1&limit=10`

#### **Get My Posts**
- **Endpoint:** `GET /api/posts/my-posts`
- **Access:** 🔒 Private

#### **Get Single Post by ID**
- **Endpoint:** `GET /api/posts/:id`
- **Access:** Public
- **URL Params:** `id` (MongoDB ObjectId)

#### **Create a New Post**
- **Endpoint:** `POST /api/posts`
- **Access:** 🔒 Private
- **Request Type:** `multipart/form-data`
- **Body Fields:**
  - `content` (Text) - Optional text content
  - `image` (File) - Optional image file
- *(Note: Author is automatically extracted from JWT)*

#### **Update a Post**
- **Endpoint:** `PATCH /api/posts/:id`
- **Access:** 🔒 Private (Must be the post owner)
- **Request Type:** `application/json`
- **Body Fields:**
  - `content` (String) - Updated text content

#### **Delete a Post**
- **Endpoint:** `DELETE /api/posts/:id`
- **Access:** 🔒 Private (Must be the post owner)

#### **Like a Post**
- **Endpoint:** `POST /api/posts/:id/like`
- **Access:** 🔒 Private

#### **Dislike a Post**
- **Endpoint:** `POST /api/posts/:id/dislike`
- **Access:** 🔒 Private

---

### 🟢 4. Comment Routes

#### **Add a Comment to a Post**
- **Endpoint:** `POST /api/comments`
- **Access:** 🔒 Private
- **Request Type:** `application/json`
- **Body Fields:**
  - `postId` (String) - Required MongoDB ObjectId
  - `content` (String) - Required comment text
- *(Note: Comments are anonymous. The author is not stored.)*

#### **Get Comments for a Post**
- **Endpoint:** `GET /api/comments/post/:postId`
- **Access:** Public
- **URL Params:** `postId` (ObjectId)

---

### 🟢 5. Winner Routes

#### **Get Top 3 Posts (Winners)**
- **Endpoint:** `GET /api/winners`
- **Access:** Public
- **Description:** Returns the top 3 posts globally sorted dynamically by net score `(likes - dislikes)`.

---

## 🔒 Security & Postman Tips
- Always ensure you run requests against the correct **Base URL** (e.g. `http://localhost:5000`).
- **Postman file uploads:** When sending a `multipart/form-data` request, ensure you use the **form-data** tab in Postman. Change the key type from "Text" to "File" for image fields (`avatar`, `image`).
- **Do not manually set the Content-Type header** for `multipart/form-data` in Postman — Postman will auto-generate it with the correct boundary tags!

Happy Coding! 🎉