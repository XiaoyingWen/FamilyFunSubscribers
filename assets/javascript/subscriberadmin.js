/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Dynamically display the subscriber list based on the current records in the database 

var database = null;

//Initialize Firebase
function initDB(){
  var config = {
    apiKey: "AIzaSyCDS7biKyndh6lJJOExBSm36xvrde87-7g",
    authDomain: "supportusers-90f71.firebaseapp.com",
    databaseURL: "https://supportusers-90f71.firebaseio.com",
    projectId: "supportusers-90f71",
    storageBucket: "supportusers-90f71.appspot.com",
    messagingSenderId: "895161493012"
  };

  firebase.initializeApp(config);
  database = firebase.database();

  /*$.getJSON('firebase.json', function (data) {
      console.log('gotJSON');
    console.log(data);

  })
    .fail(function(err) {
        console.log("err");
      console.log(err.responseText);
    })*/
}

//refresh subscriber list upon record been added in DB
function addDBAddListener(){
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  var recordKey = childSnapshot.key;
  var email = childSnapshot.val().email;
  var username = childSnapshot.val().username;
  var zipcode = childSnapshot.val().zipcode;

  // Add each subscriber data into the table
  $("#subscriber-table > tbody").append("<tr id='" + recordKey + "'> <td>" + email + "</td><td>" 
      + username + "</td><td>" + zipcode + "</td></tr>");
  });
}

$(document).ready(function(){
  //Initialize Firebase
  initDB();

  //fill the schedule dashboard with info from DB AND
  //add DB listener for subscriber been added 
  addDBAddListener();

  //add DB listener for zipcode been changed
  database.ref().on('child_changed', function(ChildSnapshot) {
    //delete table row for the removed record
    $('td:eq(2)', $('#'+ChildSnapshot.key)).text(ChildSnapshot.val().zipcode);
  });

  //add DB listener for subscriber been removed
  database.ref().on('child_removed', function(oldChildSnapshot) {
    //delete table row for the removed record
    $('#'+oldChildSnapshot.key).remove();
    console.log("removed:" + oldChildSnapshot.key);
  });
});