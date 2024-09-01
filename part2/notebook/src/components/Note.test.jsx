/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', async() => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  // mocking function that simulates event handler toggleImportance is created
  const mockHandler = vi.fn()
  // render the component
  render(<Note note={note} toggleImportance={mockHandler} />)
  screen.debug() // prints the HTML of a component to the terminal
// simulates a user that can interact with the button
    const user = userEvent.setup()
    // use the object screen to access the rendered component
    const button = screen.getByText('make not important')
    await user.click(button) // method click of the userEvent-library.

    // verify that the mock function has been called exactly once when button is cliced
    expect(mockHandler.mock.calls).toHaveLength(1)
})

test('renders content', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Does not work anymore :(', { exact: false })

  expect(element).toBeDefined()
})

test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})