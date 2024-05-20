let mainCanvas;
const numLasers = 50;
const tail = 400;
const canvas = document.querySelector(".main_visual_canvas");
const ctx = canvas.getContext("2d");

// 비 생성 함수
const createLasers = n => {
  const lasers = [];
  for (let i = 0; i < n; ++i) {
    lasers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 1 + 0.5 // 레이저의 속도를 0.5에서 1.5 사이의 임의의 값으로 설정
    });
  }
  return lasers;
};

// 레이저 그리기 함수
const renderLaser = l => {
  const grad = ctx.createLinearGradient(l.x, l.y, l.x + tail, l.y + tail); // 왼쪽 위에서 오른쪽 아래로 그라데이션 설정
  const a = 1 - (canvas.height - l.y) / canvas.height * 1;
  grad.addColorStop(0, `hsla(340,100%,100%,${a})`);
  grad.addColorStop(1, "hsla(340,100%,50%,0)");
  ctx.strokeStyle = grad;
  ctx.beginPath();
  ctx.moveTo(l.x, l.y);
  ctx.lineTo(l.x + tail, l.y + tail);
  ctx.stroke();
};

// 레이저 업데이트 함수
const updateLaser = l => {
  l.x += l.s; // x축 이동
  l.y += l.s; // y축 이동
  if (l.y > canvas.height || l.x > canvas.width) {
      // 레이저가 캔버스를 벗어나면 다시 상단에서 나타나도록 설정
      l.y = -Math.random() * canvas.height;
      l.x = Math.random() * canvas.width;
  }
};

// 애니메이션 렌더링 함수
const render = lasers => {
  ctx.fillStyle = "hsl(261,43%,7%)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let l of lasers) {
      renderLaser(l);
      updateLaser(l);
  }
  mainCanvas = requestAnimationFrame(() => render(lasers));
};

