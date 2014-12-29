// later on an algorithm option can be added
var algorithm = require('./minimax');

function AiException (message) {
    this.name = 'AiException';
    this.message = message || 'Unhandled AiException occurred.';
};

function Ai (id, algorithm) {
    this._id = id;
    this._algorithm = algorithm;

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



// take Ai state and make assessment

// make move
module.exports = Ai;
