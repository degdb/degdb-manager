// degDB index page JS
$(document).ready(function () {
    $("#dataMain").click(function () {
        window.location = "/search";
    });
    $("#manageBtn").click(function () {
        $("#searchBox").hide();
        $("#manageLogin").fadeIn();
    });
    $("#queryMain").click(function () {
        window.location = "/performQuery";
    });
});
