import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		// we want to be careful when using the uniqueness index.If there are already documents
		// in the database that violate the uniqueness condition, no index will be created
		unique: true, // this ensures the uniqueness of username
	},
	name: String,
	passwordHash: {
		"type": String,
		"required": true,
	},
	notes: [
		{
			// specify the data type of the field ie. object, since it is set to Object.i
			// this means the field will stroe an obj id which is a unique id to identify doc
			// this id will reference another doc in the db, establishing relationships btw doc in diff collections
			type: mongoose.Schema.Types.ObjectId,
			ref: "Note", // tell mongoose that obj id stored refers to a doc in Note collection
		},
	],
});

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model("User", userSchema);

export default User;
