$(document).ready(function() {

  function BusinessSlide () {
    var businessSwiper = new Swiper('.business-swiper-container', {
      slidesPerView: 1.89,
      navigation: { nextEl: '.business-swiper-container .swiper-button-next', prevEl: '.business-swiper-container .swiper-button-prev' },
			pagination: { el: '.business-swiper-container .visual-swiper-pagination', type: 'progressbar', clickable: true },
      loop: true,
      centeredSlides: true,
      spaceBetween: 50,
      loopedSlides: 4,
      autoHeight: false,
      autoplay: { delay: 5000, disableOnInteraction: !1 },
      on: {
        init: function () {
          var slideLength = this.slides.length - 8
          $('.js-swiper-pagination-total').text(slideLength);
        },
        slideChange: function () {
          var currentNumber = this.realIndex + 1
          $('.js-swiper-pagination-current').text(currentNumber);
          /* var currentNumber = this.realIndex
          $('.main-section-premium').find('.premium__button').removeClass('is--active');
          $('.main-section-premium').find('.premium__button').eq(currentNumber).addClass('is--active');
          var slideLength = $('.premium-swiper-container').find('.swiper-slide:not(.swiper-slide-duplicate)').length;
          var currentNumber = this.realIndex + 1
          if (currentNumber > slideLength) {
            currentNumber = 0
          } */
        }
      }
    });
    $('.business__button').on('click', function (){
      businessSwiper.autoplay.stop()
      var slideIndex = businessSwiper.realIndex
      var current = Number($(this).attr('data-business-index'));
      businessSwiper.slideTo(current);
    })
  }
  BusinessSlide();

	new Swiper('.visual-swiper-container', {
	  loop: true,
	  autoplay : {  // 자동 슬라이드 설정 , 비 활성화 시 false
		  delay : 6000,   // 시간 설정
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
	  },
	  paginationClickable: true,
	  pagination: {
	  el: '.swiper-pagination',
			clickable: true,
			renderBullet: function (index, className) {
			 return '<span class="' + className + '">'+'<svg class="fp-arc-loader" width="32" height="32" viewBox="0 0 16 16">'+
						'<circle class="path" cx="8" cy="8" r="6" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"'+
						'stroke-opacity="1" stroke-width="1px"></circle>'+
				'<circle cx="8" cy="8" r="2" fill="#FFF"></circle>'+
						'</svg></span>';
		  },
	  },
	  navigation: {
		nextEl: '.visual-next',
		prevEl: '.visual-prev',
	  },
	});

	new Swiper('.content03-swiper-container', {
	  loop: true,
	  slidesPerView: 2,
		spaceBetween: 20, 
	  autoplay : { 
		  delay : 6000,   
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
	  },
	  paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		breakpoints: { 
			990: { slidesPerView: 3} }
	});

  AOS.init({
    useClassNames: true,
    initClassName: false,
    duration: 2000,
  });

  $('img[usemap]').rwdImageMaps();
	
	//media-wrap
	$('.media-info-all ul li').hover(function() {
		$(this).find('.more-button').stop().animate({'opacity' : 1})
	}, function() {
		$('.more-button').stop().animate({'opacity' : 0})
	})


	// banner_control
	/*var ban_num = 1;
	$('.banner_controler button').click(function() {
		switch($(this).attr('class')) {
			case 'prev_num':
				if(ban_num <= 1) {ban_num = 5}
				else {ban_num--;}
			break;
			case 'next_num':
				if(ban_num >= 5) {ban_num = 1}
				else {ban_num++;}
			break;
		}
	})*/
	//const mainSection2 = document.querySelector('.main-section2');
	//mainSection2.addEventListener('click', () => {


	$('.main-section2 button').click(function() {
		 const activatedBanner = document.querySelector('.swiper-slide-active');
		 const number = activatedBanner.dataset.swiperSlideIndex;
		 const prevNum = document.querySelector('.prev_num');
		 prevNum.innerText = parseInt(number) + 1;
   });
   
		function isElementUnderBottom(elem, triggerDiff) {
		const { top } = elem.getBoundingClientRect();
		const { innerHeight } = window;
		return top > innerHeight + (triggerDiff || 0);
	}

	function handleScroll() {
		const elems = document.querySelectorAll('.up-on-scroll');
		elems.forEach(elem => {
			if (isElementUnderBottom(elem, -20)) {
			  elem.classList.remove ("is--active");
			} else {
				elem.classList.add ("is--active");
			}
		})
	}

	window.addEventListener('scroll', handleScroll);

});


