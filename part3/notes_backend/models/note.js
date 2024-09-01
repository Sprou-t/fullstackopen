// this mod is only for defining and setting the schema for notes

import mongoose from "mongoose";

// we shd pass thruobj w this schema to validate the obj for the db
const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true,
	},
	important: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // user is the model name defined in mongoose.model
	}
});

// .set customizes the properties of the json obj created by the noteSchema when the obj is 
// converted from a mongoose doc. ie. everytime we use a GET req to draw data/doc from mongodb,
// the data presented to us would be after it has been transformed by the set function
noteSchema.set("toJSON", {
	// transform:callback function that will be executed whenever a document is converted to JSON.
	// doc: original doc taken from mongoose
	// returnedobj: the obj that will be displayed to client
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		// note that id property is an obj by itself, hence need to transform into a string
		delete returnedObject._id;
		// _v is a version key that helps mongoose keep track of the version of data
		delete returnedObject.__v;
	},
});

// Use export default instead of module.exports
// this line creates a Note model based on the schema. A model allows u to create a collection
// named notes if not yet created. if created, it will allow u to form a connection w dat
// collection such as for retrieval. we can also use this model to create notes document obj
// to save inside the db
const notesModel = mongoose.model("Note", noteSchema);

export default notesModel;
