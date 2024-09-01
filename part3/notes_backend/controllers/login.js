import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Router } from "express";
import User from "../models/user.js";

const loginRouter = Router();

loginRouter.post("/", async (request, response) => {
	const { username, password } = request.body;

	const user = await User.findOne({ username });
	// password: plain text password that the user provides when they try to log in.
	// user.passwordHash: hashed version of the user's password that was
	// stored in the database when the user initially registered or last updated their password.
	// bcrypt.compare takes the plain text password and hashes it using the same algorithm and
	// salt that were originally used to create user.passwordHash.After hashing the password,
	// bcrypt.compare compares this new hash with user.passwordHash. if matcch function returns true
	const passwordCorrect =
		user === null ? false : await bcrypt.compare(password, user.passwordHash);
	console.log(passwordCorrect);

	if (!(user && passwordCorrect)) {
		return response.status(401).json({
			error: "invalid username or password",
		});
	}
	// If the password is correct, a token is created with the method jwt.sign. The token
	// contains the username and the user id in a digitally signed form. it is basically a
	// way for systems to recogise a user
	const userForToken = {
		username: user.username,
		id: user._id,
	};

	// token expires in 60*60 seconds, that is, in one hour. this is to give a time limit
	// so that the device that has the token does not have it for an extended period of time
	// where the chance of having a diff user using it is high or if the acct is revoked,
	// we can use this method to 'revoke' the token as wellc
	const token = jwt.sign(userForToken, process.env.SECRET, {
		expiresIn: 60 * 60,
	});

	response
		.status(200)
		.send({ token, username: user.username, name: user.name });
});

export default loginRouter;
