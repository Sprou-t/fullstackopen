import express from "express";
import Note from "../models/note.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken"; // lib generates JSON web tokens

// .Router is used to grp a subset of routes & related middleware together
// like for all the routes related to CRUD of notes
const notesRouter = express.Router();

// notice that notesRouter obj only define the relative route paths

notesRouter.get("/", async (request, response) => {
	const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
	response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
	const note = await Note.findById(request.params.id);
	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});

const getTokenFrom = (request) => {
	// extract the authorization header from the POST request
	// eg. Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

notesRouter.post("/", async (request, response) => {
	// change both the user and the notes obj
	const body = request.body;
	// retrieve token from getTokenFrom & verifies the token using jwt.verify w the second arg SECRET env var
	// SECRET is a string used as a secret key for signing & verifying JSON web tokens.
	// it signs the JWT eg, during user login & gives it a specific value. if anyone tries
	// to tamper w the token, the signature will not match caused of SECRET & token becomes invalid
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	// verify the token to ensure that data can be trusted
	if (!decodedToken.id) {
			// if token is invalid ie. tampered with, req is rejected
			return response.status(401).json({ error: "token invalid" });
		}
		const user = await User.findById(decodedToken.id);
	//  above line is why i need to have user property in my POST test even when my schema did not specify

	const note = new Note({
		content: body.content,
		important: body.important || false,
		user: user,
	});

	const savedNote = await note.save();
	user.notes = user.notes.concat(savedNote.user); // add notes to user
	await user.save(); // save the user data w new notes in the db
	response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response) => {
	await Note.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

notesRouter.put("/:id", (request, response, next) => {
	const body = request.body;

	const note = {
		content: body.content,
		important: body.important,
	};

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

export default notesRouter;
