'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const overlayMobile = document.querySelector('.mobile-overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLinksContainer = document.querySelector('.nav__links');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const featureImages = document.querySelectorAll('img[data-src]');

// Modal window
const openModal = () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Cookie message
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'We use cookies to improve performance';
message.innerHTML += '<button class="btn btn--close-cookie">OK</button>';
header.after(message);
const btnCloseCookie = document.querySelector('.btn--close-cookie');
btnCloseCookie.addEventListener('click', () => {
    message.remove();
});

// Page navigation
// Smooth scroll to 1st section
btnScrollTo.addEventListener('click', () => {
    section1.scrollIntoView({behavior: 'smooth'});
});

// Smooth scroll with event delegation
navLinksContainer.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('nav__link') && !e.target.classList.contains('nav__link--btn')) {
        const id = e.target.getAttribute('href'); // #section--n
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
});

// Navigation links fade animation
const changeNavOpacity = function (e) {
    if (!e.target.classList.contains('nav__link')) return;

    // select all links, not navItems
    const siblings = [...navLinksContainer.querySelectorAll('.nav__link')];
    siblings.forEach(link => {
        if (link !== e.target && !link.classList.contains('nav__link--btn')) link.style.opacity = this;
    });
};
navLinksContainer.addEventListener('mouseover', changeNavOpacity.bind(0.5));
navLinksContainer.addEventListener('mouseout', changeNavOpacity.bind(1));

// Sticky navigation with Intersection Observer API
// запоминаем высоту nav
const navHeight = nav.getBoundingClientRect().height;
const stickNav = (entries) => {
    const [entry] = entries; // достаем первый элемент из массива, тк у нас всего 1 вхождение (порог - threshold: 0)
    // добавляем класс, когда header не пересекается с вьюпортом
    if (!entry.isIntersecting) nav.classList.add('sticky'); else nav.classList.remove('sticky');
}
const obsOptionsHeader = {
    root: null, // элемент, который пересекается с target element (header), null = viewport
    threshold: 0, // процент пересечения root с target element
    rootMargin: `-${navHeight}px`,
}

const observerHeader = new IntersectionObserver(stickNav, obsOptionsHeader);
observerHeader.observe(header);

// Mobile navigation

let isMobile = window.matchMedia('only screen and (max-width: 61.25em)').matches;
if (isMobile) {
    const btnMobileNavEl = document.querySelector('.btn-mobile-nav');

    btnMobileNavEl.addEventListener('click', () => {
        overlayMobile.classList.remove('hidden');
        nav.classList.toggle('nav-open');
    });

    overlayMobile.addEventListener('click', function () {
        this.classList.add('hidden');
        nav.classList.remove('nav-open');
    });
}

// Reveal sections
const revealSection = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};
const observerSections = new IntersectionObserver(revealSection, {root: null, threshold: 0.2});
// скрываем все секции и добавляем Observer на каждую
sections.forEach(section => {
    section.classList.add('section--hidden');
    observerSections.observe(section)
});

// Lazy loading images
const loadFullImg = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    // replace src with data-src
    entry.target.setAttribute('src', entry.target.dataset.src);

    // wait before the image is loaded to remove blur filter
    entry.target.addEventListener('load', function () {
        this.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const observerImgs = new IntersectionObserver(loadFullImg, {root: null, threshold: 0, rootMargin: '200px'});
featureImages.forEach(img => {
    observerImgs.observe(img);
});

// Tabbed Component
tabContainer.addEventListener('click', function (e) {
    // e.target.closest, тк клик может быть на дочернем span, а не на button
    const clickedBtn = e.target.closest('.operations__tab');

    if (!clickedBtn) return; // если кликнули не на кнопку, то выходим из функции

    // Remove active classes then add active class to clicked button
    tabs.forEach(tabBtn => {
        tabBtn.classList.remove('operations__tab--active');
        document.querySelector(`.operations__content--${tabBtn.dataset.tab}`)
            .classList.remove('operations__content--active');
    });

    clickedBtn.classList.add('operations__tab--active');
    document.querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
        .classList.add('operations__content--active');
});

// Slider component
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const sliderBtnLeft = document.querySelector('.slider__btn--left');
    const sliderBtnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    /**
     * @param {number} slideNumber zero-based
     */
    const goToSlide = (slideNumber) => {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - slideNumber)}%)`;
        });
    };

// position slides side by side
    goToSlide(0);

    const goToNextSlide = () => {
        if (curSlide === maxSlide - 1) curSlide = 0; else curSlide++;

        goToSlide(curSlide);
        highlightActiveDot(curSlide);
    };

    const goToPrevSlide = () => {
        if (curSlide === 0) curSlide = maxSlide - 1; else curSlide--;

        goToSlide(curSlide);
        highlightActiveDot(curSlide);
    };

    sliderBtnRight.addEventListener('click', goToNextSlide);
    sliderBtnLeft.addEventListener('click', goToPrevSlide);

// arrow keys navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPrevSlide(); else if (e.key === 'ArrowRight') goToNextSlide();
    });

// dots navigation
    dotContainer.addEventListener('click', (e) => {
        if (!e.target.classList.contains('dots__dot')) return;

        curSlide = +e.target.dataset.slide;
        goToSlide(curSlide);
        highlightActiveDot(curSlide);
    });
    const highlightActiveDot = (slide) => {
        document.querySelectorAll('.dots__dot').forEach(d => {
            if (+d.dataset.slide === slide) d.classList.add('dots__dot--active'); else d.classList.remove('dots__dot--active');
        });
    };
};
slider();



