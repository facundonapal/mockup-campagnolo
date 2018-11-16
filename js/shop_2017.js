/*--------------------------------------------------
Browsers
--------------------------------------------------*/
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
var isIE10 = navigator.userAgent.toString().toLowerCase().indexOf("trident/6") > -1;
var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
var isEdge = window.navigator.userAgent.indexOf("Edge") > -1;

function oldBrowsers() {
    if (isIE10 === true) {
        $('html').addClass('msie10');
    }

    if (isIE11 === true) {
        $('html').addClass('msie11');
    }

    if (isSafari === true) {
        $('html').addClass('safari');
    }

    if (isEdge === true) {
        $('html').addClass('edge');
    }
}

/*--------------------------------------------------
LISTING PRODOTTI - GESTIONE VARIANTI
--------------------------------------------------*/
function attivaVariante(ind, src, el)
{
    $('.list-size li', el).attr('data-active', 'false');
    $('.list-size li[data-order=' + ind + ']', el).attr('data-active', 'true');
    $('.product-image > img', el).attr('src', src);
}

var hoverVariante = false,
    timeoutVariante;

function gestioneVarianti()
{

    $('.shop-listing-product .list-color li').hover(function ()
    {
        hoverVariante = true;
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        attivaVariante($(this).index(), $("a", this).attr("data-image"), $(this).parents('.shop-listing-product'));
    }, function ()
    {
        clearTimeout(timeoutVariante);
        hoverVariante = false;
        $t = $(this);

        timeoutVariante = setTimeout(function ()
        {
            if (hoverVariante == false)
            {
                $t.removeClass('active');
                $t.parents('.shop-listing-product').find('li:eq(0)').addClass('active');
                attivaVariante(0, $('.list-color li.active a', $t.parents('.shop-listing-product')).attr('data-image'), $t.parents('.shop-listing-product'));
            }
        }, 250);

    });
}


/*--------------------------------------------------
SCHEDA PRODOTTO - GESTIONE VARIANTI
--------------------------------------------------*/
function onChangeVariante()
{
    ind = $(this).parent().index();
    sellable = $(this).parent().attr("data-issellable");
    parent = $(this).parents('.product-description');
    if ($(this).parents('.bundle-config').length == 0)
    {
        parent = $(this).parents('.product-description');
        if ($(this).attr("data-image") == undefined)
        {
            //SCHEDA PRODOTTO            
            $('.image-gallery-wrap', '.product-detail-wrap').removeClass('active');
            $('.image-gallery-wrap[data-order=' + ind + ']', '.product-detail-wrap').addClass('active');
        } else
        {
            //PRODOTTI CORRELATI
            $('.product-image a > img', parent.parent('.shop-listing-product')).attr('src', $(this).attr("data-image"));
        }
    } else
    {
        //BUNDLE
        parent = $(this).parents('.bundle-config');
        $('.image-item-bundle img', parent).attr('src', $(this).attr("data-image"));
    }
    $('#err_message:visible, #stock_message:visible').hide(0);
    $('.list-size .btn-group .active', parent).removeClass('active');
    $('.product-detail-wrap #qty').attr("max", $(this).parent().attr("data-stock")); //IMPOSTA MAX QTA' SE CI SONO COLORI
    $('.list-size .btn-group', parent).removeClass('active');
    $('.list-size .btn-group[data-order=' + ind + ']', parent).addClass('active');
    $(parent).attr("data-issellable", sellable);
}

// INPUT CHANGE VARIANTE COLORE
function gestioneVariantiDettaglio()
{
    $('.product-description .list-color').on("change", "input", onChangeVariante);

    //IMPOSTA MAX QTA' SE CI SONO TAGLIE
    $('.product-description .list-size').on("change", "input", function ()
    {
        if ($(this).parent().attr("data-stock") == "0")
        {
            $(parent).attr("data-issellable", "0");
        }
        else
        {
            $(parent).attr("data-issellable", "1");
        }

        $('#err_message:visible, #stock_message:visible').hide(0);
        $('.product-detail-wrap #qty').attr("max", $(this).parent().attr("data-stock"));

    });

    $('.product-description').on("change", "#qty", function ()
    {
        qt = parseInt($(this).val(), 10);
        mx = parseInt($(this).attr("max"), 10);
        if (qt <= mx)
        {
            $('#stock_message:visible').hide(0);
        } else
        {
            $('#stock_message').show(0);
        }
    });
}




/*--------------------------------------------------
CHECK SCROLL
--------------------------------------------------*/
function checkScroll(e, n, t, nav)
{
    return (($(t).scrollTop() > $(e).height() / n) && ($(t).scrollTop() < ($(nav).parent().offset().top + $(nav).parent().height())));
}


/*--------------------------------------------------
HEADER FIXED
--------------------------------------------------*/
if ($('#listing-nav').length > 0)
{
    $(document).on('scroll', function (e)
    {
        $('#listing-nav').toggleClass('fixed', checkScroll('#hero', 1, this, '#listing-nav'));
        $('.filters-link').toggleClass('filters-link-fixed"', checkScroll('#hero', 1, this, '#listing-nav'));
    });
}


/*--------------------------------------------------
GO TO SECTION
--------------------------------------------------*/
function goToSection(ancor)
{
    $('html, body').animate({ scrollTop: ($(ancor).offset().top) }, 800, "swing");
}


