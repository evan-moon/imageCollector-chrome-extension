'use strict';

chrome.extension.onMessage.addListener((request, sender) => {
    if (request.action == "getImages") {
        let images = request.source;
        console.log(images.length);
        for(var i = 0; i < images.length; i++) {
            if(images[i].length < 1) continue;

            let _DOM = document.createElement('li');
            _DOM.style.backgroundImage = "url("+images[i]+")";

            document.getElementById('target').appendChild(_DOM);
        }
    }
});

function onWindowLoad() {
    chrome.tabs.executeScript(null, { // 현재 실행중인 웹페이지에 스크립트 주입
        file: "scripts/contentscript.js"
    }, () => {
            if (chrome.extension.lastError) {
                document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
            }
        });
}
window.onload = onWindowLoad;
