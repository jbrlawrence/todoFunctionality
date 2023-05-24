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

let uid;
let myToDos = [];

const colRef = collection(db, "todos").withConverter(todoConverter);

// Good starting point for any flow through the page loading is the onAuthStateChanged
// This will run as soon as the page loads and registers that the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        uid = user.uid;
        let myQuery = query(colRef, where("done", "==", false), where("uid", "==", uid))
        console.log(uid)
        getDocs(myQuery).then(
            (snapshot) => {
                snapshot.forEach(
                    (doc) => {
                        let data = doc.data();
                        console.log(data);
                        data.display(document.getElementById("items"), myToDos);
                        myToDos.push(data);
                    }
                );
            }
        )
        //   window.location.pathname = ('/dist/4-1-ToDoMaker.html')
        // ...
    } else {
        window.location.pathname = ('/dist/auth.html')
        // User is signed out
        // ...
    }
});

window.signOutButton = function () {
    signOut(auth);
}

setInterval(() => {
    console.log(uid)
    myToDos.forEach(async (item) => {
        if (item.selected) {
            item.timer++;
            item.timerDiv.innerHTML = getTimerString(item.timer);
            let docRef = doc(db, "todos", item.id);
            if (item.timer % 30 === 0) {
                await updateDoc(docRef, { timer: item.timer });
            }
        }
    });
}, 1000);

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







window.showAdd = function () {
    let addDiv = document.getElementById("addItems");

    console.log(addDiv.style)
    document.getElementById("addItems").style.display = "block";
}



window.getTimerString = function (timer) {
    let hour = Math.floor(timer / 3600);
    let hourString = hour.toString().padStart(2, "0");
    let minute = Math.floor((timer / 60) % 60);
    let minuteString = minute.toString().padStart(2, "0");
    let second = timer % 60;
    let secondString = second.toString().padStart(2, "0");
    return `${hourString}:${minuteString}:${secondString}`

}



window.addMyItem = async function () {
    console.log("adding items");
    let text = document.getElementById("textInput").value;
    let date = document.getElementById("dateInput").value;
    let time = document.getElementById("timeInput").value;


    console.log(`user input: ${text} ${date} ${time}`);
    let newDate = new Date(`${date}T${time}`)
    if (isNaN(newDate)) {
        newDate = new Date();
    }
    //console.log(addDoc(colRef,))
    let newItem = new TodoItem(text, false, newDate, 0, "", uid);
    myToDos.push(newItem)
    let docRef = await addDoc(colRef, newItem);
    newItem.id = docRef.id;


    newItem.display(document.getElementById("items"), myToDos);

    document.getElementById("addItems").style.display = "none";
}




window.updateDone = async function (id, done) {
    let docRef = doc(db, "todos", id);
    await updateDoc(docRef, { done: done });
}

window.updateTimer = async function (id, done) {

}





