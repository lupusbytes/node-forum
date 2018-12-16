$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/api/categories",
        success: function (data) {
            let html = ``;
            $.each(data.data, function (key, value) {
                const html = `
                <tr>
                    <td>` + value.name + `</td>
                </tr>`
                $("#categories").append(html);
            })

        },
        error: function () {
            $("#logout-state").append("Du var ikke logget ind til at begynde med ...");
        }
    });
});