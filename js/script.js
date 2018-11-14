var _dwlWindow;

function downloadFiles(co_id, downloadType, docType)
{
    _dwlWindow = window.open("/DownloadSA/DownloadDocs.cshtml?co_id=" + co_id + "&downloadType=" + downloadType + "&docType=" + docType, "download_docs", "height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no");
    
}

function removeDLIframe(event) {
    if (event.data == "delete") {
        $("#downloadArchive").remove();
    }
}

$(function ()
{
    /* removeStyle */
    $(".removeStyle").removeAttr("style");

    /* CTA */
    $(".cta[data-label]").each(function ()
    {
        var c = $(this).attr("data-label");
        $(this).html(c);
        $(this).removeAttr("data-label");
    });

    /* NEWSLETTER - FOOTER */
    $("#form_iscrizione_nl").validate({ submitHandler: null });

    /* LOGIN */
    $('#login_form').validate({
        getDataToSend: function (form)
        {
            return {
                email: $('#login_email').val(),
                password: $('#login_password').val()
            };
        },
        callbackHandler: function (data, form)
        {
            if (data.d.Status)
            {
                $(form).find(".error").html('');
                location.reload();
            } else
            {
                $(form).find(".error").html(data.d.HTML);
                $(form).find("button[type=submit]").show();
            }
        }
    });

    // SMART REGISTER
    //$('#form_checkRegister').validate({
    //    getDataToSend: function (form) {
    //        return {
    //            email: $('#Email3').val()
    //        };
    //    },
    //    callbackHandler: function (data, form) {
    //        if (data.d.Status) {
    //            document.location = $(form).attr("data-page") + $('#Email3').val();
    //        } else {
    //            $(form).find(".error").html(data.d.HTML);
    //        }
    //    }
    //});

    /* LOGOUT */
    $('#logout_link').bind("click", function ()
    {
        $.ajax({
            type: "POST",
            url: "/WS/wsUsers.asmx/Logout",
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data)
            {
                location.reload();
            },
            error: function (data)
            {
                alert("Web-Service Error!!");
            }
        });
    });

    $("#lost_pwd_link").click(function ()
    {
        $(".container_form_lost_pwd").toggle("slow");
        return false;
    })

    //SEO
    //$(".social_link").bind("click", function () {
    //    _gaq.push(['_trackEvent', 'Social', $(this).text()]);
    //});

    //$(".share_links a").bind("click", function () {
    //    _gaq.push(['_trackEvent', 'Social Share', $(this).text(), $(this).attr("data-url")]);
    //});

    //$("#download_area a").bind("click", function () {
    //    _gaq.push(['_trackEvent', 'Downloads', $(this).attr("title")]);
    //});

    if (window.addEventListener) {
        addEventListener("message", removeDLIframe, false);
    } else {
        attachEvent("onmessage", removeDLIframe);
    }
});