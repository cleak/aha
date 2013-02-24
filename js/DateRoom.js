/// <reference path="../Bindings/refs.js" />

var zz = zz || {};

zz.DateRoom = function () {
    'use strict';

    // A very hacked together data file.  Sorry =(

    var score = 0;

    function good() {
        score += 1;
    }

    function bad() {
        score -= 1;

        if (score < 3 && !(zz.om.has(outside1) || zz.om.has(outside2)
            || zz.om.has(outside3) || zz.om.has(inside1) || zz.om.has(inside2))) {
            zz.page.write("Alice says “excuse me a minute, I need to use the restroom” as she gets up from the table.  She walks away without making eye contact.<br/><br/>");
            zz.om.clear();
            zz.om.add(restroom);
            zz.om.add(leave);
            return true;
        }

        return false;
    }

    var restroomWaitCount = 0;

    var restroom = {
        '[mood|score]': function () {
            return "Alice isn't here.  You can't tell her mood.  She didn't look happy before getting up though.";
        },
        'wait [for Alice [to return]?]?': function () {
            restroomWaitCount += 1;

            if (restroomWaitCount === 1) {
                return "You wait for Alice to return.";
            }

            if (restroomWaitCount === 2) {
                return "Alice will be back soon.  She's overdue, so any second now.";
            }

            if (restroomWaitCount === 3) {
                return "Could Alice have fallen in?  Maybe she had an upset stomach but was too polite to mention it.";
            }

            // >= 4
            return "You sit around like the loser you are, waiting for Alice to return.";
        }
    };

    var outside1 = {
        '<look around>': 'It’s 7:01pm and slightly chilly out here in downtown.  You’re outside your favorite steak house.  Your date appears to be an entire minute late.  You wonder if she got cold feet about being seen in public with a guy such as yourself.',
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

        "[greet Alice? with a? bow|bow [to? Alice]?]":  ["You greet Alice by bowing to her.  A strange look comes across her face as she says “you’re ridiculous, stop embarrassing me.”",
            function () {
                bad();
                zz.om.remove(outside2);
                zz.om.add(outside3);
            }
        ],
        "[greet Alice with a kiss on [her|the]? hand|kiss [Alice]? [on]? [her|the]? hand]":  ["You greet Alice by grabbing her hand, pulling it towards yourself, and giving it a peck on the back.  She screams.  “PERVERT!!!!!”  Smack.  The hand you pecked slaps you with all its might.<br/><br/>As you see the back of Alice, likely for the last time, you realize you don’t know social boundaries.  Type “I do not know how to not be a pervert” to continue.",
            function () {
                zz.die("I do not know how to not be a pervert");
                zz.om.remove(outside2);
                zz.om.add(outside3);
            }
        ],
        "[greet Alice|say hello [to Alice]?]":  ["In your least nerdy voice you squeak out “hello Alice”.  She looks up at you and says “hello”.  She pauses for a couple seconds as she analyzes you.  “Wow, you have a severe nerd hunch.”",
            function () {
                zz.om.remove(outside2);
                zz.om.add(outside3);
                zz.om.add(nerdHunch);
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
        'tell [her|Alice] she is short':  ["You tell Alice she looks especially short today.  “I am not short and you’re not very nice!” Alice squeals as she stands on the tips of her toes to gain a little more height.",
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
            }
        ],
        '[open door and hold open?|hold door open?]':  ["You open the door and hold it open for Alice to walk in.  Several guests inside cast a dirty look your way as you allow a cold breeze in while Alice slowly enters.  “Thank you sir” Alice says to you with a smile.",
            function () {
                good();
                
                zz.om.remove(outside3);
                zz.om.add(inside1);

                if (zz.om.has(nerdHunch)) {
                    zz.om.remove(nerdHunch);
                }

                return enterMessage;
            }
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
                    zz.die("I am creepy");
                    return "“You’re a jerk!  I told you I DON’T drink!  What are you trying to do, give me roofies?  I’m leaving.”  Alice gets up and walks away quickly, never to be seen by you again.<br/><br/>What a creepy person you are.  Type “I am creepy” to continue.";
                }

                zz.om.remove(drinks);
                zz.om.add(waiting);
                zz.om.add(cheers);

                return "You place your order with the drink servant and he says “right away sir!” as he walks away briskly.<br/><br/>Alice looks at you and says softly “I normally only drink on special occasions, but I suppose it’s fine.”<br/><br/>The drink servant returns with your beverages a few moments later and places them on the table before quickly walking away.";
            },
        '[dismiss the? drink? servant|do not order drinks?|say no thanks?]':  ["You tell the drink servant that you do not want any alcoholic beverages.  He looks at you and says “very well sir, I will return with two waters” before turning to walk away.<br/><br/>Alice looks around awkwardly, unsure of what to say.<br/><br/>The drink servant returns with two glasses of ice water.  He places one before each of you and then leaves quickly.  He mutters “cheap bastard” under his breath as he leaves.",
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
                return "Cheers!  Alice clinks her glass against yours and takes a gulp.  She smiles a rosy cheeked smile at you.";
            }

            zz.om.remove(cheers);
            good();

            var lastCheers = "Cheers!  Alice clinks her glass against yours and downs the rest of her drink.";

            if (zz.om.has(waiting)) {
                // Skip waiting phase if drinking
                zz.om.remove(waiting);
                zz.om.add(food);

                return lastCheers + "<br/><br/>" + foodApproach;
            }

            return lastCheers;
        }
    };

    var waiting = {
        'tell Alice she looks like an angle':  ["You tell Alice she looks very geometric today.  She frowns.",
            function () {
                if (bad()) {
                    return;
                }
                
                zz.om.remove(waiting);
                zz.om.add(food);
                return foodApproach;
            }
        ],
        'wait': ["You awkwardly wait around for the waiter to arrive so you can order food.",
            function () {
                zz.om.remove(waiting);
                zz.om.add(food);
                return foodApproach;
            }
        ]
    };

    var foodApproach = "After several minutes, the food servant arrives and asks “what have you two decided on for dinner tonight?”";
    var foodOrderDone = "“Thank you” the food servant says after taking your order.  He quickly turns and leaves.";

    var yourFood = "steak";
    var aliceFood = "steak";

    function getFoodPhrase() {
        if (yourFood === aliceFood) {
            return "sliding a plate of " + yourFood + " in front of you and another in front of Alice";
        }

        return "sliding a plate of " + yourFood + " in front of you and a plate of " + aliceFood + " in front of Alice";
    }

    function foodReturn() {
        return "The food servant returns with your orders.  “Here you go” he says, " + getFoodPhrase() + ".";
    }

    var food = {
        '[order [a? steak|filet mignon]]':  ["You order a steak.  Alice nods approvingly and then orders the same.",
            function () {
                zz.om.remove(food);
                zz.om.add(waitForFood);
                return foodOrderDone;
            }
        ],
        '[order two [steaks|filet mignons]]': ["You order a steak for yourself and a steak for Alice.  Alice smiles at you and says “I like your style”.",
            function () {
                good();
                zz.om.remove(food);
                zz.om.add(waitForFood);
                return foodOrderDone;
            }
        ],
        'order a? salad':  ["You order a salad.  Alice looks at you with a befuddled expression and says “you’re such a pussy” before turning to the food servant and saying “I’ll have a steak”.",
            function () {
                yourFood = "salad";
                if (bad()) {
                    return;
                }

                zz.om.remove(food);
                zz.om.add(waitForFood);
                return foodOrderDone;
            }
        ],
        'order two salads':  ["“The fuck are you trying to say?  Do I look like I need a salad to you?” Alice puffs at you in her most rhetorical tone of voice.",
            function () {
                yourFood = "salad";
                aliceFood = "salad";
                if (bad()) {
                    return;
                }
                zz.om.remove(food);
                zz.om.add(waitForFood);
                return foodOrderDone;
            }
        ]
    };

    var waitForFood = {
        'tell Alice she looks like an angel': ["You tell Alice that she looks angelic.  She grins and says “I know” dismissively.",
            function () {
                good();
                zz.om.remove(waitForFood);
                zz.om.add(eating);
                return foodReturn();
            }
        ],
        'wait': ["You wait around awkwardly for your food to arrive.",
            function () {
                zz.om.remove(waitForFood);
                zz.om.add(eating);
                return foodReturn();
            }
        ]
    };

    var doneEatingPhrase = "After several intense minutes of gormandizing, both your’s and Alice’s plates are picked clean.  The food servant promptly returns to grab the plates and deliver the bill, which he casually sets on the table midway between yourself and Alice.";

    var eating = {
        'wait': ["Alice begins eating and then notices your lack of ingestion.  “Don’t make me eat alone, I’ll feel like a pig” Alice says to you with a frown.<br/><br/>You decide to start eating.",
            function () {
                if (bad()) {
                    return;
                }
                zz.om.remove(eating);
                zz.om.add(aliceCheck1);
                zz.om.add(check);
                return doneEatingPhrase;
            }
        ],
        'eat [the? food]?': [function () {
                zz.om.remove(eating);
                zz.om.add(aliceCheck1);
                zz.om.add(check);
                return "You and Alice both dig into your food.  " + doneEatingPhrase;
            }
        ]
    };

    var aliceCheck1 = {
        'wait': ["“Are you gonna take care of that or not?”  Alice asks you in her least rhetorical tone of voice.",
            function () {
                if (bad()) {
                    return;
                }
                zz.om.remove(aliceCheck1);
                zz.om.add(aliceCheck2);
            }
        ],
    };

    var aliceCheck2 = {
        '[wait|say? no]': ["After realizing you have no intent of paying for dinner, Alice reaches into her purse, pulls out a wad of cash, places it on the bill, and then calmly gives you the finger as she gets up to walk away.  Alice turns around and says “jerk!” to you sharply before disappearing from sight.<br/><br/>Type “I am a cheap bastard” to continue.",
            function () {
                zz.die("I am a cheap bastard");
            }
        ],
    };

    var check = {
        'pay [the? [bill|check]]?': ["You place a wad of cash on top of the bill with a smile.",
            function () {
                zz.om.remove(check);

                if (zz.om.has(aliceCheck1)) {
                    zz.om.remove(aliceCheck1);
                }

                if (zz.om.has(aliceCheck2)) {
                    zz.om.remove(aliceCheck2);
                }

                return finalReply();
            }
        ]
    };

    function dateWin(message) {
        zz.rooms.splice(zz.rooms.indexOf(zz.DateRoom), 1);
        zz.die(message);
    }

    function finalReply() {
        if (score === 7) {
            dateWin('I am extremely dishonest');
            return "Absolutely beaming, and slightly tipsy, Alice looks at you and says “I had an unexpectedly great time with you tonight.”  As you both get up, she continues to smile at you.  She then grabs your arm, gives a peck on the cheek and says “you better call me soon.”  Alice holds onto your arm tightly, smiling the whole way back to her car.<br/><br/>Looks like your deception worked, you’ve won over Alice with deceit.  Someday she’ll realize what you’re really like, but for now she’s happy.  Type “I am extremely dishonest” to win.";
        }

        if (score >= 5 && score <= 6) {
            dateWin('I convince people to trust me by lying');
            return "Alice smiles, realizing that your time together has come to an end. “That was fun, thanks for dinner” she says with a smile.  “Call me, and maybe we can get coffee sometime.”  Alice gets up and gives you a genuinely-happy grin before leaving.<br/><br/>Congratulations, through deception Alice now thinks your intents are benign.  Type “I convince people to trust me by lying” to win.";
        }
        
        if (score >= 3 && score <= 4) {
            zz.die('I am not too bad but not good either');
            return "“Not too bad, thanks for dinner” Alice says with a half a smile.  “Take care of yourself and maybe we’ll bump into each other sometime.”<br/><br/>Alice waves, smiles slightly, and then heads out the door.<br/><br/>You’re not too bad, just not too good either.  Type “I am not too bad but not good either” to continue.";
        }

        if (score >= 1 && score <= 2) {
            zz.die('I am a friend and nothing more');
            return "After realizing you’re done trying to impress her, Alice gets up, looks at you, and says “that was kinda fun” with a smile.  “I can’t see us working, but maybe we can be friends.”  With that thought Alice turns and leaves.<br/><br/>On the bright side, you can always find friends.  Type “I am a friend and nothing more” to continue.";
        }

        if (score === 0) {
            zz.die('I am not interesting');
            return "“Well, that was interesting” Alice says for lack for anything better to say.  “Take care of yourself and good luck in the dating arena” she continues before getting up to leave.<br/><br/>Alice waves and then heads out the door.<br/><br/>At least she said goodbye.  Type “I am not interesting” to continue.";
        }

        // The bad stuff
        if (score === -1) {
            zz.die("I am a bad date");
            return "After realizing she’s finally free, Alice gets up looks at you, and says “um, thanks, I guess” without making eye contact.  She then quickly turns and walks away.<br/><br/>Looks like you need to work on your dating skills.  Type “I am a bad date to continue”.";
        }

        if (score === -2) {
            zz.die("I am ridiculous");
            return "Alice looks at you and says “tonight was ridiculous, you need to learn how to treat a lady.”  She then stands up, zips up her purse, and tells you “don’t bother walking me out, or calling for that matter.”  Alice turns her body away from you and strolls confidently away.<br/><br/>Type “I am ridiculous” continue.";
        }

        if (score <= -3) {
            zz.die("I am a horrible person");
            return "“This was easily the worst date I have, or ever will, go on” Alice says to you as she gets up from the table.  “You’re such a jerk” she continues as she gathers her things and prepares to leave. “Please leave me, and for that matter every girl, alone.”<br/><br/>Alice strolls confidently away but then pauses when nearly out the door.  She turns around, looks at you one last time, and gives you the finger.  She smiles, content with her composure, before continuing out the door and vanishing forever.<br/><br/>Type “I am a horrible person” to continue, and for the love god treat her better next time.";
        }
    }

    var leave = {
        '[leave|walk away]':  ["You decide the only way to win is not to play; you walk away.<br/><br/>Running away before your inevitable failure is pathetic.  Type “I am truly pathetic” to continue.",
            function () {
                zz.die('I am truly pathetic');
            }
        ],
    };

    var mood = {
        '[mood|score]': function () {
            if (score === 0) {
                return "Alice regards you indifferently.";
            }

            if (score === -1) {
                return "Alice doesn't look happy.";
            }

            if (score === -2) {
                return "Alice is frowning, clearly wondering if tonight was a mistake.";
            }

            if (score <= -3) {
                return "Alice loathes you.  May as well have not bothered with tonight.";
            }

            if (score === 1) {
                return "Alice doesn't look upset, but doesn't look that happy either.";
            }

            if (score === 2) {
                return "Alice seems to be enjoying herself.";
            }

            if (score >= 3 && score <= 4) {
                return "Alice looks content.";
            }

            if (score >= 5 && score <= 6) {
                return "Alice has a pretty big smile on her face.";
            }


            if (score >= 7) {
                return "Alice is absolutely beaming.";
            }
        }
    };

    zz.om.add(outside1);
    zz.om.add(leave);
};