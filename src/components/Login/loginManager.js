import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () =>{
    if (firebase.apps.length === 0){
      firebase.initializeApp(firebaseConfig);
    }
}

export const handleGoogleSignIn =() =>{
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
    .then(res =>{
      const {displayName,photoURL,email} = res.user;
       const signedInUser ={
         isSignedIn: true,
         name :displayName,
         email:email,
         photo:photoURL,
         success :true,
       }
       return signedInUser;
      //console.log(displayName,photoURL,email);
    })
    .catch(error => {
      console.log(error);
    })
    }

   export const handleSignOut = () =>{
        firebase.auth().signOut()
        .then(res => {
          const signOutUser ={
            isSignedIn: false,
            name:'',
            email:'',
            photo:'',
            error:'',
            success:false
           
          }
          return signOutUser;
        })
          .catch(error =>{
    
          });
        }

 export const createUserWithEmailAndPassword =(name, email, password) =>{
  return firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(res =>{
    const newUserInfo = res.user;
    newUserInfo.error = '';
    newUserInfo.success = true ;    
    updateUserName(name);
    return newUserInfo;
  })
  
  
  .catch(error =>{
    const  newUserInfo = {};
    newUserInfo.error = error.message;
    newUserInfo.success =false;
    return newUserInfo;
    //setUser (newUserInfo);
  });
}

export const  signInWithEmailAndPassword= (email, password) =>{
 return firebase.auth().signInWithEmailAndPassword(email,password)
  .then(res => {
   const newUserInfo = res.user;
   newUserInfo.error = '';
   newUserInfo.success = true ;
  return newUserInfo;
  })
  .catch(function(error) {
   const  newUserInfo = {}
       newUserInfo.error = error.message;
       newUserInfo.success =false;
       return newUserInfo;
 });
}

const updateUserName = name =>{
  var user = firebase.auth().currentUser;
    user.updateProfile({
   displayName:name 
 })
 .then(res =>{
  console.log('user name updated successfully');
 })
 .catch(function(error) {
  console.log(error);
 });

}