/*--------------------------------------------------
SLICK SLIDERS
--------------------------------------------------*/
function slickSlidersInit()
{
    $('.slider-category').slick({
        infinite: true,
        arrows: false,
        dots: true
    });

    $('.slider-related').on('init', function ()
    {
        if ($('.slider-related .slick-dots li').length <= 1)
        {
            $('.slider-related .slick-dots').hide();
        } else
        {
            $('.slider-related .slick-dots').show();
        }
    }).slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 1700,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    arrows: false,
                    dots: true
                }
            },
            {
                breakpoint: 1439,
                settings: {
                    slidesToShow: 2.5,
                    slidesToScroll: 2.5,
                    arrows: false,
                    dots: true
                }
            },
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false,
                    dots: true
                }
            }
        ]
    });

    $('.image-gallery-wrap .image-gallery').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        slide: "a",
        responsive: [
            {
                breakpoint: 2560,
                settings: "unslick",
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                }
            }
        ]
    });

    $('.slider-outfit').slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 2560,
                settings: "unslick",
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                }
            }
        ]
    });
}


/*--------------------------------------------------
SET ACTIVE MENU
--------------------------------------------------*/
function setMenu(ca)
{
    if (typeof (ca) != "undefined" && ca != null)
        if ($(".shop-menu a[data-ca='" + ca + "']").length > 0)
            $(".shop-menu a[data-ca='" + ca + "']").parent().addClass("active");
}


/*--------------------------------------------------
    miniCart REMOVE PRODUCT
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
                                    'products': [{
                                        'name': x.name,
                                        'id': x.id,
                                        'price': x.price,
                                        'category': x.category,
                                        'dimension1': x.dimension1,
                                        'quantity': x.quantity
                                    }]
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
}


/*--------------------------------------------------
    survey
--------------------------------------------------*/
function survey()
{
    var itImg = "/img/survey_it.jpg";
    var enImg = "/img/survey_en.jpg";
    var imgCurrent;

    if ($('#top_menu .top_sx .flag_1').length)
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

/*--------------------------------------------------
Filters Shop
--------------------------------------------------*/
function filtersShop() {
    $('.filters-link').on('click', function (e) {
        $('#filters-shop').addClass("open");
        e.preventDefault();
        //var aid = $(this).attr("href");
        //$('html,body').animate({ scrollTop: $(aid).offset().top }, 'slow');

        if ($("#listing-nav").is(".fixed")) {

            var aid = $(this).attr("href");
            $('html,body').animate({ scrollTop: $(aid).offset().top }, 'slow');

        }
    });

    $('.chiudi-filtri span').on('click', function (e) {
        $('#filters-shop').removeClass("open");
        e.preventDefault();
    });
}

/*--------------------------------------------------
Filters Shop Mobile
--------------------------------------------------*/
function filtersShopMobile() {
    $('.filters-link-mobile').on('click', function (e) {
        $('#filters-shop').toggleClass("open");
        $(this).html(function (i, html) {
            return html === 'Chiudi <i class="material-icons">close</i>' ? 'Filtri <i class="material-icons">filter_list</i>' : 'Chiudi <i class="material-icons">close</i>';
        })

    });
}


/*--------------------------------------------------
DOCUMENT READY
--------------------------------------------------*/
$(function ()
{
    oldBrowsers();
    //survey();
    //Script Sito Istituzionale
    cokbar();
    supahMenu();
    dropCountry.init();
    dropLogin.init();
    filtersShop();
    filtersShopMobile();
    if ($('.touch').length > 0)
    {
        $('.hover-menu > a').on('click', function () { return false; });
    }

    //$("#miniCart").remove();
    //$(".openMiniCart .num_items").remove();


    //Script Sito Shop    
    if ($('.touch').length == 0) { gestioneVarianti() }
    gestioneVariantiDettaglio();
    slickSlidersInit();
    var timeoutGoToSection;
    var timeoutClass;
    $('[data-href]').on('click', function ()
    {
        clearTimeout(timeoutGoToSection);
        $t = $(this);
        $ancor = $(this).attr('data-href');
        timeoutGoToSection = setTimeout(function ()
        {
            if ($($ancor).hasClass("panel-heading") && !$t.hasClass("collapsed"))
            {
                $("a.collapsed", $ancor).removeClass("collapsed");
                goToSection($ancor);
            }
        }, 250);
    });
    $("[data-fancybox]").fancybox({
        thumbs: {
            autoStart: true
        }
    });
});


/*--------------------------------------------------
WINDOW RESIZE
--------------------------------------------------*/
$(window).resize(function ()
{
    if ($('.touch .image-gallery-wrap .image-gallery').length > 0 && $(window).width() < 991 && $(window).width() > 767)
    {
        $('.image-gallery-wrap .image-gallery').slick("resize");
    }
});


/*--------------------------------------------------
WINDOW LOAD
--------------------------------------------------*/
$(window).on("load", function ()
{
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0 || window.navigator.userAgent.indexOf("Edge") > -1)
    {
        $('.shop-listing .shop-listing-image figure .bg-img').css("height", "300px");
        setTimeout(function ()
        {
            $('.shop-listing .shop-listing-image figure .bg-img').css("height", "");
        }, 100);
    }
});