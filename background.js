"use strict";

var latynkaTranslationModes = ['translate', 'disabled'];

chrome.action.onClicked.addListener(function (tab) {

    // rotate the translation mode
    chrome.storage.local.get('latynkaTranslationMode').then((currentMode) => {
        currentMode = currentMode.latynkaTranslationMode;
        var currentModeIndex = latynkaTranslationModes.indexOf(currentMode);
        if (currentModeIndex < 0) currentModeIndex = 0;
        currentModeIndex = (currentModeIndex + 1) % latynkaTranslationModes.length;
        currentMode = latynkaTranslationModes[currentModeIndex];
        // console.error(JSON.stringify(currentMode));
        chrome.storage.local.set({ 'latynkaTranslationMode': currentMode }).then(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
                chrome.tabs.reload(arrayOfTabs[0].id);
            });
        });
        chrome.action.setIcon({
            path: currentMode == 'disabled' ? "images/icon_invert.png" : "images/icon.png"
        });
    });

});