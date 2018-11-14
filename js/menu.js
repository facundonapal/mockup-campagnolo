/*--------------------------------------------------
Cookiebar
--------------------------------------------------*/
function cokbar() {
    val = document.cookie.match("cookiebar=close");


    if (!val) {
        $('body').addClass('menage-cookie-css').prepend("<div class='cookie-adv'><div><span>" + $('.lbl_cokbar').html() + "</span> <a class='chiudi' href='#'></a></div></div>");
        document.cookie = 'cookiebar=close; path=/;'
    };


    $(document).on('click', '.menage-cookie-css .cookie-adv div a.chiudi', function () {
        //document.cookie = 'cookiebar=close; path=/;'
        $('.cookie-adv').remove();
        $('body').removeClass('menage-cookie-css');
        return false;
    });
};


/*--------------------------------------------------
supahMenu
--------------------------------------------------*/
function supahMenu() {
    var loadImg = '/img/mycampy.png';

    $('#header').on('click', '.menu_mobile #menu_button', function () {
        $(this).toggleClass('open');
        var move = ($(this).is('.open')) ? -($('#menu').width()) : 0;
        /*var overflow = ($(this).is('.open')) ? 'visible' : 'hidden';
        var overflowHtml = ($(this).is('.open')) ? 'hidden' : 'visible';
        var height = ($(this).is('.open')) ? $('#menu').outerHeight() : 'auto';
        $('.wrapper').css({ overflow: overflow, height: height, minHeight: $(window).height() }).animate({ left: move }, 500, 'easeInOutQuart');
        $('html, body').css({ overflow: overflowHtml });
        $('body').css({ height: height, minHeight: $(window).height() });*/
        $('#menu ul ul').slideUp(200);
        $('#menu .active').removeClass('active');

        var height = ($(this).is('.open')) ? $('#menu').outerHeight() - $('#header').height() : 'auto';
        $('.wrapper').css({ height: height, minHeight: $(window).height() - $('#header').height() }).animate({ left: move }, 500, 'easeInOutQuart');
        $('#header').animate({ left: move }, 500, 'easeInOutQuart');

        return false;
    });

    $('#header').on('click', '.menu_mobile li a', function () {
        if ($(this).next().is('ul')) {
            $(this).toggleClass('active').next().slideToggle(500, 'easeInOutQuart', function () {
                $('body').css({ height: $('#menu').outerHeight() });
                $('.wrapper').css({ height: $(document).height() });
                $('.wrapper').css({ height: $('#menu').outerHeight() - $('#header').height() })
            });

            return false;
        }
    });


    $(window).on('load resize', function () {
        if ($(window).width() < 768) {
            $('#menu').addClass('menu_mobile');
        } else {
            $('#menu').removeClass('menu_mobile');
            $('#menu ul ul').hide();
            $('#menu .active').removeClass('active');
            $('.wrapper').css({ left: 0 });
        }
    });

    // desktop
    var menuHeight = 0;
    var timeout;
    var timer = 400;
    var boxMenu = $('#place_image').wrap('<p/>').parent().html();

    $('#menu:not(".menu_mobile") #main_menu li.subarrow').on('click', function (e) {
        $('#main_menu li a.on').removeClass('on');
        $('a:eq(0)', this).addClass('on');
        clearTimeout(timeout);
        $('#sub_menu_content').html('');
        if ($(this).has('ul')) {
            $('#sub_menu_content').append(boxMenu);
            $('#sub_menu_content').append($(this).html());
            $("#sub_menu_content > a").remove()
            $('#sub_menu_content ul').addClass('clearfix');

            $('#sub_menu').stop().animate({ height: 0 }, 600, 'easeInOutQuart');
            setTimeout(function () {
                resetHeight = (menuHeight > 0) ? menuHeight : 0;
                openDuration = (menuHeight > 0) ? 400 : 600;
                menuHeight = 332;
                $('#sub_menu').css({ height: resetHeight }).stop().animate({ height: menuHeight }, openDuration, 'easeInOutQuart');
            }, 50);

            // click su tablet per l'apertura del sottomenu
            if ($('html.touch').length > 0) {
                if ($('#sub_menu').height() < 20 || $('#sub_menu').is(':animated')) {
                    $('a', $(this)).each(function () {
                        $(this).attr('data-href', $(this).attr('href')).removeAttr('href');
                        setTimeout(function () {
                            $('#main_menu [data-href]').each(function () {
                                $(this).attr('href', $(this).attr('data-href'));
                            })
                        }, 500);
                    });
                }
            }
            return false;
        } else {
            menuHeight = 0;
            $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
            $('#main_menu li a.on').removeClass('on');
        }
    }).mouseout(function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            menuHeight = 0;
            $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
            $('#main_menu li a.on').removeClass('on');
        }, timer);
    });


    $('#sub_menu').mouseover(function () {
        clearTimeout(timeout);
        menuHeight = 332;
        $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
    }).mouseout(function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            menuHeight = 0;
            $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
            $('#main_menu li a.on').removeClass('on');
        }, timer);
    });

    // rollover image
    $('#sub_menu').on('mouseover', 'a[data-image]', function () {
        $p = $('#place_image img');
        if ($(this).parents('.tecnologie').length > 0) {
            $i = 'img/tecnologie/menu_tecnologie.jpg';
        } else {
            $i = $(this).attr('data-image');
        }

        // $('#text_image').html($(this).text());
        $p.attr('src', loadImg);
        if ($i != '') {
            $p.attr('src', $i);
        }
    });
}


