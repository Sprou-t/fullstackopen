// files under controllers contains all the route handlers

const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogRouter.get("/:id", async (request, response, next) => {
	const blog = await Blog.findById(request.params.id);

	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogRouter.post("/", async (request, response) => {
	const body = request.body;

	// verify that the token created when user logs in is valid using the SECRET key
	// if valid, returns the data contained in the token to decodedToken
	// eg. {
	//   "id": "user_id_here",
	//   "username": "user_name_here", .....
	//}
	// note that tokenExtractor middleware activates & assigns the token payload/info to
	// request.token already for access
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	const user = request.user;

	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const blog = new Blog({
		title: body.title,
		author: user,
		url: body.url,
		likes: body.likes,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	console.log(savedBlog._id); // new ObjectId('66c2a10e90e8198081cdf219')
	console.log(savedBlog.id); // 66c2a10e90e8198081cdf219
	await user.save();
	response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response, next) => {
	const body = request.body;

	const decodedToken = jwt.verify(request.token, process.env.SECRET);

	const user = request.user;
	// delete blog from blog collection
	const deletedBlog = await Blog.findByIdAndDelete(request.params.id);

	// delete blog from user's property array
	if (deletedBlog) {
		user.blogs = user.blogs.filter((blogID) => {
			return blogID.toString() !== deletedBlog.id.toString();
		});

		await user.save();
		// end() finishes the response so client is know server is done processing req
		// need end() only when we are not sending any data back to client
		response.status(204).end(); // Successfully deleted, respond with 204 No Content
	} else {
		response.status(404).end(); // Blog not found, respond with 404 Not Found
	}
});

blogRouter.put("/:id", async (request, response, next) => {
	const body = request.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});
	// don't need end when we are sending data over such as put and post as .json auto ends the response aft sending
	// response.json(updatedBlog).status(205).end(); is wrong, need to set status code first if not default 200 will apply
	response.status(205).json(updatedBlog);
});

module.exports = blogRouter;
