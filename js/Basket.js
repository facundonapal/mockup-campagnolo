var MAX_QTA = 5;

function setCart(data) {
    if (data.d.Status) {
        if (parseInt(data.d.Props.Count) == 0 && $("#urlHomeShop").length > 0) {     //checkout
            location.href = $("#urlHomeShop").val();
        }
        if ($(".openMiniCart .num_items").length == 0) {
            $(".openMiniCart > a:first").append('<span class="num_items"></span>')
        }
        if (data.d.Props.Basket != undefined) {
            $("#basket-list").html(data.d.Props.Basket);
        }
        if (data.d.Props.BasketStep2 != undefined) {
            $("#basket-list-step2").html(data.d.Props.BasketStep2);
        }
        if (data.d.Props.AccessoriAggiuntiviList != undefined) {
            $("#acc-container").html(data.d.Props.AccessoriAggiuntiviList)
        }
        $(".num_items").html(data.d.Props.Count);
        $("#miniCart").html(data.d.HTML);
    } else {
        alert(data.d.ErrMessage);
    }
}

function loadCart() {
    $.ajax({
        type: "POST",
        url: "/ws/wsECommerce.asmx/MiniCart",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: '{"w":"s"}',
        dataType: "json",
        success: setCart
    });
}

/*--------------------------------------------------
Open Mini Cart
--------------------------------------------------*/
function openMiniCart() {    
    //$('header .cart').addClass("evidence");
    $('#miniCartContainer').addClass("active");
    //setTimeout(function () {
    //    $('header .cart').removeClass("evidence");
    //}, 2000);
}

//
// AddProduct
//
function AddProduct(caller, code, quantita, withRedir) 
{
    if (isNaN(quantita)) return;
    if (quantita <= 0) return;
    $.ajax({
        type: "POST",
        url: "/WS/wsEcommerce.asmx/bAdd",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON2.stringify({ "id": code, "qta": quantita }),
        dataType: "json",
        success: function (data)
        {
            AddProductSuccess(caller, data, withRedir);
        },
        error: function (data) {
            alert("Web-Service Error!!");
        }
    });
}

function AddProduct2(caller, code, taglia, quantita, withRedir) 
{
    if (isNaN(quantita)) return;
    if (quantita <= 0) return;
    $.ajax({
        type: "POST",
        url: "/WS/wsEcommerce.asmx/bAddVariante",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON2.stringify({ "id": code, "size": taglia, "qta": quantita }),
        dataType: "json",
        success: function (data)
        {
            AddProductSuccess(caller, data, withRedir);
        },
        error: function (data) {
            alert("Web-Service Error!!");
        }
    });
}

