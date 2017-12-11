$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 1024,
    wide: 1336,
    hd: 1680
  }

  //////////
  // COMMON
  //////////

  // svg support for laggy browsers
  svg4everybody();

 	// Prevent # behavior
	$(document).on('click', '[href="#"]', function(e) {
		e.preventDefault();
	});

  // triggered each time PJAX DONE or first page load
  function pageReady(){
    revealFooter();

    headerSticky();
    setHeaderActiveClass();

    initMagnific();
    initStackTable();

    initTogglePlugin();
    initTextareaExpand();
    initFileUpload();
  }

  pageReady();

  // FOOTER REVEAL
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() && _window.width() > bp.tablet ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
    _window.on('resize', debounce(revealFooter, 100));
  }

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function headerSticky(){
    if ( $('.header-static').length == 0 ){
      _window.on('scroll', throttle(function() { // scrolled is a constructor for scroll delay listener
        var vScroll = _window.scrollTop();
        var header = $('.header').not('.header--static');
        var headerHeight = header.outerHeight();

        if ( _document.height() / _window.height() > 2.5){
          if ( vScroll > headerHeight ){
            header.addClass('header--fixed');
          } else {
            header.removeClass('header--fixed');
          }
        }

      }, 10));

      _window.on('scroll', throttle(function(e){
        $('[js-header-dropdown-list]').removeClass('is-active');
      }, 100, {
        'leading': true
      }))

    }
  }

  // HAMBURGER TOGGLER
  $(document).on('click', '[js-hamburger]', function(){
    $('.hamburger').toggleClass('is-active');
    $('.mobile-navi').toggleClass('is-active');
    $('.header').toggleClass('is-sticky');
    $('body').toggleClass('is-fixed');
  });

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('.mobile-navi').removeClass('is-active');
    $('.header').removeClass('is-sticky');
    $('body').removeClass('is-fixed');
  }

  // HEADER DROPDOWN
  $(document)
    .on('click', '[js-header-dropdown]', function(e){
      var pos = $(this).offset();
      var dropdown = $('[js-header-dropdown-list]');
      console.log(pos)

      dropdown.css({
        top: pos.top - _window.scrollTop() + ( $(this).outerHeight() + 25 ),
        right: _window.width() - (pos.left + $(this).outerWidth())
      })
      dropdown.toggleClass('is-active');

      e.stopPropagation()
    })
    .on('click', function(e){
      if(!$(event.target).closest('[js-header-dropdown-list]').length) {
        if( $('[js-header-dropdown-list]').is(".is-active")) {
          $('[js-header-dropdown-list]').removeClass('is-active');
        }
      }
    });

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering
  // user .active for li instead
  function setHeaderActiveClass(){
    $('.header__menu li a').each(function(i,val){
      if ( $(val).attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  //////////
  // MODALS
  //////////

  // Magnific Popup
  function initMagnific(){
    var startWindowScroll = 0;
    $('[js-modal]').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });
  }

  ////////////
  // STACKTABLE
  ////////////
  function initStackTable(){
    $('[js-stacktable]').stacktable();
  }

  ////////////
  // PERFECT SCROLLBAR
  ////////////

  $('[js-scrollbar]').each(function(i, scrollbar){
    var _this = scrollbar;

    var ps = new PerfectScrollbar(_this, {
      wheelSpeed: 2,
      wheelPropagation: true,
      maxScrollbarLength: 100,
      suppressScrollY: true
    });
  })


  ////////////
  // LOAD MORE
  ////////////
  $(document).on('click', '[js-load-more]', function(e){
    // some fake functionality
    // just should be doing some ajax here instead

    var table, rows;
    if ( _window.width() > bp.tablet ){
      table = _document.find('table.large-only')
    } else {
      table = _document.find('table.small-only');
    }

    rows = table.find('tbody tr').clone(true);

    rows.each(function(i, row){
      $(table).append(row);
      // .hide().slideDown();
    });

    // initStackTable();
    e.preventDefault();
  })

  //////////
  // TOGGLE PLUGIN
  //////////
  function initTogglePlugin(){
    $('[js-toggle]').each(function(i, toggle){
      var _this = $(toggle);

      var anchor = _this.find('[js-toggle-anchor]');
      var anchorTextHidden = anchor.attr('data-toggle-hidden');
      var anchorTextVisible = anchor.attr('data-toggle-visible');
      var dropdown = _this.find('[js-toggle-drop]');

      anchor.on('click', function(e){
        var openState = _this.attr('data-toggle-opened');

        if ( openState == 0 ){
          anchor.find('span').text(anchorTextVisible)
          dropdown.slideDown(250);
          _this.attr('data-toggle-opened', 1);
        } else if ( openState == 1 ) {
          anchor.find('span').text(anchorTextHidden)
          dropdown.slideUp(250);
          _this.attr('data-toggle-opened', 0);
        }
        e.preventDefault();
      })
    })
  }

  ////////////
  // UI
  ////////////

  // textarea autoExpand
  // $(document)
  //   .one('focus.autoExpand', '.ui-group textarea', function(){
  //       var savedValue = this.value;
  //       this.value = '';
  //       this.baseScrollHeight = this.scrollHeight;
  //       this.value = savedValue;
  //   })
  //   .on('input.autoExpand', '.ui-group textarea', function(){
  //       var minRows = this.getAttribute('data-min-rows') || 0, rows;
  //       this.rows = minRows;
  //       rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
  //       this.rows = minRows + rows;
  //   });

  function initTextareaExpand(){
    var textarea = $('.ui-group textarea');

    textarea.on('keydown', debounce(autosize, 50));

    function autosize(){
      var el = this;
      el.style.cssText = 'height:auto; padding:0';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }
  }

  // file uploader
  function initFileUpload(){
    var file_api = ( window.File && window.FileReader && window.FileList && window.Blob ) ? true : false;

    var uploader = $('[js-uploader]');
    var valid_ext = uploader.attr('data-validate');
    var uploaderFile = uploader.find('input');
    var uploaderText = uploader.find('.uploader__current-filename');
    var uploaderTag = uploader.find('.uploader__current');

    uploaderFile.on('change', function(){
        var file_name;
        if( file_api && uploaderFile[ 0 ].files[ 0 ] ){
            file_name = uploaderFile[ 0 ].files[ 0 ].name;
        }else{
            file_name = uploaderFile.val().replace( "C:\\fakepath\\", '' );
        }

        if( ! file_name.length ){
          return false
        }

        if ( valid_ext ){
          var file_arr = file_name.split('.');
          var ext = file_arr[file_arr.length - 1]
          if( ext !== valid_ext ){
            // alert('Please select csv file')
            $('.uploader-error').remove();
            uploader.prev().append("<div class='uploader-error'>Please select ."+valid_ext+" file</div>")
            return false
          }
        }

        $('.uploader-error').remove();

        uploaderText.text(file_name);
        uploaderTag.addClass('has-file');

    });

    uploaderTag.on('click', '.ico', function(){
      uploaderFile.val("");
      uploaderTag.removeClass('has-file');
    })
  }

  // Masked input
  // $(".js-dateMask").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
  // $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});


  //////////
  // BARBA PJAX
  //////////


  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      $el.animate({ opacity: 1 }, 200, function() {
        document.body.scrollTop = 0;
        _this.done();
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();

    // close mobile menu
    if ( _window.width() < bp.mobile ){
      closeMobileMenu();
    }
  });

});
