/* Client */
(function() {
    'use strict';

    let activeTab;
    window.onload = getActiveTabInfo().then(res => {
        activeTab = res[0];
        console.log('CURRENT ACTIVE TAB -> ', activeTab);
        __init__();
    });

    function __init__() {
        addScriptToPage(activeTab);
    }



    /* RESPONSER */
    chrome.extension.onMessage.addListener((request, sender) => {
        if (request.func === 'imageCollector') {
            bindImageToDOM(request, sender);
        }
    });



    /* CONTENT SCRIPT */
    function addScriptToPage() {
        // 현재 실행중인 웹페이지에 스크립트 주입
        let scriptName = '';
        if(activeTab.url.indexOf('google') > -1) scriptName = 'googleImagecollector.js';
        else scriptName = 'imageColålector.js';

        chrome.tabs.executeScript(null, {
            file: 'scripts/contentScripts/' + scriptName
        }, () => {
            if (chrome.extension.lastError) {
                document.body.innerText = 'There was an error injecting script : ' + chrome.extension.lastError.message;
            }
        });
    }



    /* METHOD */
    function getActiveTabInfo() {
        const chromePromise = new ChromePromise();
        return chromePromise.tabs.query({
            'active': true,
            'windowId': chrome.windows.WINDOW_ID_CURRENT
        });
    }

    function bindImageToDOM(request, sendor) {
        let data = request.data;

        data.forEach((v, i) => {
            console.log(v, v.thumbnail);
            if(v.thumbnail) {
                const DOM = $('<li/>').css({
                    'background-image': 'url('+ v.thumbnail +')'
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
