"use strict";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import todoRoutes from "./src/routes/todo.routes.js";
import notFound from "./src/middlewares/notFound.middleware.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";

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
