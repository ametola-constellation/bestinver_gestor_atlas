$(document).ready(function () {
    initIdleTimeout2();
});

var TIMEOUT = null;


function initIdleTimeout2() {
    $('*').bind('mousemove click mouseup mousedown mousewheel keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {
        triggerTimeout();
    });
}

function loadTimeOut() {
    TIMEOUT = setTimeout(function () {
        TIMEOUT = null
    }, 60000)
}

function triggerTimeout() {
    if (!TIMEOUT) {
        echo();
        loadTimeOut();
    }
}

function echo() {
    var data = [];

    $.ajax({
        url: routeConfig.Shared_SendEcho,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
        type: 'POST',
        failure: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    });
}