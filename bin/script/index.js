/*
$(".nav-link").hover(function(){
    $(".nav-link.active").removeClass("active");
    $(this).addClass("active");
});
*/

$(function() {
    if (/library/.test(window.location.pathname)) {
        $('.nav-link').eq(1).addClass('active');
    }
    else {
        $('.nav-link').eq(0).addClass('active');
    }
});