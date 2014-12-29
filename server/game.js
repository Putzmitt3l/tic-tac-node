function GameException (message) {
    this.name = 'GameException';
    this.message = message || 'Unhandled GameException occurred.';
};

function Game (id) {
    this._matrix = [[0,0,0],[0,0,0],[0,0,0]];
    this._ply = 'x';
    this._id = id;

    addInstanceToDictionary(this);
};

///////////////////////////
// Static Game functions //
///////////////////////////

function addInstanceToDictionary (instance) {
    if(Game._instancesDictionary === undefined) {
        Game._instancesDictionary = {};
    }

    Game._instancesDictionary[instance._id] = instance;
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

Game.prototype.updateState = function (ply, filledCell) {
    if(this._ply !== ply) {
        throw new GameException('Unauthorized player move');
    }
    var newCellValue = (this._ply === 'x')? 1 : 2;
    this._matrix[filledCell.cellRow][filledCell.cellCol] = newCellValue;

    if(this._ply === 'x') {
        this._ply = 'o';
    }
    else {
        this._ply === 'x';
    }
};

Game.prototype.checkForGameEnd = function () {
    // TODO: check if any of the win positions are present
    // check if all the cells are filled and call draw
}

Game.prototype.getId = function () {
    return this._id;
};

Game.prototype.getPly = function () {
    return this._ply;
};

Game.prototype.getState = function () {
    return this._matrix;
};

// TODO: add player uuids
// TODO: add history of moves by players

module.exports = Game;

