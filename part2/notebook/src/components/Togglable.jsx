/* eslint-disable react/display-name */
//The Togglable component is a React component designed to toggle the 
// visibility of its child components based on user interaction
import { useState, forwardRef, useImperativeHandle } from 'react'
// this function sends a function to parent component as well as render react components
// forwardRef is used to forward the ref from the parent component to this component.
const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false)
    // set the CSS style
    // hideWhenVisible style: when visible true, display = none
    // showWhenVisible: when visible true, display is as default
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
//  useImperative function is a react hook, used for defining functions in a 
// component, which can be invoked outside of component

// useImperativeHandle can also be used to expose the toggleVisibility function to
// the parent component. This means the parent component can call toggleVisibility
// on the Togglable component’s instance via the ref it passes down & use
// it to change the toggleVisibility
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable