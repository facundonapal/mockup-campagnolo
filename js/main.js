/*--------------------------------------------------
bigShowreel
--------------------------------------------------*/
function dropMenu()
{
    $(".droplink").mouseover(function ()
    {
        $('ul.dropmenu').show();
    });
    $(".droplink").mouseout(function ()
    {
        $('ul.dropmenu').hide();
    });
    $("ul.dropmenu").mouseover(function ()
    {
        $(this).show();
    });
    $("ul.dropmenu").mouseout(function ()
    {
        $(this).hide();
    });
}


/*--------------------------------------------------
bigShowreel
--------------------------------------------------*/
function bigShowreel()
{
    if ($('.big_showreel').size() && $('.big_showreel div.item').size() > 1)
    {

        $('.big_showreel div[id]:eq(0)').each(function (i)
        {
            $carousel = $('#' + $(this).attr('id'));
            $carousel.slidesjs({
                play: {
                    active: true,
                    // [boolean] Generate the play and stop buttons.
                    // You cannot use your own buttons. Sorry.
                    effect: "slide",
                    // [string] Can be either "slide" or "fade".
                    interval: 5000,
                    // [number] Time spent on each slide in milliseconds.
                    auto: true,
                    // [boolean] Start playing the slideshow on load.
                    swap: true,
                    // [boolean] show/hide stop and play buttons
                    pauseOnHover: true,
                    // [boolean] pause a playing slideshow on hover
                    restartDelay: 500
                    // [number] restart delay on inactive slideshow
                },
                width: 1600,
                height: 639,
                navigation: false,
                callback: {
                    complete: function ()
                    {
                        if ($(window).width() >= 768)
                        {
                            bg_neutro = 'rgba(0,0,0,0)';
                            bg_active = 'rgb(0, 68, 124)';
                        } else
                        {
                            bg_neutro = '#fafafa';
                            bg_active = '#28baff';
                        }
                        $('.slidesjs-pagination a').css({ 'background': bg_neutro });
                        $('.slidesjs-pagination a.active').css({ 'background': bg_active });
                    }
                }
            });
            // wrappo la paginazione
            $('.big_showreel .slidesjs-pagination').wrap('<div class="pag"></div>');
            // creo testi paginazione
            $('.slidesjs-pagination a', $carousel).each(function (i)
            {
                text_pagination = $('.item .pag_text', $carousel).eq(i).html();
                $(this).html(text_pagination);
            });
        });

        // resize
        $(window).on('load resize', function ()
        {
            if ($(window).width() == 768)
            {
                if ($('.big_showreel .slidesjs-container').width() != $(window).width())
                {
                    setTimeout(function ()
                    {
                        $(window).resize();
                    }, 10);
                }
            }
        })
    }
}


/*--------------------------------------------------
Cokbar
--------------------------------------------------*/
function cokbar()
{
    val = document.cookie.match("cookiebar=close");


    if (!val)
    {
        $('body').addClass('menage-cookie-css').prepend("<div class='cookie-adv'><div><span>" + $('.lbl_cokbar').html() + "</span> <a class='chiudi' href='#'></a></div></div>");
        document.cookie = 'cookiebar=close; path=/;'
    };


    $(document).on('click', '.menage-cookie-css .cookie-adv div a.chiudi', function ()
    {
        //document.cookie = 'cookiebar=close; path=/;'
        $('.cookie-adv').remove();
        $('body').removeClass('menage-cookie-css');
        return false;
    });
};


