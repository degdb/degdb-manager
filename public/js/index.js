// degDB index page JS
$(document).ready(function () {
    $("#dataMain").click(function () {
        // show data entry box
        $("#manageLogin").hide();
        $('#searchBox').fadeIn();
    });
    $("#manageBtn").click(function () {
        $("#searchBox").hide();
        $("#manageLogin").fadeIn();
    });
});