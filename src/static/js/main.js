import svgForEveryBody from 'svg4everybody';
import Swiper, {Navigation, Grid, Pagination} from 'swiper';
import GLightbox from 'glightbox';
import noUiSlider, {target} from 'nouislider';
import tippy from 'tippy.js';
import SlimSelect from 'slim-select';

require('./plugins/audio-player');
require('./plugins/modal');

// Svg sprites for all
svgForEveryBody();

// Nav toggle
const hamburger = document.querySelector('.header__hamburger');
const navigation = document.querySelector('.header__nav-wrap');
toggleClass(hamburger, navigation);

// Search toggle
const search = document.querySelector('.header__search');
const searchToggle = document.querySelector('.header__search-toggle');
toggleClass(searchToggle, search);

// Toggle class function
function toggleClass(trigger, element) {
    trigger.addEventListener('click', function () {
        trigger.classList.toggle('show');
        element.classList.toggle('show');
    });
}

// Swiper by 6 slides
const swipers_6 = document.querySelectorAll('[data-swiper="6"]');
swipers_6.forEach(function (element) {
    const swiperElement = new Swiper(element, {
        slidesPerView: 1,
        spaceBetween: 12,
        grid: {
            rows: 1,
        },
        modules: [Navigation, Grid],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            600: {
                slidesPerView: 2,
                spaceBetween: 16,
                grid: {
                    rows: 1,
                }
            },
            768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 24,
                grid: {
                    rows: 2,
                }
            },
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 30,
                grid: {
                    rows: 2,
                }
            },
            1400: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 36,
                grid: {
                    rows: 2,
                }
            }
        }
    });
});

// Partners swiper
const partners = new Swiper('[data-swiper="partners"]', {
    slidesPerView: "auto",
    spaceBetween: 32,
    modules: [Navigation, Pagination],
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            spaceBetween: 48,
        },
        1024: {
            spaceBetween: 56,
        },
        1400: {
            spaceBetween: 64,
        }
    }
});

// Toggle text
const toggleLinks = document.querySelectorAll('.js-toggle-link');
toggleLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        const id = link.getAttribute('href');
        const texts = link.querySelectorAll('span');
        const element = document.querySelector(id);
        element.classList.toggle('show');
        texts.forEach(function (text) {
            text.classList.toggle('visually-hidden');
        });
        e.preventDefault();
    });
});

// Lightbox gallery
const lightbox = GLightbox({
    touchNavigation: true,
    autoplayVideos: true,
    descPosition: 'top',
    openEffect: 'fade',
    closeEffect: 'fade'
});

// Accordion
const triggersFilter = document.querySelectorAll('[data-accordion-trigger]');
triggersFilter.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
        trigger.classList.toggle('open');
        trigger.nextElementSibling.classList.toggle('open');
    });
});

// Filter years
const filter = document.querySelector('#filter');
if (filter) {
    const inputFrom = document.querySelector('#years_from');
    const inputTo = document.querySelector('#years_to');
    const years_slider = document.querySelector('#years_slider');

    noUiSlider.create(years_slider, {
        start: [+years_slider.dataset.min, +years_slider.dataset.max],
        connect: true,
        step: +years_slider.dataset.step,
        range: {
            'min': +years_slider.dataset.min,
            'max': +years_slider.dataset.max
        }
    });

    years_slider.noUiSlider.on('update', function (values) {
        inputFrom.value = Math.round(values[0]);
        inputTo.value = Math.round(values[1]);
    });

    inputFrom.addEventListener('change', function () {
        if (this.value < +years_slider.dataset.min) {
            this.value = +years_slider.dataset.min;
        }
        if (this.value > +years_slider.dataset.max) {
            this.value = +years_slider.dataset.max;
        }
        years_slider.noUiSlider.set([this.value, inputTo.value]);
    });

    inputTo.addEventListener('change', function () {
        if (this.value > +years_slider.dataset.max) {
            this.value = +years_slider.dataset.max;
        }
        if (this.value < +years_slider.dataset.min) {
            this.value = +years_slider.dataset.min;
        }
        years_slider.noUiSlider.set([inputFrom.value, this.value]);
    });
}

