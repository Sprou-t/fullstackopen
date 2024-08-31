import { useState } from 'react'
// BlogForm component that renders input fields to create a blog
const BlogForm = ({ onSubmit}) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLikesChange = (event) => {
    setLikes(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call onSubmit with the form data
    onSubmit({ title, url, likes: parseInt(likes, 10) });
    // Clear form fields
    setTitle('');
    setUrl('');
    setLikes('');
  };

  return (
    <div>
      <h2>Create a new blog</h2>
  
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className='titleInput'
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            className='urlInput'
          />
        </div>
        <div>
          likes:
          <input
            type="number"
            value={likes}
            onChange={handleLikesChange}
            className='likesInput'
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
}

export default BlogForm;
