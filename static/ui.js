var ui = (function($, io) {
    'use strict';

    var ui = {};

    // Event names store
    // TODO: move socketEvents object in separate file
    var socketEvents = {
            listen: {
                gameStarted: 'gamestarted',
                gameEnd: 'gameover',
                playerconnected: 'playerconnected',
                opponentCell: 'opponentcellfilled'
            },
            emit: {
                startGame: 'startgame',
                playerCell: 'cellfilled'
            }
        },
        uiClasses = {
            cell: {
                taken: 'taken',
                disabled: 'disable-cell'
            }
        },
        playerId = null,
        playerType = null,
        gameId = null;

    ui.init = function() {
        var socket = io();

        attachClickHandlers(socket);

        socket.on(socketEvents.listen.playerconnected, function (data) {
            playerId = data.playerId;

            console.log('playerId: ' + playerId);
        });

        socket.on(socketEvents.listen.gameStarted, function (gameInfo) {
            if(gameInfo.playerOne === playerId) {
                playerType = 'x';
            }
            else {
                playerType = 'o';
            }
            gameId = gameInfo.gameId;
            console.log('gameId: ' + gameId);
            console.log('palyerType: ' + playerType);
        });

        // socket listen on value change
        socket.on(socketEvents.listen.opponentCell, function (data){
            // set server cell filled
            enableCells();
        });

        // socket listen on gameover
        socket.on(socketEvents.listen.gameEnd, function (endObject) {
            // show/update score board

            // prompt user to
            // leave/restart/choose-another-option
        });
    }
    ui.init();


    function attachClickHandlers (socket) {
        var $doc = $(document);

        $doc.on('click', '.start-game', function (e) {
            e.preventDefault();
            var option = $('select').val();

            showGrid();
            hideMenu();

            socket.emit(socketEvents.emit.startGame, {
                playerId: playerId
            });
            // TODO: change window.location after adding ng-rock tool
            // change the quesry string to be generated from select option
        });

        $doc.on('click', '.col', function (e) {
            e.preventDefault();

            var $this = $(this),
                col = $this.data('number'),
                row = $this.parent().data('number'),
                isTaken = $this.hasClass(uiClasses.cell.taken);

            // set value for the cell
            if(!isTaken) {
                setCellValue($this, 'cross');
                disableCells();

                // socket emit a value change for the cell
                socket.emit(socketEvents.emit.playerCell, {
                    cellRow: row,
                    cellCol: col
                });
            }
        });

        $doc.on('click', '.score', function (e) {

        });

        $doc.on('click', '.controls', function (e) {

        });
    }

    function hideGrid () {
        $('.grid').addClass('hidden');
    }

    function showGrid () {
        $('.grid').removeClass('hidden');
    }

    function hideMenu () {
        $('.game-settings').addClass('hidden');
    }

    function showMenu () {
        $('.game-settings').removeClass('hidden');
    }

    function setCellValue ($cell, cellValue) {
        var cellValueUrl = '';

        if(cellValue == 'cross') {
            cellValueUrl = './images/cross.png';
        }
        else if(cellValue == 'circle') {
            cellValueUrl = './images/cricle.svg';
        }

        $cell.html('<img src="' + cellValueUrl + '" />');
        $cell.addClass(uiClasses.cell.taken);
    }

    function disableCells () {
        $('.col').addClass(uiClasses.cell.disabled);
    }

    function enableCells () {
        $('.col').removeClass(uiClasses.cell.disabled);
    }

    return ui;

}(jQuery, io));
