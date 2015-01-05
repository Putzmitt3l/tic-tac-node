'use strict';
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var assessment = require('./assessment');

function GameException (message) {
    this.name = 'GameException';
    this.message = message || 'Unhandled GameException occurred.';
};

function Game (id) {
    this._matrix = [[0,0,0],[0,0,0],[0,0,0]];
    this._ply = 'x';
    this._id = id;
    this._ready = false;
    this._filledCellsCounter = 0;
    this._players = [];
    this._gameWinner = null;

    addInstanceToDictionary(this);

    // this.on('gameover', function (results) {
    //     removeInstanceFromDictionary(results.game);
    // });
};

util.inherits(Game, EventEmitter);

///////////////////////////
// Static Game functions //
///////////////////////////

function addInstanceToDictionary (instance) {
    if(Game._instancesDictionary === undefined) {
        Game._instancesDictionary = {};
    }

    Game._instancesDictionary[instance._id] = instance;
};

function removeInstanceFromDictionary (instance) {
    Game.removeInstanceFromDictionary(instance.getId());
};

Game.getInstanceFromDictionary = function (instanceId) {
    if(Game._instancesDictionary === undefined) {
        throw new GameException('No Game instances are created.');
    }

    var instance =  Game._instancesDictionary[instanceId];
    if(instance === undefined) {
        instance = null;
    }
    return instance;
};

Game.removeInstanceFromDictionary = function (instanceId) {
    if(Game._instancesDictionary === undefined) {
        throw new GameException('No Game instances are created.');
    }

    var removedInstance = Game._instancesDictionary[instanceId];

    Game._instancesDictionary[instanceId] = undefined;

    return removedInstance;
}

////////////////////////////////
// EOF Static Game functions  //
////////////////////////////////

Game.prototype.addPlayer = function (player) {
    var _this = this;
    if(this._players.length < 2) {
        this._players.push(player);

        player.on('updatestate', function(filledCell) {
            _this.updateState.call(_this, filledCell);
        });
    }
    if(this._players.length === 2) {
        this._ready = true;

        this.emit('gamestart');
    }
}

Game.prototype.updateState = function (filledCell) {
    var previousPly = this._ply;

    var newCellValue = (this._ply === 'x')? 1 : 2;
    this._matrix[filledCell.cellRow][filledCell.cellCol] = newCellValue;
    this._filledCellsCounter++;

    if(this._ply === 'x') {
        this._ply = 'o';
    }
    else {
        this._ply = 'x';
    }

    var isGameEnded = this.checkForGameEnd();

    if(isGameEnded) {
        this.emit('gameover', {
            winner: this._gameWinner,
            game: this
        });
    }
    else {
        this.emit('stateupdated', {
            previousPly: previousPly,
            previousFilledCell: filledCell,
            nextPly: this._ply,
            gameState: this._matrix
        });
    }
};


Game.prototype.checkForGameEnd = function () {
    var assessmentResult = assessment.checkForWin(this.getState());

    if(assessmentResult.isWon || this._filledCellsCounter === 9) {
        this._gameWinner = assessmentResult.winner || 'draw';
        return true;
    }
    return false;
};

Game.prototype.getId = function () {
    return this._id;
};

Game.prototype.getPly = function () {
    return this._ply;
};

Game.prototype.getState = function () {
    return this._matrix;
};

Game.prototype.getPlayerOne = function () {
    return this._players[0];
};

Game.prototype.getPlayerTwo = function () {
    return this._players[1];
}

Game.prototype.getPlayerOneId = function () {
    return this._players[0].getId();
};

Game.prototype.getPlayerTwoId = function () {
    return this._players[1].getId();
};

Game.prototype.isReadyToStart = function () {
    return this._ready;
};

// TODO: add history of moves by players

module.exports = Game;

