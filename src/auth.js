//var firebase = require('firebase');
//var firebaseui = require('firebaseui');
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword,connectAuthEmulator } from "firebase/auth"

import {
    getFirestore, collection, getDocs,
    addDoc, updateDoc, doc, getDoc, setDoc
} from 'firebase/firestore'

import {
    fromDate, toDate, Timestamp
} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXxl67w-RhT-HyOIXDwcvYxLtqSxPXesg",
    authDomain: "test2023-54cd1.firebaseapp.com",
    projectId: "test2023-54cd1",
    storageBucket: "test2023-54cd1.appspot.com",
    messagingSenderId: "1028743080476",
    appId: "1:1028743080476:web:9c7bf372c3a822848c8dd9"
};

console.log("auth!")
initializeApp(firebaseConfig);
let auth = getAuth();

let newdiv = document.createElement("div");
newdiv.innerHTML = "click to sign in";
document.body.appendChild(newdiv);
newdiv.addEventListener("click", (e)=>{
    let provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
            console.log(error)
            // Handle Errors here.
            const errorCode = error.code;
            console.log(errorCode);
            const errorMessage = error.message;
            console.log(errorMessage)
            // The email of the user's account used.
            const email = error.customData.email;
            console.log(email);
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(credential)
            // ...
        }
    );
})

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      window.location.pathname = ('/dist/4-1-ToDoMaker.html')
      // ...
    } else {
     //   window.location.pathname = ('/dist/auth.html')

      // User is signed out
      // ...
    }
  });
  


// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//       // List of OAuth providers supported.
//       firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     ],
//     // Other config options...
//   });

