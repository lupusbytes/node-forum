// In JavaScript, 'replace()' only replaces the first occurence ....
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
$(document).ready(function () {
    const pathname = window.location.pathname;
    const paths = pathname.split('/');
    const categoryId = paths[3];
    const threadId = paths[5];
    const postsUrl = "/api/categories/" + categoryId + "/threads/" + threadId + "/posts"
    $.ajax({
        type: "GET",
        url: postsUrl,
        success: function (data) {

            const threadName = data.data.name;
            $("#thread-title").append(threadName);

            $.each(data.data.posts, function (key, value) {
                const html = `
            <div class="col-2 user-col rounded text-center">
                <strong>` + value.creator.username + `</strong><br><br>
                <img src="/images/default-user.png" width="100" height="100">
                <br><br><br>
                <p>Medlem siden ` + new Date(value.creator.created_at).toLocaleDateString('da-DK') + `</p>
            </div>
            <div class="col-10 post-col rounded">
                <p>` + replaceAll(value.content, "\n", "<br>") + `</p>
                <div class="bottom-right-text tiny">Oprettet ` + new Date(value.creator.created_at).toLocaleString('da-DK') + `</div>
            </div>`
                $("#post-row").append(html);
            });

        } // We don't need to handle 404 here, it will simply mean that there has not been created any threads
    })
    if (Cookies.get('username')) {
        console.log("showing stuff")
        $("#submit-row").removeClass('d-none');

        $("#submit-form").submit(function(e) { 
            console.log("submitted");
            const content = $("#post-input").val();
            $.ajax({
                type: "POST",
                url: postsUrl,
                data: { 
                    content: content
                },
                success: function (data) {
                    console.log(data);
                    Cookies.set('username', username, { expires: 7 });
                    location.href = "/"; 
                },
                /*error: function (data) {
                    let response = (data.responseJSON);
                    if (response.status == 409) {
                        $("#signupInputUsername").after("<label id='signupInputUsername-error' class='error' for='signupInputUsername'>Brugernavnet er optaget</label>")
                    }     
                }*/
            });
            e.preventDefault();
        });
    }
});
