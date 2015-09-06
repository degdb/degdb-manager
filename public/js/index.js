// degDB index page JS
$(function () {
    $(".setActive").click(function () {
        var arr = ['#dataMain', '#nodeMain', '#manageBtn'];
        $.each(arr, function(i, val) {
            $(val).removeClass("active");
        });

        $(this).addClass("active");
        window.current_action = $(this).text();
    });
    $(".selectMode").click(function () {
        // show data entry box
        $("#manageLogin").hide();
        $('#searchBox').fadeOut();
        $('#searchBox').fadeIn();

        // toggle active state on button
    });
    $("#manageBtn").click(function () {
        $("#searchBox").hide();
        $("#manageLogin").fadeIn();
    });
});
var items = document.querySelectorAll('.circle');

for(var i = 0, l = items.length; i < l; i++) {
    items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";

    items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
}

document.querySelector('.menuButton').onclick = function(e) {
    e.preventDefault(); document.querySelector('.circle').classList.toggle('open');
}