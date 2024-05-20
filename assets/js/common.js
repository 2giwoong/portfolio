$(function() {


  console.clear();

// 의도적인 로딩
setTimeout(function(){
    $(".loading").fadeOut("slow");
}, 1500);

// 스크롤에 유동적인 메뉴
function NotScrollTop0__init() {
    var scrollTop = $(window).scrollTop();

    if ( scrollTop >= 85 ) {
        $('.header').addClass('not-scroll-top-0');
    }
    else {
        $('.header').removeClass('not-scroll-top-0');
    }
}

$(window).scroll(NotScrollTop0__init);
NotScrollTop0__init();

// 사이트맵 팝업창 켜기
$('.header > .header-inner > .header-util > .sitemap-btn').click(function(){
    $(this).siblings('.sitemap-wrap').addClass('active');
});

// 사이트맵 팝업창 끄기
$('.header > .header-inner > .header-util > .sitemap-wrap > .sitemap-popup > .close-btn').click(function(){
    $(this).closest('.sitemap-wrap').removeClass('active');
});

// 검색창 버튼 클릭
$('.header > .header-inner > .header-util > .search-btn').click(function(){

    $(this).toggleClass('active');
    $(this).siblings('.search-inner').toggleClass('active');
});



// 모바일 메뉴 관련
$('.header > .header-inner > .m-gnb-btn').click(function(){
    if ( $(this).hasClass('active') ){
        $('html, body').css('overflow-y', 'visible');
        $(this).siblings('.m-menu-wrap').find(' > .m-gnb > ul > li.active > ul').slideUp(300);
        $(this).siblings('.m-menu-wrap').find(' > .m-gnb > ul > li.active').removeClass('active');

        $(this).removeClass('active');
        $(this).siblings('.m-menu-wrap').removeClass('active');
    }
    else {
        $('html, body').css('overflow-y', 'hidden');

        $(this).addClass('active');
        $(this).siblings('.m-menu-wrap').addClass('active');
    }
});

// 모바일 메뉴 연 상태로 화면 키웠을때 모바일 메뉴 사라지게
$(window).resize(function(){
    if ( $(window).width() > 1220 && $('.header > .header-inner > .m-gnb-btn').hasClass('active') ){
        $('.header > .header-inner > .m-gnb-btn').removeClass('active');
        $('.header > .header-inner > .m-menu-wrap > .m-gnb > ul > li.active > ul').slideUp(300);
        $('.header > .header-inner > .m-menu-wrap > .m-gnb > ul > li.active').removeClass('active');
        $('.header > .header-inner > .m-menu-wrap').removeClass('active');
        $('html, body').css('overflow-y','visible');
    }
});

// 모바일 gnb 2차 메뉴
$('.header > .header-inner > .m-menu-wrap > .m-gnb > ul > li').click(function() {
    if ( $(this).hasClass('active') ) {
        $(this).find(' > ul').slideUp(300);
        $(this).removeClass('active');
    }
    else {
        $(this).siblings('li.active').find(' > ul').slideUp(300);
        $(this).siblings('li.active').removeClass('active');
        $(this).find(' > ul').slideDown(300);
        $(this).addClass('active');
    }
});

$('.header > .header-inner > .m-menu-wrap > .m-gnb > ul ul').click(function(e){
    e.stopPropagation();
});

// 메인 비주얼 슬라이더 slick 적용

// aos 플러그인 적용
AOS.init({
    duration:800,
    easing: 'ease',
    once:true,
});

//반응형이미지

//$('img[usemap]').rwdImageMaps();

$(function() {
	$('ul.tabs2 li').click(function () {
		var tab_id = $(this).attr('data-tab');
		$('ul.tabs2 li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#" + tab_id).addClass('current');
	});
})

// 지정되지 않은 a 링크 return false
$('a').click(function(e) {
    if ( $(this).attr('href') == '#' ) {
        //return false;
        e.preventDefault();
    }
});

(function($){

  $(document).ready(function(){

    $('.slick-slides').slick({
      slidesToShow: 1,
      dots: true,
      appendDots: '.slick-nav',
      infinite: false,
			prevArrow: $('.sub-prev'),
			nextArrow: $('.sub-next'),
      customPaging: function(slick, index) {
        var $slickImg = $(slick.$slides[index]).find('img'),
            imgPath = $slickImg.data('lazy'),
            textContent = $slickImg.attr('alt');

        return '<button class="custom-thumb"><span class="custom-thumb__bg" style="background-image:url('+imgPath+');"><span class="visually-hidden">' + textContent + '</span></span></button>';
      }
    });

  });

})(jQuery);


		function isElementUnderBottom(elem, triggerDiff) {
			const { top } = elem.getBoundingClientRect();
			const { innerHeight } = window;
			return top > innerHeight + (triggerDiff || 0);
		}

		function handleScroll() {
			const elems = document.querySelectorAll('.up-on-scroll');
			elems.forEach(elem => {
				if (isElementUnderBottom(elem, -300)) {
					elem.classList.remove ("is--active");
				} else {
					elem.classList.add ("is--active");
				}
			})
		}

		window.addEventListener('scroll', handleScroll);
})
