
import mongoose from "mongoose";
// these 2 lines r needed for environment variable to work
import dotenv from "dotenv";
dotenv.config();

const password = process.argv[2];

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

mongoose.set("strictQuery", false);

// schema is essential for both adding/retrieving db data  
const phoneNumberSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			minLength: 3,
			required: true,
		},
		number: {
			type: String,
			minLength: 8,
			required: true,
			validate: {
				validator: function (v) {
					// Regex to check min 2 digits - min 5 digits
					return /^(\d{2,3})-(\d{5,})$/.test(v);
				},
				// custom error message if not validated
				message: (props) =>
					`${props.value} is not a valid phone number! It should be in the format XX-XXXXXXXX or XXX-XXXXXXXX.`,
			},
		},
	},
	{ collection: "phone numbers" }
);
// this sets the collection name of my own choice in mongodb. when i interact with the db,
// this line ensures the correct collection that i interact with

phoneNumberSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});
const phoneNumModel = mongoose.model("PhoneNumber", phoneNumberSchema);

// export the model that is built on the phoneNumberSchema with add configurations done
// this model will be used to build new phone number in post as well as verifyng existing
// phone numbers for retrieval/update
export default phoneNumModel;