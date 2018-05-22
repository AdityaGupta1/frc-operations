firebase.initializeApp({
    apiKey: "AIzaSyBqgAMXL5NK1q5b7tLK3mzNz1NS2ED_Ohg",
    authDomain: "frc-operations.firebaseapp.com",
    databaseURL: "https://frc-operations.firebaseio.com",
    projectId: "frc-operations",
    storageBucket: "frc-operations.appspot.com",
    messagingSenderId: "580956261000"
});

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
const tasks = db.collection("tasks");

var tasksObject = {};
var taskString = "";

// will get actual signed in user once it's on wordpress
const user = "Aditya Gupta";

load();

function load() {
    $("#tasks").html("Loading...");
    taskString = "";

    tasks.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let task = doc.data();

            tasksObject[doc.id] = {
                "leader": task.leader,
                "max_participants": task.max_participants,
                "name": task.name,
                "participants": task.participants
            };
        });
    }).then(function() {
        showTasks();
    });
}

function showTasks() {
    taskString = "";

    for (let id in tasksObject) {
        let task = tasksObject[id];

        taskString += "<h3>" + task.name + " (" + task.leader + ")";
        let participants = task.participants;

        if (participants.length < task.max_participants && task.leader !== user && task.participants.indexOf(user) === -1) {
            taskString += "<button style='margin-left:7px;' onclick='signup(\"" + id + "\")'>+</button>";
        }

        if (task.leader === user) {
            taskString += "<button style='margin-left:7px;' onclick='removeTask(\"" + id + "\")'>-</button>";
        }

        taskString += "</h3><table class='table-striped'>";

        for (let i in participants) {
            let participant = participants[i];
            taskString += "<tr><td>" + participant;
            if (participant === user) {
                taskString += "<button style='margin-left:7px;' onclick='removeSignup(\"" + id + "\")'>-</button>";
            }
            taskString += "</td></tr>";
        }
        taskString += "</table><br>";
    }

    $("#tasks").html(taskString);
}

function signup(id) {
    let task = tasks.doc(id);

    task.get().then(function(doc) {
        let participants = doc.data().participants;
        participants.push(user);
        tasksObject[id].participants = participants;
        task.update({ "participants": participants });
    }).then(function() {
        showTasks();
    });
}

function removeSignup(id) {
    let task = tasks.doc(id);

    let participants = tasksObject[id].participants;
    participants.splice(participants.indexOf(user), 1);
    task.update({ "participants":  tasksObject[id].participants}).then(function() {
        showTasks();
    });
}

function removeTask(id) {
    tasks.doc(id).delete();
    delete tasksObject[id];
    showTasks();
}

function addTask() {
    let taskName = $("#task-name").val();
    let maxParticipants = parseInt($("#task-participants").val());

    let task = {
        "leader": user,
        "max_participants": maxParticipants,
        "name": taskName,
        "participants": []
    };

    tasks.add(task).then(function(doc) {
        tasksObject[doc.id] = task;
        showTasks();
    });
}