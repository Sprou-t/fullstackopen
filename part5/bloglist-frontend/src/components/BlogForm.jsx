// BlogForm component that renders input fields to create a blog
const BlogForm = ({ onSubmit, title, url, likes, handleTitleChange, handleUrlChange, handleLikesChange }) => {
  return (
    <div>
      <h2>Create a new blog</h2>
  
      <form onSubmit={onSubmit}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <div>
          likes:
          <input
            type="number"
            value={likes}
            onChange={handleLikesChange}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
}

export default BlogForm;
