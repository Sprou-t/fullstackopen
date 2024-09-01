import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm' // rmb that components r used in <LoginForm> for eg.
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  // noteFormRef points to the Togglable component
  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      }).catch(error => {
        console.error('Failed to fetch notes:', error);
      });
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
		// note that data from localStorage are DOMstrings. to change
		// it into reg string for usage, need to JSON.parse it
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  // addNote function is responsible for sending POST req for note creation
  // addNote is sent to noteForm as its prop w the noteObject argument
  // where it would be executed to send a POST req over to server
  const addNote = ( noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
        .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
        .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleLogin = async(event) => {
    event.preventDefault()
    try {
      const user = await loginService({
      username, password,
      })

      // store logged in user's info in local storage so that user's
      // login info doesn't disappear when browser refreshes 
      // values has to be in DOMstrings, so need to use JSON.stringify
      // to change it into json string which is ok ald. note both r not similar to reg string
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user) // key, value
      ) 
      noteService.setToken(user.token)
      // token returned from successful login is saved to state: user
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
      setErrorMessage(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

// this is redundant at the moment
    // const noteForm = () => (
    //   <Togglable buttonLabel='new note' ref={noteFormRef}>
    //     <NoteForm createNote={addNote} />
    //   </Togglable>
    // )

    const loginForm = () => {
      // set display to none if loginVisible, revert back to default style w ''
      const hideWhenVisible = { display: loginVisible ? 'none' : '' }
      const showWhenVisible = { display: loginVisible ? '' : 'none' }
      // if user has not logged in, loginvisible is false, thus display is ''
      // making div visible, thus user can click login button. now loginvisible
      // is truem showWhenVisible is '', where user can see the LoginForm
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

// commonly used react trick to conditional render loginForm if user not
// logged in and show notes only if there's user
// note usage of outer {} to embed JS expressions within HTML-like syntax
// html syntax is when code is within tags. hence {noteForm()} cuz in the 
// 2nd part of the ternary operator, there is another <div> surrounding it
return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
	
      {!user && loginForm()}
      {user && <div>
       <p>{user.name} logged in</p>
       <Togglable buttonLabel="new note" ref = {noteFormRef}>
        <NoteForm
          addNote={addNote}
          handleChange={handleNoteChange}
        />
      </Togglable>
      </div>
     } 

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      
      <Footer />
    </div>
  )
}

export default App