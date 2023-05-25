// importing our custom Todo object and converter object from the classExport JS file
import { TodoItem, todoConverter } from "./classExport";
// importing the db and auth objects from our setup file
import { db, auth } from "./fbSetup"


// importing the functions we will use from the node_module libraries
import {
    collection, getDocs, addDoc, query, where,
    doc, updateDoc
} from 'firebase/firestore'

import { onAuthStateChanged, signOut } from "firebase/auth"

// setting up global variables containing array of ToDo objects and logged in user id
let uid;
let myToDos = [];

// saving the collection reference to the tods into a variable
const colRef = collection(db, "todos").withConverter(todoConverter);

// Good starting point for any flow through the page loading is the onAuthStateChanged
// This will run as soon as the page loads and registers that the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // setting the global variable uid as the logged in user id
        uid = user.uid;
        // setting up a query that will return a collection reference
        // for only part of a collection that meets a criteria
        // (in this case only documents where the done property is false
        // and the uid property matches the logged in user)
        let myQuery = query(colRef, where("done", "==", false), where("uid", "==", uid))

        // running the get docs method to display the ToDos on the page
        // this is triggered inside the onAuthStateChanged to ensure
        // that we have a userID loaded before accessing docs
        getDocs(myQuery).then(
            (snapshot) => {
                snapshot.forEach(
                    (doc) => {
                        // for each document run the display() method of the data object
                        // which has been converted to our custom ToDo object when it is loaded
                        // thanks to the "withConverter(todoConverter)" method appended to the 
                        // collection reference
                        let data = doc.data();
                        console.log(data);
                        data.display(document.getElementById("items"), myToDos);
                        // add the data (ToDo objects) to the myToDos array
                        myToDos.push(data);
                    }
                );
            }
        )

    } else {
        // if the user is signed out kick them to the authentication page
        window.location.pathname = ('/dist/auth.html')
    }
});

// like the sign-in button a simple function bound to the browser window
// (as needed by webpack), that will trigger on-click from the HTML
// In this case all we need to do is using the signOut() function
// (and the onAuthStateChanged() will kick the user to the authentication page)
window.signOutButton = function () {
    signOut(auth);
}

// a useful built-in function in JS is setInterval, which takes two inputs,
// a function to run, and a number of miliseconds to wait between running this
// function. In this case updating the selected toDo item by incrementing its
// timer every 1 second.
setInterval(() => {
    console.log(uid)
    myToDos.forEach(async (item) => {
        // loop through the ToDos array and check each one if they are selected
        if (item.selected) {
            // increment the timer and update the text on screen
            item.timer++;
            item.timerDiv.innerHTML = getTimerString(item.timer);
            // update the database every 30 seconds
            // (there's a limit for how many times a day we can write data)
            if (item.timer % 30 === 0) {
                // find the document using the id of this instance of the todo
                // then use the updateDoc() function to change the timer field
                // in the firebase
                let docRef = doc(db, "todos", item.id);
                await updateDoc(docRef, { timer: item.timer });
            }
        }
    });
}, 1000);

// called from the select method, loops through the loaded todos and 
// changes the selected properties of other instances to unselected
// and changes their class to "item"
// for the selected instance add a class name "selected" so it's both
// "item" and "selected" for the purposes of the css (this makes the red
// border around the selected item)
window.deselectOthers = function (id) {
    myToDos.forEach((item) => {
        if (item.id != id) {
            item.selected = false;
            item.itemDiv.className = "item"
        }
        else {
            item.itemDiv.classList.add("selected");
        }
    });
}






// reveal the div with the addItems id 
window.showAdd = function () {
    let addDiv = document.getElementById("addItems");
    console.log(addDiv.style)
    document.getElementById("addItems").style.display = "block";
}

// a simple helper function that translates seconds into a nice text format
window.getTimerString = function (timer) {
    let hour = Math.floor(timer / 3600);
    let hourString = hour.toString().padStart(2, "0");
    let minute = Math.floor((timer / 60) % 60);
    let minuteString = minute.toString().padStart(2, "0");
    let second = timer % 60;
    let secondString = second.toString().padStart(2, "0");
    return `${hourString}:${minuteString}:${secondString}`
}


// adding a new item (triggered from onclick in the html)
// the async keyword as there are steps that can't complete immediately
window.addMyItem = async function () {
    console.log("adding items");
    // get the user input from the html form
    let text = document.getElementById("textInput").value;
    let date = document.getElementById("dateInput").value;
    let time = document.getElementById("timeInput").value;


    console.log(`user input: ${text} ${date} ${time}`);
    // make a Date object from the input date and time
    let newDate = new Date(`${date}T${time}`)
    // check if the Date object is not correctly formed (is Not a Number)
    if (isNaN(newDate)) {
        // just use the current date/time if it's not correctly formed
        newDate = new Date();
    }
    // make a new ToDo object (using the user input,
    // false for done, an empty string for the document ID and the
    // logged in user ID)
    let newItem = new TodoItem(text, false, newDate, 0, "", uid);
    // add the new instance to the array
    myToDos.push(newItem)
    // make a new document in the Firestore database using our ToDo object
    // (this will be converted using the converter we made)
    let docRef = await addDoc(colRef, newItem);
    // take the document id and update the id of the local todo item
    newItem.id = docRef.id;
    // run the display method of this new ToDo item
    newItem.display(document.getElementById("items"), myToDos);
    // hide the input div
    document.getElementById("addItems").style.display = "none";
}



// called from the toggle() method in the ToDo class
// update the fireStore database using the updateDoc function
// and the document id and done property received from the
// toggle() method
window.updateDone = async function (id, done) {
    let docRef = doc(db, "todos", id);
    await updateDoc(docRef, { done: done });
}
