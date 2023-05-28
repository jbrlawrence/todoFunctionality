// importing the Timestamp object (allows us to create FB Timestamp objects from traditional Date objects)
import {
    Timestamp
} from 'firebase/firestore'

// defining our rules for converting data to and from our FireStore database, giving us access to the custom ToDo objects whenever we load documents from the database
// the "export" keyword allows us to access this object from other files (see index.js)
export const todoConverter = {
    toFirestore: (todo) => {
        return {
            item: todo.text,
            done: todo.done,
            date: Timestamp.fromDate(todo.duedate),
            timer: todo.timer,
            when: todo.when,
            uid: todo.uid
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let timer = 0;
        if (data.timer != undefined) {
            timer = data.timer;
        }
        let when = 2;
        if (data.when != undefined) {
            when = data.when;
        }
        return new TodoItem(data.item, data.done, new Date(data.date.seconds * 1000), timer, when, snapshot.id, data.uid);
    }
};


// adding to our traditional object a document and user id property (needed for interacting with the database)
// also adding a timer property to count the number of seconds working on a todo item
export class TodoItem {
    constructor(text, done, duedate, timer, when, id, uid) {
        this.text = text;
        this.done = done;
        this.duedate = duedate;
        this.timer = timer;
        this.id = id;
        this.selected = false;
        this.uid = uid;
        this.when = when;
        this.parents = [document.getElementById("now"), document.getElementById("today"), document.getElementById("later")];
    }
    display(parent) {

        this.itemDiv = document.createElement("DIV");
        let textDiv = document.createElement("DIV");
        this.checkDiv = document.createElement("DIV");
        let duedateDiv = document.createElement("DIV");
        this.nowDiv = document.createElement("DIV");
        this.todayDiv = document.createElement("DIV");
        this.laterDiv = document.createElement("DIV");

        this.itemDiv.className = "item";
        textDiv.className = "info";
        this.checkDiv.className = "check";
        duedateDiv.className = "due";
        this.nowDiv.className = "timeButton"
        this.todayDiv.className = "timeButton"
        this.laterDiv.className = "timeButton"
        this.nowDiv.innerHTML = "NOW"
        this.todayDiv.innerHTML = "Today"
        this.laterDiv.innerHTML = "later..."

        this.timerDiv = document.createElement("DIV");

        this.checkDiv.addEventListener("click", () => {
            this.toggle();
        });
        // adding the ability to select the entire instance of the todo item and start a timer
        this.itemDiv.addEventListener("click", () => {
            this.select();
        });

        this.nowDiv.addEventListener("click", () => {
            this.when = 0;
            this.parent = this.parents[this.when];
            this.parent.appendChild(this.itemDiv);
            updateWhen(this.id, this.when);
        });
        this.todayDiv.addEventListener("click", () => {
            this.when = 1;
            this.parent = this.parents[this.when];
            this.parent.appendChild(this.itemDiv);
            updateWhen(this.id, this.when);
        });
        this.laterDiv.addEventListener("click", () => {
            this.when = 2;
            this.parent = this.parents[this.when];
            this.parent.appendChild(this.itemDiv);
            updateWhen(this.id, this.when);
        });

        textDiv.innerHTML = this.text;
        duedateDiv.innerHTML = this.duedate;
        // making a nice string out of the timer seconds data (see index.js)
        this.timerDiv.innerHTML = getTimerString(this.timer);

        if (this.done) {
            this.checkDiv.innerHTML = "✅";
        }
        else {
            this.checkDiv.innerHTML = "🔲";
        }

        this.itemDiv.appendChild(this.checkDiv);
        this.itemDiv.appendChild(textDiv);
        //this.itemDiv.appendChild(duedateDiv);
        this.itemDiv.appendChild(this.timerDiv)
        this.itemDiv.appendChild(this.nowDiv)
        this.itemDiv.appendChild(this.todayDiv)
        this.itemDiv.appendChild(this.laterDiv)
        this.parents[this.when].appendChild(this.itemDiv);
    }
    // the toggle method from before. the "async" keyword indicates that some part
    // of this method will take time to complete (this part will be indicated by an
    // "await" keyword)
    async toggle() {
        this.done = !this.done;

        if (this.done) {
            this.checkDiv.innerHTML = "✅";
        }
        else {
            this.checkDiv.innerHTML = "🔲";
        }
        // run the "updateDone" function (see the index.js)
        // you will hand it the document id and done property of this instance of the ToDo object as inputs to use in its operation
        await updateDone(this.id, this.done);
    }
    // select method which switches the select property of this instance of the Todo object
    select() {
        this.selected = true;
        // runs a function "deselect others" to 
        deselectOthers(this.id);
    }
}
