# flowchart depicting user entering a site
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: user goes to browser

    activate server
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/SPA

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
    Note right of browser: Browser executes JS to fetch JSON from server

    activate server
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json

    deactivate server
    server-->browser: JSON [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]

    Note right of browser: Browser renders the contents via callback
