const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ayushd785:ayush%40ayush@cluster0.hptou9o.mongodb.net/TodoFullStack"
);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
  User,
  Todo,
};
