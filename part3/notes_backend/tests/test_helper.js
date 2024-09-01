import Note from "../models/note.js";
import User from "../models/user.js";

const initialNotes = [
	{
		content: "HTML is easy",
		important: false,
	},
	{
		content: "Browser can execute only JavaScript",
		important: true,
	},
];

const nonExistingId = async () => {
	// create a note w unacceptable schema to delete later
	const note = new Note({ content: "willremovethissoon" });
	await note.save();
	await note.deleteOne();
	// _id is a obj type that has its own props. to work w _id outside of mongo, need to cvt to str
	return note._id.toString();
};

// function retrieves all the Note data in the db
const notesInDb = async () => {
	const notes = await Note.find({});
	return notes.map((note) => note.toJSON());
	//toJSON converts mongoose doc to plain JS obj that does not hv mongoose specific
	// properties like _id, _v etc
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

export { initialNotes, nonExistingId, notesInDb, usersInDb };
