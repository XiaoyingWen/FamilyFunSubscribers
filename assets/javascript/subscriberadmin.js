/* global firebase moment */
// Steps to complete:

// 1. Get config info
// 2. Initialize Firebase
// 2. Dynamically display the subscriber list based on the current records in the database 

var database = null;
var config = null;

function getDBconnInfo(){
  $.getJSON('firebase.json', function (data) {
    config = data.config;
  })
    .fail(function(err) {
      console.log("err");
      console.log(err.responseText);
    });
}

//Initialize Firebase
function initDB(){
  firebase.initializeApp(config);
  database = firebase.database();
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
  //need to make sure all the functions can only
  //start after env config info been received
  $.ajaxSetup({
    async: false
  });

  //Get config info for db connection
  getDBconnInfo();
  $.ajaxSetup({
      async: true
  });

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
  });
});