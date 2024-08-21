// this file is responsible for connecting with the db and for equipping the app to middleware
const config = require("./utils/config");
const express = require("express");
require("express-async-errors"); // use to handle error in controllers w/o try/catch blocks
const app = express();
// cors enables mongoose & backend to share resources
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB");
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB:", error.message);
	});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
// Use middleware as global middleware w this syntax. If you apply middleware globally using app.use(), it gets 
// activated for every incoming HTTP request to your application, regardless of the route.
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor); this makes user creation impossible as even that route undergoes the jwt verification process
app.use("/api/blog", middleware.userExtractor, blogRouter); // only blogRouter needs JWT validation

app.use("/api/blog", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
