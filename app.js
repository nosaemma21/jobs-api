require("dotenv").config();
require("express-async-errors");

// Extra security packages
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const xss = require("xss-clean");
const cors = require("cors");

const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, //100 requests per minute
  })
);
app.get("/", (req, res) => {
  res.send("Working perfectly");
});

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
