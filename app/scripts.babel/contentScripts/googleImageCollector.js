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
            const limit = {
                min: {
                    w: 100,
                    h: 100
                }
            };

            url = url.forEach(vv => {
                vv = vv.split('=');
                temp[vv[0]] = vv[1];
            });

            temp.imgurl = decodeURIComponent(temp.imgurl);
            temp.imgrefurl = decodeURIComponent(temp.imgrefurl);

            let thumbnail = v.childNodes[0].childNodes[0].src ?
                v.childNodes[0].childNodes[0].src :
                temp.imgurl;
            let isGIF = /(\.gif)/.test(temp.imgurl);
            if(isGIF) console.log(temp.imgurl, i);

            if(temp.imgurl !== 'undefined' && !isGIF) {
                images.push({
                    thumbnail,
                    url: temp.imgurl,
                    refurl: temp.imgrefurl,
                    origin_w: temp.biw,
                    origin_h: temp.bih,
                    type: 'google'
                });
            }
        });

        return images;
    }

    chrome.extension.sendMessage({ // popup.js로 다시 돌려준다
        func: 'imageCollector',
        data: GoogleImageCollector(document)
    });
})();
