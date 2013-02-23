/// <reference path="../Bindings/refs.js" />

zz.PassageTokenizer = (function () {
    'use strict';

    var EOF = -1;

    /// <summary>
    ///   Tokenizes a passages of text.
    /// </summary>

    function PassageTokenizer() {
        /// <summary>
        ///   Constructs an empty passage tokenizer
        /// </summary>

        this.tokens = [];
        this.currentToken = [];
    }

    // Static members
    PassageTokenizer.Tokens = {
        WORD: 0,
        FAST: 1,
        SLOW: 2,
        NORMAL: 3,
        PAUSE: 4,
        LINE_BREAK: 5,
        CHECK_POINT: 6,
        WHITE_SPACE: 7
    };

    PassageTokenizer.prototype.text = '';
    PassageTokenizer.prototype.textCursor = 0;
    PassageTokenizer.prototype.tokens = [];

    PassageTokenizer.prototype.tokenize = function (text) {
        /// <summary>
        ///   Spits the given text into a series of words.
        /// </summary>
        /// <param type="String" name="text">
        ///   The text to split.
        /// </param>
        /// <returns type="Array">
        ///   An array of words.
        /// </returns>

        this.tokens = [];
        this.text = text;
        this.textCursor = 0;

        while (this.peekChar() !== EOF) {
            if (this.peekChar() === '<') {
                this.command();
            } else if (this.peekChar() === '\n') {
                this.tokens.push([PassageTokenizer.Tokens.LINE_BREAK, 1]);
                this.consume();
            } else if (this.peekChar() === ' ') {
                this.whiteSpace();
            } else {
                this.word();
            }
        }

        this.tokens.push([PassageTokenizer.Tokens.LINE_BREAK, 1]);
        return this.tokens;
    };

    PassageTokenizer.prototype.consume = function (text) {
        /// <summary>
        ///   Consumes a character.
        /// </summary>

        var char = this.peekChar();

        // Should never try to consume EOF
        if (char === EOF) {
            throw 'Attempted to consume EOF';
        }

        this.textCursor += 1;
        return char;
    };

    PassageTokenizer.prototype.peekChar = function () {
        /// <summary>
        ///   Peeks at and returns the next char in the stream.
        /// </summary>

        if (this.textCursor >= this.text.length) {
            return EOF;
        }

        return this.text[this.textCursor];
    };

    PassageTokenizer.prototype.command = function () {
        /// <summary>
        ///   Matches a command token.
        /// </summary>

        var command = '';

        // Skip the starting <
        this.consume();

        while (this.peekChar() !== '>') {
            command += this.consume();
        }

        // Consume ending >
        this.consume();

        if (command[0] === '/') {
            // Ending of something
            this.tokens.push([PassageTokenizer.Tokens.NORMAL, 0]);
        } else if (command === 'fast') {
            this.tokens.push([PassageTokenizer.Tokens.FAST, 1]);
        } else if (command === 'slow') {
            this.tokens.push([PassageTokenizer.Tokens.SLOW, 1]);
        } else if (command === 'pause') {
            this.tokens.push([PassageTokenizer.Tokens.PAUSE, 1]);
        } else if (command === 'save') {
            this.tokens.push([PassageTokenizer.Tokens.CHECK_POINT, 0]);
        } else if (command === 'br/') {
            this.tokens.push([PassageTokenizer.Tokens.LINE_BREAK, 1]);
        } else {
            throw 'Unknown command "' + command + '"';
        }
    };

    PassageTokenizer.prototype.whiteSpace = function () {
        /// <summary>
        ///   Matches white space.
        /// </summary>

        var spaces = '';

        // TODO: Match other whitespace as well?
        while (this.peekChar() === ' ') {
            spaces += this.consume();
        }

        this.tokens.push([PassageTokenizer.Tokens.WHITE_SPACE, spaces]);
    };

    PassageTokenizer.prototype.word = function () {
        /// <summary>
        ///   Matches a word.
        /// </summary>

        var word = '',
            wordType = /[^ \n<]/;

        while (this.peekChar() !== EOF && wordType.test(this.peekChar())) {
            word += this.consume();
        }

        this.tokens.push([PassageTokenizer.Tokens.WORD, word]);
    };

    return PassageTokenizer;
}());
