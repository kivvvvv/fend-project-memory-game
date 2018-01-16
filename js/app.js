/*
 * Create a list that holds all of your cards
 */

var $CARD_SHOW = null;

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
    var arrayCards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bomb', 'fa-bomb', 'fa-bicycle', 'fa-bicycle'];

    var $cardClass = $($deckClass).children();
    var arrayShuffledCards = shuffle(arrayCards);

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
    $faClass.removeClass();
    $faClass.addClass('fa ' + value);
}

function rebindClickCards($hiddenCards) {
    /**
     * https://stackoverflow.com/a/31347427
     */
    setTimeout(function () {
        $hiddenCards.on('click', function () {
            var $this = $(this);
            pickCard($CARD_SHOW, $this);
        });
    }, 0);

    $CARD_SHOW = null;
}

function showMatchedCard($card1, $card2) {
    var $bothCards = $card1.add($card2);
    var sAnimationName = 'open show match animated rubberBand';
    var sAnimationEvent = whichAnimationEvent();

    $bothCards.addClass(sAnimationName).one(sAnimationEvent, function () {
        rebindClickCards($hiddenCards);
    });
}

function showUnmatchedCard($card1, $card2) {
    var $bothCards = $card1.add($card2);
    
    var sAnimationEvent = whichAnimationEvent();
    var sAnimationName = 'open show unmatch animated wobble';
    var sCardStatus = 'card';

    $bothCards.addClass(sAnimationName).one(sAnimationEvent, function (event) {
        resetCardStatus($card1, sCardStatus, event);
        resetCardStatus($card2, sCardStatus, event);

        rebindClickCards($hiddenCards);
    });
}

function whichAnimationEvent() {
    /**
     * https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/
     */
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

function pickCard($card, $this) {
    if ($card) {
        if ($this.attr('class') === 'card') {
            var $hiddenCards = $('li[class="card"]');

            $hiddenCards.off('click');

            if ($card.children().attr('class') === $this.children().attr('class')) {
                showMatchedCard($card, $this, $hiddenCards);
            } else {
                showUnmatchedCard($card, $this, $hiddenCards);
            }
            $CARD_SHOW = null;
        }
    } else {
        $this.addClass('open show');
        $CARD_SHOW = $this;
    }
}

function startGame() {
    var $deckClass = $('.deck');
    var $cardClass = $deckClass.children();

    resetDeck($deckClass);

    setTimeout(function () {
        $cardClass.each(function () {
            resetCardStatus($(this), 'card');
        });
        $cardClass.on('click', function () {
            var $this = $(this);
            pickCard($CARD_SHOW, $this);
        });

    }, 3000);
}

$(function () {
    startGame();
    $('.restart').children().click(function () {
        startGame();
        $CARD_SHOW = null;
    });
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