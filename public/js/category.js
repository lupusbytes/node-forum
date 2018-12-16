$(document).ready(function () {
    const pathname = window.location.pathname;
    const categoryId = pathname.substring(18);
    $.ajax({
        type: "GET",
        url: "/api/categories/" + categoryId,
        success: function (data) {
            $("#category-name").append(data.data.name);
        },
        error: function () {
            // redirect 404
        }
    });
    $.ajax({
        type: "GET",
        url: "/api/categories/" + categoryId + "/threads",
        success: function (data) {
            let html = ``;
            $.each(data.data, function (key, value) {
                const html = `
                <tr>
                    <td><a href='/forum/categories/` + categoryId + `/threads/` + value.id + "'>" + value.name + `</a></td>
                    <td><a href='/user/` + value.creator.id + "'>" + value.creator.username + `</td>
                    <td class="text-right">` + (value.nrOfPosts-1) + `</td>
                </tr>`
                $("#threads").append(html);
            })
        } // We don't need to handle 404 here, it will simply mean that there has not been created any threads

    })
});
