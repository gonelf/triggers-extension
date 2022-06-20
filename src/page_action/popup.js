// functions

// comms with background
var port = chrome.extension.connect({
     name: "Sample Communication"
});
port.onMessage.addListener(function(msg) {
     console.log("message recieved: " + msg);
});

function login() {
  port.postMessage("login");
}

function edit (){
  port.postMessage("edit");
}


// console.log(localStorage.getItem("triggers_user"));
if (localStorage.getItem("triggers_user")) {
  $("#login").hide();
  $("#edit").show();
  $("#test").show();
}
else {
  $("#login").show();
  $("#edit").hide();
  $("#test").hide();
}

$("#login").click(()=>{
  login();
})

$("#edit").click(()=>{
  edit();
})
