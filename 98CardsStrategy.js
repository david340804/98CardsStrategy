var numCards = 98;	//total number of cards in the deck
var numCardsInHand = 8;	//how many cards are visible to the player at a time and able to be played
var numCardsPlayedPerTurn = 2; //the number of cards that must be played to get replacements from the top of the deck

var numUpStacks = 2;	//the number of decks starting low and can be played upwards
var numDownStacks = 2;	//the number of decks starting high and can be played downwards

var jumpDistance = 10;	//cards can be played against the stack direction if they are exactly the jump distance away from the top card


var deck = [];
var stacks = [];
var hand = [];

/**
	Generate the up and down 
*/
function getStacks(){
	var s = {};
	s.up = (new Array(numUpStacks)).fill(1);
	s.down = (new Array(numDownStacks)).fill(100);
	return s;
}

/**
	Generate a randomly sorted deck of 98 cards
*/
function getDeck(){
	//create empty deck array
	var d = [];

	//insert each number at a random index of the deck
	for(var i = 2; i < 2+numCards; i++){
		d.splice(Math.floor(Math.random() * (d.length + 1)),0,i);
	}

	return d;
}

/**
	Start a new game
*/
function startGame(){
	//fetch a new deck
	deck = getDeck();
	stacks = getStacks();
	hand = [];

	//deal first hand
	for(var i = 0; i < numCardsInHand; i++){
		hand.push(deck.pop());
	}


}

/**
	Determine if any cards can be played from the current hand on the stacks at their present states
*/
function cardCanBePlayed(_stacks, _hand){

	return (
		//check stacks going up
		(_stacks.up.some((stackCard) => 
			_hand.some((handCard) => 
				(handCard > stackCard) || (stackCard - handCard === jumpDistance)
			)
		))
		||
		//stacks going down
		(_stacks.down.some((stackCard) => 
			_hand.some((handCard) =>
				(handCard < stackCard) || (handCard - stackCard === jumpDistance)
			)
		))
	)

}

/**
	Check if a play is valid to execute given the current state of the deck
*/
function isValidPlay(_play){
	var handCard = _play.card;

	//card must be in the players' hand
	if(hand.indexOf(_play.card) == -1){
		console.error('Cannot play card that is not in the hand');
		return false;
	}

	//deck must be valid
	if(stacks[_play.stackDir].length - 1 < _play.index){
		console.error('Play attempted to stack outside existing range on direction \'' + _play.stackDir + '\' at index ' + _play.index);
		return false;
	}

	var stackCard = stacks[_play.stackDir][_play.index];

	//check gameplay rule compliance
	if(_play.stackDir == 'up'){
		return (handCard > stackCard) || (stackCard - handCard === jumpDistance);
	}
	if(_play.stackDir == 'down'){
		return (handCard < stackCard) || (handCard - stackCard === jumpDistance);
	}

	//failed both valid deck conditions
	console.error('Invalid play stack field \'' + _play.stackDir + '\'');
}

/**
	Execute a play by moving a card from the hand to a stack
	play : {
		stackDir: 'up' |'down',
		index	: number,
		card 	: number,
	}
*/
function makePlay(_play){
	//check validity of play
	if(!isValidPlay(_play)){
		console.error('Attempted invalid play');
		console.error(_play);
		return false;
	}

	//put the card on its stack
	stacks[_play.stackDir][_play.index] = _play.card;

	//remove the card from the hand
	hand.splice(hand.indexOf(_play.card),1);

	return true;
}

/**
	Execute a series of play objects
*/
function makePlays(_plays){
	//verify integrity of plays
	if(_plays.length != numCardsPlayedPerTurn){
		console.error('Incorrect number of plays made');
		return false;
	}

	//execute each play in order
	_plays.forEach((_play) => {
		makePlay(_play);
	});

	//draw new cards from deck
	for(var i = 0; i < numCardsPlayedPerTurn; i++){
		hand.push(deck.push());
	}
	return true;
}


window.onload = function () {
	console.log("we goin bois");
	startGame();
}