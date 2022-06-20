// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
var enable=false;
var main_page = "https://9c56-79-169-178-176.eu.ngrok.io/";


function goto_login() {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.create({"url":  main_page+"?ref="+tabs[0].url});;
  });
}

function handler(evt) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, evt, config => {
      console.log(config);
      // do something with config
    });
  });
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  }
);

function handle_popup_comms (msg) {
  // if (msg == "edit") {
  switch (msg) {
    case "edit":
      enable = enable ? false : true;
      if(enable){
       //turn on...
       // chrome.browserAction.setIcon({ path: 'icon.png' });
       page_edit_on();
      }else{
       //turn off...
       // chrome.browserAction.setIcon({ path: 'disable.png'});
       page_edit_off();
      }
      break;

      case "login":
        goto_login();
        break;
    default:

  }

  // }
}

// communicate with mainPopup
chrome.extension.onConnect.addListener(function(port) {
     handler("Connected .....");
     port.onMessage.addListener(function(msg) {
          handler("message recieved: " + msg);
          port.postMessage("Hi Popup.js");
          handle_popup_comms(msg);
     });
})


function getCookie(domain, name, callback) {
  chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
    // handler("get cookie")
    // handler(cookie);
      if(callback) {
          callback(cookie);
      }
  });
}

function page_edit_off(){
  chrome.browserAction.setBadgeText({ text: '' });
  handler("page_edit_off");
}

function page_edit_on (){
  chrome.browserAction.setBadgeText({ text: 'ON' });
  handler("page_edit_on");
}


page_edit_off();
chrome.browserAction.onClicked.addListener(function (tab) {
 enable = enable ? false : true;
 if(enable){
  //turn on...
  // chrome.browserAction.setIcon({ path: 'icon.png' });
  page_edit_on();
 }else{
  //turn off...
  // chrome.browserAction.setIcon({ path: 'disable.png'});
  page_edit_off();
 }
});

function check_login(){
  handler("check login");
  const domain = "https://9c56-79-169-178-176.eu.ngrok.io";

  getCookie(domain, "triggers_user", function(cookie) {
      // handler(cookie);
      var key = "triggers_user";
      // handler(cookie ? "yes" : "no");
      if (cookie) {
          var value = JSON.parse(cookie.value);
          localStorage.setItem(key, value);
      }
      else {
        localStorage.removeItem(key);
      }
  });
}


setInterval(()=>{
  check_login();
  handler(tab_url());
}, 1000);
