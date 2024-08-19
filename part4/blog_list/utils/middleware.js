const logger = require("./logger");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

// this middleware provides the method(eg. GET), path(url) and data being
// handled
const requestLogger = (request, response, next) => {
	logger.info("Method:", request.method);
	logger.info("Path:  ", request.path);
	logger.info("Body:  ", request.body);
	logger.info("---");
	next();
};

// this function is to extract the token for easy access in the controller folder using request.token
const tokenExtractor = (request, response, next) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		request.token = authorization.replace("Bearer ", "");
	} else {
		request.token = null;
	}

	next(); // Pass control to the next middleware or route handler
};

const userExtractor = async (request, response, next) => {
	// verify token using jwt. if valid, decode the token to get the user info
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: `token invalid` });
	}

	const user = await User.findById(decodedToken.id);

	// even if token is valid, there's a chance that user has been deleted from db, hence need to check
	if (!user) {
		return response.status(404).json({ error: "user not found" });
	}

	request.user = user;
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message); // this logs the error to our conole only

	// these logs the error only to the results page of postman/rest
	if (error.name === "CastError") {
		// when a val cannot be cast bcoz it doesnt follow note schema eg. using string for likes
		return response.status(400).send({ error: "malformatted data" });
	} else if (error.name === "ValidationError") {
		// does not pass the blog schema validation
		return response.status(400).json({ error: error.message });
	}
	// if according to scheme, username is not unique, this error would activate
	else if (
		error.name === "MongoServerError" &&
		error.message.includes("E11000 duplicate key error")
	) {
		return response
			.status(400)
			.json({ error: "expected `username` & `password` to be unique" });
	} else if (error.name === "JsonWebTokenError") {
		// token generated from login is wrong from original token/password
		return response.status(401).json({ error: "token invalid" });
	}

	next(error);
};

module.exports = {
	requestLogger,
	tokenExtractor,
	userExtractor,
	unknownEndpoint,
	errorHandler,
};
