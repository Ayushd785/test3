const Jwt = require("jsonwebtoken");
const secretKey = require("../config");

async function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      msg: "Invalid token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = Jwt.verify(token, secretKey);
    if (decoded.username) {
      req.username = decoded.username;
      next();
    } else {
      res.status(403).json({
        msg: "Authentication can not be done",
      });
    }
  } catch (error) {
    res.status(404).json({
      msg: "Invalid token",
      error: error,
    });
  }
}

module.exports = userMiddleware;
