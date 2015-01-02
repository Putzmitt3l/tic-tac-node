var ui = (function($) {
    'use strict';

    var uiModule = {};

    uiModule.init = function () {
        attachClickHandlers();
    }

    uiModule.init();

    function attachClickHandlers () {
        var $doc = $(document);

        $doc.on('click', '.start-game', function (e) {
            e.preventDefault();
            var $option = $('select').val();
            var querystring = '?type=ai';
            // TODO: change window.location after adding ng-rock tool
            // change the quesry string to be generated from select option
            window.location = '/game/' + querystring;
        });
    }

    return uiModule;

}(jQuery));
