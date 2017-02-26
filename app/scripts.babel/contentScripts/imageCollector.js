// IT ONLY FOR GOOGLE NOW

(function() {
    'use strict';

    console.log('CONTENT SCRIPT IS LOADED');

    function getImagesFromPage(document) {
        let images = [];
        let url = location.href;
        let documentImages = [...document.images];
        let limit = {
            min: {
                w: 100,
                h: 100
            },
            max: {
                w: 2000,
                h: 2000
            }
        };

        documentImages.forEach((v, i) => {
            let width = v.clientWidth,
                height = v.clientHeight;
            const wRange = width > limit.min.w && width <= limit.max.w;
            const hRange = height > limit.min.h && height <= limit.max.h;
            if(wRange && hRange) images.push({
                url: decodeURIComponent(v.src),
                origin_w: width,
                origin_h: height,
                type: 'default'
            });
            console.log(width,height, v);
        });

        console.log('URL -> ', location.href);
    }

    chrome.extension.sendMessage({ // popup.js로 다시 돌려준다
        func: 'imageCollector',
        data: getImagesFromPage(document)
    });
})();
