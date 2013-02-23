/// <reference path="../Bindings/refs.js" />

var zz = zz || {};

zz.DateRoom = function () {
    'use strict';

    var score = 0;

    function good() {
        score += 1;
    }

    function bad() {
        score -= 1;
    }

    var outside1 = {
        '<look around>': 'It’s 7:01pm and slightly chilly out here in downtown outside your favorite steak house.  Your date appears to be an entire minute late.  You wonder if she got cold feet about being seen in public with a guy such as yourself.',
        'wait [for my? date [to arrive]?]?': ['You wait for your date to arrive.  Despite the cold weather, you manage to work up a nervous sweat.  Two minutes pass as sweat accumulates on the pits of your shirt.  Finally, Alice arrives looking less short than usual in her high heels.',
                function () {
                    zz.om.remove(outside1);
                    zz.om.add(outside2);
                    zz.om.add(mood);
                }
            ]
    };

    var outside2 = {
        '<look around>': "You’re outside your favorite steak house.  In the cold.  Not doing anything.<br/><br/>Alice is here.  You should probably acknowledge her presence in some way.",
        'wait [for my? date [to arrive]?]?': [
                function () {
                    bad();
                    return "It seems like a good idea to make Alice wait a bit.  You stand around without acknowledging her.";
                }
        ],

        "[greet Alice? with a? bow|bow [to? Alice]?]":  ["You greet Alice by bowing to her.  A strange look comes across her face as she says “you’re ridiculous, stop embarrassing me.”<br/><br/>",
            function () {
                bad();
                zz.om.remove(outside2);
                zz.om.add(outside3);
            }
        ],
        "[greet Alice with a kiss on [her|the]? hand|kiss [Alice]? [on]? [her|the]? hand]":  ["You greet Alice by grabbing her hand, pulling it towards yourself, and giving it a peck on the back.  She screams.  “PERVERT!!!!!”  Smack.  The hand you pecked slaps you with all its might.<br/><br/>As you see the back of Alice, likely for the last time, you realize you don’t know social boundaries.  Type “I do not know how to not be a pervert” to continue.",
            function () {
                die("I do not know how to not be a pervert");
                zz.om.remove(outside2);
                zz.om.add(outside3);
            }
        ],
        "[greet Alice|say hello [to Alice]?]":  ["In your least nerdy voice you squeak out “hello Alice”.  She looks up at you and says “hello”.  She pauses for a couple seconds as she analyzes you.  “Wow, you have a severe nerd hunch.”",
            function () {
                zz.om.remove(outside2);
                zz.om.add(outside3);
                zz.add(nerdHunch);
            }
        ]
    };

    // TODO: Remove this later
    var nerdHunch = {
        '[fuck you|tell [her|Alice] to go? fuck herself]':  ["She giggles and a slight smiles comes across her face.  “Did I offend you?  You’re funny.”",
            function () {
                good();
                zz.om.remove(nerdHunch);
            }
        ],
        'tell [her|Alice] she is short’':  ["You tell Alice she looks especially short today.  “I am not short and you’re not very nice!” Alice squeals as she stands on her toes to gain a little more height.",
            function () {
                bad();
                zz.om.remove(nerdHunch);
            }
        ]
    };

    var enterMessage = "The hostess greets you with a bright smile.  “Good evening!  Would like a table inside or outside?”";

    var outside3 = {
        '[open door|go inside|enter]':  ["You open the door and walk inside.  Alice follows you inside and folds her arms, clearly unhappy with you.  “What’s wrong with you?  Did your family not teach you how to be a gentleman?”",
            function () {
                bad();

                zz.om.remove(outside3);
                zz.om.add(inside1);
                zz.om.add(sorry);

                if (zz.om.has(nerdHunch)) {
                    zz.om.remove(nerdHunch);
                }

                return enterMessage;
            },
        ],
        '[open door and hold open?|hold door open?]':  ["You open the door and hold it open for Alice to walk in.  Several guests inside cast a dirty look your way as you allow a cold breeze in while Alice slowly enters.  “Thank you sir” Alcie says to you with a smile.",
            function () {
                good();
                
                zz.om.remove(outside3);
                zz.om.add(inside1);

                if (zz.om.has(nerdHunch)) {
                    zz.om.remove(nerdHunch);
                }

                return enterMessage;
            },
        ],
        'talk [to Alice]? about [[video|computer] games?|computers|science fiction|comic books|pop art|the weather|her day]': [
            "You attempt to start a conversation with Alice.  A frown appears on her face and she rubs her arms for warmth.  “Why are we waiting out here?  I’m cold and you’re a jerk!”.<br/><br/>An unmistakable look of displeasure appears on Alice’s face.",
            function () {
                bad();       
            }
        ]
    };

    var sorry = {
        '[[tell Alice|say]? sorry|apologize [to Alice]?]':  ["You tell Alice “sorry”.  She looks at you.  “Don’t be such a pussy.  No girl wants to date a guy without a backbone.”",
            function () {
                bad();
                zz.om.remove(sorry);
            }
        ]
    };

    var inside1 = {
        '[ask for a? table]? outside':  ["You ask for a table outside.  The hostess says “right this way please” and leads you outside.<br/><br/>Alice rubs her arms for warmth.  “It’s cold out here.  You should know better than to ask for a table outside this time of year!  You’re so inconsiderate!”<br/><br/>Alice begins to paw through her purse while standing next to the table.",
            function () {
                bad();
                zz.om.remove(inside1);
                zz.om.add(inside2);

                if (zz.om.has(sorry)) {
                    zz.om.remove(sorry);
                }
            }
        ],
        '[ask for a? table]? inside':  ["You ask for a table inside.  The hostess says “right this way please” and leads you to a small booth near the back of the restaurant.<br/><br/>Alice begins to paw through her purse while standing next to the table.",
            function () {
                zz.om.remove(inside1);
                zz.om.add(inside2);

                if (zz.om.has(sorry)) {
                    zz.om.remove(sorry);
                }
            }
        ],
    };

    var drinkMessage = "The drink servant wastes no time after you’re seated to move in and try to force drink orders upon you.  “What will you and the lady have to drink tonight?” he asks.";

    var inside2 = {
        '[sit down?|[have|take] a? seat]':  ["Alice looks up from her purse and says  “Wow!  Yes, please don’t wait for me.  Go right ahead.” in a sarcastic tone of voice.<br/><br/>Alice sits down.",
            function () {
                bad();
                zz.om.remove(inside2);
                zz.om.add(drinks);
                zz.om.add(askAlice);
                return drinkMessage;
            }
        ],
        'wait [for Alice]?':  ["Alice looks up from her purse and notices you waiting.  She smiles briefly and then grabs a seat.",
            function () {
                good();
                zz.om.remove(inside2);
                zz.om.add(drinks);
                zz.om.add(askAlice);
                return drinkMessage;
            }
        ],
    };

    var askAlice = {
        'ask Alice if she [wants a drink|drinks]':  ["You ask Alice if she wants a drink.  She says “I only drink on special occasions.”",
            function () {
                zz.om.remove(askAlice);
            }
        ]
    };

    var drinks = {
        'order [drinks|wine|cocktails]': 
            function () {
                if (!zz.om.has(askAlice)) {
                    die("I am creepy");
                    return "“You’re a jerk!  I told you I DON’T drink!  What are you trying to do, give me roofies?  I’m leaving.”  Alice gets up and walks away quickly, never to be seen by you again.<br/><br/>What a creepy person you are.  Type “I am creepy” to continue.";
                }

                zz.om.remove(drinks);
                zz.om.add(waiting);
                zz.om.add(cheers);

                return "You place your order with the drink servant and he says “right away sir!” as he walks away briskly.<br/><br/>Alice looks at you softly and says “I normally only drink on special occasions, but I suppose it’s fine.”<br/><br/>The drink servant returns with your beverages a few moments later and places them on the table before quickly walking away.";
            },
        '[dismiss the? drink? servant|do not order drinks?|say no thanks?]':  ["You tell the drink servant that you do not want any alcoholic beverages.  He looks at you and says “very well sir, I will return with two waters” before turning to walk away.<br/><br/>Alice looks around awkwardly, unsure of what to say.<br/><br/>The drink servant returns with two glasses of ice water.  He places one before each of and then leaves quickly.  He mutters “cheap bastard” under his breath as he leaves.",
            function () {
                zz.om.remove(drinks);
                zz.om.add(waiting);

                if (zz.om.has(askAlice)) {
                    zz.om.remove(askAlice);
                }
            }
        ]
    };

    var cheersCount = 3;

    var cheers = {
        'cheers': function () {
            cheersCount -= 1;
            if (cheersCount === 2) {
                return "Cheers!  Alice clinks her glass against yours and takes a sip.";
            }

            if (cheersCount === 1) {
                good();
                return "Cheers!  Alice clinks her glass against yours and takes a gulp.  She smiles a rosey cheeked smile at you.";
            }

            zz.om.remove(cheers);
            good();

            if (zz.om.has(waiting)) {
                // Skip waiting phase if drinking
                zz.om.remove(waiting);
                zz.om.add(food);
            }
            return "Cheers!  Alice clinks her glass against yours and downs the rest of her drink.";
        }
    };

    var waiting = {
        'tell Alice she looks like an angle':  ["You tell Alice she looks very geometric today.  She frowns.",
            function () {
                bad();
                
                zz.om.remove(waiting);
                zz.om.add(food);
            }
        ],
        'wait': ["You awkwardly wait around for the waiter to arrive so you can order food.",
            function () {
                zz.om.remove(waiting);
                zz.om.add(food);
            }
        ]
    };

    var food = {
        '
    };

    var leave = {
        '[leave|walk away]':  ["You decide the only way to win is not to play; you walk away.<br/><br/>Running away before your inevitable failure is pathetic.  Type “I am truly pathetic” to continue.",
            function () {
                zz.die('I am truly pathetic');
            }
        ]
    };

    var mood = {
        '[mood|score]': function () {
            if (score === 0) {
                return "Alice regards you indifferently.";
            }

            if (score < 0) {
                return "Alice loathes you.";
            }

            if (score > 0) {
                return "Alice is absolutely beaming.";
            }
        }
    };

    zz.om.add(outside1);
    zz.om.add(leave);
};