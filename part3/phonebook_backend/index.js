// use express to create a backend server listens for http request made by client side when they open browser and key
// in the url. a http req is a msg sent by client to server to tell it to do sth, get info, post info, delete etc
import express from "express";
// When you call express(), it creates an Express application, which is an object that has methods for handling
//HTTP requests and configuring the web server.
import morgan from "morgan";
import cors from 'cors';

//This app object is used to define routes, middleware, and other settings for your application.
const app = express();
//use the port defined in the environment variable PORT or port 3001 if the environment variable PORT is undefined
const PORT = process.env.PORT || 3002;

// this line uses the middleware function(express.json()). this middleware
// function parses request into data that can be retrieved in request.body
// Environment variables are dynamic variables in the operating system's environment 
// w/o changing the code itself
app.use(express.json());

app.use(express.static("dist"));

// use morgan which is a middleware that shows us info abt our requests
app.use(
	// eg. could be  POST /api/persons 200 61 - 3.894ms
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(cors())

let phonebook = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];
// app is an object that has methods for handling HTTP requests and configuring the web server
// request contains all the info in the http request made by client
// response is an obj that contains functions for how to respond to requests
app.get("/api/phonebook", (request, response) => {
	// The response.json() method in Express is used to send a JSON type response to the backend. This method sets
	// the Content - Type header to application / json and converts the JavaScript object or array
	// you pass to it into a JSON string before sending it to the client.
	response.json(phonebook);
});

app.get("/info", (request, response) => {
	// Count the number of entries in the phonebook
	const count = phonebook.length;

	const date = Date();
	// Create the message string
	const message = `<p>Phonebook has info for ${count} people</p><p>${date}</p>`;

	// Send the message string as a response
	response.send(message);
});

app.get("/api/phonebook/:id", (request, response) => {
	// id is taken from the url on top
	const id = request.params.id;
	const phoneNum = phonebook.find((num) => num.id === id);

	if (phoneNum) {
		response.json(phoneNum);
	} else {
		response.status(404).end();
	}
});

// Route to delete a specific phonebook entry by id
app.delete("/api/phonebook/:id", (request, response) => {
	const id = request.params.id;
	const initialLength = phonebook.length;

	// Filter out the phonebook entry with the given id
	phonebook = phonebook.filter((wantedNum) => wantedNum.id !== id);

	if (phonebook.length < initialLength) {
		// If the phonebook length has decreased, the deletion was successful
		response.status(204).end();
	} else {
		// If the phonebook length has not changed, the id was not found
		response.status(404).json({ error: "ID not found" });
	}
});
// postman would send a http req to the URL location with the necessary detail,
// then the server would process the request and if valid, response.json() 
// would then send the detail back to the client at the frontend 
// to be seen in the webpage(in a json object)

// the detail will be inside request.body that we can use to access its content
app.post("/api/phonebook", (request, response) => {
// request.body: Contains the data sent by the client in the body of the POST request.
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name or number missing",
		});
	}

	const generatedID = Math.floor(Math.random() * 10000).toString();

	const phoneNum = {
		id: generatedID,
		name: body.name,
		number: body.number,
	};

	const duplicatedName = phonebook.find((item) => item.name === body.name);

	if (duplicatedName) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}
	// add the new num to our local array
	phonebook = phonebook.concat(phoneNum);
	// this line sends phoneNum (aft converting into json obj) to client(webpage to be seen) 
	response.json(phoneNum);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// these 2 lines allow us to set up the backend server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
