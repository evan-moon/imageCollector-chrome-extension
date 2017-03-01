// IT ONLY FOR GOOGLE NOW

(function() {
    'use strict';

    console.log('CONTENT SCRIPT IS LOADED');

    function getImagesFromPage(document) {
        let images = [];
        let url = location.href;
        let documentImages = [...document.images];
        const limit = {
            min: {
                w: 100,
                h: 100
            }
        };

        documentImages.forEach((v, i) => {
            let width = v.clientWidth,
                height = v.clientHeight;
            let isGIF = /(\.gif|data\:image\/gif\;)/.test(v.src);
            const wRange = width > limit.min.w;
            const hRange = height > limit.min.h;

            if(wRange && hRange && !isGIF) images.push({
                thumbnail: decodeURIComponent(v.src),
                url: decodeURIComponent(v.src),
                origin_w: width,
                origin_h: height,
                type: 'default'
            });
        });

        return images;
    }

    chrome.extension.sendMessage({ // popup.js로 다시 돌려준다
        func: 'imageCollector',
        data: getImagesFromPage(document)
    });
})();
