'use strict';
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var miniMaxAlgorithm = require('./algo/minimax');

function AiException (message) {
    this.name = 'AiException';
    this.message = message || 'Unhandled AiException occurred.';
};

function Ai (id, cellValue, player, algorithm) {
    this._id = id;
    this._algorithm = algorithm || miniMaxAlgorithm;
    this._nextMove = {};
    this._cellValue = cellValue;

    var _this = this;
    player.on('runbot', function (newGameState) {
        _this.makeAssessment(newGameState.gameState);
    });

    addInstanceToDictionary(this);
};

util.inherits(Ai, EventEmitter);

//////////////////////////
// Static Ai functions  //
//////////////////////////

function addInstanceToDictionary (instance) {
    if(Ai._instancesDictionary === undefined) {
        Ai._instancesDictionary = {};
    }

    Ai._instancesDictionary[instance._id] = instance;
};

Ai.getInstanceFromDictionary = function (instanceId) {
    if(Ai._instancesDictionary === undefined) {
        throw new GameException('No Ai instances are created.');
    }

    var instance =  Ai._instancesDictionary[instanceId];
    if(instance === undefined) {
        instance = null;
    }
    return instance;
};

Ai.removeInstanceFromDictionary = function (instanceId) {
    if(Ai._instancesDictionary === undefined) {
        throw new GameException('No Ai instances are created.');
    }

    var removedInstance = Ai._instancesDictionary[instanceId];

    Ai._instancesDictionary[instanceId] = undefined;

    return removedInstance;
};

/////////////////////////////
// EOF Static Ai functions //
/////////////////////////////

Ai.prototype.makeAssessment = function (gameState) {
    this._nextMove = this._algorithm.generateNextMove(gameState, this._cellValue);
    this.emit('botmovemade', {
        cellInfo: this._nextMove
    })
};

module.exports = Ai;
