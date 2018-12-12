// Wait for the DOM to be ready
$(function () {
    // Initialize form validation on the registration form.
    // It has the name attribute "registrationForm"
    $("form[name='registrationForm']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute of an input field. Validation rules are defined on the right side
            signupInputUsername: "required",
            signupInputEmail: {
                required: true,
                // Specify that email should be validated by the built-in "email" rule
                email: true
            },
            signupInputPassword1: {
                required: true,
                minlength: 8
            },
            signupInputPassword2: {
                equalTo: "#signupInputPassword1"
            },
            signupCheck: "required"
        },
        // Specify validation error messages
        messages: {
            signupInputUsername: "Du skal have et brugernavn!",
            signupInputEmail: {
                required: "Du skal angive din email-adresse",
                email: "Din email er ugyldig"
            },
            signupInputPassword1: {
                required: "Du skal angive dit kodeord",
                minlength: "Dit kodeord skal mindst være 8 karakterer langt"
            },
            signupInputPassword2: {
                equalTo: "Du skal indtaste den samme kode"
            },
            signupCheck: {
                required: "Du skal acceptere anarki!"
            }
        },
        submitHandler: function (form, e) {
            $.ajax({
                type: "POST",
                url: "/api/signup",
                data: { 
                    username: $("#signupInputUsername").val(),
                    email: $("#signupInputEmail").val(),
                    password: $("#signupInputPassword1").val(),
                },
                success: function (data) {
                    Cookies.set('name', $("#signupInputUsername").val(), { expires: 7 });
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
        }
    });
});
