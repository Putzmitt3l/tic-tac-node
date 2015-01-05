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
                inviteopponent: 'inviteopponent',
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
        opponentId = null,
        playerType = null,
        opponentType = null,
        gameId = null;

    ui.init = function() {
        var socket = io();

        attachClickHandlers(socket);

        socket.on(socketEvents.listen.playerconnected, function (data) {
            playerId = data.playerId;

            console.log('playerId: ' + playerId);
        });

        socket.on(socketEvents.listen.inviteopponent, function (invite) {
            fillInviteField(invite.gameId);
        });

        socket.on(socketEvents.listen.gameStarted, function (gameInfo) {
            if(gameInfo.playerOne === playerId) {
                playerType = 'x';
                opponentId = gameInfo.playerTwo;
                opponentType = 'o';
            }
            else {
                playerType = 'o';
                opponentId = gameInfo.playerOne;
                opponentType = 'x';
            }
            gameId = gameInfo.gameId;

            console.log('gameId: ' + gameId);
            console.log('palyerType: ' + playerType);

            console.log('playerOneId: ' + gameInfo.playerOne);
            console.log('playerTwoId: ' + gameInfo.playerTwo);

            if(playerType === 'x') {
                removeOverlay();
            }
        });

        // socket listen on value change
        socket.on(socketEvents.listen.opponentCell, function (data){
            // set server cell filled
            var $cell = getCellElement(data.opponentCell);
            setCellValue($cell, opponentType);
            removeOverlay();
            enableCells();
        });

        // socket listen on gameover
        socket.on(socketEvents.listen.gameEnd, function (endObject) {
            addOverlay();
            displayWinner(endObject.winner);
        });
    }
    ui.init();


    function attachClickHandlers (socket) {
        var $doc = $(document);

        $doc.on('click', '.start-game', function (e) {
            e.preventDefault();
            var option = $('select').val(),
                $gameId = $('#multi-game-id-paste');

            showGrid();
            hideMenu();

            addOverlay();

            socket.emit(socketEvents.emit.startGame, {
                playerId: playerId,
                multiplayer: (option === 'multi')? true : undefined,
                gameId: ($gameId.val() !== '')? $gameId.val(): undefined
            });
        });

        $doc.on('change', 'select', function (e) {
            var $this = $(this);
            if($this.find(':selected').val() === 'multi') {
                showMultiplayerGameIdField()
            }
            else {
                hideMultiplayerGameIdField();
            }
        });

        $doc.on('click', '.col', function (e) {
            e.preventDefault();

            var $this = $(this),
                col = $this.data('number'),
                row = $this.parent().data('number'),
                isTaken = $this.hasClass(uiClasses.cell.taken);

            // set value for the cell
            if(!isTaken) {
                setCellValue($this, playerType);
                disableCells();

                // socket emit a value change for the cell
                socket.emit(socketEvents.emit.playerCell, {
                    playerId: playerId,
                    opponentId: opponentId,
                    cellInfo: {
                        cellRow: row,
                        cellCol: col
                    }
                });
            }
        });
    }

    function setCellValue ($cell, cellValue) {
        var cellValueUrl = '';

        if(cellValue == 'x') {
            cellValueUrl = './images/cross.png';
        }
        else if(cellValue == 'o') {
            cellValueUrl = './images/circle.png';
        }

        $cell.html('<img src="' + cellValueUrl + '" />');
        $cell.addClass(uiClasses.cell.taken);
    }

    function getCellElement (cellCoords) {
        var $rowElement = $('.row').filter('[data-number="' + cellCoords.cellRow + '"]'),
            $cellElement = $rowElement.children().filter('[data-number="' + cellCoords.cellCol + '"]');
        return $cellElement;
    }

    function disableCells () {
        $('.col').addClass(uiClasses.cell.disabled);
    }

    function enableCells () {
        $('.col').removeClass(uiClasses.cell.disabled);
    }

    function hideGrid () {
        $('.game').addClass('hidden');
    }

    function showGrid () {
        $('.game').removeClass('hidden');
    }

    function hideMenu () {
        $('.game-settings').addClass('hidden');
    }

    function showMenu () {
        $('.game-settings').removeClass('hidden');
    }

    function showMultiplayerGameIdField () {
        $('.game-id-holder').removeClass('hidden');
    }

    function hideMultiplayerGameIdField () {
        $('.game-id-holder').addClass('hidden');
    }

    function addOverlay () {
        $('.grid').addClass('overlay');
    }

    function removeOverlay () {
        $('.grid').removeClass('overlay');
    }

    function displayWinner (winner) {
        $('.score').html('Winner is:' + winner)
                .removeClass('hidden');
    }

    function fillInviteField (gameId) {
        $('#multi-game-id-copy').val(gameId);
    }

    return ui;

}(jQuery, io));
