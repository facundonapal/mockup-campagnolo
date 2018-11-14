$.validator.defaults.getDataToSend = function (form) {
    return { data: GetJsonData(form) };
};
$.validator.defaults.callbackHandler = function (data, form) {

    if ($(form).attr("id") == "form_lcn") {
        $('html, body').stop().animate({ scrollTop: 0 }, 800, 'easeInOutQuart');
        $('#form_lcn').slideUp(800, 'easeInOutQuart');
        $('#frmUpLoad').slideUp(800, 'easeInOutQuart');
    }
    $(".row.form_submit").hide().html('<div class="success">' + data.d.HTML + '</div>').slideDown(400);

    if ($(form).attr("id") == "contatta_shop_form") {
        //_gaq.push(['_trackEvent', 'Contatti Negozi', $(form).attr("data-name"), 'Form Inviato']);
        dataLayer.push({
            'event': 'Contatti Negozi',
            'nome_negozio': $(form).attr("data-name"),
            'etichetta': 'Form Inviato'
        });

    } else if ($(form).attr("id") == "contatti") {
        //_gaq.push(['_trackPageview', location.pathname + "_" + $("#MotivazioneContatto option:selected").text().replace(/ /g, '_') + '_ok']);
        dataLayer.push({
            'event': 'Form',
            'page': location.pathname + "_" + $("#MotivazioneContatto option:selected").text().replace(/ /g, '_') + '_ok'
        });
    } else {
        //_gaq.push(['_trackPageview', location.pathname + '_ok']);
        dataLayer.push({
            'event': 'Form',
            'page': location.pathname + '_ok'
        });
    }

    // FB Pixel
    if ($(form).attr("id") == "frmRegister" || $(form).attr("id") == "form_register") {
        dataLayer.push({ 'event': 'CompleteRegistration' });
    } else if ($(form).attr("id") == "form_newsletter") {
        dataLayer.push({ 'event': 'Lead' });
    }
}
$.validator.addMethod("validateSelect", function (value, element)
{
    return this.optional(element) || value != "-1";
});
$.validator.defaults.submitHandler = function () {
    var validator = this,
        form = validator.currentForm,
        $loading = null;

    $(form).find("button[type=submit]").hide();
    if ($(".loading", form).length > 0)
    {
        $loading = $(".loading", form);
        $loading.show();
    }
    $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON2.stringify(validator.settings.getDataToSend(form)),
        dataType: "json",
        success: function (data)
        {
            if ($loading != null) $loading.hide();
            // se c'è data.d.Status ed è a 'false' mostro il pulsante per riprovare
            if (typeof (data) != "undefined" && typeof (data.d) != "undefined" && typeof (data.d.Status) != "undefined" && !data.d.Status)
                $(form).find("button[type=submit]").show();
            validator.settings.callbackHandler(data, form);
        },
        error: function (data) 
        {
            if ($loading != null) $loading.hide();
            alert("Web-Service Error!!");
            $(form).find("button[type=submit]").show();
        }
    });

    return false;
}

$.extend($.validator.messages, {
    email: '',
    required: ''
});

$.validator.defaults.ignore = ':hidden:not(select.selectpicker)';
$.validator.defaults.errorPlacement = function (error, element) {};

$.validator.defaults.highlight_base = $.validator.defaults.highlight;
$.validator.defaults.highlight = function (element, errorClass, validClass) {
    $.validator.defaults.highlight_base.call(this, element, errorClass, validClass);

    var select = $(element).filter('select');
    if (select.length && select.data('selectpicker'))
        select.data('selectpicker').button.removeClass(validClass).addClass(errorClass);

    if ($(element).is(":checkbox")) $(element).parent().removeClass(validClass).addClass(errorClass);

};

$.validator.defaults.unhighlight_base = $.validator.defaults.unhighlight;
$.validator.defaults.unhighlight = function (element, errorClass, validClass) {
    $.validator.defaults.unhighlight_base.call(this, element, errorClass, validClass);

    var select = $(element).filter('select');
    if (select.length && select.data('selectpicker'))
        select.data('selectpicker').button.removeClass(errorClass).addClass(validClass);

    if ($(element).is(":checkbox")) $(element).parent().removeClass(errorClass).addClass(validClass);

};

function GetJsonData(formObj) {
    var d = {};
    var form = $(formObj);
    var fields = form.find("input[name][name!=''][type!=submit][type!=reset]")/*.filter("[type=email], [type=text], [type=password], [type=checkbox], [type=radio], [type=hidden]")*/;

    fields.each(function () {
        var
            type = $(this).attr("type"),
            name = $(this).attr("name"),
            value;

        switch (type) {
            case "checkbox":
            case "radio":
                var list = fields.filter('[name=' + name + '][type=' + type + ']');
                if (list.length == 1)
                    value = $(this).is(':checked');
                else {
                    if (d[name]) return;

                    var values = [];
                    list.each(function () { if ($(this).is(':checked')) values.push($(this).val()); });
                    value = values.join(',');
                }
                break;

            default:
                value = $(this).val();
                value = $.trim(value);
                break;
        }

        d[name] = value;
    });

    form.find("select[name][name!=''], textarea[name][name!='']").each(function () {
        var name = $(this).attr("name");
        d[name] = $(this).val();

    });

    return d;
}


/* showLoading
----------------*/
function showLoading(sender, frmId) {
    var defaultTxt;
    if ($("#hfLoadingText").length)
        defaultTxt = $("#hfLoadingText").val();
    else
        defaultTxt = "Registrazione in Corso ...";

    showLoadingText(sender, frmId, defaultTxt);
}

function showLoadingText(sender, frmId, txt) {
    $("#" + frmId + " .divNotify").html("<div id=\"contLoading\"> <img src='/img/loading.gif' /> <span class=\"red\"> " + txt + " </span> </div>");
    $("#" + frmId + " .divNotify").show();
    $(sender).fadeOut(350);
}

/* removeLoading
-----------------*/
function removeLoading(sender) {
    $("#contLoading").remove();
    $(sender).fadeIn(400);
}

/*  wsError
-------------*/
function wsError(jqXHR, textStatus, errorThrown) {
    var msg = textStatus;
    if (errorThrown != null && errorThrown != "")
        msg = textStatus + " (" + errorThrown + ")";
    alert(msg);
}

$(function () {
    $("form").each(function ()
    {
        var $l = $(".loading", this);
        if ($l != null) $l.hide();
    });
});


function logout() {
    // POST AJAX
    $.ajax({
        type: "POST",
        url: "/WS/wsUsers.asmx/Logout",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: '{"w":"s"}',
        dataType: "json",
        success: function (data) {
            if (data != null) {
                if (data.d.Status) {
                    dataLayer.push({
                        'event': 'logout',
                        'userid': Number(data.d.Props.id || "0")}); 
                    document.location.reload();
                }
            }
        },
        error: function (data) {
            alert("Web-Service Error!!");
        }
    });
    return false;
}