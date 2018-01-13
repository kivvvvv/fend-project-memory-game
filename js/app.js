/*
 * Create a list that holds all of your cards
 */

var CARDS = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bomb', 'fa-bomb', 'fa-bicycle', 'fa-bicycle'];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function resetDeck($deckClass) {
    var $cardClass = $($deckClass).children();
    var arrayShuffledCards = shuffle(CARDS);

    $cardClass.each(function () {
        var $faClass = $(this).children();

        resetCardStatus($(this), 'card open show');
        shuffleCardValue($faClass, arrayShuffledCards.pop())
    })
}

function resetCardStatus($cardClass, sCardStatus, sAnimationEnd = null) {
    $cardClass.removeClass();
    $cardClass.addClass(sCardStatus);
    if (sAnimationEnd) {
        $cardClass.off(sAnimationEnd);
    }
}

function shuffleCardValue($faClass, value) {
    $faClass.addClass(value);
}

function showMatchedCard($card1, $card2) {
    var sAnimationName = 'open show match animated rubberBand';
    var sAnimationEvent = whichAnimationEvent();

    $card1.addClass(sAnimationName).one(sAnimationEvent, function () {
        $card1.off();
    });
    $card2.addClass(sAnimationName).one(sAnimationEvent, function () {
        $card2.off();
    });
}

function showUnmatchedCard($card1, $card2) {
    var sAnimationEvent = whichAnimationEvent();
    var sAnimationName = 'open show unmatch animated wobble';
    var sCardStatus = 'card';

    $card1.addClass(sAnimationName).one(sAnimationEvent, function (event) {
        resetCardStatus($card1, sCardStatus, event);
    });
    $card2.addClass(sAnimationName).one(sAnimationEvent, function (event) {
        resetCardStatus($card2, sCardStatus, event);
    });
}

function whichAnimationEvent() {
    var t,
        el = document.createElement("fakeelement");

    var animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    }

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

$(function () {
    var $deckClass = $('.deck');
    var $cardClass = $deckClass.children();
    var $card_show = null;

    resetDeck($deckClass);

    setTimeout(function () {
        $cardClass.each(function () {
            resetCardStatus($(this), 'card');
        });
        $cardClass.on('click', function () {
            if ($card_show) {
                if ($(this).attr('class') === 'card') {
                    if ($card_show.children().attr('class') === $(this).children().attr('class')) {
                        showMatchedCard($card_show, $(this));
                    } else {
                        showUnmatchedCard($card_show, $(this));
                    }
                    $card_show = null;
                }
            } else {
                $(this).addClass('open show');
                $card_show = $(this);
            }
        });
    }, 3000);

});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */