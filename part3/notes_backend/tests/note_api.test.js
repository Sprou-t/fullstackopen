// these tests are integration tests as they check diff parts of app such as backend operation
// & backend - database interaction
import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Note from "../models/note.js";
import { initialNotes, nonExistingId, notesInDb, usersInDb } from "./test_helper.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

// wrap express app w the supertest function into a so-called superagent object
// this obj, in api variable can be used to make http req to backend
// note that supertest provides an internal port so we don't need to listen to any port bf test
const api = supertest(app);

beforeEach(async () => {
	// there is an error as the author doesn't match the id.
	// refactor: create user first and then link the user's id to the note's user section
	await Note.deleteMany({});
	await Note.insertMany(initialNotes);
});

beforeEach(async () => {
	await User.deleteMany({});

	const passwordHash = await bcrypt.hash("sekret", 10);
	const user = new User({ username: "root", passwordHash });

	await user.save();
});

describe("when there is initially some notes saved", () => {
	test("notes are returned as json", async () => {
		await api
			.get("/api/notes")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all notes are returned", async () => {
		const response = await api.get("/api/notes");

		assert.strictEqual(response.body.length, initialNotes.length);
	});

	test("a specific note is within the returned notes", async () => {
		const response = await api.get("/api/notes");

		const contents = response.body.map((r) => r.content);
		assert(contents.includes("Browser can execute only JavaScript"));
	});

	describe("viewing a specific note", () => {
		test("succeeds with a valid id", async () => {
			const notesAtStart = await notesInDb();

			const noteToView = notesAtStart[0];

			const resultNote = await api
				.get(`/api/notes/${noteToView.id}`)
				.expect(200)
				.expect("Content-Type", /application\/json/);

			assert.deepStrictEqual(resultNote.body, noteToView);
		});

		test("fails with statuscode 404 if note does not exist", async () => {
			const validNonexistingId = await nonExistingId();

			await api.get(`/api/notes/${validNonexistingId}`).expect(404);
		});

		test("fails with statuscode 400 id is invalid", async () => {
			const invalidId = "5a3d5da59070081a82a3445";

			await api.get(`/api/notes/${invalidId}`).expect(400);
		});
	});

	describe("addition of a new note", () => {
		test("succeeds with valid data", async () => {
			const newUser = await usersInDb();
			const notes = await notesInDb();
			
			const newNote = {
				content: "async/await simplifies making async calls",
				important: true,
				user: newUser[0].id
			};

			await api
				.post("/api/notes")
				.send(newNote)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const notesAtEnd = await notesInDb();
			assert.strictEqual(notesAtEnd.length, initialNotes.length + 1);

			const contents = notesAtEnd.map((n) => n.content);
			assert(contents.includes("async/await simplifies making async calls"));
		});

		test("fails with status code 400 if data invalid", async () => {
			const newNote = {
				important: true,
			};

			await api.post("/api/notes").send(newNote).expect(400);

			const notesAtEnd = await notesInDb();

			assert.strictEqual(notesAtEnd.length, initialNotes.length);
		});
	});

	describe("deletion of a note", () => {
		test("succeeds with status code 204 if id is valid", async () => {
			const notesAtStart = await notesInDb();
			const noteToDelete = notesAtStart[0];

			await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

			const notesAtEnd = await notesInDb();

			assert.strictEqual(notesAtEnd.length, initialNotes.length - 1);

			const contents = notesAtEnd.map((r) => r.content);
			assert(!contents.includes(noteToDelete.content));
		});
	});
});

describe("when there is initially one user in db", () => {
	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await usersInDb();

		const newUser = {
			username: "mluukkai",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		assert(usernames.includes(newUser.username));
	});

	test("creation fails with proper statuscode and message if username already taken", async () => {
		const usersAtStart = await usersInDb();

		const newUser = {
			username: "root",
			name: "Superuser",
			password: "salainen",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await usersInDb();
		assert(result.body.error.includes("expected `username` to be unique"));

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});
});

after(async () => {
	await mongoose.connection.close();
});
