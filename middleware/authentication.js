const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid !!!");
  }

  const token = authHeader.split(" ").at(1);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ATTACH USER TO JOB ROUTES
    const user = User.findById(payload.id).select("-password");

    req.user = { userId: payload.userId, name: payload.name };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid....");
  }
};

module.exports = authMiddleware;
