/* Client */
(function() {
    'use strict';

    let activeTab = null;
    let storedImages = [];
    let selectedImage = null;
    let pageIndex = 0;

    window.onload = getActiveTabInfo().then(res => {
        activeTab = res[0];
        console.log('CURRENT ACTIVE TAB -> ', activeTab);
        __init__();
    });

    function __init__() {
        addScriptToPage(activeTab);

        $('#reload-btn').on('click', () => {
            addScriptToPage();
        });

        $('.btn.next-btn').on('click', () => {
            pagenator('next');
        });

        $('.btn.prev-btn').on('click', () => {
            pagenator('prev');
        });
    }



    /* RESPONSER */
    chrome.extension.onMessage.addListener((request, sender) => {
        if (request.func === 'imageCollector') {
            bindImageToDOM(request, sender);
        }
    });



    /* CONTENT SCRIPT */
    function addScriptToPage() {
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
        hideEmptyPage();
        if(request.data.length < 1) {
            showEmptyPage();
            return false;
        }

        storedImages = request.data;
        selectedImage = request.data[0];

        let data = request.data;
        const $imagePreviewElement = $('.image-previewer');
        const $sliderElement = $('.slick-nav');

        data.forEach((v, i) => {
            if(v.thumbnail) {
                const NAV_DOM = $('<li/>').css({
                    'background-image': 'url('+ v.thumbnail +')'
                });
                const PREVIEW_DOM = $('<div/>',{ class: 'image-wrapper' });
                const PREVIEW_IMG_DOM = $('<img/>', { src: v.url });

                PREVIEW_DOM.append(PREVIEW_IMG_DOM);
                $imagePreviewElement.append(PREVIEW_DOM);
                $sliderElement.append(NAV_DOM);
            }
        });

        $imagePreviewElement.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.slick-nav',
            dots: false
        });

        $sliderElement.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.image-previewer',
            centerMode: true,
            cssEase: 'ease-in-out',
            easing: 'ease-in-out',
            focusOnSelect: true,
            dots: false,
            lazyLoad: 'ondemand'
        }).on('afterChange', changeSelectedImg);
    }

    function changeSelectedImg(event, slick, currentSlide) {
        selectedImage = storedImages[currentSlide];
    }

    function pagenator(direction) {
        if(direction === 'next') pageIndex++;
        else if(direction === 'prev' && pageIndex > 0) pageIndex--;
        console.log(direction, pageIndex);

        const $pages = $('.page');
        $pages.each((index, element) => {
            if($(element).data('index') !== pageIndex) $(element).hide();
            else $(element).show();
        });
    }

    function showEmptyPage() {
        $('#container').hide();
        $('#empty-page').show();
        $('footer').hide();
    }

    function hideEmptyPage() {
        $('#container').show();
        $('#empty-page').hide();
        $('footer').show();
    }
})();
