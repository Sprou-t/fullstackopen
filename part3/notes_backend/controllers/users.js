import bcrypt from "bcrypt"; // library used for generating hashes
import express from "express";
import User from "../models/user.js";

const usersRouter = express.Router();

usersRouter.get("/", async (request, response) => {
	//populate function in Mongoose is used to replace a specific field in a document with documents from another collection.
	// arg given to populate tells node that the notes key, that has the referenced id, will
	// replace the id to the actual notes document
	// the functionality of populate is coz we defined types to ref of notes in the userSchema
	const users = await User.find({}).populate("notes", {
		content: 1, // this line specifies which field should be included in the notes doc.
		important: 1, // 1 means incluuded, 0 means excluded or if we did not include the field == excluded
	});
	response.json(users);
});

usersRouter.post("/", async (request, response) => {
	const { username, name, password } = request.body;

	const saltRounds = 10;
	// saltRounds refers to the number of times the hashing algorithm
	// will process the password and salt(a random value added to the password & shuffle it)
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();

	response.status(201).json(savedUser);
});

export default usersRouter;
