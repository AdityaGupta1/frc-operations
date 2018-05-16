var config = {
    apiKey: "AIzaSyBqgAMXL5NK1q5b7tLK3mzNz1NS2ED_Ohg",
    authDomain: "frc-operations.firebaseapp.com",
    databaseURL: "https://frc-operations.firebaseio.com",
    projectId: "frc-operations",
    storageBucket: "frc-operations.appspot.com",
    messagingSenderId: "580956261000"
};
firebase.initializeApp(config);

const database = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
database.settings(settings);

var taskString = "";

database.collection("tasks").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var task = doc.data();
        taskString += "<h3>" + task.name + " (" + task.leader + ")</h3>"
                + "<table class='table-striped'>";
        for (var i in task.participants) {
            taskString += "<tr><td>" + task.participants[i] + "</td></tr>";
        }
        taskString += "</table><br>";
    });
}).then(function() {
    $("#tasks").html(taskString);
});