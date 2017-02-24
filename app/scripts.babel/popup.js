'use strict';

chrome.extension.onMessage.addListener((request, sender) => {
    if (request.action == 'getImages') {
        let images = request.source;
        images.forEach((v, i) => {
            if(v.length < 1) return false;
            console.log(v);
            const DOM = document.createElement('li');
            DOM.style.backgroundImage = 'url(${v})';
            document.getElementById('target').appendChild(DOM);
        });
    }
});

function onWindowLoad() {
    chrome.tabs.executeScript(null, { // 현재 실행중인 웹페이지에 스크립트 주입
        file: 'scripts/contentscript.js'
    }, () => {
        if (chrome.extension.lastError) {
            document.body.innerText = 'There was an error injecting script : ${chrome.extension.lastError.message}';
        }
    });
}
window.onload = onWindowLoad;
