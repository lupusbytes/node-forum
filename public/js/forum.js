$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/api/categories",
        success: function (data) {
            let html = ``;
            $.each(data.data, function (key, value) {
                const html = `
                <tr>
                    <td><a href='forum/categories/` + value.id + "'>" + value.name + `</a></td>
                    <td><a href='forum/categories/` + value.id + "/threads/" + value.latestThread.id + "'>" + value.latestThread.name + `</td>
                    <td class="text-right">` + value.threadCount + `</td>
                </tr>`
                $("#categories").append(html);
            })

        },
        error: function () {
            $("#logout-state").append("Du var ikke logget ind til at begynde med ...");
        }
    });
});