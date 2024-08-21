const Blog = require("../models/blog.js");
const User = require("../models/user.js");

const blogsInDb = async () => {
	const blogs = await Blog.find({}).sort({ title: 1 }); // retrieve by title in asc order
	// convert everything to json data to use
	return blogs.map((blog) => blog.toJSON());
	// changes mongoose obj into js obj: this involves transforms _id to id & removes _v
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

module.exports = {  blogsInDb, usersInDb };
