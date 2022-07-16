'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnscrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////smooth scroll
btnscrollto.addEventListener('click', function (evnt) {
  //prac
  const section1 = document.querySelector('#section--1');
  // console.log(evnt.target.getBoundingClientRect());
  // const s1coords = section1.getBoundingClientRect();
  // console.log(evnt.target.getBoundingClientRect());
  // console.log(s1coords);
  // //current scroll x/y
  // console.log(window.scrollX);
  // console.log(window.scrollY);
  // //height/width of viewport
  // console.log(document.documentElement.clientHeight);
  // console.log(document.documentElement.clientWidth);
  //prac-end

  //implenting scrolling
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1.top); //this y is relative to viewport
  //scrollTo scroll from top of website
  //so we need y=how much we scrolled + what is height of section from viewport

  // window.scrollTo(
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY
  // ); //not smooth

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // }); //smooth

  //modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page Navigation
//without event delegation
//adding same event to all link is unnecessary
//if 10000 links we are creating 10000 functions
// document.querySelectorAll('.nav__link').forEach(navLink => {
//   navLink.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href'); //not this.href
//     if (id !== '#')
//       document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//with delegation (we know event bubbles up)
//event delegation is usefull when child buttons are added dynamically
//1. add event to parent of links
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);
  // console.log(e.currentTarget);

  //2. determine which link get clicked
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    //this==nac_links
    const id = e.target.getAttribute('href'); //not this.href
    if (id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/////////////////////

// console.log(tabs);
// console.log([...tabs]);
//event delegation on tab container instead of events on each tab
let activeTab = tabs[0];
let activeContent = tabContent[0];
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  if (clicked && clicked !== activeTab) {
    //tab change
    clicked.classList.add('operations__tab--active');
    activeTab.classList.remove('operations__tab--active');
    activeTab = clicked;

    //content change
    activeContent.classList.remove('operations__content--active');
    activeContent = tabContent[+clicked.getAttribute('data-tab') - 1];
    activeContent.classList.add('operations__content--active');
  }
});
/////////////////////
//header fade on hovering link
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(element => {
      if (element !== link) {
        element.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};
// const handleHover = function (e,opacity) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     siblings.forEach(element => {
//       if (element !== link) {
//         element.style.opacity = opacity;
//         logo.style.opacity = opacity;
//       }
//     });
//   }
// };
const nav = document.querySelector('.nav');
/////
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);//handleHover(e, opacity)
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);//handleHover(e, opacity)
// });
/////
nav.addEventListener('mouseover', handleHover.bind(0.5)); //this=0.5
nav.addEventListener('mouseout', handleHover.bind(1)); //this=1
/////////////////////
//sticky header
//way 1
// window.addEventListener('scroll', function (evnt) {
//   //bad for performance as it fires for every scroll
//   // console.log(evnt);
//   // console.log(window.scrollX);
//   // console.log(window.scrollY);xx
//   const s1Coords = document
//     .querySelector('#section--1')
//     .getBoundingClientRect();
//   console.log(window.scrollY, s1Coords.top);
//   if (s1Coords.top <= 0) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
//way 2
//intersection Observer
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries, observer) {
  // entries.forEach(entry => console.log(entry));
  const [entry] = entries;
  // console.log(entry);
  // console.log(entries);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOptions = {
  root: null,
  threshold: [0],
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);
/////////////////////
//reveal section (slide up)
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //dont observe this section anymore...
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: [0.15],
});
allSection.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});
/////////////////////
// ..lazy image loading
const imgTargets = document.querySelectorAll('img[data-src]'); //images which have property named=data-src
const loadimg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img');//dont remove too early ....what of network of user is slow..it then remove that blur and show our dirty image..instead add event listener that callback ones out quality image is loaded
  entry.target.addEventListener('load', function (evnt) {
    entry.target.classList.remove('lazy-img'); //happen once quality image is fully loaded
  });
  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(loadimg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px', //start loading quality image before it comes to viewport
});
imgTargets.forEach(image => imageObserver.observe(image));
/////////////////////
//slider
//1.put them side by side(currently they are absolute position(out of design [required]) and on top of each other)
//temp code
// document.querySelector('.slider').style.transform =
//   'scale(0.5) translateX(-300px)';
// document.querySelector('.slider').style.overflow = 'visible';
//temp code end
//

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const gotoSlide = function (curSlide = 0) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${(index - curSlide) * 100}%)`;
    });
  };

  //0% 100% 200% 300% => -100% 0% 100% 200%
  const nextSlide = function (e) {
    curSlide++;
    if (curSlide === slides.length) curSlide = 0;
    gotoSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function (e) {
    if (curSlide === 0) curSlide = slides.length;
    curSlide--;
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  //0% 100% 200% 300% [curSlide=0] => -300% -200% -100% 0%
  //-100% 0% 100% 200% [curSlide=1] => 0% 100% 200% 300%
  //-200% -100% 0% 100% [curSlide=2] => -100% 0% 100% 200%
  btnLeft.addEventListener('click', prevSlide);
  //keyboard event >press right and left key
  document.addEventListener('keydown', function (kbrdevnt) {
    // console.log(kbrdevnt);
    if (kbrdevnt.key == 'ArrowLeft') {
      prevSlide();
    } else if ((kbrdevnt.key = 'ArrowRight')) {
      nextSlide();
    }
  });
  //dots
  const dotConatiner = document.querySelector('.dots');
  function createDots() {
    slides.forEach((_, index) => {
      const dot = `<button class="dots__dot" data-slide="${index}"></button>`;
      dotConatiner.insertAdjacentHTML('beforeend', dot);
    });
  }

  function activateDot(slide = 0) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  //event delegation
  // let activeDot = document.querySelector('button[data-slide]');
  // console.log(activeDot);
  dotConatiner.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log(e.target.dataset);
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });

  const init = function () {
    //0% 100% 200% 300%
    gotoSlide();
    createDots();
    activateDot(); //defaults
  };
  init();
};
slider();

///////////////////
document.addEventListener('DOMContentLoaded', function (evnt) {
  //html and js to load
  console.log('HTML and js loaded');
  console.log(evnt);
});
window.addEventListener('load', function (e) {
  console.log('img html css js etc loaded fully', e);
});
window.addEventListener('beforeunload', function (e) {
  //before a user leave a page
  e.preventDefault();
  console.log(e);
});
///////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////practice///////////////////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

//Note htmlCollection is live collection it changes live when itms are added or deleted
//but nodelist is static
// const allsections = document.querySelectorAll('.section');
// console.log(allsections);
// const section1 = document.getElementById('section--1');
// console.log(section1);
// const section11 = document.getElementsByClassName('section'); //getElement(s)
// console.log(section11);
// const allbuttons = document.getElementsByTagName('button');
// console.log(allbuttons);
////////////////////////////////creating and inserting the element
// const header = document.querySelector('.header');
// const message = document.createElement('div'); //not in dom right now
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookies for imporved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for imporved functionality and analytics.<button class="btn btn--close-cookie">Got it</button>';
// // header.prepend(message);
// // header.append(message); //not two copies as html collection is live and it just move the element(preappend) from top to bottom(append)

// //two copies
// // header.prepend(message);
// // header.append(message.cloneNode(true)); //two copies inserted as both are not same

// header.append(message); //inside header
// // header.before(message); //before header (not inside)
// // header.after(message); //after header (not inside)

// //removing on click
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove(); //remove itself
//     //or
//     message.parentElement.removeChild(message);
//   });
////////////////////////////////
// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for imporved functionality and analytics.<button class="btn btn--close-cookie">Got it</button>';
// header.append(message); //inside header
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove(); //remove itself
//   });

// //styling cookies
// message.style.backgroundColor = '#37383d'; //set inline style
// console.log(message.style.height); //only return height if height is set in inline style
// console.log(message.style.backgroundColor); //only return height if height is set in inline style
// //to get css styles
// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// console.log(getComputedStyle(message).color);
// //
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// //css variables
// document.documentElement.style.setProperty('--color-primary', 'orangered');
// //attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// //setting attributes
// logo.setAttribute('designer', 'vishnu kumar');
// //read non standart attri
// console.log(logo.designer); //wont work
// console.log(logo.getAttribute('designer')); //will work
// //see diff
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// //see diff
// const link = document.querySelector('.twitter-link');
// console.log(link.href);
// console.log(link.getAttribute('href'));
// const linkk = document.querySelector('.nav__link--btn');
// console.log(linkk.href);
// console.log(linkk.getAttribute('href'));
// //data attribut->special attributes
// console.log(logo.dataset); //a-b =>aB
// //setting property
// // logo.classList.add('a', 'b');
// // logo.className = 'abc'; //overright all classes with this(dont use)
// // console.log(logo.classList.contains('abc'));
// // console.log(logo.classList.contains('a'));//false
// /////////
// // logo.classList.add('abc');
// // logo.classList.remove('abc');
// // logo.classList.toggle('abc');
// // console.log(logo.classList.contains('abc'));
// /////////
/////////
//by using addEventListener we can add multiple events to an element
//but in old way we override the prev event
//by using addEventListener we can remove event
// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function (evnt) {
//   alert('you are reading h1');
// });

//or
//old way
// const h1 = document.querySelector('h1');
// h1.onmouseenter = function (e) {
//   alert('you are reading h1');
// };

//or (do not use)
/*
in html element do <button onclick="...">
*/

//removing event
// const h1 = document.querySelector('h1');
// const alerth1 = function (evnt) {
//   alert('you are reading h1');
//   h1.removeEventListener('mouseenter', alerth1);
// };
// h1.addEventListener('mouseenter', alerth1);

// const h1 = document.querySelector('h1');
// const alerth1 = function (evnt) {
//   alert('you are reading h1');
// };
// h1.addEventListener('mouseenter', alerth1);
// setTimeout(() => {
//   console.log('ok');
//   h1.removeEventListener('mouseenter', alerth1);
// }, 5000);
//////////////////capturing and Bubbling
/*
whenever we apply event listener it starts capturing from dom->dom element to the tartget
then that even is applied on target
then it start bubbling up again to dom
while bubbling if there are events on parent they are applied as well

we generally do not apply event while capturing but we can if we set third para to addEventListener as true
*/
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// // console.log(randomColor());
// document.querySelector('.nav').addEventListener('click', function (e) {
//   // console.log(`nav :${e.target} `); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // console.log(`nav__links :${e.target} `); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // console.log(`nav__link :${e.target}`); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);

//   this.style.backgroundColor = randomColor();
// });
////////stop propogation
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// // console.log(randomColor());
// document.querySelector('.nav').addEventListener('click', function (e) {
//   // console.log(`nav :${e.target} `); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // console.log(`nav__links :${e.target} `); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // console.log(`nav__link :${e.target}`); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);
//   this.style.backgroundColor = randomColor();

//   //stop prop
//   e.stopPropagation(); //do not bubble(not a good idea but sometimes required)
// });
//apply events while capturing
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// // console.log(randomColor());
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     // console.log(`nav :${e.target} `); //see order
//     console.log(e.target); //check target
//     console.log(e.currentTarget); //check target
//     console.log(e.currentTarget === this);
//     this.style.backgroundColor = randomColor();
//   },
//   true //listen only while capturing not while bubbling
// );
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // console.log(`nav__links :${e.target} `); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);
//   this.style.backgroundColor = randomColor();
// }); //third para false by default->apply while bubbling
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // console.log(`nav__link :${e.target}`); //see order
//   console.log(e.target); //check target
//   console.log(e.currentTarget); //check target
//   console.log(e.currentTarget === this);
//   this.style.backgroundColor = randomColor();
// });
///////////////////////Dom traversing
// const h1 = document.querySelector('h1');

// //going downwards :child
// console.log(h1.querySelectorAll('.highlight')); //only children
// console.log(h1.childNodes); //all childs(deep)
// console.log(h1.children); //liveCollection ->direct childs
// console.log(h1.firstChild);
// console.log(h1.firstElementChild);
// // h1.firstElementChild.style.backgroundColor = 'green';
// console.log(h1.lastChild);
// console.log(h1.lastElementChild);
// //going upwards :parents
// console.log(h1.parentNode);
// console.log(h1.parentElement); //direct parent👍
// console.log(h1.closest('.header'));
// // h1.closest('.header').style.background = 'var(--gradient-secondary)';
// console.log(h1.closest('h1')); //itself

//goind sideways : siblings
// const h1 = document.querySelector('h1');
// console.log(h1.nextSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousElementSibling);
// console.log(h1.parentElement.childElementCount);
// console.log(h1.parentElement.children); //html collection
// [...h1.parentElement.children].forEach(function (e) {
//   if (e !== h1) e.style.transform = 'scale(0.5)';
// });
////////////////////////////practice-end////////////////////////////
