/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  let container;
  const createNote = vi.fn()
  const user = userEvent.setup()
// i am rendering a component. once i render, react testing lib returns an obj w several props
// 1 such props is container which can be accessed using .container and later using queryselector
// container refers to a specific part of the DOM that contains only the elements rendered by the component under test.
  container = render(<NoteForm createNote={createNote} />).container
// getByRole is used to query elements by their ARIA roles
// query for an element with the role of textbox. In HTML
//, an input field of type text, password, or email is associated with the textbox role.
// replace document with container
const input = container.querySelector('#note-input')
  // query elements by their visible text content
  const sendButton = screen.getByText('save')
// type in the input tag
  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')

  // see what the createNote function mocks up
  console.log(createNote.mock.calls)
})