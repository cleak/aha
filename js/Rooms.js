/// <reference path="../Bindings/refs.js" />

var zz = zz || {};

zz.die = function (deathText) {
    'use strict';
    var death = {};
    
    death[deathText] = function () {
        zz.om.clear();

        zz.page.write('****************<br/>');

        if (zz.rooms.length === 0) {
            return "That's it.  You've won.  Thanks for playing.  I hope you make better decisions about how to spend your time in the future.";
        }

        zz.roomIndex = (zz.roomIndex + 1) % zz.rooms.length;
        zz.rooms[zz.roomIndex]();
        zz.om.run('describe');
        return '';
    };
    zz.om.clear();
    zz.om.add(death);
};

zz.roomIndex = 0;

zz.rooms = [
    zz.TrollRoom,
    zz.DateRoom
];

$(document).ready(function () {
    zz.rooms[0]();
    zz.om.run('describe');
});