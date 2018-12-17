$(document).ready(function() {
    $("#login-form").submit(function(e) { 
        console.log("submitted");
        const username = $("#login-username").val();
        $.ajax({
            type: "POST",
            url: "/api/auth",
            data: { 
                username: username,
                password: $("#login-password").val(),
            },
            success: function (data) {
                Cookies.set('username', username, { expires: 7 });
                Cookies.set('userId', data.data.userId, { expires: 7 })
                location.href = "/"; 
            },
            error: function (data) {
                let response = (data.responseJSON);
                if (response.status == 409) {
                    $("#signupInputUsername").after("<label id='signupInputUsername-error' class='error' for='signupInputUsername'>Brugernavnet er optaget</label>")
                }     
            }
        });
        e.preventDefault();
    });
});


