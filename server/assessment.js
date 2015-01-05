function checkForWin (board) {
    var boardDimension = 3;
    var result = {};
    for (var i = 0; i < boardDimension; i++) {
        if(checkRow(board, i, board[i][0]) === 3 &&
            board[i][0] !== 0) {

            result.isWon = true;
            result.winner = (board[i][0] === 1)? 'x' : 'o';
            break;
        }
        else if(checkCol(board, i, board[0][i]) === 3 &&
            board[0][i] !== 0) {

            result.isWon = true;
            result.winner = (board[0][i] === 1)? 'x' : 'o';
            break;
        }
    };

    if(checkDiagonal(board, board[0][0]) === 3 &&
        board[0][0] !== 0) {

        result.isWon = true;
        result.winner = (board[0][0] === 1)? 'x' : 'o';
    }
    else if(checkDiagonal(board, board[0][1], true) === 3 &&
        board[0][1] !== 0) {

        result.isWon = true;
        result.winner = (board[0][1] === 1)? 'x' : 'o';
    }

    return result;
};

function checkRow (board, row, cell) {
    return check(board, row, cell)
};

function checkCol (board, col, cell) {
    return check(board, col, cell, true);
};

function check (board, index, cell, isCol) {
    var euriCheckVal = 0;
    if(!!isCol) {
        // we are checking a row
        for (var i = 0; i < 3; i++) {
            if (board[index][i] === cell) {
                euriCheckVal++;
            }
            else if(board[index][i] !== cell && board[index][i] !== 0) {
                euriCheckVal--;
            }
        };
    }
    else {
        // we are checking a column
        for (var i = 0; i < 3; i++) {
            if (board[i][index] === cell) {
                euriCheckVal++;
            }
            else if(board[i][index] !== cell && board[i][index] !== 0) {
                euriCheckVal--;
            }
        };
    }
    // possible return values in interval [-2, 2]
    return euriCheckVal;
}

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
