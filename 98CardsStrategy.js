var numCards = 98;	//total number of cards in the deck
var numCardsInHand = 8;	//how many cards are visible to the player at a time and able to be played
var numCardsPlayedPerTurn = 2; //the number of cards that must be played to get replacements from the top of the deck

var numUpStacks = 2;	//the number of decks starting low and can be played upwards
var numDownStacks = 2;	//the number of decks starting high and can be played downwards

var jumpDistance = 10;	//cards can be played against the stack direction if they are exactly the jump distance away from the top card


var deck;

/**
	Start a new game
*/
function startGame(){
	//fetch a new deck
	deck = getDeck();
	stacks = getStacks();

}

/**
	Determine if any cards can be played from the current hand on the stacks at their present states
*/
function cardCanBePlayed(_stacks, _hand){

	return _stacks.upStacks.some((stackCard) => 
		_hand.some((handCard) => 
			(handCard > stackCard) || (stackCard - handCard === jumpDistance)
		)
	)
	

}

/**
	Generate the up and down 
*/
function getStacks(){
	var s = {};
	s.upStacks = (new Array(numUpStacks)).fill(1);
	s.downStacks = (new Array(numDownStacks)).fill(100);
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
		d.splice(Math.floor(Math.random() * d.length),0,i);
	}

	return d;
}

window.onload = function () {
	console.log("we goin bois");
}