// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  }
);

function handler(evt) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, evt, config => {
      console.log(config);
      // do something with config
    });
  });
}

function page_edit_off(){
  chrome.browserAction.setBadgeText({ text: '' });
  handler("page_edit_off");
}

var enable=false;
page_edit_off();
chrome.browserAction.onClicked.addListener(function (tab) {
 enable = enable ? false : true;
 if(enable){
  //turn on...
  // chrome.browserAction.setIcon({ path: 'icon.png' });
  chrome.browserAction.setBadgeText({ text: 'ON' });
  handler("page_edit_on");
 }else{
  //turn off...
  // chrome.browserAction.setIcon({ path: 'disable.png'});
  page_edit_off();
 }
});

chrome.cookies.get({ url: '/', name: 'triggers_user' },
  function (cookie) {
    if (cookie) {
      console.log(cookie.value);
    }
    else {
      console.log('Can\'t get cookie! Check the name!');
    }
});
