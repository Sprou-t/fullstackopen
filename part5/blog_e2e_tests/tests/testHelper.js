const loginWith = async (page, username,  password) =>{
    await page.getByRole('button',{ name: 'log in'}).click()
    await page.getByTestId('usernameInput').fill(username)
    await page.getByTestId('passwordInput').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page,title, url, likes) =>{
    await page.getByRole('button',{name: 'new blog'}).click()
    await page.getByTestId('titleInput').fill(title)
    await page.getByTestId('urlInput').fill(url)
    await page.getByTestId('likesInput').fill(likes)
    await page.getByRole('button',{name: 'save'}).click()

}
module.exports = {loginWith,createBlog}