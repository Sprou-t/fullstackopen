const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper.js");
const Blog = require("../models/blog.js");
const User = require('../models/user.js')

// supertest wraps our express app to create an API that can interact with routes & be used for tests
const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});

	// Create a Mongoose blog object and save it
	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);
});

describe("GET /api/blog", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blog")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("there are two blogs", async () => {
		const response = await api.get("/api/blog");
		assert.strictEqual(response.body.length, 2);
	});

	test("the first blog is about HTTP methods", async () => {
		const response = await api.get("/api/blog");
		const contents = response.body.map((e) => e.title);
		assert(contents.includes("titleA"));
	});

	test("unique identifier prop of blog posts is _id", async () => {
		const response = await api.get("/api/blog");
		const blogs = response.body;
		blogs.forEach((blog) => {
			assert.ok(blog.id); // Ensure 'id' is defined and truthy
			assert.strictEqual(blog._id, undefined);
		});
	});
});

describe("POST /api/blog", () => {
	test("successfully create & add 1 more blog to the db", async () => {
		const newBlog = {
			title: "titleC",
			author: "authorC",
			url: "urlC",
			likes: 20,
		};
		await api
			.post("/api/blog")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map((blog) => blog.title);
		assert(titles.includes("titleC"));
	});
});

describe("DELETE /api/blog/:id", () => {
	test("succeeds with status code 204 if id is valid", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];

		await api.delete(`/api/blog/${blogToDelete.id}`).expect(204);

		const blogsAtEnd = await helper.blogsInDb();
		assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1);

		const titles = blogsAtEnd.map((blog) => blog.title);
		assert(!titles.includes(blogToDelete.title));
	});
});

describe("PUT /api/blog/:id", () => {
	test("update an existing blog's likes", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		const updatedBlog = { likes: 5 };

		await api.put(`/api/blog/${blogToUpdate.id}`).send(updatedBlog).expect(205);

		const blogsAtEnd = await helper.blogsInDb();
		assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes);
	});
});

describe("when there is initially one user in db", () => {
	  beforeEach(async () => {
			await User.deleteMany({});

			const passwordHash = await bcrypt.hash("sekret", 10);
			const user = new User({ username: "root", passwordHash });

			await user.save();
		});

	 test("creation succeeds with a fresh username", async () => {
			const usersAtStart = await helper.usersInDb();

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

			const usersAtEnd = await helper.usersInDb();
			assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

			const usernames = usersAtEnd.map((u) => u.username);
			assert(usernames.includes(newUser.username));
	 });
	
	test("creation fails with proper statuscode and message if username already taken", async () => {
		const usersAtStart = await helper.usersInDb();

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

		const usersAtEnd = await helper.usersInDb();
		assert(result.body.error.includes("expected `username` to be unique"));

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});
});

after(async () => {
	await mongoose.connection.close();
});
