import mongoose from "mongoose";

const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const phoneNumberSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const PhoneNumber = mongoose.model("phone number", phoneNumberSchema);

const phoneNum = new PhoneNumber({
	name: process.argv[3],
	number: process.argv[4],
});

if (process.argv.length === 3) {
	PhoneNumber.find({}).then((result) => {
		result.forEach((phoneNumber) => {
			console.log(`${phoneNumber.name} ${phoneNumber.number}`);
		});
		mongoose.connection.close();
	});
} else {
	phoneNum.save().then((result) => {
		console.log(
			`added ${process.argv[3]} number ${process.argv[4]} to phonebook`
		);
		mongoose.connection.close();
	});
}