// Filter toggle
const filterToggleButtons = document.querySelectorAll('.js-filter-toggle');
filterToggleButtons.forEach(function (button) {
    button.addEventListener('click', function (e) {
        let id = this.getAttribute('href') ? this.getAttribute('href') : this.getAttribute('data-href'),
            el = document.querySelector(id);
        el.classList.toggle('show');
        e.preventDefault();
    });
});

// Map full screen
const mapWrap = document.querySelector('#map-wrap');
const mapFullScreenButton = document.querySelector('.js-map-full-screen');
if (mapFullScreenButton) {
    mapFullScreenButton.addEventListener('click', function () {
        let icon = mapFullScreenButton.querySelector('svg use'),
            iconHref = icon.getAttribute('xlink:href');

        if (iconHref.indexOf('full-screen-close') > -1) {
            icon.setAttribute('xlink:href', iconHref.replace('full-screen-close', 'full-screen'));
        } else {
            icon.setAttribute('xlink:href', iconHref.replace('full-screen', 'full-screen-close'));
        }

        mapWrap.classList.toggle('show');
        map.container.fitToViewport();
    });
}

// Tippy
function tippyElements() {
    const tippyElements = document.querySelectorAll('[data-tippy]');
    tippyElements.forEach(function (element) {
        if (element.nextElementSibling) {
            const content = element.nextElementSibling.innerHTML;

            tippy(element, {
                content: content,
                allowHTML: true,
                interactive: true,
                zIndex: 5,
            });
        }
    });
}
tippyElements()

// Select style
const select = document.querySelectorAll('select');
select.forEach(function (item) {
    new SlimSelect({
        select: item,
        showSearch: item.dataset.search ? item.dataset.search : false,
        searchText: "Результатов не найдено",
        searchPlaceholder: "Найти",
        placeholder: true,
    })
});

// Show password
const showPasswordButtons = document.querySelectorAll('.form__eye-button');
showPasswordButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const input = button.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        button.classList.toggle('show');
        input.setAttribute('type', type);
    });
});

// Nav scrolling on profile page
const navProfile = document.querySelector('.lk-nav__wrap');
if (navProfile) {
    const currentItem = navProfile.querySelector('.current');
    navProfile.scrollLeft = currentItem.offsetLeft - 20;
}

// Copy link
const shareCopyButton = document.querySelector('.share__copy');
if(shareCopyButton) {
    shareCopyButton.addEventListener('click', function () {
        let icon = shareCopyButton.querySelector('use'),
            url = icon.getAttribute('xlink:href').replace('link', 'check');
        icon.setAttribute('xlink:href', url);
        copyToClipboard(shareCopyButton.dataset.url);
        shareCopyButton.classList.add('active');
        setTimeout(function () {
            url = icon.getAttribute('xlink:href').replace('check', 'link');
            icon.setAttribute('xlink:href', url);
        }, 3000);
    });
}
// Copy button
const CopyButtons = document.querySelectorAll('.item__number .button--copy');
if(CopyButtons) {
    CopyButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            console.log(button)
            let icon = button.querySelector('use'),
                url = icon.getAttribute('xlink:href').replace('copy', 'check');
            icon.setAttribute('xlink:href', url);
            copyToClipboard(button.dataset.id);
            button.classList.add('active');
            setTimeout(function () {
                url = icon.getAttribute('xlink:href').replace('check', 'copy');
                icon.setAttribute('xlink:href', url);
            }, 3000);
        });
    })
}
function copyToClipboard(url) {
    let aux = document.createElement("input");
    aux.setAttribute("value", url);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}

// Share buttons
const shareButtons = document.querySelectorAll('.share__button');
shareButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
        popupWindow(this.href, this.title, window, 640, 480);
        e.preventDefault();
    });
});
function popupWindow(url, windowName, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - ( h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - ( w / 2);
    return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
}

// Shared
const shareItemButtons = document.querySelectorAll('.js-share')
shareItemButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const url = button.dataset.postUrl;
        if (shareCopyButton) {
            shareCopyButton.dataset.url = url
        }
        shareButtons.forEach(function (item) {
            item.setAttribute('href', item.dataset.href + url)
        })
    })
})

// Open video from map
window.mapVideoOpen = function (el, event) {
    event.preventDefault();

    const lightbox = GLightbox({
        elements: [
            {
                'href': el.href,
                'type': 'video',
                'description' : el.title,
                'descPosition': 'top'
            }
        ],
        touchNavigation: true,
        autoplayVideos: true
    });
    lightbox.open();
}