// this module contains the entire collection of the middleware this project uses
import { info, error } from "./logger.js";

const requestLogger = (request, response, next) => {
	info("Method:", request.method);
	info("Path:  ", request.path);
	info("Body:  ", request.body);
	info("---");
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

// note that when i am handling error argument, change it to err to avoid name clashing
const errorHandler = (err, request, response, next) => {
	if (err.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (err.name === "ValidationError") {
		return response.status(400).json({ error: err.message });
	} else if (
		err.name === "MongoServerError" &&
		err.message.includes("E11000 duplicate key error")
	) {
		return response
			.status(400)
			.json({ error: "expected `username` & 'password'to be unique" });
	} else if (error.name === "JsonWebTokenError") {
		//The JsonWebTokenError is an error that occurs when something goes wrong with the
		// verification or decoding of a JSON Web Token(JWT) using the jsonwebtoken library
		return response.status(401).json({ error: "token invalid" });
	} else if (error.name === "TokenExpiredError") {
		// this error happens when the token given to the user expires
		return response.status(401).json({
			error: "token expired",
		});
	}

	next(err); // passes the error to the nxt error-handling middleware in the stack if there's 1
};

export { requestLogger, unknownEndpoint, errorHandler };
