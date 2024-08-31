const Blog = ({ blogId, blogTitle, blogUrl, blogLikes, updateBlogLikes, username, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // note that we need arrrow function to pass the updateBlogLikes by ref
  // need to use { } cuz we are rendering the destructured props
  return (
    <div style={blogStyle}>
      <div>
        <p>{blogTitle}</p> 
        <p>{blogUrl} </p>
        <p>{blogLikes} <button onClick={() => updateBlogLikes(blogId)} >like</button> </p>
        <p>{username}</p>
        <button onClick={()=> deleteBlog(blogId)}>remove</button>
      </div>
  </div>  
)
}
  

export default Blog