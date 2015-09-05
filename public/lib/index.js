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
