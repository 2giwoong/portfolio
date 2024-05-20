$(function() {
	$('.js-header-menu-button').on('click', function () {
		$('.js-menu-modal').fadeIn()
	})
	$('.js-close-menu-button').on('click', function () {
		$('.js-menu-modal').fadeOut()
	})

  const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'myEaseSmooth' } })
  const body = document.querySelector('.body-responsive')

	function registModal() {
    const registPopup = document.querySelector('.js-popup-modal-container')
    $('.register-btn').on('click', function (){
      gsap.set(body, { overflow: 'hidden' })
      tl.to(registPopup, { display: 'flex', autoAlpha: 1 })
    })
    $('.js-popup-modal-close').on('click', function (){
      tl.to(registPopup, { display: 'none', autoAlpha: 0 })
      gsap.set(body, { overflow: 'auto' })
    })		
	}
	registModal();
	
	function registInfoModal() {
    const targetModal = document.querySelector('.js-register-modal')
    $('.js-register-popup-button').on('click', function (){
      gsap.set(body, { overflow: 'hidden' })
      tl.to(targetModal, { display: 'flex', autoAlpha: 1 })
    })
    $('.js-close-button').on('click', function (){
      tl.to(targetModal, { display: 'none', autoAlpha: 0 })
      gsap.set(body, { overflow: 'auto' })
    })		
	}
	registInfoModal();


	AOS.init();
	$('.sub-top-bg').addClass('active');
/*
	new Swiper('.status-container01', {
		//loop: true,
		autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
		},
		paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	});

	new Swiper('.status-container02', {
	  //loop: true,
	  autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
	  },
	  paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	});

	new Swiper('.status-container03', {
	  //loop: true,
	  autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
	  },
	  paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
		},
	});

	new Swiper('.status-container2-01', {
	  //loop: true,
	  autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
	  },
	  paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	});

	new Swiper('.status-container2-02', {
		//loop: true,
		autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
		},
		paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	});

	new Swiper('.status-container01', {
		//loop: true,
		autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
		},
		paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	});

	new Swiper('.status-container2-03', {
		//loop: true,
		autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
		},
		paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	});

	new Swiper('.status-container2-04', {
		//loop: true,
		autoplay : {
		  delay : 6000,
		  disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
		},
		paginationClickable: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	});
*/
});//function end
