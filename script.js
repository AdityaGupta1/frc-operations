var config = {
    apiKey: "AIzaSyBqgAMXL5NK1q5b7tLK3mzNz1NS2ED_Ohg",
    authDomain: "frc-operations.firebaseapp.com",
    databaseURL: "https://frc-operations.firebaseio.com",
    projectId: "frc-operations",
    storageBucket: "frc-operations.appspot.com",
    messagingSenderId: "580956261000"
};
firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
var tasks = db.collection("tasks");

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
            var task = doc.data();

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

    for (var id in tasksObject) {
        var task = tasksObject[id];

        taskString += "<h3>" + task.name + " (" + task.leader + ")";
        var participants = task.participants;

        if (participants.length < task.max_participants && task.leader !== user && task.participants.indexOf(user) === -1) {
            taskString += "<button style='margin-left:7px;' onclick='signup(\"" + id + "\")'>+</button>";
        }

        if (task.leader === user) {
            taskString += "<button style='margin-left:7px;' onclick='removeTask(\"" + id + "\")'>-</button>";
        }

        taskString += "</h3><table class='table-striped'>";

        for (var i in participants) {
            var participant = participants[i];
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
    var task = tasks.doc(id);

    task.get().then(function(doc) {
        var participants = doc.data().participants;
        participants.push(user);
        task.update({ "participants": participants });
        tasksObject[id].participants = participants;
    }).then(function() {
        showTasks();
    });
}

function removeSignup(id) {
    var task = tasks.doc(id);

    task.get().then(function(doc) {
        var participants = tasksObject[id].participants;
        participants.splice(participants.indexOf(user), 1);
        task.update({ "participants":  tasksObject[id].participants});
    }).then(function() {
        showTasks();
    });
}

function removeTask(id) {
    tasks.doc(id).delete();
    delete tasksObject[id];
    showTasks();
}

function addTask() {
    var taskName = $("#task-name").val();
    var maxParticipants = parseInt($("#task-participants").val());

    var task = {
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