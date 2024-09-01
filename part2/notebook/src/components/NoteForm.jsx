import { useState } from 'react'

const NoteForm = ({ addNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    addNote({
      content: newNote,
      important: true,
    })
    

    setNewNote('')
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          data-testid='newNote'
          value={newNote}
          onChange={handleChange}
          id='note-input'
          placeholder='write note content here'  // use placeholder so that the test know which input field to test for
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm