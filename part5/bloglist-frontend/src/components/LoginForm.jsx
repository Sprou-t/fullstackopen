// this is the component used in loginForm function in App.jsx to render 
// the JSX
const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
   }) => {
   return (
     <div>
       <h2>Login</h2>
 
       <form onSubmit={handleSubmit}>
         <div>
           username
           <input
             value={username}
             onChange={handleUsernameChange}
           />
         </div>
         <div>
           password
           <input
             type="password"
             value={password}
             onChange={handlePasswordChange}
           />
       </div>
         <button type="submit">login</button>
       </form>
     </div>
   )
 }
 
 export default LoginForm