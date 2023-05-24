import {
    Timestamp
} from 'firebase/firestore'


export const todoConverter = {
    toFirestore: (todo) => {
        return {
            item: todo.text,
            done: todo.done,
            date: Timestamp.fromDate(todo.duedate),
            timer: todo.timer,
            uid: todo.uid
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        console.log(data);
        let timer = 0;
        if (data.timer != undefined) {
            timer = data.timer;
        }
        return new TodoItem(data.item, data.done, new Date(data.date.seconds * 1000), timer, snapshot.id, data.uid);
    }
};

export class TodoItem {
    constructor(text, done, duedate, timer, id, uid) {
        this.text = text;
        this.done = done;
        this.duedate = duedate;
        this.timer = timer;
        this.id = id;
        this.selected = false;
        this.uid = uid;
    }
    display(parent, todoArray) {
        this.itemDiv = document.createElement("DIV");
        let textDiv = document.createElement("DIV");
        this.checkDiv = document.createElement("DIV");
        let duedateDiv = document.createElement("DIV");
        this.itemDiv.className = "item";
        textDiv.className = "info";
        this.checkDiv.className = "check";
        duedateDiv.className = "due";
        this.timerDiv = document.createElement("DIV");

        this.checkDiv.addEventListener("click", () => {
            this.toggle();
        });
        this.itemDiv.addEventListener("click", () => {
            this.select(todoArray);
        });

        textDiv.innerHTML = this.text;
        duedateDiv.innerHTML = this.duedate;
        this.timerDiv.innerHTML = getTimerString(this.timer);
        // `${this.timer / 3600}:${(this.timer / 60) % 60}:${this.timer % 60}`;

        if (this.done) {
            this.checkDiv.innerHTML = "✅";
        }
        else {
            this.checkDiv.innerHTML = "🔲";

        }

        this.itemDiv.appendChild(this.checkDiv);
        this.itemDiv.appendChild(textDiv);
        this.itemDiv.appendChild(duedateDiv);
        this.itemDiv.appendChild(this.timerDiv)

        parent.appendChild(this.itemDiv);
    }
    async toggle() {
        this.done = !this.done;
        console.log(this.id);


        console.log(this.done);
        if (this.done) {
            this.checkDiv.innerHTML = "✅";
        }
        else {
            this.checkDiv.innerHTML = "🔲";
        }
        await updateDone(this.id, this.done);
    }
    async select(todoArray) {
        this.selected = true;
        deselectOthers(todoArray, this.id);
    }
}
