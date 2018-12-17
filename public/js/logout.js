$(document).ready(function () {
    Cookies.remove('username');
    Cookies.remove('userId')
    $.ajax({
        type: "GET",
        url: "/api/logout",
        success: function () {
            $("#logout-state").append("Du er logget ud");
        },
        error: function () {
            $("#logout-state").append("Du var ikke logget ind til at begynde med ...");
        }
    });
});
