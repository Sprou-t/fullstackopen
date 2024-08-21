const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.post("/", async (request, response) => {
	// password is the password that user types in. we create a passwordHash from this password
	const { username, password, name } = request.body;
	console.log(request.body);

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds); // note that even 
	// the same password will generate a diff hash

	const user = new User({
		username,
		name,
		passwordHash, // store the hash of the password instead of the password itself
	});

	const savedUser = await user.save();

	response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
	const users = await User.find({});
	response.json(users);
});

usersRouter.delete("/:id", async (request, response) => {
	const deletedUser = await User.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

module.exports = usersRouter;
