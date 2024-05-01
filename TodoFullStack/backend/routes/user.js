const express = require("express");
const userMiddleware = require("../middleware/index");
const router = express.Router();
const Jwt = require("jsonwebtoken");
const secretKey = require("../config");
const { User, Todo } = require("../db");

// signup
// login
// view the todos
// add a todo
// delete a todo

// signup
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const isExit = await User.findOne({
    username: username,
  });
  if (isExit) {
    res.status(403).json({
      msg: "please login user already exists",
    });
  } else {
    await await User.create({
      username,
      password,
    });
    res.json({
      msg: "User created Successfully",
    });
  }
});

// login
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const isExit = await User.findOne({
    username,
    password,
  });
  if (isExit) {
    const jwtToken = Jwt.sign({ username }, secretKey);
    res.status(200).json({
      msg: "user Authenticated Successfully",
      token: jwtToken,
    });
  } else {
    res.status(404).json({
      msg: "User does not exist or invalid credentials",
    });
  }
});

//get all the todos of a user who is logged in
router.get("/todos", userMiddleware, async (req, res) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username }).populate("todos");
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.json({
      todos: user.todos,
    });
  } catch (error) {
    res.status(404).json({
      msg: "Error in fetching the todos",
      error: error,
    });
  }
});

// autheenticaded user can create a new todo
router.post("/addtodo", userMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const username = req.username;

    const todo = await Todo.create({
      title,
      description,
    });

    await User.findOneAndUpdate({ username }, { $push: { todos: todo._id } });

    res.json({
      msg: "Todo added succesfully",
      todoId: todo._id,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error in adding the todo kindly retry",
      error: error,
    });
  }
});

// Authenticated user can delete a existing todo

router.delete("/deletetodo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const username = req.username;

    const user = await User.findOne({ username });

    // Check if the todo ID exists in user's todos
    if (!user.todos.includes(id)) {
      return res.status(403).json({
        msg: "Todo does not belong to this user",
      });
    }

    // Delete the Todo
    await Todo.findByIdAndDelete(id);

    // Pull the Todo ID from user's todos array
    await User.findOneAndUpdate({ username }, { $pull: { todos: id } });

    res.json({
      msg: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error in deleting the todo",
      error: error.message,
    });
  }
});
module.exports = router;
