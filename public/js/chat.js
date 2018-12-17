$(document).ready(function () {
    if (Cookies.get('userId')) {
        $("#chat-input-col").removeClass('d-none');
    }
    let socket = io.connect(location.host + "/");

    let message = $("#chat-input"),
        userId = Cookies.get('userId'),
        btn = $("#chat-input-button"),
        output = $("#shoutbox-content")

    // Emit events
    btn.click(function () {
        console.log('event sent');
        socket.emit('chat', {
            message: message.val(),
            userId: userId
        });
        message.val('');
    });

    // Listen for events
    // When a message is being broadcasted
    socket.on('chat', function (data) {
        console.log(data);
        output.append('<p class="message"><strong>' + data.username + ': </strong>' + data.message + '<span style="float:right;">' + new Date(data.timestamp).toLocaleString('da-DK') + '</span></p>');
        // Animate scrolling to bottom when a new message is recieved
        //output.animate({ scrollTop: output.prop("scrollHeight")}, 1000);
        $("#shoutbox").animate({ scrollTop: $('#shoutbox').prop("scrollHeight")}, 100);
    });
});