// 초기화 함수
const cavasInit = () => {
  cancelAnimationFrame(mainCanvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render(createLasers(numLasers));
};

// 윈도우 리사이즈 이벤트 핸들러 등록
window.onresize = cavasInit;

// 초기화 함수 호출
cavasInit();

$(function() {

  AOS.init({
    duration: 1000
  });

  $('img[usemap]').rwdImageMaps()
})

const select = (e) => document.querySelector(e)
const selectID = (e) => document.getElementById(e)
const selectAll = (e) => document.querySelectorAll(e)

const container = document.body


const firstSectionContent = document.querySelector('.first-section-content')
const firstSection = document.querySelector('.first-section')
const mainSection = document.querySelector('.main-main-section')
const mainSectionSlide = document.querySelector('.main-section-visual')

let maxHeight
let isMovingIntro = false
let isRadiusOnce = false
let newPosition = 0
let upCount = 0
let downCount = 0
let scrollDirection
let isShowLoading = true
const prevSpace = window.innerHeight / 2
let isOnceStoryFirst = true
let isOnceStorySecond = true
let isOnceThird = true
let isOnceSecond = true
let isOnceBetween = true
let isOnceFourth = true


const aboutLine = select('.story-title-line')
const storyDescriptionName = select('.section-title-description')
const storyTitleName = select('.section-title-text')
const loadingScreen = select('.js-loading')
const header = select('.js-header')
const introPattern1 = select('.js-intro-pattern1')
const introPattern2 = select('.js-intro-pattern2')
const introPattern3 = select('.js-intro-pattern3')
const introPattern4 = select('.js-intro-pattern4')
const introText = select('.js-intro-text')
const building = select('.js-building')
const buildingBg = select('.js-building-bg')
const buildingBgBottom = select('.js-building-bg-bottom')
const scrollImg = select('.js-scroll-main')

const parallax1 = select('.js-parallax1')
const parallax2 = select('.js-parallax2')
const parallax3 = select('.js-parallax3')

const environmentText = select('.environment-text')
const environmentCards = select('.environment-list')

const unitContentImg = select('.unit-content-img')
const registerTitle = select('.register-title')
const registerImg = select('.register-img')


const radiusKeyframes = {
  borderTopLeftRadius: ['490px', '0'],
  borderTopRightRadius: ['490px', '0']
}
const reverseRadiusKeyframes = {
  borderTopLeftRadius: ['0', '490px'],
  borderTopRightRadius: ['0', '490px']
}
const animateOption = {
  duration: 2000,
  easing: 'cubic-bezier(0.25,0.74,0.22,0.99)',
  fill: 'forwards'
}



gsap.registerPlugin(ScrollTrigger, SplitText, GSDevTools, CustomEase)
CustomEase.create('myEaseSmooth', '0.33,0,0,1')
CustomEase.create('myEaseSwift', 'M0,0 C0.89,0 0.11,1 1,1')

gsap.config({ nullTargetWarn: false })

function setAnimation () {
  gsap.set(header, { y: -100, autoAlpha: 0  } )
  gsap.set(introPattern1, {  autoAlpha: 0  } )
  gsap.set(introPattern2, {  autoAlpha: 0  } )
  gsap.set(introPattern3, {  autoAlpha: 0  } )
  gsap.set(introPattern4, {  autoAlpha: 0  } )

  gsap.set(buildingBg, { yPercent: 100, autoAlpha: 0 })
  gsap.set(building, { autoAlpha: 0 })
  gsap.set(mainSection, { display: 'none', autoAlpha: 0 })
  gsap.set(mainSectionSlide, { autoAlpha: 0 })
}

function loadingScreenReveal () {

  gsap.set(loadingScreen, { display: 'flex', autoAlpha: 1 })
  gsap.set(container, {  overflow: 'hidden'  } )
  const tl = gsap.timeline({ defaults: { duration: 1.34, ease: 'myEaseSmooth' } })

  tl.to(loadingScreen, { display: 'none', autoAlpha: 0 }, '<2')
  tl.to(header, { display: 'block', autoAlpha: 1, y: 0, stagger: 0.03 }, '<')
  tl.to(buildingBg, { yPercent: 0, autoAlpha: 1 }, '<')
  tl.to(building, { autoAlpha: 1 })
  tl.to(scrollImg, { yPercent: 0, autoAlpha: 1 }, '<')
  tl.to(introPattern1, { autoAlpha: 1 }, '<.4')
  tl.to(introPattern2, { autoAlpha: 1}, '<.4')
  tl.to(introPattern3, {  autoAlpha: 1 }, '<.4')
  tl.to(introPattern4, {  autoAlpha: 1 }, '<.4')

  tl.to(firstSection, { autoAlpha: 0 }, '<1')
  tl.to(mainSection, { display: 'block', autoAlpha: 1}, '<.5')
  tl.to(mainSection, {  zIndex: 6 }, '<')
  tl.to(mainSectionSlide, { autoAlpha: 1 }, '<')
  tl.set(container, {  overflow: 'auto'  } )

  setTimeout(()=> {
    isShowLoading = false
  },5000)

  return tl
}

function hideFirstMain () {
  const tl = gsap.timeline({ defaults: { duration: 1.34, ease: 'myEaseSmooth' } })

  tl.to(firstSection, { autoAlpha: 0 }, '<')
}

function showMainSection () {
  const tl = gsap.timeline({ defaults: { duration: 1.34, ease: 'myEaseSmooth' } })
  tl.to(mainSection, { display: 'block', autoAlpha: 1})

  tl.to(mainSection, {  zIndex: 6 })
  // tl.to(firstSection, { display: 'none' }, '<')
}


// EVENT HANDLERS
$('.header-gnb-item').click(function() {
  var anchor = $(this).attr('dot');
  $('.header-gnb-item').removeClass('on');
  $(this).addClass('on');
  $('html, body').animate(
    {
      scrollTop: $('#' + anchor).offset().top
    },
    700
  );
});

function scrollMotion() {
  const currentScroll = $(document).scrollTop();
  const infoHeight = $('.main-section-info').offset().top;
  if (infoHeight < currentScroll) {
    $('.main-section-info').addClass('active');
  } else {
  }
}

function scroll (event) {
  console.log(window.scrollY)
  console.log(event)
  if (window.scrollY > 0) {
    hideFirstMain()
    showMainSection()
  }
}
window.addEventListener('load', () => {
  setAnimation()
  loadingScreenReveal()
})

window.addEventListener('scroll', function(){
  scrollMotion()
});

let lastScrollTop =
  window.pageYOffset || document.documentElement.scrollTop;
let firstScroll = true
// window.addEventListener(
//   'scroll',
//   function handleScroll() {
//     const scrollTopPosition =
//       window.pageYOffset || document.documentElement.scrollTop;
//
//     if (scrollTopPosition > lastScrollTop) {
//       console.log('scrolling down');
//       if (firstScroll) {
//         hideFirstMain()
//         showMainSection()
//         console.log('모션');
//         // document.body.style.overflow = 'hidden'
//       } else {
//         console.log('first motion끝')
//         // if (document.body.style.overflow === 'hidden') {
//         //   document.body.style.overflow = 'auto'
//         // }
//       }
//
//
//       firstScroll = false
//
//     } else if (scrollTopPosition < lastScrollTop) {
//       // if (document.body.style.overflow === 'hidden') {
//       //   document.body.style.overflow = 'auto'
//       // }
//       console.log('scrolling up');
//     }
//     lastScrollTop =
//       scrollTopPosition <= 0 ? 0 : scrollTopPosition;
//   },
//   false
// );
$('.js-header-menu-button').on('click', function () {
  $('.js-menu-modal').fadeIn()
})
$('.js-close-menu-button').on('click', function () {
  $('.js-menu-modal').fadeOut()
})



$(function() {
  $('.post-content').hover(function(){
		$(this).parents('.dsn-item-post').addClass('hv');
	}, function(){
		$(this).parents('.dsn-item-post').removeClass('hv');
	})
	setTimeout(() => {
		$('.js-quick-menu').addClass('show')
	},8000)


  function modalHandler () {
    const modalContainer = selectAll('.js-modal-container')
    const modalContent = selectAll('.js-modal-content')
    const body = selectAll('body')
    modalContainer.forEach((container) => {
      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'myEaseSmooth' } })

      container.addEventListener('click', () => {
        const id = container.getAttribute('data-modal-id')
        const targetModal = document.querySelector(`.js-${ id }-modal`)
        tl.to(targetModal, { display: 'flex', autoAlpha: 1})
        tl.to(body, {overflow : 'hidden'})
      })
    })
    modalContent.forEach((content) => {
      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'myEaseSmooth' } })

      const closeButton = content.querySelector('.js-close-button')
      const topButton = content.querySelector('.js-go-top-button')

      if (closeButton) {
        closeButton.addEventListener('click', () => {
          tl.to(content, { display: 'none', autoAlpha: 0 })
          tl.to(body, {overflow : 'auto'})
        })
      }

      if (topButton) {
        topButton.addEventListener('click', () => {
          tl.to(content, { duration: 0.3, scrollTo: { y: 0 } })
        })
      }

    })
  }
  modalHandler()
	$('.sub-btn-wrap').css({'display':'none'})
})



