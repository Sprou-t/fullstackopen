// files under models set up the scheme and model of the data
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
	title: String,
	author: { // mongoose will find another doc w the model of User
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	url: String,
	likes: Number,
});

blogSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

//a new 'Blog' collection will be created in my cluster0
module.exports = mongoose.model("Blog", blogSchema);

// specifying bloglist creates a 'bloglist' parent collection when i send a POST req
// const mongoUrl="mongodb+srv://lauweibin77:AcKWEilNEDn8BmJp@cluster0.8sn9b.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0";
