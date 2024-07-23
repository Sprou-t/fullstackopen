#  traditional way of user sending data
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Write note and click save
    Note right of browser: browser captures the user input and prepares to send it to the server

    browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/notes with note data

    activate server
    Note right of server: Server receives the note and saves it
    server-->>browser: HTTP 302 Redirect to /notes

    deactivate server
    Note right of browser: browser receives instructions to make GET request to /notes

    activate server
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes

    deactivate server
    server-->>browser: HTML Code

    activate server
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/styles.css

    deactivate server
    server-->>browser: CSS File

    activate server
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js

    deactivate server
    server-->>browser: JS File

    Note right of browser: Browser executes JS that fetches JSON from server

    activate server
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json

    deactivate server
    server-->browser: JSON File [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]

    Note right of browser: The browser executes the callback function that renders the notes