function AddProductSuccess(caller, data, withRedir)
{
    if (caller && caller.hasAttribute("data-fbpixel")) 
    {
        try
        {
            var array = JSON.parse($(caller).attr("data-fbpixel").replace(/'/g, '"'));
            array["event"] = "AddToCart";
            array["content_type"] = "product";
            var push = "dataLayer.push(" + JSON.stringify(array) + ")";
            eval(push);
        }
        catch (e)
        {
            console.log("ERR in data-fbpixel");
            console.log(e);
        }
    }
    if (data != null)
    {
        // GTM
        try
        {
            if (typeof (dataLayer) != "undefined" && typeof (data.d.Props.GTM) != "undefined")
            {
                var x = JSON.parse(data.d.Props.GTM);
                dataLayer.push({
                    'event': 'addToCart',
                    'ecommerce': {
                        'currencyCode': 'EUR',
                        'add': {
                            'products': [{
                                'name': x.name,
                                'id': x.id,
                                'price': x.price,
                                'category': x.category,
                                'dimension1': x.dimension1,
                                'metric1': x.metric1,
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

        if (typeof (withRedir) != "undefined" && withRedir == true)
        {
            location.href = data.d.Props.LinkCarrello;
        }
        else
        {
            setCart(data);
            //if ($(window).width() > 767) {
            //    $('html, body').animate({ scrollTop: 0 }, 500);
            //}
            //$('.box_shopping').slideDown(1000);
            openMiniCart();
        }
    }
}

//
// changeQta
//
var _t = [];
function changeQta(hashcode, event)
{
    // è sull'evento keyUp quindi se devo scrivere 12, fa il changeQta due volte (con 1 e con 12)
    // per ovviare timeout +650ms avanti
    // se nel frattempo arriva un'altra lettera, cancello il timeout precedente e faccio sempre solo l'ultimo
    $(_t).each(function (i, o)
    {
        clearTimeout(o);
    });
    _t.push(setTimeout(function () { doChangeQta(hashcode, event); }, 650));
}
function doChangeQta(hashcode, event) 
{
    var
        $obj = $('#basket' + hashcode),
        $from = $obj.find('.currQtaInput'),
        $to = $obj.find('.qtaInput'),
        $maxQta = $obj.find(".qtaMax"),
        from = Number($from.val()),
        maxQta = Number($maxQta.val()),
        to = Number($to.val());


    if (event == 'blur' && $to.val() == '') {
        $to.val($from.val());
        $to.removeAttr("style");
        return;
    }

    /* validazione */
    $to.removeAttr("style");
    if (isNaN(to) || to <= 0) {
        $to.attr("style", "color:#f00;");
        return;
    }

    if (maxQta > 0 && to > maxQta) {
        $to.val(maxQta);
        $obj.find(".maxQtaWarning").slideDown(800);
        $to.attr("style", "color:#f00;");
        setTimeout(function () { $to.removeAttr('style'); $obj.find(".maxQtaWarning").slideUp(500); }, 3000);
        return;
    }

    /* se necessario cambio */
    if (from != to) {
        if (tChangeQta != null)
            clearTimeout(tChangeQta);

        var dtStart = new Date();
        dtChangeQta = dtStart;

        $.ajax({
            type: "POST",
            url: "/ws/wsECommerce.asmx/bChangeQta",
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: JSON2.stringify({ 'hashcode': hashcode, 'qta': to }),
            dataType: "json",
            success: function (data) {
                var dtStop = new Date();

                if (data.d.Status) {
                    if (data.d.Props[".cartCount text"] && data.d.Props[".totalecarrello text"]) {
                        var newqty = data.d.Props[".cartCount text"];
                        var newtot = data.d.Props[".totalecarrello text"].match(/\d+[,.]?\d*/)[0].replace(",", ".");
                        updateFBPixelValue('.cta-checkout', "value", newtot);
                        updateFBPixelValue('.cta-checkout', "num_items", newqty);
                        updateFBPixelValue('#frmPPExpress input', "value", newtot);
                        updateFBPixelValue('#frmPPExpress input', "num_items", newqty);

                        // GTM
                        try {
                            if (typeof (dataLayer) != "undefined" && typeof (data.d.Props.GTM) != "undefined") {
                                tChangeQta = setTimeout(delayChangeQtaGTM(data, from, dtStart), 500);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        // /GTM

                        if (event == 'blur') {
                            var now = parseInt(data.d.Props[".qtaInput,.currQtaInput val"]);
                            try {
                                console.log("From " + from + " To " + to + " --> NOW IS: " + now);
                            } catch (e) { }
                            if (now != to && typeof (_lblQtaNonDisponibile) != "undefined")
                                alert(_lblQtaNonDisponibile);
                        }
                    }
                    _bind($obj, data.d.Props);
                    loadCart();
                }
            },
            error: wsError
        });
    }
}

var tChangeQta = null;
var dtChangeQta = null;

function delayChangeQtaGTM(data, from, dtStart) {

    return function () {

        if (dtStart < dtChangeQta) return;

        var diff = Number(data.d.Props[".qtaInput,.currQtaInput val"]) - from;
        if (diff == 0) return;

        var x = JSON.parse(data.d.Props.GTM);

        if (diff > 0) {
            dataLayer.push({
                'event': 'addToCart',
                'ecommerce': {
                    'currencyCode': 'EUR',
                    'add': {
                        'products': [{
                            'name': x.name,
                            'id': x.id,
                            'price': x.price,
                            'category': x.category,
                            'dimension1': x.dimension1,
                            'metric1': (Math.round(x.price * diff * 100) / 100).toString().replace(/(\.\d)$/, '$10').replace(/^([^\.]+)$/, '$1.00'),
                            'quantity': diff
                        }]
                    }
                }
            });
        } else {
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
                            'metric1': (Math.round(-x.price * diff * 100) / 100).toString().replace(/(\.\d)$/, '$10').replace(/^([^\.]+)$/, '$1.00'),
                            'quantity': -diff
                        }]
                    }
                }
            });
        }

        tChangeQta = null;
    }
}

//
// retrievePrezzoCorriere 
//
function RetrieveSpeseSped(sender) {
    var country = $("#orderCountrySelect").val();
    var special = $("#specialDelivery").val();
    $.ajax({
        type: "POST",
        url: "/ws/wsECommerce.asmx/bSpeseSped",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON2.stringify({ 'id': country, 'specialDelivery': special }),
        dataType: "json",
        success: function (data) {
            if (data.d.Status) {
                _bind($(document), data.d.Props);
                var d = JSON2.parse(data.d.Props.PRODUCTS);
                var h;
                for (var p in d) {
                    h = d[p];
                    $("#basket" + h.id + " .price-money").html(h.unitPrice);
                    $("#basket" + h.id + " .price-punti").html(h.unitPrice);
                    $("#basket" + h.id + " .prezzotot").html(h.tot);
                }

                if (data.d.Props.SCORPORO_IVA == "True")
                    $(".scorporo_iva_warning").slideDown(500);
                else
                    $(".scorporo_iva_warning").slideUp(500);


                if ($("#specialDelivery").is(":visible")) {
                    if ($("#specialDelivery").val() == null) {
                        $(".cta-checkout").addClass("disabled");
                        $("#frmPPExpress input").attr("disabled", "disabled");
                    }
                    else {
                        if (data.d.Props.SPED_NON_DISPONIBILE == "True") {
                            $(".cta-checkout").addClass("disabled");
                            $("#frmPPExpress input").removeAttr("disabled");
                            $(".sped_not_available").slideDown(500);
                        }
                        else {
                            $(".cta-checkout").removeClass("disabled");
                            $("#frmPPExpress input").removeAttr("disabled");
                            $(".sped_not_available").slideUp(500);
                        }
                    }
                }
            }
            //removeLoading(sender);
        },
        error: wsError
    });
    return true;
}

function CanCheckout() {
    if ($(".sped_not_available").is(":visible"))
        return false;

    if ($("#specialDelivery").is(":visible") && $("#specialDelivery").val() == null)
        return false;

    return true;
}

function TrackCheckout(step) {
    try {
        if (typeof (dataLayer) != "undefined" && dataLayer != null) {
            var opt = '';
            if (typeof (_datagateway) != "undefined")
                opt = _datagateway;

            return $.ajax({
                type: "POST",
                url: "/ws/wsECommerce.asmx/gtmProducts",
                cache: false,
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
                .done(function (data) {
                    dataLayer.push({
                        'event': 'checkout',
                        'ecommerce': {
                            'checkout': {
                                'actionField': { 'step': step, 'option': opt },
                                'products': eval(data.d)
                            }
                        }
                    });
                });
        }
    }
    catch (e) {
        console.log(e);
    }
}

function TrackCheckoutEvent(e, step) {
    e.preventDefault();

    if (!CanCheckout())
        return;

    var me = $(this);

    var go =
        $(this).is('form')
            ? function () { setTimeout(function () { me.get(0).submit(); }, 1200); }
            : function () { setTimeout(function () { document.location = me.prop('href'); }, 1200); };

    var data = $(this).data();
    var facebookData = data.facebookData;
    var facebookEvent = data.facebookEvent;
    if (facebookData) {
        _datagateway = data.gateway;

        if (facebookEvent)
            facebookData.event = facebookEvent;

        dataLayer.push(facebookData);
    }

    var track = TrackCheckout(step);
    if (track)
        track.then(go, go, null);
    else
        go();
}

//
// CheckBasket
//
function CheckBasket() {
    // Controllo che sia stato selezionato il Pease di Spedizione
    var v = $("#ddlPaesiSped").val();
    if (v == -1) {
        var c = "<div class='alertFancy'>" + $("#alertPaeseSpedReq").html() + "</div>";
        $.fancybox({ 'content': c });
        return false;
    }

    // Controllo che la Qta di Prodotti sia > 0 (non dovrebbe poter accadere ma non si sa mai)
    var qta = $(".lista").length;
    if (qta <= 0) {
        var c = "<div class='alertFancy'>" + $("#alertBasketEmpty").html() + "</div>";
        $.fancybox({ 'content': c });
        return false;
    }

    return true;
}

// 
// wsError
// 
function wsError(jqXHR, textStatus, errorThrown) {
    var msg = textStatus;
    if (errorThrown != null && errorThrown != "")
        msg = textStatus + " (" + errorThrown + ")";

    Log("  " + msg);
    alert(msg);

    removeLoading();
}

//
// loadSpecialDelivery
//
function loadSpecialDelivery() {
    if ($("#orderCountrySelect").length > 0) {
        $('#specialDelivery').empty();
        var country = $("#orderCountrySelect").val();
        $.ajax({
            type: "POST",
            url: "/ws/wsECommerce.asmx/bSpecialDelivery",
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: JSON2.stringify({ 'id': country }),
            dataType: "json",
            success: function (data) {
                if (data.d.Status) {
                    var count = parseInt(data.d.Props.SPECIAL_DELIVERY_COUNT);
                    if (count == 0) {
                        $('#specialDelivery').hide();
                        $(".alert_sped").hide();
                        $(".sped_not_available").hide();
                        $(".cta-checkout").removeClass("disabled");
                        $("#frmPPExpress input").removeAttr("disabled");
                    }
                    else {
                        $(".alert_sped").show();
                        $('#specialDelivery').append(data.d.HTML);
                        $('#specialDelivery').val(null);
                        $('#specialDelivery').show();
                    }
                    $("#spedNazione option:first").val($("#orderCountrySelect option[value='" + country + "']").val());
                    $("#spedNazione option:first").text($("#orderCountrySelect option[value='" + country + "']").text());
                    $("#spedNazione").val(country)
                    $("#spedNazione").change();
                }

                /*if ($("#orderCountrySelect option").size() == 1 && !$("#specialDelivery").is(":visible")) {
                    $(".shipping-cost-section .spedizioni-select").hide();
                }*/

                RetrieveSpeseSped();
                //removeLoading(sender);
            },
            error: wsError
        });
    }
    return true;
}

//// ricarico per multi safe pay
//function reloadMSP(provenienza) {

//    if (provenienza != "timeout") {
//        // necessario un ritardo per sincronizzare i valori
//        setTimeout("reloadMSP('timeout')", 500)
//        return false;
//    }

//    if ($("#spedNazione:visible").size() > 0)
//        country = $("#spedNazione:visible").val();
//    else
//        country = $("#Nazione").val();
//    //alert("#spedNazione:visible=" + $("#spedNazione:visible").size() + "|co=" + country + "|pr=" + provenienza)



//    //showLoading(sender);
//    if (country !== '') {
//        //console.log('test 3: ' + country);
//        $.ajax({
//            type: "POST",
//            url: "/ws/wsECommerce.asmx/bSpeseSped",
//            cache: false,
//            contentType: "application/json; charset=utf-8",
//            data: JSON2.stringify({ 'id': country }),
//            dataType: "json",
//            success: function (data) {
//                if (data.d.Status) {
//                    //console.log('test 4: ');
//                    //console.log(data.d);

//                    _bind($(document), data.d.Props);
//                }
//                //removeLoading(sender);
//            },
//            error: wsError
//        });
//    }
//    return true;

//}



//
// INIT
//
$(function () {
    if ($(".maxQtaWarning").length > 0) {
        $(".maxQtaWarning").hide();
        //$(".maxQtaWarning").html($(".maxQtaWarning").html().replace("#QTA#", MAX_QTA));
    }
    $('#orderCountrySelect').change(loadSpecialDelivery);
    $('#specialDelivery').change(RetrieveSpeseSped);

    if ($(".iFrameCodSconto").length > 0)
        $(".iFrameCodSconto").fancybox({ "titleShow": false, "width": 650, "height": 350 });

    loadSpecialDelivery();

    if ($(".sped_not_available").length > 0 && $(".sped_not_available").is(":visible")) {
        $(".cta-checkout").addClass("disabled");
        $("#frmPPExpress input").attr("disabled", "disabled");
    }

    if (window.location.hash != "") {
        cls = window.location.hash.substring(1);
        if (cls != undefined) {
            $("." + cls).show();
        }
    }

    $('.openMiniCart').on("click", function () {
        openMiniCart();
        return false;
    });

    $('.closeMiniCart').on("click", function () {
        $('#miniCartContainer').removeClass("active");
    });
});

function _bind(obj, props) {
    for (name in props) {
        var match = name.match(/(\S*) (val|text|html)$/);
        if (match) {
            var object = obj.find(match[1]);
            if (object.length == 0) object = $(match[1]);
            $.fn[match[2]].call(object, props[name]);
        }
    }
}

function RemoveProductsGroup() {
    if (confirm($("#removeGroupConfirmLbl").val())) {
        $.ajax({
            type: "POST",
            url: "/ws/wsECommerce.asmx/bRemoveProductsGroup",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d.Status) {
                    if (data.d.Props[".cartCount text"] && data.d.Props[".totalecarrello text"]) {
                        var newqty = data.d.Props[".cartCount text"];
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
}