'use strict';

(function app() {
  var tabletBreak = 1280;
  var mobileBreak = 768;
  var mobileXSBreak = 320;
  var pageOffsetX = window.scrollX;
  var pageOffsetY = window.scrollY;
  var frozeException = null;
  var isWindowFrozen = false;
  var isHeaderActive = false;

  // Base functions

  function detectBrowser() {
    var html = $('html');
    function init() {
      var userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg/') <= -1) {
        html.addClass('is-chrome');
      } else {
        html.removeClass('is-chrome');
      }
      if (
        userAgent.indexOf('safari') > -1
        && userAgent.indexOf('chrome') <= -1
      ) {
        html.addClass('is-safari');
      } else {
        html.removeClass('is-safari');
      }
      if (userAgent.indexOf('firefox') > -1) {
        html.addClass('is-firefox');
      } else {
        html.removeClass('is-firefox');
      }
      if (
        userAgent.indexOf('msie ') > -1
        || userAgent.indexOf('trident/') > -1
      ) {
        html.addClass('is-ie');
      } else {
        html.removeClass('is-ie');
      }
      if (userAgent.indexOf('edg/') > -1) {
        html.addClass('is-edge');
      } else {
        html.removeClass('is-edge');
      }
    }
    $('html head meta[name="viewport"]').attr(
      'content',
      'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0'
    );
    $(window).on('load resize', function onLoad() {
      init();
    });
    init();
  }

  function detectDevice() {
    var html = $('html');
    function init() {
      var viewport = $('html head meta[name="viewport"]')[0];
      var userAgent = navigator.userAgent.toLowerCase();
      var orientation = window.matchMedia('(orientation: portrait)').matches;
      // System
      if (userAgent.indexOf('mac') > -1) {
        html.addClass('is-mac is-macos');
      } else {
        html.removeClass('is-mac is-macos');
      }
      if (userAgent.match(/(iphone|ipod|ipad)/)) {
        if (userAgent.match(/iphone/)) {
          if (window.screen.width < mobileBreak && window.screen.width >= 390) {
            html.addClass('is-iphone-12');
          } else {
            html.removeClass('is-iphone-12');
          }
          if (window.screen.width < mobileBreak && window.screen.width < 390) {
            html.addClass('is-iphone-10');
          } else {
            html.removeClass('is-iphone-10');
          }
          if (window.screen.width < mobileBreak && window.screen.width < 375) {
            html.addClass('is-iphone-5');
          } else {
            html.removeClass('is-iphone-5');
          }
          html.addClass('is-iphone');
        } else {
          html.removeClass('is-iphone-12 is-iphone-10 is-iphone-5 is-iphone');
        }
        if (userAgent.match(/ipod/)) {
          html.addClass('is-ipod');
        } else {
          html.removeClass('is-ipod');
        }
        if (userAgent.match(/ipad/)) {
          html.addClass('is-ipad');
        } else {
          html.removeClass('is-ipad');
        }
        html.addClass('is-ios');
      } else {
        html.removeClass('is-phone is-ipod is-ipad is-ios');
      }
      if (userAgent.indexOf('android') > -1) {
        html.addClass('is-android');
      } else {
        html.removeClass('is-android');
      }
      // Type
      if (
        navigator.maxTouchPoints === 1
        && userAgent.indexOf('Mobile') === -1
      ) {
        $('html').addClass('is-emulation');
      } else {
        $('html').removeClass('is-emulation');
      }
      if (
        (html.hasClass('is-mac')
          || html.hasClass('is-ios')
          || html.hasClass('is-android'))
        && navigator.maxTouchPoints
        && navigator.maxTouchPoints >= 1
      ) {
        $('html').addClass('is-touchable');
        $('html').removeClass('is-untouchable');
      } else {
        $('html').removeClass('is-touchable');
        $('html').addClass('is-untouchable');
      }
      // Media
      if ($(window).width() < mobileBreak) {
        if (window.screen.width < mobileXSBreak) {
          viewport.setAttribute(
            'content',
            'width=' + mobileXSBreak + ', user-scalable=0'
          );
        } else {
          viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1'
          );
        }
        $('html').removeClass('is-desktop is-tablet');
        $('html').addClass('is-mobile');
      } else {
        $('html').addClass('is-desktop');
        if (
          (window.screen.width >= mobileBreak
            && window.screen.width <= tabletBreak)
          || (window.screen.width < mobileBreak
            && window.screen.height >= mobileBreak
            && !orientation)
        ) {
          $('html').addClass('is-tablet');
          viewport.setAttribute(
            'content',
            'width=' + tabletBreak + ', user-scalable=0'
          );
        } else {
          $('html').removeClass('is-tablet');
          viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0'
          );
        }
        $('html').removeClass('is-mobile');
      }
    }
    $(window).on('load resize', function onLoadWindow() {
      init();
    });
    init();
  }

  // Helper functions

  function isMobile() {
    return window.innerWidth <= mobileBreak - 0.02;
  }

  function isTouchable() {
    return $('html').hasClass('is-touchable');
  }

  function isOutside(event, target) {
    var container = $(target);
    if (
      !container.is(event.target)
      && container.has(event.target).length === 0
    ) {
      return true;
    }
    return false;
  }

  function frozeWindow(isFrozen, exception) {
    var classFrozenWindows = 'is-frozen-windows';
    var classFrozenOS = 'is-frozen-os';
    function freezeWindows() {
      if (isFrozen) {
        pageOffsetY = $(window).scrollTop();
        $('body').css({ top: -pageOffsetY + 'px', left: -pageOffsetX + 'px' });
        $('html').addClass(classFrozenWindows);
        isWindowFrozen = true;
      } else {
        isWindowFrozen = false;
        $('html').removeClass(classFrozenWindows);
        $('body').css({ top: 'auto', left: 'auto' });
        $(window).scrollLeft(pageOffsetX);
        $(window).scrollTop(pageOffsetY);
      }
    }
    function freezeOS() {
      if (isFrozen) {
        $('html').addClass(classFrozenOS);
        isWindowFrozen = true;
        if (exception.length) {
          frozeException = exception;
        } else {
          frozeException = null;
        }
        if (
          !$('html').attr('data-froze-state')
          || $('html').attr('data-froze-state') !== 'ready'
        ) {
          document.body.addEventListener(
            'touchmove',
            function onTouch(event) {
              if (isWindowFrozen) {
                if (
                  frozeException !== null
                  && frozeException.length
                  && isOutside(event, frozeException)
                ) {
                  event.preventDefault();
                } else if (frozeException === null) {
                  event.preventDefault();
                }
              }
            },
            { passive: false }
          );
          $('html').attr('data-froze-state', 'ready');
        }
      } else {
        isWindowFrozen = false;
        $('html').removeClass(classFrozenOS);
      }
    }
    if (isFrozen) {
      if ($('html').hasClass('is-desktop') && !isTouchable()) {
        freezeWindows();
      } else {
        freezeOS();
      }
    } else if (!isFrozen && $('html').hasClass(classFrozenWindows)) {
      freezeWindows();
    } else if (!isFrozen && $('html').hasClass(classFrozenOS)) {
      freezeOS();
    }
  }

  function scrollLeft() {
    if (!$('.js-scroll-left').length) return;
    $(window).on('load scroll resize', function onLoadScrollWindow() {
      var winLeft = $(window).scrollLeft();
      $('.js-scroll-left').each(function onEach() {
        var target = $(this);
        if (target.css('position') === 'fixed') {
          $('.js-scroll-left').css('left', -winLeft + 'px');
        } else {
          $('.js-scroll-left').css('left', 0);
        }
      });
    });
  }

  function scrollFix(target) {
    var windowScrollLeft = $(window).scrollLeft();
    if (windowScrollLeft > 0 && $(target).css('position') === 'fixed') {
      $(target).css('left', -windowScrollLeft + 'px');
    } else {
      $(target).css('left', 0);
    }
  }

  // Advance functions

  function headerCommonOpen() {
    var classReady = 'is-ready';
    var classActive = 'is-active';
    var header = $('header');
    var navigationSitemap = header.find(
      '.navigation-header-sitemap .navigation-wrapper'
    );
    var buttonBurger = header.find('.button-header-burger');
    header.addClass(classReady);
    header.addClass(classActive);
    navigationSitemap.addClass(classReady);
    navigationSitemap.addClass(classActive).stop().slideDown(300);
    buttonBurger.addClass(classReady);
    buttonBurger.addClass(classActive);
    if (isWindowFrozen === false) {
      frozeWindow(true, navigationSitemap);
    }
    isHeaderActive = true;
  }

  function headerCommonClose() {
    var classReady = 'is-ready';
    var classActive = 'is-active';
    var header = $('header');
    var navigationSitemap = header.find(
      '.navigation-header-sitemap .navigation-wrapper'
    );
    var buttonBurger = header.find('.button-header-burger');
    header.addClass(classReady);
    header.removeClass(classActive);
    navigationSitemap.addClass(classReady);
    navigationSitemap.removeClass(classActive).stop().slideUp(300);
    buttonBurger.addClass(classReady);
    buttonBurger.removeClass(classActive);
    if (isWindowFrozen === true) {
      frozeWindow(false);
    }
    isHeaderActive = false;
  }

  function headerCommon() {
    var classReady = 'is-ready';
    var classActive = 'is-active';
    var classScrolled = 'is-scrolled';
    var header = $('header');
    var navigationSitemap = header.find(
      '.navigation-header-sitemap .navigation-wrapper'
    );
    var buttonBurger = header.find('.button-header-burger');
    if (!$('header').length) return;
    buttonBurger.on('click', function onClickButton() {
      if (!buttonBurger.hasClass(classActive)) {
        headerCommonOpen();
      } else {
        headerCommonClose();
      }
    });

    $(window).on('load scroll resize', function onLoadWindow() {
      if ($(document).scrollTop() > 104) {
        header.addClass(classScrolled);
      } else {
        header.removeClass(classScrolled);
      }
    });
    $(window).on('resize', function onLoadWindow() {
      header.removeClass(classReady);
      navigationSitemap.removeClass(classReady);
      buttonBurger.removeClass(classReady);
      if (!isMobile() && isHeaderActive) {
        headerCommonClose();
      }
    });
    header.addClass(classReady);
    navigationSitemap.addClass(classReady);
    buttonBurger.addClass(classReady);
  }

  function smoothScroll() {
    var anchors = $('a[href*="#"]:not([href="#"])');
    var speed = 400;
    var delay = 0;
    var timeout = 0;
    function getPosition(target) {
      var position = $(target).offset().top - $('header .menu-header-sitemap').innerHeight();
      if ($(target).attr('data-smoothscroll-offset') !== undefined) {
        position += parseInt($(target).attr('data-smoothscroll-offset'), 10);
      } else if (
        $(target).attr('data-smoothscroll-offset-pc') !== undefined
        && !isMobile()
      ) {
        position += parseInt($(target).attr('data-smoothscroll-offset-pc'), 10);
      } else if (
        $(target).attr('data-smoothscroll-offset-sp') !== undefined
        && isMobile()
      ) {
        position
          += parseFloat($(target).attr('data-smoothscroll-offset-sp'))
          * $('html').css('font-size');
      }
      return position;
    }
    function triggerScroll(context) {
      var href = typeof context === 'string'
        ? context
        : '#' + $(context).attr('href').split('#')[1];
      if (!$(context).hasClass('no-scroll') && $(href).length) {
        if (isHeaderActive === true) {
          delay = 400;
          headerCommonClose();
        }
        if (isWindowFrozen === true) {
          delay = 400;
          frozeWindow(false);
        }
        setTimeout(function onTimeout() {
          $('body, html').animate(
            { scrollTop: getPosition($(href)) },
            speed,
            'swing'
          );
        }, delay);
        return false;
      }
      return true;
    }
    setTimeout(function setTimerHTMLVisibility() {
      window.scroll(0, 0);
      $('html').removeClass('is-loading').addClass('is-visible');
    }, 1);
    if (window.location.hash) {
      window.scroll(0, 0);
      if (
        navigator.userAgent.indexOf('MSIE ') > -1
        || navigator.userAgent.indexOf('Trident/') > -1
      ) {
        timeout = 0;
      } else {
        timeout = 400;
      }
      setTimeout(function setTimerTriggerScroll() {
        triggerScroll(window.location.hash);
      }, timeout);
    }
    anchors.on('click', function onClickAnchor() {
      return triggerScroll(this);
    });
  }

  function goTop() {
    var pageTop = $('.js-go-top');
    if ($('.js-go-top').length) {
      pageTop.hide();
      $(window).scroll(function onScroll() {
        if ($(this).scrollTop() > 104) {
          pageTop.fadeIn();
        } else {
          pageTop.fadeOut();
        }
      });
      pageTop.click(function onClickButton() {
        $('body, html').animate({ scrollTop: 0 }, 500);
        return false;
      });
    }
  }

  function scrollHint() {
    if (!$('.js-scrollable').length) return;
    new ScrollHint('.js-scrollable', {
      i18n: {
        scrollable: 'スクロールできます'
      }
    });
  }

  function accordionFAQ() {
    var classActive = 'is-active';
    var classReady = 'is-ready';
    if (!$('.js-accordion-faq').length) return;
    $('.js-accordion-faq[data-accordion-role="toggle"]').on(
      'click',
      function onClick() {
        var toggle = $(this);
        var id = toggle.attr('data-accordion-id');
        var target = $(
          '.js-accordion-faq[data-accordion-role="target"][data-accordion-id="'
          + id
          + '"]'
        );
        if (!toggle.hasClass(classActive)) {
          toggle.addClass(classActive);
          target.addClass(classActive);
          target.stop().slideDown(500);
        } else {
          toggle.removeClass(classActive);
          target.removeClass(classActive);
          target.stop().slideUp(500);
        }
      }
    );
    $(
      '.js-accordion-faq[data-accordion-role="target"]:not(.'
      + classActive
      + ')'
    )
      .stop()
      .slideUp(0);
    $('.js-accordion-faq').addClass(classReady);
  }

  $(window).on('load scroll resize', function onLoad() {
    pageOffsetX = $(window).scrollLeft();
    if (isWindowFrozen === true) {
      scrollFix($('body'));
    }
  });

  $(function init() {
    detectBrowser();
    detectDevice();
    headerCommon();
    smoothScroll();
    scrollLeft();
    goTop();
    scrollHint();
    accordionFAQ();
  });
}());