/*--------------------------------------------------
Drop Country
--------------------------------------------------*/
dropCountry = {
    $t: $('#drop_country'),
    $o: $('.overlay', this.$t),
    $w: $('.drop_country_wrap', this._$),
    open: function () {
        this.$t.show();
        this.$o.fadeIn(900, 'easeInOutQuart');
        this.$w.stop().css({ display: 'block', opacity: 0, marginTop: '-700px' }).animate({ opacity: 1, marginTop: 0 }, 900, 'easeInOutQuart');
        this.change($('.country_wrap'));
    },
    change: function (div) {
        $('.country_wrap, .lang_wrap').hide();
        div.fadeIn(300);
    },
    close: function () {
        setTimeout(function () {
            dropCountry.$t.hide();
        }, 800);
        this.$o.fadeOut(900, 'easeInOutQuart');
        this.$w.stop().animate({ opacity: 0, marginTop: '500px' }, 900, 'easeInOutQuart');
    },
    init: function () {
        $('.lingua_ico,.open_country').on('click', function () {
            dropCountry.open();
            return false;
        });
        this.$o.dblclick(function () {
            dropCountry.close();
            return false;
        });
        $('.close', this.$t).on('click', function () {
            dropCountry.close();
            return false;
        });
        $('[data-view]', this.$t).on('click', function () {
            dropCountry.change($('.' + $(this).attr('data-view')));
            return false;
        });
        $('.country_wrap li a').click(function () {
            $('.lang_wrap li span').removeClass('active');
            $('.country_wrap li a.active').removeClass('active');
            $(this).addClass('active');
            $('.lang_wrap span').hide().parent().addClass('no-country');

            var arr = $(this).data('lang').toString().split(',');
            $.each(arr, function (i, val) {
                $('.lang_wrap span[data-lang="' + val + '"]').show().parent().removeClass('no-country');
            });

            $('.lang_wrap span[data-lang="' + $(this).data('langdef') + '"]').addClass("active");

            $('.lang_wrap .action span').remove();
            $('.lang_wrap .action').prepend('<span>' + $(this).text() + ':</span> ');

            $('#change_lang_btn').click();
            return false;
        });
        $('.lang_wrap li span').click(function () {
            $('.lang_wrap li span').removeClass('active');
            $(this).addClass('active');
        });
        $('#confirm_btn').click(function () {
            dropCountry.close();
            var u = $("input[name=url_doc][data-lg=" + $('.lang_wrap li span.active').data('lang-id') + "][data-mkt=" + $('.country_wrap li a.active').data('country-id') + "]").val();
            if (u != undefined) {
                document.location = u;
            }
        });
    }
}


/*--------------------------------------------------
Drop Login
--------------------------------------------------*/
dropLogin = {
    $t: $('#drop_login'),
    $o: $('.overlay', this.$t),
    $w: $('.drop_login_wrap', this._$),
    open: function () {
        this.$t.show();
        this.$o.fadeIn(900, 'easeInOutQuart');
        this.$w.stop().css({ display: 'block', opacity: 0, marginTop: '-700px' }).animate({ opacity: 1, marginTop: 0 }, 900, 'easeInOutQuart');
        this.change($('.login_wrap'));
    },
    close: function () {
        setTimeout(function () {
            dropLogin.$t.hide();
        }, 800);
        this.$o.fadeOut(900, 'easeInOutQuart');
        this.$w.stop().animate({ opacity: 0, marginTop: '500px' }, 900, 'easeInOutQuart');
    },
    init: function () {
        $('.mycampy_ico').on('click', function () {
            dropLogin.open();
        });
        this.$o.dblclick(function () {
            dropLogin.close();
        });
        $('.close', this.$t).on('click', function () {
            dropLogin.close();
        });
    }
}


