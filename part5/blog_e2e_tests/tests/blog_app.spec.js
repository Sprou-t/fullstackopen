const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./testHelper')

// when running a test using playwright, it provides a page objwhich provides methods to interact w webpg
describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
    // empty the db here(refer to backend)
    // create a user for the backend here
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'Sprout',
        password: 'bean',
        name: "sprout"
      }
    })
    await page.goto('http://localhost:3003')// go to the login page
})
  
    test('login form is shown', async ({ page }) => {
        const locateBlogTitle = page.getByText('blogs')
        const loginButton = page.getByRole('button',{ name: 'log in'})
        await expect(locateBlogTitle).toBeVisible()
    }) 

    describe('attempt to login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            // fill in login form
            await loginWith(page,'Sprout','bean');

            await expect(page.getByText('logged in')).toBeVisible()
            await expect(page.getByRole('button',{name: 'logout'})).toBeVisible()
            await expect(page.getByRole('button',{name: 'new blog'})).toBeVisible()
            await expect(page.getByRole('button',{name: 'show blog'})).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page,'john','wrongPW');

            await expect(page.getByText('Wrong credentials')).toBeVisible()
        })
      })

    describe('After logging in',()=>{
        beforeEach(async ({ page }) => {
            // log user in
            await loginWith(page,'Sprout','bean');
        })

        test('a new blog can be created', async ({ page }) => {
            createBlog(page, 'Jeronimo', 'JUrl', '13')

            await expect(page.getByText("A new blog 'Jeronimo' added")).toBeVisible()

            await page.getByRole('button',{name: 'show blog'}).click()
            await expect(page.getByText("Jeronimo", { exact: true })).toBeVisible() //exact match of text
          })

        describe('After creating a blog',() =>{
            // sometimes if test cannot work due to the time overshot just remove the nesting
            beforeEach(async ({page}) =>{
                await createBlog(page, 'Jeronimo', 'JUrl', '13')
            })

            test('blog can be liked',async ({page}) =>{
                await page.getByRole('button',{name: 'show blog'}).click()
                await page.getByRole('button',{name: 'view'}).click()
                await expect(page.getByText("13")).toBeVisible()

                await page.getByRole('button',{name: 'like'}).click()
                await expect(page.getByText("14")).toBeVisible()
            })

            test('blog can be deleted', async({page}) =>{
                await page.getByRole('button',{name: 'show blog'}).click()
                await page.getByRole('button',{name: 'remove'}).click()
                await expect(page.getByText(`Blog 'Jeronimo' deleted successfully!`)).toBeVisible() 
                // Alternatively, check if the blog is no longer visible
                await expect(page.getByText('Jeronimo', {exact:true})).not.toBeVisible();
            })

            test('blogs are arranged in descending order of their likes', async({page}) =>{
                await createBlog(page, 'Percy Jackson', 'JUrl', '30')
                await createBlog(page, 'Harry Potter', 'JUrl', '100')
                await page.getByRole('button',{name: 'show blog'}).click()
                // get all the url elements and see that the no. are in desc order
                const allLikesText = await page.getByTestId('blogLikes').allTextContents();
                // parse the number from the 'like string
                const allLikesNum = allLikesText.map(text => {
                    // Use split or a regular expression to extract the number part
                    const likesNumber = text.split(' ')[0]; // Assumes the format is "{number} like"
                    return parseInt(likesNumber, 10); // Convert the extracted part to a number
                  });
                expect(allLikesNum[0]).toBeGreaterThan(allLikesNum[1])
                expect(allLikesNum[1]).toBeGreaterThan(allLikesNum[2])
            })
        })
    })
})

 