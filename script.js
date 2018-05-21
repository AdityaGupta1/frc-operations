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
            taskString += "<h3>" + task.name + " (" + task.leader + ")";
            var participants = task.participants;

            if (participants.length < task.max_participants && task.leader !== user) {
                taskString += "<button style='margin-left:7px;' onclick='signup(\"" + doc.id + "\")'>+</button>";
            }

            if (task.leader === user) {
                taskString += "<button style='margin-left:7px;' onclick='removeTask(\"" + doc.id + "\")'>-</button>";
            }

            taskString += "</h3><table class='table-striped'>";

            for (var i in participants) {
                var participant = participants[i];
                taskString += "<tr><td>" + participant;
                if (participant === user) {
                    taskString += "<button style='margin-left:7px;' onclick='removeSignup(\"" + doc.id + "\")'>-</button>";
                }
                taskString += "</td></tr>";
            }
            taskString += "</table><br>";
        });
    }).then(function() {
        $("#tasks").html(taskString);
    });
}

function signup(id) {
    var task = tasks.doc(id);
    task.get().then(function(doc) {
        var participants = doc.data().participants;
        participants.push(user);
        task.update({ "participants": participants });
    }).then(function() {
        load();
    });
}

function removeSignup(id) {
    var task = tasks.doc(id);
    task.get().then(function(doc) {
        var participants = doc.data().participants;
        participants.splice(participants.indexOf(user), 1);
        task.update({ "participants": participants });
    }).then(function() {
        load();
    });
}

function removeTask(id) {
    tasks.doc(id).delete();
    load();
}

function addTask() {
    var taskName = $("#task-name").val();
    var maxParticipants = parseInt($("#task-participants").val());

    tasks.add({
        "leader": user,
        "max_participants": maxParticipants,
        "name": taskName,
        "participants": []
    });

    load();
}