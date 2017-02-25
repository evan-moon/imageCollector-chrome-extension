
(function() {
    'use strict';

    chrome.extension.onMessage.addListener((request, sender) => {
        if (request.action == 'getImagesFromPage') {
            let images = request.source;
            images.forEach((v, i) => {
                if(v.length > 0) {
                    const DOM = document.createElement('li');
                    DOM.style.backgroundImage = 'url(' + v + ')';
                    $('#image-list').append(DOM);
                }
            });
        }
    });

    function addScriptToPage() { // 현재 실행중인 웹페이지에 스크립트 주입
        chrome.tabs.executeScript(null, {
            file: 'scripts/contentScripts/contentscript.js'
        }, () => {
            if (chrome.extension.lastError) {
                document.body.innerText = 'There was an error injecting script : ${chrome.extension.lastError.message}';
            }
        });
    }
    window.onload = addScriptToPage;
})();
