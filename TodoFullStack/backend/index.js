const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

const userRoute = require("./routes/user");

require("./db/index");

app.use("/user", userRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