/*--------------------------------------------------
Sticky menu
Ale F. Luglio 2016
--------------------------------------------------*/
function stickyMenu() {

    var init = function () {

        var header = $('#header');

        // Non far partire lo sticky menu se si è sulla landing cavatappi o su mobile.
        if (!$('body').is('[data-page="cavatappi"]') && (window.matchMedia("(min-width: 768px)").matches) && !$('body').is('.shop_v2')) {
            

            header
              .affix({
                  offset: {
                      // Distance of between element and top page
                      top: function () {
                          return (this.top = header.offset().top)
                      },


                      // when start #footer
                      bottom: function () {

                          return (this.bottom = $('#footer').outerHeight(true));

                          if (window.innerHeight > 750) {
                              return (this.bottom = $('#footer').outerHeight(true) * 2);
                          } else {
                              return 0;
                          }

                      }

                  }
              })

              // Gestione lenzuolone
              .on('affix.bs.affix', function () {
                  $('#sub_menu_wrapper').addClass('sub-menu--affix');
              })
              .on('affix-top.bs.affix', function () {
                  $('#sub_menu_wrapper').removeClass('sub-menu--affix');
              });

        }

            // Annulla menu sticky quando al resize si passa su mobile
        else if (!$('body').is('[data-page="cavatappi"]') && window.matchMedia("(max-width: 767px)").matches) {

            $(window).off('.affix');
            header
                .removeClass("affix affix-top affix-bottom")
                .removeData("bs.affix");

        }



    } // /init

    // Attivazione / disattivazione menu sticky su mobile al resize  
    jQuery(window).on('resize', _.debounce(init, 200));

    // Primo lancio della funzione
    init();


};


/*--------------------------------------------------
FB Pixel
--------------------------------------------------*/
function updateFBPixelValue(selector, key, newvalue) {
    if ($(selector).length > 0 && $(selector).attr('onclick')) {
        var onclick_data = $(selector).attr('onclick').match(/dataLayer.push\((.*)\)/);
        if (typeof onclick_data != "undefined") {
            var data = onclick_data[1];
            data = data.replace(/'/g, '"');
            var array = JSON.parse(data);
            array[key] = newvalue;
            data = JSON.stringify(array);
            data = data.replace(/"/g, '\'');
            onclick_data[1] = data;
            $(selector).attr('onclick', $(selector).attr('onclick').replace(/dataLayer.push\((.*)\)/, "dataLayer.push(" + onclick_data[1] + ")"));
        }
    }
}


/*--------------------------------------------------
Nav Main
--------------------------------------------------*/
function navMain() {
    var previousScroll = 0,
    headerColor = $('.header-light').length ? 'light' : 'dark';

    // Fixed on scroll
    $(window).on('scroll', function () {
        var scroll = $(this).scrollTop(),
            fixed = $('.header-fixed').length;

        if ($('.nav-open').length == 0 && window.innerWidth > 991) {
            if (scroll > 100) {
                $('header.header').addClass('header-fixed');
                if (headerColor == 'light') {
                    $('header.header').removeClass('header-light').addClass('header-dark');
                }
            } else {
                $('header.header').removeClass('header-fixed');
                if (headerColor == 'light') {
                    $('header.header').removeClass('header-dark').addClass('header-light');
                }
            }

            if (scroll < previousScroll && $('body').is('.is-scrolling') == false) {
                $('header.header').addClass('header-visible');
            } else {
                $('header.header').removeClass('header-visible');
            }
        }

        /* Fixed bar spy scroll */
        if ($('.fixed-bar').length && window.innerWidth > 991) {
            var navs = [];
            $('.fixed-bar .nav a').each(function () {
                var href = $(this).attr('href');
                if ($(href).length) {
                    navs.push({ href: href, scroll: $(href).offset().top - 120 });
                }
            });
            if ($('body.is-scrolling').length == 0) {
                $.each(navs, function (i, val) {
                    if (window.scrollY > val.scroll) {
                        $('.fixed-bar .nav a.active').removeClass('active');
                        $('.fixed-bar .nav a[href="' + val.href + '"]').addClass('active');
                    }
                })
            }
        }

        previousScroll = scroll;
    });

    // Toggle Nav Mobile
    $('.toggle-nav').on('click', function () {
        var $subnav = $('.subnav-mobile');
        if ($subnav.is('.active')) {
            $('body').removeClass('nav-open');
            $(this).removeClass('active');
            $subnav.removeClass('active');
        } else {
            $('body').addClass('nav-open');
            $(this).addClass('active');
            $subnav.addClass('active');
        }

        return false;
    });


    // Subnav Mobile
    $('.subnav-mobile ul li:has("ul") > a').on('click', function () {
        $(this).next().slideToggle(500, 'easeInOutQuart');
        return false;
    });
}

/*--------------------------------------------------
DOC READY
--------------------------------------------------*/
$(function () {   
    navMain();    
    cokbar();
    supahMenu();
    dropCountry.init();
    dropLogin.init();
    stickyMenu();    
    if ($('.touch').length > 0) {
        $('.hover-menu > a').on('click', function () { return false; });
    }
    if (isMobile.apple.phone)
        $("body").addClass('ios-mobile');
});