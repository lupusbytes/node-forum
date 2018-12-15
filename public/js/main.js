$(document).ready(function () {
    $("#auth").empty();
    let cookie = Cookies.get();
    if (cookie.username) {
        const userHtml = `
        <li>
            <span class="navbar-text">
                Logget ind som ` + cookie.username + `
            </span>
        </li>
        <li><a class='nav-link' href='/logout'><span class='fa fa-sign-out'></span>Log ud </a></li>
        `
        $("#auth").append(userHtml);
    } else {
        const userHtml = `
        <li><a class='nav-link' href='/signup'><span class='fa fa-user'></span> Opret bruger</a></li>
        <li><a class='nav-link' href='/login'><span class='fa fa-sign-in'></span> Log ind</a></li>`
        $("#auth").append(userHtml);
    }
});