# Create a diagram depicting the situation where the user creates a new note using the single-page version of the app
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: User writes new note and click save


    activate server
    browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/notes with note data

    Note right of browser: Content-type: application/json<br> { "content": "newNote", "date": "2023-1-1" }

    server-->browser: HTTP 201 created
    deactivate server

    Note right of browser: Browser renders page with new note via callback from previously sent JS file
