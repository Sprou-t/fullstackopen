// this mod sets up connection to mongodb as well as equips all the middleware
import { PORT, url } from "./utils/config.js";
import express from "express";
import cors from "cors"; // cross origin resource sharing
// don't need to assign a library to a variable when the library is designed to perform
// side effects upon being imported. this lib allows us to eliminate try-catch blk from controller files
import "express-async-errors"; // must import this lib bf importing yr router
import notesRouter from "./controllers/notes.js";
import usersRouter from "./controllers/users.js";
import testRouter from "./controllers/testing.js"; 
import {
	requestLogger,
	unknownEndpoint,
	errorHandler,
} from "./utils/middleware.js";
import { error, info } from "./utils/logger.js";
import mongoose from "mongoose";
import loginRouter from './controllers/login.js' 

mongoose.set("strictQuery", false);

info("connecting to", url);

mongoose
	.connect(url)
	.then(() => {
		info("connected to MongoDB");
	})
	.catch((e) => {
		error("error connecting to MongoDB:", e.message);
	});

const app = express();

app.use(cors());
// this line is used to search for frontend files whenever there's a http get req
// eg. http req: http: ... /about --> express will search for a dist file w
// the path eg. /folder/about & serve the file back to web server
app.use(express.static("dist"));
app.use(express.json());
// this middleware should be among the first few to be loaded
// bcoz dis middleware needds to transform json data and attach it to body prop of req obj for POST first!
app.use(requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// use the testing router only when we are running tests to modify db
if (process.env.NODE_ENV === 'test') {
	app.use('/api/testing', testRouter)
  }  

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
