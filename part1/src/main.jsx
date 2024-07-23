import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// This line of code is used in React to render a React component (<App />) 
// into a specific HTML element in the DOM
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
// ReactDOM: This is the React DOM package, which is used to interact with the DOM (Document Object Model) and render React components.

// createRoot: This is a method provided by ReactDOM to create a root for your React application.

//In React, createRoot is used to set up a "root" for your React application. Here's a clearer explanation of what a "root" is in this context:
// The "root" is essentially a container in the DOM where your entire React application will be mounted. It acts as the starting point for rendering all your React components.

// .render: This method is called on the root object created by createRoot. It is used to render the specified React component into the selected DOM element.

/* <App />: This is a React component that you want to render. It represents 
the root component of your React application. In this context, <App /> is a JSX 
(JavaScript XML)tag that corresponds to the App component defined elsewhere in your code. */