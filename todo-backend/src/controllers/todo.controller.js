"use strict";

import Todo from "../models/todo.model.js";

// GET /api/todos
const getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
};

// GET /api/todos/:id
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

// POST /api/todos
const createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ title, description });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

// PUT /api/todos/:id
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

// DELETE /api/todos/:id
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

export { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo };
