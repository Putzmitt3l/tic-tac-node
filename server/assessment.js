function checkForWin (board) {
    var boardDimension = 3;
    var result = {};
    for (var i = 0; i < boardDimension; i++) {
        if(checkRow(board, i, board[i][0]) === 3 &&
            board[i][0] !== 0) {
            attachWin(result, board[i][0]);
            break;
        }
        else if(checkCol(board, i, board[0][i]) === 3 &&
            board[0][i] !== 0) {

            attachWin(result, board[0][i]);
            break;
        }
    };

    if(checkDiagonal(board, board[0][0]) === 3 &&
        board[0][0] !== 0) {

        attachWin(result, board[0][0]);
    }
    else if(checkDiagonal(board, board[0][2], true) === 3 &&
        board[0][2] !== 0) {

        attachWin(result, board[0][2]);
    }

    return result;
};

function attachWin(result, cell) {
    result.isWon = true;
    result.winner = (cell === 1)? 'x' : 'o';
}

function checkRow (board, row, cell) {
    var sameAsCellCounter = 0;
    for (var i = 0; i < 3; i++) {
        if(board[row][i] === cell) {
            sameAsCellCounter++;
        }
        else if(board[row][i] !== cell && board[row][i] !== 0) {
            sameAsCellCounter--;
        }
    };
    return sameAsCellCounter;
};

function checkCol (board, col, cell) {
    var sameAsCellCounter = 0;
    for (var i = 0; i < 3; i++) {
        if(board[i][col] === cell) {
            sameAsCellCounter++;
        }
        else if(board[i][col] !== cell && board[i][col] !== 0) {
            sameAsCellCounter--;
        }
    };
    return sameAsCellCounter;
};

function checkDiagonal (board, cell, checkOpposite) {
    var euriCheckVal = 0;
    if(!!checkOpposite) {
        // check normal diagonal
        for (var i = 0; i < 3; i++) {
            if (board[i][i] === cell) {
                euriCheckVal++;
            }
            else if(board[i][i] !== cell && board[i][i] !== 0) {
                euriCheckVal--;
            }
        };
    }
    else {
        // check reverse diagonal
        for (var i = 2; i >= 0; i--) {
            var j = i -2;
            if(j < 0) {
                j = -j;
            }
            if (board[i][j] === cell) {
                euriCheckVal++;
            }
            else if(board[i][j] !== cell && board[i][j] !== 0) {
                euriCheckVal--;
            }
        };
    }
    return euriCheckVal;
}

module.exports = {
    checkRow: checkRow,
    checkCol: checkCol,
    checkDiagonal: checkDiagonal,
    checkForWin: checkForWin
}
