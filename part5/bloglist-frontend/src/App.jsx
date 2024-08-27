import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  // create a state that handles user returned from backend aft logging in w username & password 
  const [user, setUser] = useState(null) 
  const [blogTitle, setBlogTitle] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogLikes, setBlogLikes] = useState('')
  const [errorMessage, setErrorMessage] = useState(null); // put null so that when no msg, the Notification component wont render
  const [successMessage, setSuccessMessage] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false)

  // this hook runs when webpage renders and fetches all the blogs from backend server using getAll
  // the blogs state then contains all the blogs
  useEffect(() => {
    blogService.getAll().then(blogs => {
      // console.log(blogs); // Debugging
      setBlogs(blogs);
    });
  }, []);

  // this effect hook keeps user logs in. aft login, user info stored in local storage, then
  // everytime page refresh, instead fo losing the info, this effect hook activates and re-stores
  // the info from the local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault() // prevent page reload when login which affects states in react
    try{
      // user contains the data sent back from backend: username, user and token
      const user = await loginService.login({
        username, password // these 2 states r obtained from input field
      })
      // store user details in localstorage to prevent loss of info aft browser refreshes
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user) // if successful in login in, set user state
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // this function activates when user submits the form in blogForm
  const addBlog = async (event)=> {
    event.preventDefault()
    // use states to create the new blog
    const blogObject = {
      title: blogTitle,
      url: blogUrl,
      likes:  blogLikes,
    }
    const createdBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(createdBlog))
    // clear the i/p field cuz the fields r assigned blogTitle, blogAuthor and blogLikes
    setBlogTitle('');
    setBlogUrl('')
    setBlogLikes('')
    setSuccessMessage(`A new blog '${blogObject.title}' added!`);
        setTimeout(() => {
        setSuccessMessage(null);
    }, 5000);
  }
  // id will receive blogID as arg
  const updateBlogLikes = async (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id);
    if (blogToUpdate) {
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
      };
      try {
        const returnedBlog = await blogService.update(id, updatedBlog);
        console.log(`Returned blog: ${JSON.stringify(returnedBlog)}`);
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog));
      } catch (error) {
        console.error('Error updating blog likes:', error);
      }
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null) // clear the token
  }

  const handleBlogTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }

  const handleBlogLikesChange = (event) => {
    setBlogLikes(event.target.value)
  }
  // this function serves as a reusable piece of logic that defines how login
  // form shd be displaced based on the conditional. it uses LoginForm
  // from components to render the JSX
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  // for now, dont neeed this!!! this is basically a duplicate of BlogForm
  const blogForm = () => ( 
    // renders a form that allows user to create new blogs
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={blogTitle}
          name = 'BlogTitle'
          onChange={handleBlogTitleChange}
        />
      </div>

      <div>
        Url: 
        <input
            type="text"
            value={blogUrl}
            name='BlogUrl'
            onChange={handleBlogUrlChange}
          />
      </div>

      <div>
        Likes: 
        <input
            type="text"
            value={blogLikes}
            name='BlogLikes'
            onChange={handleBlogLikesChange}
          />
      </div>
      <button type="submit">save</button>
    </form>  
  )     
// note that both notif will only show if there's a msg given in error/successMessage
// note that we need to pass key to render list  
return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new blog">
            <BlogForm
              onSubmit={addBlog}
              title={blogTitle}
              url={blogUrl}
              likes={blogLikes}
              handleTitleChange={handleBlogTitleChange}
              handleUrlChange={handleBlogUrlChange} // Ensure this is defined in your component
              handleLikesChange={handleBlogLikesChange}
            />
          </Togglable>

          <Togglable buttonLabel="show blog">
            <ul>
              {blogs.map(blog => 
                <Blog
                  key={blog.id}
                  blogId = {blog.id}
                  blogTitle={blog.title}
                  blogUrl={blog.url}
                  blogLikes= {blog.likes}
                  updateBlogLikes = {updateBlogLikes}
                />
              )}
            </ul>
          </Togglable>
          
        </div>
      )}
    </div>
  );
}

      
      


export default App