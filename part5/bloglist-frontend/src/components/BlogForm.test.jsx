import userEvent from "@testing-library/user-event";
import { render, screen } from '@testing-library/react'
import BlogForm from "./BlogForm";

test('blogForm calls addBlog event handler when new blog created',async()=>{
    // create blogForm
    const createBlog = vi.fn();
    const user = userEvent.setup();

    let container = render(<BlogForm onSubmit={createBlog} />).container

    const titleInput = container.querySelector('.titleInput');
    const urlInput = container.querySelector('.urlInput');
    const likesInput = container.querySelector('.likesInput');
    const saveBtn = screen.getByText('save');

    await user.type(titleInput,'charlotte web');
    await user.type(urlInput,'cwurl');
    await user.type(likesInput, '13');
    await user.click(saveBtn);

    console.log(createBlog.mock.calls);
    //.mock.calls property is an array that contains all the arguments passed
    // to the mock function during each of its calls.
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('charlotte web')
    
    // screen.debug()
})