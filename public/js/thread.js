
// In JavaScript, 'replace()' only replaces the first occurence ....
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


function addPostHtml(post) {
    const html = `
    <div class="col-2 user-col rounded text-center">
        <strong>` + post.creator.username + `</strong><br><br>
        <img src="/images/default-user.png" width="100" height="100">
        <br><br><br>
        <p>Medlem siden: ` + new Date(post.creator.created_at).toLocaleDateString('da-DK') + `</p>
        <p class="tiny">Sidst aktiv: ` + new Date(post.creator.last_activity).toLocaleString('da-DK') + `</p>
    </div>
    <div class="col-10 post-col rounded">
        <p>` + replaceAll(post.content, "\n", "<br>") + `</p>
        <div class="bottom-right-text tiny">
        Oprettet ` + new Date(post.created_at).toLocaleString('da-DK') + `</div>
    </div>`
    $("#post-row").append(html);
}


$(document).ready(function () {
    const pathname = window.location.pathname;
    const paths = pathname.split('/');
    const categoryId = paths[3];
    const threadId = paths[5];
    const postsUrl = "/api/categories/" + categoryId + "/threads/" + threadId + "/posts";
    
    $.ajax({
        type: "GET",
        url: postsUrl,
        success: function (data) {

            const threadName = data.data.name;
            $("#thread-title").append(threadName);
            $.each(data.data.posts, function (key, value) {
                addPostHtml(value);
            });

        } // We don't need to handle 404 here, it will simply mean that there has not been created any threads
    })
    if (Cookies.get('username')) {
        $("#submit-row").removeClass('d-none');
        $("#submit-form").submit(function (e) {
            console.log("submitted");
            const content = $("#post-input").val();
            $.ajax({
                type: "POST",
                url: postsUrl,
                data: {
                    content: content
                },
                success: function (response) {
                    console.log(response);
                    addPostHtml(response.data);
                },
                error: function (data) {
                    let response = (data.responseJSON);
                    if (response.status == 401) {
                        alert("Du er ikke logget ind!")
                    }     
                }
            });
            e.preventDefault();
        });
    }
});
