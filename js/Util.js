/**
 * @license Copyright (C) 2012, Caleb Leak.  All rights reserved.
 */

/// <summary>
/// Various utility functions.
/// </summary>

var zz = zz || {};

function using(objectString) {
    /// <summary>
    ///   Makes available the specified object.		
    /// </summary>
    /// <param name="objectString" type="String">
    ///   The object to be used in string form (ex: "zz.Actor").
    /// </param>
   
    "use strict";

    var objectList = objectString.split("."),
        obj = window;

    // Traverse the object hierarchy
    objectList.forEach(function (propertyName) {
        if (obj[propertyName] === undefined) {
            obj[propertyName] = {};
        }
        obj = obj[propertyName];
    });
}

zz.runAll = function (functionList) {
    var i = 0, length = functionList.length;

    for (i = 0; i < length; i += 1) {
        functionList[i]();
    }
};
