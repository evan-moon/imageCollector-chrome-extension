/* Server */
(function() {
    'use strict';

    chrome.runtime.onInstalled.addListener(details => {
        console.log('previousVersion', details.previousVersion);
    });
})();
