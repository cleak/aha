/// <reference path="../Bindings/refs.js" />

var zz = zz || {};

zz.TrollRoom = function () {
    'use strict';

    var bladeIsSharp = false;

    var trollRoom = {
        "<look around>": ["You always have terrible ideas and make terrible decisions, and this time is no different.  Well, it is a bit, because it may be your last terrible decision.  You’re standing at the end of a small damp cave with the only exit blocked by a rather large green troll.",
        ],
        '<attack> <troll>': [
                function () {
                    if (zz.om.has(swordHand)) {
                        zz.die('I think too highly of myself');
                        return "You clench your teeth and draw your sword to stomach level.  You bravely charge at the troll.  You quickly close the distance and lunge at the troll with you sword.  Without even a glance in your direction, the troll nonchalantly tosses you aside with the back of his left hand.  As you reel from the push, you fall and land on your sword, impaling yourself in one of those vital-to-live parts. <br/> <br/>What did you expect to happen? Have you ever used a sword before? <br/><br/>You are both terrible and arrogant.  Type “I think too highly of myself” to continue.";
                    }

                    zz.die('oh shit');
                    return "Great idea!  You charge at the troll with your fists flailing in the air.  After several seconds of attempted bashing, the troll finally feels one of your blows and turns towards you.  With a mighty shove, the trolls pushes you the ground and proceeds to sit on you.  As your ribcage snaps and your lungs collapse, you’re allowed one final moment of reflection to think to yourself “oh shit!”.<br/><br/>Type “oh shit” to continue.";
                }
        ],
        '<attack>': 'Attack what?',
        '<get>': 'Get what?',
        'score': "Is your ego so large that you must have in constantly stroked?  You have no score.  You have no points.  You have done nothing right.  Ever."
    };

    var swordGround = {
        "<get> <sword>": ["You pick up the sword.  It probably belonged to someone, but that doesn’t bother you.",
            function () {
                zz.om.remove(swordGround);
                zz.om.add(swordHand);
            }],
        '<look around>': "An elvish sword of some unknown antiquity lies abandoned here in the dirt."
    };

    var swordHand = {
        '<attack> <troll> with <sword>': trollRoom['<attack> <troll>'],

        'plant <sword> [in ground]?': function () {
            zz.om.remove(swordHand);
            zz.om.add(swordHiltUp);

            return "You plant the blade of your sword firmly in the ground and claim this horrible place for your selfish self.";
        },
        'plant <sword> [in ground]? with? the? blade up': function () {
            zz.om.remove(swordHand);
            zz.om.add(swordHiltDown);

            return "You carefully place the hilt of the sword in the ground so the blade is sticking up.";
        },
        "throw <sword> at <troll>": function () {
            zz.om.remove(swordHand);
            return "You throw your elvish sword of unknown antiquity in the general direction of the troll and miss horribly.  Congratulations, now you have no sword.";
        }
    };

    var swordHiltUp = {
        '<attack> <troll>': swordGround['<attack> <troll>'],
        '<look around>': "An elvish sword of some unknown antiquity has been firmly planted into the ground here.  Its hilt stands high in the air to say to all “I can do no better in life than claiming a cave as my own.”",
        "<get> <sword>": ["You pull the sword out of the dirt, admitting to yourself that it was a horrible idea to put it there in the first place.",
            function () {
                zz.om.remove(swordHiltUp);
                zz.om.add(swordHand);
        }],
    };

    var swordHiltDown = {
        '<attack> <troll>': swordGround['<attack> <troll>'],
        '<look around>': "An elvish sword of some unknown antiquity has been firmly planted into the ground here with its blade sticking into the air.  It’s not the safest decoration, but at least it’s something.",
        "<get> <sword>": ["Nope!  You made this decision, you live with it."]
    };

    var taunt = {
        "taunt <troll>": function () {

        }
    };

    var rockGround = {
        "<look around>": "There’s a rock here.  It’s slightly smaller than an average man’s clenched fist, but still larger than your baby sized hands.",
        '<get> rock': ["Sure, why not?  You pick up the rock.  It's not a great idea, but certainly wasn't your worst one today.",
                function () {
                    zz.om.remove(rockGround);
                    zz.om.add(rockHand);
                }
            ]
    };

    var rockHand = {
        'throw rock at <troll>': [//"You summon all of your nerd strength to toss the rock at the troll.  You manage to get the rock sailing in the right direction, but it lands only 3 feet away from you.",
            function () {
                if (!zz.om.has(swordHiltDown) && !zz.om.has(swordHiltUp)) {
                    zz.die("I have terrible ideas");
                    return "You summon all of your nerd strength to toss the rock at the troll.  You manage to get the rock sailing in the right direction.  It connects with the troll with just enough force to get his attention.  The troll turn turns toward you, charges, and proceeds to dismember you.  As the last of your body is pulled into bite-sized pieces, you realize how terrible your ideas are.<br/><br/>Type “I have terrible ideas” to continue.";
                } else if (zz.om.has(swordHiltUp)) {
                    zz.die("I am stupid and selfish");
                    return "With your trap set, you throw a rock at the troll to get his attention.  The troll turns towards you and charges at full speed.  Just before reaching you, he trips on the hilt of your deftly placed trap and briefly becomes airborne.  The troll lands on you, instantly crushing you beyond recognition and any hope of repair.  As the gooiest bits of you leak out your side, you realize you are not only stupid, but also quite selfish.  You have managed to kill yourself, injure a majestic troll, and deny a hungry creature the juicy meal you just seconds ago were.<br/><br/>Type “I am stupid and selfish” to continue.";
                }

                // Hurray!  You win!
                zz.rooms.splice(zz.rooms.indexOf(zz.TrollRoom), 1);
                zz.die("I am a horrible person");
                return "With your trap set, you throw a rock at the troll to get his attention.  The troll turns towards you and charges at full speed.  Just before reaching you, he impales himself on your trap going full speed.  Congratulations, you’ve killed a troll.  Come to think of it... when was the last time you saw a troll?  You may have killed the the last troll.<br/><br/>Type “I am a horrible person” to win.";
            }
        ],
        "sharpen <sword> [with rock]?": function () {
            if (!zz.om.has(swordHand)) {
                return "You attempt to sharpen the sword in the dirt.  You manage to knick yourself with the pointy end and smear more dirt on the blade.";
            }

            bladeIsSharp = true;
            return "After several minutes of frantic filing, you manage to create a few sharp spots on the blade.";
        },
        "[eat|swallow] rock": ["OK.<br/><br/>After taking one last glance at your stone, you fling it into your mouth with the palm of your hand and swallow it in a single gulp... and... uh-oh.  They were right.  They were all right.  Your ideas are terrible.  You realize this as you fail to dislodge the last bad idea you will ever have.<br/><br/>Type “I am exceedingly stupid” to continue.",
            function () {
                zz.die("I am exceedingly stupid");
            }
         ]
    };

    zz.om.add(trollRoom);
    zz.om.add(swordGround);
    zz.om.add(rockGround);
};

$(document).ready(function () {
    zz.page.write("A Horrible Adventure! by Caleb Leak");
});