/*--------------------------------------------------
supahMenu
--------------------------------------------------*/
function supahMenu()
{
    var loadImg = '/img/mycampy.png';

    $('#header').on('click', '.menu_mobile #menu_button', function ()
    {
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

    $('#header').on('click', '.menu_mobile li a', function ()
    {
        if ($(this).next().is('ul'))
        {
            $(this).toggleClass('active').next().slideToggle(500, 'easeInOutQuart', function ()
            {
                $('body').css({ height: $('#menu').outerHeight() });
                $('.wrapper').css({ height: $(document).height() });
                $('.wrapper').css({ height: $('#menu').outerHeight() - $('#header').height() })
            });

            return false;
        }
    });


    $(window).on('load resize', function ()
    {
        if ($(window).width() < 768)
        {
            $('#menu').addClass('menu_mobile');
        } else
        {
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
    var autoHeightMenu = 0;

    $('#menu:not(".menu_mobile") #main_menu li.subarrow').on('click', function (e)
    {
        $('#main_menu li a.on').removeClass('on');
        $('a:eq(0)', this).addClass('on');
        clearTimeout(timeout);
        $('#sub_menu_content').html('');
        if ($(this).has('ul'))
        {
            $('#sub_menu_content').append(boxMenu);
            $('#sub_menu_content').append($(this).html());
            $("#sub_menu_content > a").remove()
            $('#sub_menu_content ul').addClass('clearfix');
            autoHeightMenu = $("#sub_menu_content").height() + 50;

            // placeholder image
            //if ($('.soluzioni', this).size()) {

            //    if ($('.tecnologie', this).size()) {
            //        $i = '/img/mycampy.png';
            //        $t = '<p><span>Your cycling world<br /><strong>in the palm of your hand</strong></span><br /><br /><a href="#">FIND OUT MORE</a></p>';
            //    } else {
            //        $i = loadImg;
            //        $t = '<p><span>Your cycling world<br /><strong>in the palm of your hand</strong></span><br /><br /><a href="#">FIND OUT MORE</a></p>';
            //    }

            //    $('<div id="place_image"><img src="' + $i + '">' + $t + '</div>').prependTo('#sub_menu_content');

            //    if ($('.tecnologie', this).size()) {
            //        $('#place_image').wrapInner('<a href="' + $('ul.tecnologie:eq(0)').parent('li').find('a:first').attr('href') + '"></a>');
            //    }

            //    $('#sub_menu_content').css({ padding: 0 });
            //} else if ($('.supporto', this).size()) {
            //    $('#sub_menu_content').css({ paddingLeft: 0 });
            //} else {
            //    $('#sub_menu_content').css({ paddingLeft: $(this).offset().left - $('#sub_menu_content').offset().left + 7 });
            //}

            $('#sub_menu').stop().animate({ height: 0 }, 600, 'easeInOutQuart');
            setTimeout(function ()
            {
                resetHeight = (menuHeight > 0) ? menuHeight : 0;
                openDuration = (menuHeight > 0) ? 400 : 600;
                //menuHeight = 332;
                menuHeight = ($(window).width() < 1199) ? autoHeightMenu : 332;
                $('#sub_menu').css({ height: resetHeight }).stop().animate({ height: menuHeight }, openDuration, 'easeInOutQuart');
            }, 50);

            // click su tablet per l'apertura del sottomenu
            if ($('html.touch').size())
            {
                if ($('#sub_menu').height() < 20 || $('#sub_menu').is(':animated'))
                {
                    $('a', $(this)).each(function ()
                    {
                        $(this).attr('data-href', $(this).attr('href')).removeAttr('href');
                        setTimeout(function ()
                        {
                            $('#main_menu [data-href]').each(function ()
                            {
                                $(this).attr('href', $(this).attr('data-href'));
                            })
                        }, 500);
                    });
                }
            }
            return false;
        } else
        {
            menuHeight = 0;
            $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
            $('#main_menu li a.on').removeClass('on');
        }
    }).mouseout(function ()
    {
        clearTimeout(timeout);
        timeout = setTimeout(function ()
        {
            menuHeight = 0;
            $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
            $('#main_menu li a.on').removeClass('on');
        }, timer);
    });


    $('#sub_menu').mouseover(function ()
    {
        clearTimeout(timeout);
        //menuHeight = 332;
        menuHeight = ($(window).width() < 1199) ? autoHeightMenu : 332;
        $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
    }).mouseout(function ()
    {
        clearTimeout(timeout);
        timeout = setTimeout(function ()
        {
            menuHeight = 0;
            $('#sub_menu').stop().animate({ height: menuHeight }, 600, 'easeInOutQuart');
            $('#main_menu li a.on').removeClass('on');
        }, timer);
    });

    // rollover image
    $('#sub_menu').on('mouseover', 'a[data-image]', function ()
    {
        $p = $('#place_image img');
        if ($(this).parents('.tecnologie').size())
        {
            $i = 'img/tecnologie/menu_tecnologie.jpg';
        } else
        {
            $i = $(this).attr('data-image');
        }

        // $('#text_image').html($(this).text());
        $p.attr('src', loadImg);
        if ($i != '')
        {
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
    open: function ()
    {
        this.$t.show();
        this.$o.fadeIn(900, 'easeInOutQuart');
        this.$w.stop().css({ display: 'block', opacity: 0, marginTop: '-700px' }).animate({ opacity: 1, marginTop: 0 }, 900, 'easeInOutQuart');
        this.change($('.country_wrap'));
    },
    change: function (div)
    {
        $('.country_wrap, .lang_wrap').hide();
        div.fadeIn(300);
    },
    close: function ()
    {
        setTimeout(function ()
        {
            dropCountry.$t.hide();
        }, 800);
        this.$o.fadeOut(900, 'easeInOutQuart');
        this.$w.stop().animate({ opacity: 0, marginTop: '500px' }, 900, 'easeInOutQuart');
    },
    init: function ()
    {
        $('.lingua_ico,.open_country').on('click', function ()
        {
            dropCountry.open();
            return false;
        });
        this.$o.dblclick(function ()
        {
            dropCountry.close();
            return false;
        });
        $('.close', this.$t).on('click', function ()
        {
            dropCountry.close();
            return false;
        });
        $('[data-view]', this.$t).on('click', function ()
        {
            dropCountry.change($('.' + $(this).attr('data-view')));
            return false;
        });
        $('.country_wrap li a').click(function ()
        {
            $('.lang_wrap li span').removeClass('active');
            $('.country_wrap li a.active').removeClass('active');
            $(this).addClass('active');
            $('.lang_wrap span').hide().parent().addClass('no-country');

            var arr = $(this).data('lang').toString().split(',');
            $.each(arr, function (i, val)
            {
                $('.lang_wrap span[data-lang="' + val + '"]').show().parent().removeClass('no-country');
            });

            $('.lang_wrap span[data-lang="' + $(this).data('langdef') + '"]').addClass("active");

            $('.lang_wrap .action span').remove();
            $('.lang_wrap .action').prepend('<span>' + $(this).text() + ':</span> ');

            $('#change_lang_btn').click();
            return false;
        });
        $('.lang_wrap li span').click(function ()
        {
            $('.lang_wrap li span').removeClass('active');
            $(this).addClass('active');
        });
        $('#confirm_btn').click(function ()
        {
            dropCountry.close();
            var u = $("input[name=url_doc][data-lg=" + $('.lang_wrap li span.active').data('lang-id') + "][data-mkt=" + $('.country_wrap li a.active').data('country-id') + "]").val();
            if (u != undefined)
            {
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
    open: function ()
    {
        this.$t.show();
        this.$o.fadeIn(900, 'easeInOutQuart');
        this.$w.stop().css({ display: 'block', opacity: 0, marginTop: '-700px' }).animate({ opacity: 1, marginTop: 0 }, 900, 'easeInOutQuart');
        this.change($('.login_wrap'));
    },
    close: function ()
    {
        setTimeout(function ()
        {
            dropLogin.$t.hide();
        }, 800);
        this.$o.fadeOut(900, 'easeInOutQuart');
        this.$w.stop().animate({ opacity: 0, marginTop: '500px' }, 900, 'easeInOutQuart');
    },
    init: function ()
    {
        $('.mycampy_ico').on('click', function ()
        {
            dropLogin.open();
        });
        this.$o.dblclick(function ()
        {
            dropLogin.close();
        });
        $('.close', this.$t).on('click', function ()
        {
            dropLogin.close();
        });
    }
}




/*--------------------------------------------------
Slideshow
--------------------------------------------------*/
function slideshow()
{
    if ($('.slideshow').size())
    {
        var $c = $('.slideshow [id]:eq(0)');
        if (typeof ($c.slidesjs) != "undefined")
        {
            $('li a', $c).each(function (i)
            {
                text_pagination = $('<span>' + i + '</span>');
                $(this).html(text_pagination);
            });
        }
    }
}

function menuRestyle()
{
    if ($(window).width() > 767)
    {
        if ($('.cont_form').size())
        {

        } else
        {

            $('#top_menu').append('<div class="cont_form"></div>');
            var $t = $('#top_menu .form').clone();
            $('#top_menu .form').remove();
            $t.appendTo(".cont_form");

            $('#top_menu .paesi').clone().appendTo(".cont_form");
        }

    } else
    {
        $('.cont_form').remove();
    }
}

/*--------------------------------------------------
Products
--------------------------------------------------*/
function RemoveProduct(hashcode) 
{
    $.ajax({
        type: "POST",
        url: "/ws/wsECommerce.asmx/bRemove",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON2.stringify({ 'hashcode': hashcode }),
        dataType: "json",
        success: function (data)
        {
            if (data.d.Status) 
            {
                // GTM
                try
                {
                    if (typeof (dataLayer) != "undefined" && typeof (data.d.Props.GTM) != "undefined")
                    {
                        var x = JSON.parse(data.d.Props.GTM);
                        dataLayer.push({
                            'event': 'removeFromCart',
                            'ecommerce': {
                                'remove': {
                                    'products': [x]
                                }
                            }
                        });
                    }
                } catch (e)
                {
                    console.log(e);
                }
                // /GTM

                if (data.d.Props[".cartCount text"] && data.d.Props[".totalecarrello text"])
                {
                    var newqty = data.d.Props[".cartCount text"];
                    if (newqty == "0") $(".shipping-cost-section,.grey-cart-bar,.codici_promo,.cta-checkout,.xpress-checkout").remove();
                    var newtot = data.d.Props[".totalecarrello text"].match(/\d+[,.]?\d*/)[0].replace(",", ".");
                    var newitems = JSON.parse(data.d.Props["ITEMS_CO_IDS"]);
                    var newccats = data.d.Props["ITEMS_CCATS"];
                    var newcnames = data.d.Props["ITEMS_CNAMES"];
                    updateFBPixelValue('.cta-checkout', "value", parseFloat(newtot));
                    updateFBPixelValue('.cta-checkout', "num_items", parseInt(newqty));
                    updateFBPixelValue('.cta-checkout', "content_ids", newitems);
                    updateFBPixelValue('.cta-checkout', "content_category", newccats);
                    updateFBPixelValue('.cta-checkout', "content_name", newcnames);
                    updateFBPixelValue('#frmPPExpress input', "value", parseFloat(newtot));
                    updateFBPixelValue('#frmPPExpress input', "num_items", parseInt(newqty));
                    updateFBPixelValue('#frmPPExpress input', "content_ids", newitems);
                    updateFBPixelValue('#frmPPExpress input', "content_category", newccats);
                    updateFBPixelValue('#frmPPExpress input', "content_name", newcnames);
                }
                _bind($(document), data.d.Props);
                loadCart();
            }
        },
        error: wsError
    });
    return false;
}

/*--------------------------------------------------
Submenu
--------------------------------------------------*/
function stickySubMenu()
{
    hheight = $('.header').height();
    $(window).scroll(function ()
    {
        if ($(this).scrollTop() > hheight)
        {
            $('.submenu').addClass('stickytop');
        }
        else
        {
            $('.submenu').removeClass('stickytop');
        }
    });
};

/*--------------------------------------------------
Sticky Filtri
--------------------------------------------------*/
function stickyFiltri()
{

    var init = function ()
    {

        var filtri = $('.filtri-sticky');

        // Non far partire lo sticky menu se si � sulla landing cavatappi o su mobile.
        if (!$('body').is('[data-page="cavatappi"]') && window.matchMedia("(min-width: 768px)").matches)
        {

            filtri
                .affix({
                    offset: {
                        // Distance of between element and top page
                        top: function ()
                        {
                            return (this.top = filtri.offset().top)
                        },


                        // when start #footer
                        bottom: function ()
                        {

                            return (this.bottom = $('#footer').outerHeight(true));

                            if (window.innerHeight > 550)
                            {
                                return (this.bottom = $('#footer').outerHeight(true) * 2);
                            } else
                            {
                                return 0;
                            }

                        }

                    }
                })



        }

        // Annulla menu sticky quando al resize si passa su mobile
        else if (!$('body').is('[data-page="cavatappi"]') && window.matchMedia("(max-width: 767px)").matches)
        {

            $(window).off('.affix');
            filtri
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
Sticky menu
Ale F. Luglio 2016
--------------------------------------------------*/
function stickyMenu()
{

    var init = function ()
    {

        var header = $('#header');

        // Non far partire lo sticky menu se si � sulla landing cavatappi o su mobile.
        if (!$('body').is('[data-page="cavatappi"]') && window.matchMedia("(min-width: 768px)").matches)
        {

            header
                .affix({
                    offset: {
                        // Distance of between element and top page
                        top: function ()
                        {
                            return (this.top = header.offset().top)
                        },


                        // when start #footer
                        bottom: function ()
                        {

                            return (this.bottom = $('#footer').outerHeight(true));

                            if (window.innerHeight > 750)
                            {
                                return (this.bottom = $('#footer').outerHeight(true) * 2);
                            } else
                            {
                                return 0;
                            }

                        }

                    }
                })

                // Gestione lenzuolone
                .on('affix.bs.affix', function ()
                {
                    $('#sub_menu_wrapper').addClass('sub-menu--affix');
                })
                .on('affix-top.bs.affix', function ()
                {
                    $('#sub_menu_wrapper').removeClass('sub-menu--affix');
                });

        }

        // Annulla menu sticky quando al resize si passa su mobile
        else if (!$('body').is('[data-page="cavatappi"]') && window.matchMedia("(max-width: 767px)").matches)
        {

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

function updateFBPixelValue(selector, key, newvalue)
{
    try
    {
        $('[data-facebook-data]').each(function ()
        {
            $(this).data('facebookData')[key] = newvalue;
        })
    } catch (ex) { }

    //var fbData = elements.data('facebookData');

    //if ($(selector).length > 0)
    //{
    //    var onclick_data = $(selector).attr('onclick').match(/dataLayer.push\((.*)\)/);
    //    if (typeof onclick_data != "undefined")
    //    {
    //        var data = onclick_data[1];
    //        data = data.replace(/'/g, '"');
    //        var array = JSON.parse(data);
    //        array[key] = newvalue;
    //        data = JSON.stringify(array);
    //        data = data.replace(/"/g, '\'');
    //        onclick_data[1] = data;
    //        $(selector).attr('onclick', $(selector).attr('onclick').replace(/dataLayer.push\((.*)\)/, "dataLayer.push(" + onclick_data[1] + ")"));
    //    }
    //}
}

/*--------------------------------------------------
Survey temporaneo
--------------------------------------------------*/
function survey()
{
    var itImg = "/img/survey_it.jpg";
    var enImg = "/img/survey_en.jpg";
    var imgCurrent;

    if ($('#top_menu .top_sx .flag_1').size())
    {
        imgCurrent = itImg;
    } else
    {
        imgCurrent = enImg;
    }

    if (document.cookie.indexOf("visited=") >= 0)
    {

    }
    else
    {
        $('.wrapper').prepend('<div class="survey-wrap"><a target="_blank" href="http://www.m.me/CampagnoloOfficial" class="survey"><img src="' + imgCurrent + '" /></a><a href="#" class="survey-close"><img src="/img/close_white.png" /></a></div>');
    }



    $('.survey-wrap .survey-close').on('click', function (e)
    {

        // set a new cookie
        expiry = new Date();
        expiry.setTime(expiry.getTime() + (59 * 60 * 1000)); // Ten minutes

        // Date()'s toGMTSting() method will format the date correctly for a cookie
        document.cookie = "visited=yes; expires=" + expiry.toGMTString();

        $('.survey-wrap').hide();

        return false;
    });
}

function openPopup() 
{
    if (typeof (window.dataLayer) !== "undefined")
    {
        window.dataLayer.push({
            'event': 'impression',
            'popname': $('#titoloPopup').val()
        });
    }
    if ($(window).width() < 539)
    {
        $('#PopupOpen').addClass('mobile');
        $('#overlay-opacity').addClass('active');
        $(".PopupBox").css("bottom", ($(window).height() - $(".PopupBox").height()) / 2);
        $("html, body").addClass('no-scroll');
    }
    $(".PopupBox").addClass('PopBoxOpen').slideDown("slow", function ()
    {
        $('#PopupClose').show();
    });
    return false;
}

function popUp()
{
    $('#PopupClose').click(function ()
    {
        $('#PopupClose').hide();
        $(".PopupBox").slideUp("slow", function ()
        {
            $(".PopupBox").removeClass('PopBoxOpen').css("bottom", "");
        });
        $('#PopupOpen').removeClass('mobile');
        $('#overlay-opacity').removeClass('active');
        $("html, body").removeClass('no-scroll');
        document.cookie = '_promopopup=closed';
        return false;
    });

    $("#PopupImg").click(function ()
    {
        if (typeof (window.dataLayer) !== "undefined")
            dataLayer.push({ 'event': 'click', 'popname': $('#titoloPopup').val() });

        document.cookie = '_promopopup=closed';
    });

    if (document.cookie.indexOf('_promopopup=closed') === -1)
        openPopup();
}

/*--------------------------------------------------
Doc Ready
--------------------------------------------------*/
$(function ()
{
    bigShowreel();
    slideshow();
    stickyFiltri();
    popUp();

    // survey temporaneo
    //survey();

    setTimeout(function ()
    {
        if (typeof (loadCart) != "undefined")
            loadCart();
    }, 2000);
    /* 
    menuRestyle();    
    dropMenu();    
    */


    /*-----Spostati su menu.js ----*/

    //cokbar();
    //supahMenu();
    //dropCountry.init();
    //dropLogin.init();
    //stickyMenu();
    //stickySubMenu();
    //if ($('.touch').size() > 0) {
    //    $('.hover-menu > a').on('click', function () { return false; });
    //}   

    /*-----Spostati su menu.js ----*/

});


/*--------------------------------------------------
Win Resize
--------------------------------------------------*/
$(window).resize(function ()
{
    var $mbutton_open = $('#header .menu_mobile #menu_button.open');
    if ($mbutton_open.size() > 0)
    {
        var height = $('#menu').outerHeight() - $('#header').height();
        $('.wrapper').css({ height: height, minHeight: $(window).height() - $('#header').height() });
    }
    //menuRestyle();
});