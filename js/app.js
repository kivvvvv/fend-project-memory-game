var $CARD_SHOW = null;
var SCORE = 0;
var MOVE = 0;
var STARS = 3;

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

/**
 * @description Will recieve <ul class="deck"> in jQuery object then takes out the children element
 *      which is <li class="card"> then add class to display cards and from <li class="card">
 *      takes out its children which is <i class="fa"></i> then add class from the shuffled class.
 * @param {jQuery} $deckClass - The <ul class="deck"> in jQuery object
 * @argument {array} arrayCards - 18 values of FontAwesome class
 * @argument {jQuery} $cardClass - Children element of <ul class="deck"> which is <li class="card">
 * @argument arrayShuffledCards - Shuffled array of arrayCards
 * @argument sTransitionName - Class that include CSS transtion for display fliping cards
 * @argument sTransitionEvent - The transitionend event that is fired when a CSS transition has completed
 */
function resetDeck($deckClass) {
    var arrayCards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
        'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bomb', 'fa-bomb', 'fa-bicycle', 'fa-bicycle'];

    var $cardClass = $($deckClass).children();
    var arrayShuffledCards = shuffle(arrayCards);

    var sTransitionName = 'card open';
    var sTransitionEvent = whichTransitionEvent();

    $cardClass.each(function () {
        var $faClass = $(this).children();

        shuffleCardValue($faClass, arrayShuffledCards.pop())
    });

    $cardClass.removeClass();
    $cardClass.addClass(sTransitionName + ' show').one(sTransitionEvent).afterTime(3000, function () {
        $cardClass.removeClass();
        $cardClass.addClass('card');
    }).afterTime(3000, function () {
        $('.restart').one('click', function () {
            restartGame();
        });
    }).afterTime(3000, function () {
        $cardClass.on('click', function () {
            var $this = $(this);
            pickCard($CARD_SHOW, $this);
        });
    });
}

/**
 * @description Will recieve <li class="card"> in jQuery object, class name and maybe recieving
 *      animationend event which optional for removing all class from specific element and then
 *      reassign it again with the given class name.
 *      Furthermore if provide the animationend event handler, it will be removed from the given element as well.
 * @param {jQuery} $cardClass - The square card which is <li class="card">
 * @param {string} sCardStatus - Class of card to be reassign
 * @param {string} sAnimationEnd - Optional parameter that is an animationend event handler
 */
function resetCardStatus($cardClass, sCardStatus, sAnimationEnd = null) {
    $cardClass.removeClass();
    $cardClass.addClass(sCardStatus);
    if (sAnimationEnd) {
        $cardClass.off(sAnimationEnd);
    }
}

/**
 * @description Will recieve <i class="fa"> then remove all class from that element and assign
 *      new class to it from the given class.
 * @param {jQuery} $faClass - The card element which containing the FontAwesome class
 * @param {string} value - The card class which is the FontAwesome class
 */
function shuffleCardValue($faClass, value) {
    $faClass.removeClass();
    $faClass.addClass('fa ' + value);
}

/**
 * @description Will take the square card element <li class="card"> that has class="card"
 *      then bind click event handler to it.
 * @param {jQuery} $hiddenCards - The square card element which is <li class="card"> in jQuery object
 * @link https://stackoverflow.com/a/31347427
 */
function rebindClickCards($hiddenCards) {
    setTimeout(function () {
        $hiddenCards.on('click', function () {
            var $this = $(this);
            pickCard($CARD_SHOW, $this);
        });
    }, 0);

    $CARD_SHOW = null;
}

/**
 * @description Will take two selected card objects and one card object that has class="card" which
 *      is consider to be hidden card.
 *      For first two cards add class to animate them.
 *      For the last card - hidden card rebind event handler to it.
 * @param {jQuery} $card1 - The selected square card element which is <li class="card"> in jQuery object
 * @param {jQuery} $card2 - The another selected square card element which is <li class="card"> in jQuery object
 * @param {jQuery} $hiddenCards - All other square card elements which is <li class="card"> in jQuery object
 */
function showMatchedCard($card1, $card2, $hiddenCards) {
    var $bothCards = $card1.add($card2);
    var sAnimationName = 'match animated rubberBand';
    var sAnimationEvent = whichAnimationEvent();

    $bothCards.addClass(sAnimationName).one(sAnimationEvent, function () {
        rebindClickCards($hiddenCards);
    });
}

function showUnmatchedCard($card1, $card2, $hiddenCards) {
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

function whichTransitionEvent() {
    /**
     * https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/
     */
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
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

function showMove() {
    $('span.moves').text(++MOVE);

    if (SCORE === 8) {
        swal({
            title: 'Congratulations! You won!',
            text: 'With ' + MOVE + ' Moves and ' + STARS + ' Star(s). \nWoooooo!',
            icon: 'success',
            button: 'Play again!'
        })
            .then((willRestart) => {
                if (willRestart) {
                    $('div.restart').trigger('click');
                }
            });
    }
}

function pickCard($card, $this) {
    if ($card) {
        if ($this.attr('class') === 'card') {
            var $hiddenCards = $('li[class="card"]');

            $hiddenCards.off('click');

            if ($card.children().attr('class') === $this.children().attr('class')) {
                showMatchedCard($card, $this, $hiddenCards);
                SCORE++;
            } else {
                showUnmatchedCard($card, $this, $hiddenCards);
                removeStar();
            }

            $CARD_SHOW = null;
            showMove();
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
}

function restartGame() {
    $CARD_SHOW = null;
    SCORE = 0;
    MOVE = 0;
    STARS = 3;

    $('.deck').children().off('click');
    $('span.moves').text(MOVE);
    resetStar();
    startGame();
}

jQuery.fn.extend({
    /**
     * http://www.vikaskbh.com/javascript-settimeout-function-jquery-examples-and-chaining-it-with-aftertime-plugin/
     */
    afterTime: function (sec, callback) {
        that = $(this);
        setTimeout(function () {
            console.log("Calling call back");
            callback.call(that);
            return that;
        }, sec);
        return this;
    }
});

function removeStar() {
    var $starsClass = $('.stars');
    var $faStarsClass = $starsClass.find('.fa-star');

    if (STARS > 0) {
        $faStarsClass.last().removeClass('fa-star').addClass('fa-star-o');
        STARS--;
    }
}

function resetStar() {
    var $starsClass = $('.stars');
    var $faStarsClass = $starsClass.find('.fa');

    $faStarsClass.each(function () {
        $(this).removeClass().addClass('fa fa-star');
    })
}

$(function () {
    startGame();
    $('.restart').one('click', function () {
        restartGame();
    });
});