function StateNode (boardState) {
    this._boardState = boardState;
    this._children = [];
}

StateNode.prototype.getBoardState = function () {
    return this._boardState;
}

StateNode.prototype.getChildren = function () {
    return this._children;
}

StateNode.prototype.addChild = function (childStateNode) {
    this._children.push(childStateNode);
}

module.exports = StateNode;
