
(function() {
    'use strict';

    window.onload = __init__();
    function __init__() {
        addScriptToPage();
    }



    // RESPONSER
    chrome.extension.onMessage.addListener((request, sender) => {
        if (request.func === 'getImagesFromPage') {
            bindImageToDOM(request, sender);
        }
    });



    // CONTENT SCRIPT
    function addScriptToPage() { // 현재 실행중인 웹페이지에 스크립트 주입
        chrome.tabs.executeScript(null, {
            file: 'scripts/contentScripts/imageCollector.js'
        }, () => {
            if (chrome.extension.lastError) {
                document.body.innerText = 'There was an error injecting script : ${chrome.extension.lastError.message}';
            }
        });
    }



    // METHOD
    function bindImageToDOM(request, sendor) {
        let images = request.data;

        images.forEach((v, i) => {
            if(v.length > 0) {
                const DOM = $('<li/>').css({
                    'background-image': 'url('+v+')'
                });
                $('.slick-nav').append(DOM);
            }
        });

        $('.image-previewer').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.slick-nav'
        });

        $('.slick-nav').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            asNavFor: '.image-previewer',
            centerMode: true,
            focusOnSelect: true
        });
    }
})();
