import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './loginManager';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import {} from '@fortawesome/free-solid-svg-icons'




function Login() {
const [newUser, setNewUser] = useState (false);
const [user,setUser] =useState({
  isSignedIn :false,
  email: '',
  password:'',
  photo:'',
  
});
 
initializeLoginFramework();
 
const [loggedInUser ,setLoggedInUser] = useContext(UserContext);
const history = useHistory();
const location = useLocation();

let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () =>{
    handleGoogleSignIn()
    .then (res =>{
      handleResponse(res, true);
    })
  }
 const signOut =()=>{
   handleSignOut()
   .then (res =>{
     handleResponse(res, false);
   })
 }
 const handleResponse = (res , redirect)=>{
  setUser(res);
  setLoggedInUser(res);
  if (redirect){
    history.replace(from);
  }
 }
  
    
const  handleBlur = (event) =>{
//console.log(event.target.name ,event.target.value);
let isFieldValid = true;

if(event.target.name === 'email'){
 
  isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

}
if(event.target.name === 'password'){
  const isPasswordValid =event.target.value.length >6;
  const passwordHasNumber = /\d{1}/.test(event.target.value)
  isFieldValid= isPasswordValid && passwordHasNumber;

  }
  if(isFieldValid){
   
   const newUserInfo = {...user};
   newUserInfo[event.target.name] = event.target.value;
   setUser(newUserInfo);

  }
}

const handleSubmit = (event) =>{
  //console.log(user.password,user.email);
  if(newUser && user.name && user.password){
    createUserWithEmailAndPassword(user.name,user.email,user.password)
    .then (res =>{
      handleResponse(res, true);
    })
  }
 if(!newUser && user.email && user.password)
  signInWithEmailAndPassword(user.email,user.password)
  .then (res =>{
    handleResponse(res, true);
  }) 

 event.preventDefault();
}

  
  return (
   <div style={{textAlign:'center'}}>

       {
         user.isSignedIn ?  <button onClick ={signOut}>Sign out</button> :
         <button onClick ={googleSignIn}> Google Sign in </button>
       }
       <br/>
    <button> Log in using Facebook</button>

     {
       user.isSignedIn && <div>
         <p> Welcome ,{user.name}</p>
          <p> Email:{ user.email}</p>
         <img src={user.photo} alt=""></img>
          
         </div>
     }

      <h1> Our own   Authentication</h1>
      <input type ="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor ="newUser">New Users Sign Up </label>
        <form onSubmit={handleSubmit}>  
        {newUser &&<input type ="text" onBlur={handleBlur} name ="name" placeholder ="Name" />}
        <br/>
        <input type ="text" onBlur={handleBlur} name="email" placeholder ="Email" required/>
      <br/>
      <input type ="password" onBlur={handleBlur} name ="password" id ="" placeholder="Password" required/>
      <br/>
      <input type ="submit" value ={ newUser ? 'Sign up' : 'Sign in '}/>
      </form>
        <p style ={{color: 'red'}}> {user.error}</p>
        {user.success &&<p style ={{color: 'green'}}> User {newUser ? 'Created' : 'Log In'} Successfully</p>}
    
   </div>

);
    }
export default Login;
