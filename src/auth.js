// importing the auth object created in the fb setup file
import { auth } from "./fbSetup";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth"




// code to run when sign in is clicked
// window.functionName = function(){} is a syntax
// that explicitly binds the function to the browser window
// It is identical to a usual function functionName(){}
// however will work with webpack (where all functions need a context to run)
window.signInOnClick = function () {
    // choose the provider type
    let provider = new GoogleAuthProvider();
    // run the signIn with Popup function, allowing built in sign-in with firebase
    // if successful it will trigger the "onAuthStateChanged" function below
    // if it fails the "catch" code below deals with error details
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
}

// Check if authentication changes (also runs on load of page)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // user is signed in, redirect them to the main page
        // this triggers after signing in above
        window.location.pathname = ('/dist/4-1-ToDoMaker.html');
    } else {
        // User is signed out, do nothing
    }
});


