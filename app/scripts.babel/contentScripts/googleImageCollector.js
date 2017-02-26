// IT ONLY FOR GOOGLE NOW

(function() {
    'use strict';

    console.log('GOOGLE CONTENT SCRIPT IS LOADED');

    function GoogleImageCollector(document) {
        let images = [];
        let documentImages = [...document.getElementsByClassName('ivg-i')];

        documentImages.forEach((v, i) => {
            const originImageURL = v.childNodes[0].href;
            let url = originImageURL.split('?')[1].split('&');
            let temp = {};

            url = url.forEach(vv => {
                vv = vv.split('=');
                temp[vv[0]] = vv[1];
            });

            let thumbnail = v.childNodes[0].childNodes[0].src ?
                v.childNodes[0].childNodes[0].src :
                decodeURIComponent(temp.imgurl);
            console.log(thumbnail);
            if(temp.imgurl) {
                images.push({
                    thumbnail,
                    url: decodeURIComponent(temp.imgurl),
                    refurl: decodeURIComponent(temp.imgrefurl),
                    origin_w: temp.biw,
                    origin_h: temp.bih,
                    type: 'google'
                });
            }
        });

        console.log(images);
        return images;
    }

    chrome.extension.sendMessage({ // popup.js로 다시 돌려준다
        func: 'imageCollector',
        data: GoogleImageCollector(document)
    });
})();
