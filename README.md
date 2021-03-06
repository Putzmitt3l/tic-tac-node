#tic-tac-node

We have 3 classes:

* Game
* Player
* Ai

All of them are EventEmitters.

One Module - Initialiser (which handles the game/player initialisation).

## Game class

* Keeps the board state and the players playing in it.
* Keeps in check which player's turn it is.
* On player's turn end emits an ``stateupdated`` which tells all the players in the game that a move has been made.
* Checks if there's a winner after every turn.
* When all of the players are in the game emits a ``gamestarted`` event and notifies the Players(only the humans via sockets) that they can start playing.

## Player class

* Acts as a "interface" hiding from the Game class what is deciding on the next move (Human via sockets/AI bot)
* On Game event ``stateupdated`` the game gives information who's turn is it and based on that information, every player checks if it's his turn. If the player is commanded by a Bot, a ``runbot``
event is emitted which starts the AI decision making.
If it's controlled by a human emits ``sendthroughsocket`` that is handled by the socket assigned to that palyer.

## Ai class

* Instantiated with a particular decision-making algorithm(by default it's the [minimax algorithm](http://en.wikipedia.org/wiki/Minimax)).
* On ``runbot`` event emitted from Player class starts the decision making.
* When move is finished emits ``botmovemade`` event that is handled by the player class(Delegates the new
filledCell to the Game class which updates the state).

## Small Disclaimer about the AI

* The Euristic function used for the board evalutaion is a naive one. Quite possibly there's a better one.
* Bot only gets to look 3 moves ahead and thus doesn't always make the
best decision due to the short predictions.
* The State Tree is always generated from [top,left] to [bottom,right],
and that can be used for devising a counter strategy.

## Start-up

* Clone repo
* Open terminal and navigate to ``/downloadFoleder/tic-tac-node``
* Run ``npm install``
* Navigate to ``server`` subfolder and run ``node server.js``
* Open in browser ``localhost:3000``

__For single player__

* Just choose ``Versus AI`` option and press ``Start Game``

__For multiplayer__

* Open another browser instance and type again ``localhost:3000``
* Select in first browser instance ``Versus Human`` and press ``Start Game``
* Copy the ``gameId`` from the input field above the game grid
* Select in second broser instance ``Versus Human`` and paste the copied ``gameId``. Press ``Start Game``

