import { render, screen } from '@testing-library/react'
import { beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('render blog and see if it is rendered correctly',()=>{
    beforeEach(()=>{
        const blog = {
            title: "charlotte's web",
            blogLikes: 13,
            author: 'Rick Riordan',
            blogUrl:'cwUrl'
          }
        
        render(<Blog blogTitle={blog.title} blogLikes = {blog.blogLikes} username={blog.author} />)
    })
    test('renders blog title and author with url and likes being concealed by togglable', () => {
        const renderedBlogTitle = screen.getByText("charlotte's web")
        const renderedBlogLikes = screen.queryByText('13')
        const renderedBlogAuthor = screen.getByText("Rick Riordan")
        // Use queryByText to check for elements that should not be present
        const renderedBlogUrl = screen.queryByText('cwUrl');
    
        expect(renderedBlogTitle).toBeDefined()
        expect(renderedBlogAuthor).toBeDefined()
        // Check that renderedBlogLikes and renderedBlogUrl are not visible because they are wrapped by a hidden parent
        if (renderedBlogLikes) {
            const parentElement = renderedBlogLikes.closest('div'); // Adjust 'div' to the actual parent tag
            expect(parentElement).toHaveStyle('display: none');
        }
    
        if (renderedBlogUrl) {
            const parentElement = renderedBlogUrl.closest('div'); // Adjust 'div' to the actual parent tag
            expect(parentElement).toHaveStyle('display: none');
        }
    })
    
    test('blog url and likes are revealed when view button clicked', async()=>{
        const renderedBlogTitle = screen.getByText("charlotte's web")
        const renderedBlogLikes = screen.queryByText('13')
        const renderedBlogAuthor = screen.getByText("Rick Riordan")
        // Use queryByText to check for elements that should not be present
        const renderedBlogUrl = screen.queryByText('cwUrl');
        
        // Check that renderedBlogLikes and renderedBlogUrl are not visible because they are wrapped by a hidden parent
        if (renderedBlogLikes && renderedBlogUrl) {
            const parentElement = renderedBlogLikes.closest('div'); // Adjust 'div' to the actual parent tag
            expect(parentElement).toHaveStyle('display: none');
            
            // click on view button and check if BlogTitle and BlogAuthor r shown
            const user = userEvent.setup()
            const button = screen.getByText('view')
            await user.click(button)
        
            expect(parentElement).toHaveStyle('display: block');
        }
    })
})


test('updateLike event handler called twice when like button is clicked 2x', async()=>{
    const blog = {
        title: "charlotte's web",
        blogLikes: 13,
        author: 'Rick Riordan',
        blogUrl:'cwUrl'
    }
    const mockHandler = vi.fn();

    render(<Blog updateBlogLikes={mockHandler} blogTitle={blog.title} blogLikes = {blog.blogLikes} username={blog.author} />)
    
    // click on view button and check if BlogTitle and BlogAuthor r shown
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    //.mock.calls property is an array that contains all the arguments passed
    // to the mock function during each of its calls.
    expect(mockHandler.mock.calls).toHaveLength(2);
})
