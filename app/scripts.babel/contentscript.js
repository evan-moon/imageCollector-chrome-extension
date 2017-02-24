'use strict';

console.log('CONTENT SCRIPT IS LOADED');

function getImages(document) {
    console.log(document);
    let images = [];
    let documentImages = [...document.images];
    let limit = { width: 50, height: 50 };

    documentImages.forEach((v, i) => {
        let width = v.clientWidth,
            height = v.clientHeight;
        if(width > limit.width && height > limit.height) images.push(v.src);
    });

    console.log('URL -> ', location.href);
    return images;
}

chrome.extension.sendMessage({ // popup.js로 다시 돌려준다
    action: "getImages",
    source: getImages(document)
});
