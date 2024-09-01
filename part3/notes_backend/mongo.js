import mongoose from "mongoose";

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;

// this line specifies that we can only query for implemented fields like
// content & important
mongoose.set("strictQuery", false);

mongoose.connect(url);

// note schema is the blueprint of the Notemodel
const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

// Note is the name of the model (model explained in nxt line of code)
// which will be changed by mongoose's onvention into notes. notes rep the name of a collection
const Note = mongoose.model("Note", noteSchema);

// rmb that Note is a model. models are constructor functions that create new JavaScript objects based on the provided parameters
// objs created with model would have the schema of noteSchema
const note = new Note({
	content: "HTML is easy",
	important: true,
});

// save the note obj w the save method. this method is asynchronous & thus returns a promise
// if the promise is fulfilled, .then would activate which would lastly close connection to 
// db thru mongoose. if connection not closed, program cannot finish the execution of saving the note
// note.save().then((result) => {
// 	console.log("note saved!");
// 	mongoose.connection.close();
// });

// Since parameter of find is an empty object{}, we get all of the notes stored in the notes collection.
// find is a function provided by mongoose. As it is used for querying db, it is asynchronous
// ANY FUNCTION THAT IS USED TO INTERACT W DB IS ASYNCHRONOUS
Note.find({}).then((result) => {
	result.forEach((note) => {
		console.log(note);
	});
	mongoose.connection.close();
});
