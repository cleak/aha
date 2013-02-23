/// <reference path="../Bindings/refs.js" />

zz.ObjectManager = (function () {
    'use strict';

    /// <summary>
    ///   Contains and manages objects that can be interacted with.
    /// </summary>

    function ObjectManager() {
        /// <summary>
        ///   Contsucts a new empty object manager.
        /// </summary>

        this.objects = [];
        this.compiler = new zz.Compiler();
    }

    ObjectManager.prototype.objects = [];
    ObjectManager.prototype.compiler = zz.Compiler.prototype;

    ObjectManager.prototype.add = function (obj) {
        /// <summary>
        ///   Adds an object to be managed.
        /// </summary>
        /// <param type="Object" name="obj">
        ///   The object to manage. Of the form:
        ///   obj = {
        ///     'regex string': function () { ... },
        ///     ...
        ///   }
        /// </param>

        var productions = [],
            that = this;

        // Iterate over all actions
        $.each(obj, function (key, value) {
            if (!(value instanceof Array)) {
                value = [value];
            }

            $.each(value, function (i, action) {
                var production = {
                    'rule': that.compiler.compile(key),
                    'action': action
                };

                // Convert raw strings into simple functions that return them
                if (typeof production.action === 'string') {
                    production.action = function () {
                        return action;
                    };
                }

                productions.push(production);
            });
        });

        this.objects.push({
            'object': obj,
            'productions': productions
        });
    };

    ObjectManager.prototype.has = function (obj) {
        /// <summary>
        ///   Checks if the object manager has the given object.
        /// </summary>
        /// <param type="Object" name="obj">
        ///   The object to check for.
        /// </param>
        /// <returns type="Boolean">
        /// true if the object manager has the object, false otherwise.
        /// </returns>

        var index = -1;

        $.each(this.objects, function (i, e) {
            if (e.object === obj) {
                index = i;
            }
        });

        return index >= 0;
    };

    ObjectManager.prototype.remove = function (obj) {
        /// <summary>
        ///   Removes an object currently being managed.
        /// </summary>
        /// <param type="Object" name="obj">
        ///   The object to remove.
        /// </param>

        var index = -1;

        $.each(this.objects, function (i, e) {
            if (e.object === obj) {
                index = i;
            }
        });

        if (index < 0) {
            throw "Object not found: " + obj.toString();
        }

        this.objects.splice(index, 1);
    };

    ObjectManager.prototype.clear = function (obj) {
        /// <summary>
        ///   Clears the object manager of all objects.
        /// </summary>

        this.objects = [];
    };

    ObjectManager.prototype.run = function (command) {
        /// <summary>
        ///   Runs the given command.
        /// </summary>
        /// <param type="String" name="command">
        ///   The string to run.
        /// </param>

        var matches = [],
            words = this._splitWords(command.replace(/\s*$/, '')),
            result;

        $(this.objects).each(function (i1, obj) {
            $(obj.productions).each(function (i2, production) {
                if (production.rule.match(words)) {
                    matches.push(production.action);
                }
            });
        });

        if (matches.length === 0) {
            // TODO: Split this off
            zz.page.write('Huh?<br/>');
        } else {
            // 1 or more matches.  Run each.
            $.each(matches, function (i, match) {
                var result = match();
                if (typeof result === 'string' && result.length > 0) {
                    zz.page.write(result + '<br/>');
                }
            });
        }
    };

    ObjectManager.prototype.getPredictions = function (text) {
        /// <summary>
        ///   Finds completions for the given text.
        /// </summary>
        /// <param type="String" name="text">
        ///   The text to find completions for.
        /// </param>

        var predictions = [],
            uniquePredictions = [],
            predictionsTracker = {},
            words = this._splitWords(text),
            i;

        $(this.objects).each(function (i1, obj) {
            $(obj.productions).each(function (i2, production) {
                predictions = predictions.concat(production.rule.predict(words));
            });
        });

        // Make the predictions unique
        predictions.sort();
        $.each(predictions, function (i, prediction) {
            if (predictionsTracker[prediction] === undefined) {
                predictionsTracker[prediction] = prediction;
                uniquePredictions.push(prediction);
            }
        });

        // Sort them
        uniquePredictions.sort();

        // Make them the full text
        for (i = uniquePredictions.length - 1; i >= 0; i -= 1) {
            uniquePredictions[i] = text + '<b>' + uniquePredictions[i] + '</b> ';
        }

        return uniquePredictions;
    };

    ObjectManager.prototype._splitWords = function (text) {
        /// <summary>
        ///   Spits the given text into a series of words.
        /// </summary>
        /// <param type="String" name="text">
        ///   The text to split.
        /// </param>
        /// <returns type="Array">
        ///   An array of words.
        /// </returns>

        return text.toLocaleLowerCase().split(/\s+/);
    };

    return ObjectManager;
}());