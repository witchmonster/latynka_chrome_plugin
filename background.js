"use strict";

var latynkaTranslationModes = ['translate', 'disabled'];

// chrome.action.onClicked.addListener(function (tab) {

//   console.log('old latynkaTranslationMode: ' + localStorage['latynkaTranslationMode']);

//   // rotate the translation mode
//   var currentMode = localStorage['latynkaTranslationMode'];
//   var currentModeIndex = latynkaTranslationModes.indexOf(currentMode);
//   if (currentModeIndex < 0) currentModeIndex = 0;
//   currentModeIndex = (currentModeIndex + 1) % latynkaTranslationModes.length;
//   currentMode = latynkaTranslationModes[currentModeIndex];
//   localStorage['latynkaTranslationMode'] = currentMode;

//   console.log('new latynkaTranslationMode: ' + localStorage['latynkaTranslationMode']);

//   chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
//     chrome.tabs.reload(arrayOfTabs[0].id);
//   });

// });

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   switch (message.method) {
//     // ...
//     case "getLocalStorage":
//       if (message.key) { // Single key provided
//         sendResponse({ data: localStorage[message.key] });
//       }
//       else if (message.keys) { // An array of keys requested
//         var data = {};
//         message.keys.forEach(function (key) { data[key] = localStorage[key]; })
//         sendResponse({ data: data });
//       }
//       break;
//     // ...
//   }
// });
