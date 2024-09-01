import { test, expect, request, describe, beforeEach } from '@playwright/test';

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', 
            {
                data: {
                    name: 'Matti Luukkainen',
                    username: 'mluukkai',
                    password: 'salainen'
                }
            })

        await page.goto('http://localhost:3001')
      })

    test('front page can be opened', async ({ page }) => {
        const locator =  page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
    })

    test('user can log in', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')

        await page.getByRole('button', { name: 'login' }).click()
    
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      })

      describe('when logged in', () => {
        beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'log in' }).click()
          await page.getByTestId('username').fill('mluukkai')
          await page.getByTestId('password').fill('salainen')
          await page.getByRole('button', { name: 'login' }).click()
        })
    
        test('a new note can be created', async ({ page }) => {
          await page.getByRole('button', { name: 'new note' }).click()
          await page.getByTestId('newNote').fill('a note created by playwright')
          await page.getByRole('button', { name: 'save' }).click()
          await expect(page.getByText('a note created by playwright')).toBeVisible()
        })
        
        describe('and a note exists', () => {
            beforeEach(async ({ page }) => {
              await page.getByRole('button', { name: 'new note' }).click()
              await page.getByRole('textbox').fill('another note by playwright')
              await page.getByRole('button', { name: 'save' }).click()
            })
        
            test('note is created',async ({page}) =>{
                await expect(page.getByText('another note by playwright')).toBeVisible()
            })

            test('importance can be changed', async ({ page }) => {
              await page.getByRole('button', { name: 'make not important' }).click()
              await expect(page.getByText('make important')).toBeVisible()
            })
        })
      })
})