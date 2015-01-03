'use strict';
// later on an algorithm option can be added
var algorithm = require('./algo/minimax');

function AiException (message) {
    this.name = 'AiException';
    this.message = message || 'Unhandled AiException occurred.';
};

function Ai (id, algorithm, cellValue) {
    this._id = id;
    this._algorithm = algorithm;
    this._nextMove = {};
    this._cellValue = cellValue;

    addInstanceToDictionary(this);
};

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
}

/////////////////////////////
// EOF Static Ai functions //
/////////////////////////////

Ai.prototype.makeAssessment = function (gameState) {
    this._nextMove = this._algorithm.generateNextMove(gameState, this._cellValue);
};

Ai.prototype.makeMove = function () {
    return {
        coordinates: this._nextMove,
        value: this.__cellValue
    };
};

module.exports = Ai;
