var ui = (function($, io) {
    'use strict';

    var ui = {};

    ui.init = function() {
        var socket = io();

        attachClickHandlers(socket);

        // socket listen on value change

        socket.on('chat message', function(msg){
            $('#messages').append($('<li>').text(msg));
        });

        // socket listen on gameover
        socket.on('gameover', function (endObject) {
            // show/update score board

            // prompt user to
            // leave/restart/choose-another-option
        });
    }
    ui.init();


    function attachClickHandlers (socket) {
        var $doc = $(document);

        $doc.on('click', '.col', function (e) {
            e.preventDefault();

            // set value for the cell
            // socket emit a value change for the cell
            // socket.emit('');
        });

        $doc.on('click', '.score', function (e) {

        });

        $doc.on('click', '.controls', function (e) {

        });
    }

    return ui;

}(jQuery, io));
