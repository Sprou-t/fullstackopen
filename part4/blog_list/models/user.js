const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true, // this ensures the uniqueness of username
		minlength: 3,
	},
	passwordHash: { // password hash will be taken and converted from password
		type: String,
		required: true,
		minlength: 3,
	},
	name: String,
	blogs: [
		{
			// blogs r referenced by the id from the Blog model
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
});

// set customizes the way a mongoose doc is converted to a JSON obj
userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject._v;
		// passwordHash should not be revealed
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model('User', userSchema)

module.exports = User;
