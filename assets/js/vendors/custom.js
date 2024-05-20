"use strict";

const dsnParam = {
  cursor: {
    run: true,
    speed: 0.35,
    speedInner: 0.15
  },
  scrollbar: {
    duration: 1.5,
    smooth: false,
    smoothTouch: false,
    mouseMultiplier: 1
  }
};

(function ($) {
  "use strict";

  preloader();
  effectBackForward();

  async function reloadAjax($off, $el = $(document)) {
    if (!$off) {
      window.$effectScroll = await effectScroller();
      window.$animate = await dsnGrid.effectAnimate();
    }

    await $('.hidden[data-dsn="bg_section"]').each(function () {
      $(this).next().append($(this));
      $(this).css({
        zIndex: -1
      });
      $(this).removeClass('hidden');
    });
    imgPosition();
    gridGaps();
    await $effectScroll.start();
    await $animate.allInt();
    // await loadLazyImage($el, ['bg', 'src']);
    await fancyBox();
    await justifiedGallery($el);
    await compareTowImage();
    await serviceSection($el);
    await scrollBarWidth();
    await projectSlider().run();

    await contactValidator();
    if (!$off) await Isotope($el);else setTimeout(Isotope, 500);
    await list_project($el);
    await inputNumber($el);
  }

  function imgPosition() {
    $("[data-dsn-position]").each(function () {
      if (this.nodeName === "IMG") $(this).css("object-position", dsnGrid.getData(this, "position", "center"));else $(this).css("background-position", dsnGrid.getData(this, "position", "center"));
    });
  }

  function gridGaps() {
    $(".d-grid[data-dsn-gap]").each(function () {
      const gap = dsnGrid.getData(this, "gap", "30px 30px");
      const split = gap.split(" ");
      this.style.gridGap = gap;
      this.style.setProperty("--grid-gap", gap);

      if (this.classList.contains('dsn-isotope')) {
        if (split.length > 1) {
          this.style.setProperty("--grid-gap-row", split[0]);
          this.style.setProperty("--grid-gap-col", split[1]);
          this.style.setProperty("--grid-gap", split[1]);
        } else if (split.length) {
          this.style.setProperty("--grid-gap-row", split[0]);
          this.style.setProperty("--grid-gap-col", split[0]);
          this.style.setProperty("--grid-gap", split[0]);
        }
      }
    });
    $("[data-dsn-iconsize]").each(function () {
      this.style.setProperty("--dsn-icon-size", dsnGrid.getData(this, "iconsize"));
    });
  }
  /**
   *
   * servicestab
   *
   */



  function preloader() {
    const preloader = $("#dsn_preloader");

    if (!preloader.length) {
      window.addEventListener('DOMContentLoaded', function () {
        reloadAjax().catch($err => {
          console.log($err);
        });
      });
      return false;
    }

    $body.css('overflow', 'hidden');
    const progress_number = preloader.find(".loading-count"),
          preloader_progress = preloader.find('.dsn-progress-path'),
          present = {
      value: 0
    };

    const updateVal = (val, isSetVal) => {
      progress_number.text(val.toFixed(0));
      preloader_progress.css("stroke-dashoffset", 300 - val * 3);
      if (isSetVal) present.value = val;
    };

    const timer = dsnGrid.pageLoad({
      startTime: 0,
      endTime: 100,
      duration: 1000,

      onProgress(val) {
        updateVal(val, true);
      }

    });
    window.addEventListener('DOMContentLoaded', function () {
      clearInterval(timer);
      const tl = gsap.timeline();
      tl.to(present, 1, {
        value: 100,

        onUpdate() {
          updateVal(present.value, true);
        }

      }).call(function () {
        reloadAjax().catch($err => {
          console.log($err);
        });
      }).to(preloader.find('> *:not(.bg-load)'), {
        autoAlpha: 0
      }).to(preloader.find('.bg-load'), {
        yPercent: -100,
        ease: Expo.easeInOut,
        duration: 1.5
      }).to(preloader.find('.bg-load .separator__path'), {
        attr: {
          d: dsnGrid.getData(preloader.find('.bg-load .separator__path').get(0), 'to')
        },
        ease: "Power4.easeInOut",
        duration: 1.5
      }, '-=1.5').fromTo("#main_root", 1, {
        y: 400
      }, {
        y: 0,
        clearProps: true,
        ease: Expo.easeInOut
      }, "-=1.2").call(function () {
        preloader.remove();
        ScrollTrigger.update();
        $body.css('overflow', '');
        ScrollTrigger.getAll().forEach($item => {
          $item.refresh();
        });
      });
    });
  }
  /**
   *  -   event will be triggered by doing browser action such as
   *  a click on the back or forward button
   */


  function effectBackForward() {
    $wind.on("popstate", function (e) {
      console.log("sad");

      if (window.location.hash.length) {
        $wind.scrollTop(0);
        dsnGrid.scrollTop(window.location.hash, 1, -100);
        return;
      }

      if (document.location.href.indexOf("#") > -1) {
        return;
      }

    });
  }


  function scrollBarWidth() {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.cssText = "width:100px;height:100px;overflow: scroll;position: absolute;top: -9999px;";
    document.body.appendChild(scrollDiv);
    document.body.style.setProperty('--dsn-width-scroll', scrollDiv.offsetWidth - scrollDiv.clientWidth + "px");
    document.body.removeChild(scrollDiv);
  }

  async function Isotope($el = $(document)) {
    const createIso = async function ($item) {
      if (!$item.length) return;
      $item.addClass('use-filter');
      return $item.isotope({
        itemSelector: '.grid-item'
      });
    };

    await $el.find('.root-posts').each(function () {
      const rootPosts = $(this),
            $filtering = rootPosts.find('.dsn-filtering .filtering'),
            $isoItem = rootPosts.hasClass('has-filter') ? rootPosts.find('.dsn-posts') : rootPosts.find('.dsn-isotope'),
            $buttonAjax = rootPosts.find('.button-load-more');
      if (!$filtering.length && !$isoItem.length && !$buttonAjax.length) return;

      const handleClickFilter = function ($iso) {
        if (!$filtering.length) return $iso;

        const handleClick = function () {
          $(this).addClass('active').siblings().removeClass("active");
          $iso.isotope({
            filter: $(this).attr("data-filter")
          });
        };

        $filtering.find('button').on("click", handleClick);
        return $iso;
      };

      const handleAjax = function ($iso) {
        if (!$buttonAjax.length) return;
        const $option = dsnGrid.getOptionAjax($buttonAjax.get(0));
        dsnGrid.loadMore({
          el: $buttonAjax,
          option: $option,
          isotope: $iso,
          success: function (data) {
            $animate.parallaxHover();
          },
          filtering: $filtering,
          posts: rootPosts.find('.dsn-posts')
        });
        return $iso;
      };

      createIso($isoItem).then(handleClickFilter).then(handleAjax).then(function ($iso) {
        dsnGrid.killAjax(function () {
          $filtering.find('button').off('click');
          if ($iso) $iso.isotope('destroy');
          $buttonAjax.off('click');
        });
      });
    });
    await $el.find(".dsn-isotope:not(.use-filter)").each(function () {
      if ($(this).parent('.root-posts').length) return;
      createIso($(this)).then(function ($iso) {
        dsnGrid.killAjax(function () {
          if ($iso) $iso.isotope('destroy');
        });
      });
    });
  }

  function serviceSection($el = $(document)) {
    if (dsnGrid.isMobile()) return;
    ($el.hasClass("service-with-img") ? $el.find('.dsn-service') : $el.find(".service-with-img")).each(function () {
      const serviceItem = $(this).find(".service-item"),
            onEnter = function () {
        serviceItem.not(this).removeClass('active');
        this.classList.add("active");
        serviceItem.not(this).find('.service_description ').slideUp(400);
        $(this).find('.service_description ').slideDown(400);
      };

      serviceItem.first().addClass("active");
      serviceItem.on('mouseenter', onEnter);
      dsnGrid.killAjax(function () {
        serviceItem.off('mouseenter', onEnter);
      });
    });
  }
  /**
   * t is using translate3d to perform a momentum based scrolling
   * (aka inertial scrolling) on modern browsers.
   *
   */


  function effectScroller() {
    const locked_scroll = "locked-scroll";
    let lenisScroll = null;
    return {
      /**
       *
       * @returns {boolean}
       * Check smooth scroll is enable or not
       */
      isScroller: function () {
        var _dsnParam$scrollbar;

        return dsnParam === null || dsnParam === void 0 ? void 0 : (_dsnParam$scrollbar = dsnParam.scrollbar) === null || _dsnParam$scrollbar === void 0 ? void 0 : _dsnParam$scrollbar.smooth;
      },
      start: function () {
        $body.removeClass(locked_scroll);
        dsnGrid.scrollTop(0, {
          duration: 0.01
        });
        if (!this.isScroller()) return;
        lenisScroll = new Lenis(dsnParam.scrollbar);

        function raf(time) {
          lenisScroll.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      },

      /**
       *  locked smooth scrollbar
       */
      locked: function () {
        var _lenisScroll;

        $body.addClass(locked_scroll);
        this.isScroller() && ((_lenisScroll = lenisScroll) === null || _lenisScroll === void 0 ? void 0 : _lenisScroll.destroy());
      },

      /**
       *
       * @param $id
       * @returns {*}
       * Gets scrollbar on the given element. If no scrollbar instance exists, returns undefined:
       */
      getScrollbar: () => lenisScroll,

      /**
       *
       * @param listener
       * @param $useWin
       *
       * Since scrollbars will not fire a native scroll event
       */
      getListener: function (listener) {
        if (listener === undefined) return;

        const scroll = e => {
          listener(e, window.scrollX, window.scrollY);
        };

        $wind.on("scroll", scroll);
      }
    };
  }

  function compareTowImage($el = $(document)) {
    $el.find('.dsn-compare-container').each(function () {
      const compare = dsnGrid.compareTowImg(this);
      dsnGrid.killAjax(function () {
        compare.destroy();
      });
    });
  }

  function fancyBox() {
    if (!window.Fancybox) return;
    Fancybox.defaults.Hash = false;
    Fancybox.bind(".vid");
    Fancybox.bind("[data-fancybox]");
    Fancybox.bind(".woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image  a");
    dsnGrid.killAjax(function () {
      Fancybox.unbind(".vid");
      Fancybox.unbind("[data-fancybox]");
    });
  }
  /**
   *
   * @param $el
   */


  function projectSlider() {
    return {
      swiper: function ($id, $obj) {
        $id = dsnGrid.convertToJQuery($id);
        $obj = $.extend(true, {
          slidesPerView: 1,
          centeredSlides: true,
          spaceBetween: 0,
          grabCursor: true,
          speed: 1000,
          parallax: true,
          loop: true,
          // slideToClickedSlide: true,
          pagination: {
            el: $id.find(".swiper-pagination").get(0),
            dynamicBullets: true,
            clickable: true //
            // renderBullet: function (index, className) {
            //     return '<span class="' + className + ' swiper-pagination-bullet--svg-animation"><svg width="26" height="26" viewBox="0 0 28 28"><circle class="svg__circle" cx="14" cy="14" r="12" fill="none" stroke-width="2"></circle><circle class="svg__circle-inner" cx="14" cy="14" r="6" stroke-width="3"></circle></svg></span>';
            // },

          },
          navigation: {
            nextEl: $id.find(".swiper-next").get(0),
            prevEl: $id.find(".swiper-prev").get(0)
          }
        }, $obj);
        const $s = new Swiper($id.find(".swiper-container").get(0), $obj);
        dsnGrid.killAjax(() => {
          $s.destroy();
        });
      },
      run: function () {
        let $this = this;
        $(".dsn-swiper").each(function () {
          let option = dsnGrid.getData(this, "option", {});
          let syn = $(this).parent().find(dsnGrid.getData(this, "controller"));

          if (syn.length) {
            option['thumbs'] = {
              swiper: {
                el: syn.find('.swiper-container').get(0),
                allowTouchMove: false,
                slidesPerView: 1,
                speed: option.speed || 1000,
                parallax: true,
                autoHeight: true
              }
            };
          }

          option["breakpoints"] = {
            768: {
              slidesPerView: option.slidesPerView > 1 ? option.slidesPerView > 1.5 ? 2 : 1.30 : 1,
              spaceBetween: option.slidesPerView > 1 ? option.spaceBetween > 21 ? 20 : option.spaceBetween : 0
            },
            992: {
              slidesPerView: option.slidesPerView,
              spaceBetween: option.spaceBetween || 0
            },
            575: {
              slidesPerView: 1,
              spaceBetween: 0
            }
          };

          if (syn.length) {
            option['thumbs'] = {
              swiper: {
                el: syn.find('.swiper-container').get(0),
                allowTouchMove: false,
                slidesPerView: 1,
                speed: option.speed || 1000,
                parallax: true,
                autoHeight: true
              }
            };
            option.breakpoints['768'] = {
              slidesPerView: 1,
              spaceBetween: 0
            };
          }

          option['slidesPerView'] = 1;
          option['spaceBetween'] = 0;
          $this.swiper(this, option);
        });
      }
    };
  }
  /**
   *
   *  - Create an high quality justified gallery
   *    of image
   *
   */


  function justifiedGallery($el = $(document)) {
    $el.find(".gallery-portfolio").each(function () {
      if (!window.fjGallery) return;
      const option = dsnGrid.getData(this, 'option') || {};
      const gallery = fjGallery(this, { ...option,
        itemSelector: '.fj-gallery-item',
        onJustify: function () {
          ScrollTrigger.refresh();
        }
      });
      dsnGrid.killAjax(function () {
        fjGallery(gallery, 'destroy');
      });
    });
  }

  changeStyle();
  /**
   * Option Style Pages
   */

  function changeStyle() {
    const options = $('#dsn_box_options');
    options.on('click', function () {
      const isDark = $body.hasClass('v-dark'),
            _dark = $('.v-dark'),
            _light = $('.v-light');

      $body.toggleClass('v-dark');

      _dark.removeClass('v-dark').addClass('v-light');

      _light.addClass('v-dark').removeClass('v-light');

      $.ajax({
        url: dsnParam.ajaxStyle,
        type: "post",
        data: {
          color: isDark ? 'v-light' : 'v-dark',
          style: "off"
        }
      });
    });
  }

  function list_project($el = $(document)) {
    function changeState(_active, _remove, $product) {
      if (_active.hasClass('active')) return false;

      _active.addClass('active');

      _remove.removeClass('active');

      $product.fadeOut(300, function () {
        jQuery(this).toggleClass("list").fadeIn(300);
      });
      return false;
    }

    $el.find('.woocommerce').each(($index, $item) => {
      const $grid = $($item).find('.dsn_grid');
      const $list = $($item).find('.dsn_list');
      if (!$grid.length) return;
      const $product = $($item).find('ul.dsn-shop');
      $grid.on('click', function () {
        return changeState($grid, $list, $product);
      });
      $list.on('click', function () {
        return changeState($list, $grid, $product);
      });
      dsnGrid.killAjax(() => {
        $grid.off('click');
        $list.off('click');
      });
    });
  }

  function inputNumber($el = $(document)) {
    $el.find('.quantity').each(function () {
      const $this = $(this),
            input = $this.find('input[type="number"]'),
            btnUp = $this.find('.quantity-up'),
            btnDown = $this.find('.quantity-down'),
            min = input.attr('min') || 1,
            max = input.attr('max') || Number.MAX_VALUE;
      btnUp.off('click');
      btnUp.on('click', ChangeValue.bind(this, true));
      btnDown.off('click');
      btnDown.on('click', ChangeValue.bind(this, false));

      function ChangeValue(_is_plus) {
        const oldValue = parseFloat(input.val());
        let newVal = 0;

        if (_is_plus) {
          if (oldValue >= max) {
            newVal = oldValue;
          } else {
            newVal = oldValue + 1;
          }
        } else {
          if (oldValue <= min) {
            newVal = oldValue;
          } else {
            newVal = oldValue - 1;
          }
        }

        input.val(newVal);
        input.trigger("change");
      }
    });
  }
  /**
   * Validation Contact form
   */


  function contactValidator() {
    const contact_form = $("#contact-form");

    if (contact_form < 1) {
      return;
    }

    contact_form.validator(); // when the form is submitted
    // contact_form.off("submit");

    contact_form.on("submit", function (e) {
      // if the validator does not prevent form submit
      if (!e.isDefaultPrevented()) {
        // POST values in the background the the script URL
        $.ajax({
          type: "POST",
          url: "contact.php",
          data: $(this).serialize(),
          success: function (data) {
            // data = JSON object that contact.php returns
            // we recieve the type of the message: success x danger and apply it to the
            var messageAlert = "alert-" + data.type;
            var messageText = data.message; // let's compose Bootstrap alert box HTML

            var alertBox = "<div class=\"alert " + messageAlert + " alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" + messageText + "</div>"; // If we have messageAlert and messageText

            if (messageAlert && messageText) {
              // inject the alert to .messages div in our form
              contact_form.find(".messages").html(alertBox); // empty the form

              contact_form[0].reset();
            }

            setTimeout(function () {
              contact_form.find(".messages").html("");
            }, 3000);
          },
          error: function (error) {
            console.log(error);
          }
        });
        return false;
      }
    });
  }
})(jQuery);

function sidebarOptions() {
  document.body.classList.toggle('dsn-show-sidebar');
}
//# sourceMappingURL=custom.js.map
