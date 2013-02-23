/// <reference path="../Bindings/refs.js" />

/* global CanvasRenderingContext2D */

zz.DrawParams = {
    context: CanvasRenderingContext2D.prototype
};

zz.PreTokens = {
    'troll': 'the? troll',
    'look': '[describe|look at?]',
    'look around': '[describe| look around? ]',
    'get': '[get|take|pick up]',
    'sword': 'the? sword',
    'attack': '[attack|kill|fight]'
};

zz.Token = (function () {
    'use strict';

    /// <summary>
    ///   Represents a single token.
    /// </summary>

    function Token(type, value) {
        /// <summary>
        ///   A constructs a new token with the given name and value.
        /// </summary>
        /// <param name="type">
        ///   The type of the token.
        /// </param>
        /// <param name="value">
        ///   The value for the token.
        /// </param>

        this.type = type;
        this.value = value;
    }

    Token.prototype.type = "";
    Token.prototype.value = "";

    Token.prototype.toString = function() {
        /// <summary>
        ///   Converts the token to a string.
        /// </summary>
        /// <returns>
        ///   The string form of the token.
        /// </returns>

        return "<" + this.type + ", " + this.value.toString() + ">";
    };

    Token.names = {
        LBRACKET: 'lbracket',
        RBRACKET: 'rbracket',
        PIPE: 'pipe',
        WORD: 'word',
        LIST: 'list',
        ELEMENTS: 'elements',
        ELEMENT: 'element',
        QUESTION: 'question',
        EOF: 'eof',
        PHRASE: 'phrase'
    };

    return Token;
}());

zz.Lexer = (function () {
    'use strict';

    var EOF = "EOF",
        WHITE_SPACE = " \t\r\n",
        L_SQUARE_BRACKET = '[',
        R_SQUARE_BRACKET = ']',
        PIPE = '|',
        QUESTION = '?',
        WORD = /[A-Za-z'-]/;

    /// <summary>
    /// Contains a lexer.
    /// </summary>

    function Lexer() {
        this.inputBuffer = "";
        this.tokens = [];
    }

    Lexer.prototype.inputBuffer = "";
    Lexer.prototype.nextIndex = 0;
    Lexer.prototype.tokens = [];

    Lexer.prototype.nextToken = function () {
        /// <summary>
        ///   Gets the next token.
        /// </summary>
        /// <returns>
        ///   The next token in the sequence.
        /// </returns>

        var nextChar;

        while ((nextChar = this.peekChar()) !== EOF) {
            if (WHITE_SPACE.indexOf(nextChar) >= 0) {
                // Consume whitespace
                this.consume();
                continue;
            } else if (PIPE.indexOf(nextChar) >= 0) {
                this.consume();
                return new zz.Token(zz.Token.names.PIPE, '|');
            } else if (L_SQUARE_BRACKET.indexOf(nextChar) >= 0) {
                this.consume();
                return new zz.Token(zz.Token.names.LBRACKET, '[');
            } else if (R_SQUARE_BRACKET.indexOf(nextChar) >= 0) {
                this.consume();
                return new zz.Token(zz.Token.names.RBRACKET, ']');
            } else if (nextChar === QUESTION) {
                this.consume();
                return new zz.Token(zz.Token.names.QUESTION, '?');
            } else if (WORD.test(nextChar)) {
                return this.word();
            } else {
                throw 'Unknown token "' + nextChar + '"';
            }
        }

        return new zz.Token(zz.Token.names.EOF);
    };

    Lexer.prototype.reset = function () {
        /// <summary>
        ///   Resets the lexer, so it's ready to handle a new unrelated set of
        ///   input.
        /// </summary>

        this.nextIndex = 0;
        this.inputBuffer = '';
    };

    Lexer.prototype.word = function () {
        /// <summary>
        ///   Parses a word.
        /// </summary>
        /// <returns>
        ///   The word token.
        /// </returns>

        var word = '';

        while (this.peekChar() !== EOF && WORD.test(this.peekChar())) {
            word += this.peekChar();
            this.consume();
        }

        return new zz.Token(zz.Token.names.WORD, word);
    };

    Lexer.prototype.consume = function () {
        /// <summary>
        ///   Consumes a single character.
        /// </summary>

        this.nextIndex += 1;
        if (this.nextIndex > this.inputBuffer.length) {
            throw "Attempted to read past end of input buffer.";
        }
    };

    Lexer.prototype.peekChar = function () {
        /// <summary>
        ///   Looks ahaed a single character.
        /// </summary>

        if (this.nextIndex < this.inputBuffer.length) {
            return this.inputBuffer[this.nextIndex];
        } else {
            return EOF;
        }
    };

    Lexer.prototype.bufferInput = function (inputText) {
        /// <summary>
        ///   Adds the given input to the input buffer.
        /// </summary>
        /// <param type="String" name="inputText">
        ///   The input text to buffer.
        /// </param>

        $.each(zz.PreTokens, function (token, sub) {
            inputText = inputText.replace('<' + token + '>', sub);
        });

        this.inputBuffer += inputText;
    };

    Lexer.prototype.peekToken = function (distance) {
        /// <summary>
        ///   Peeks at the next token without changing the state of the lexer.
        /// </summary>
        /// <returns>
        ///   The next token that will be found.
        /// </returns>

        var index = this.nextIndex,
            token = this.nextToken();

        distance = distance || 0;

        while (distance > 0) {
            distance -= 1;
            token = this.nextToken();
        }

        // Restore state
        this.nextIndex = index;

        return token;
    };

    Lexer.prototype.match = function (tokenType) {
        /// <summary>
        ///   Verifies that the given token type is the next to be parsed and
        ///   returns it.  An exception is thrown if the next token is of a
        ///   different type.
        /// <summary>

        if (!this.isNext(tokenType)) {
            throw 'Expected "' + tokenType + '" but found "' + this.peekToken().type + '"';
        }

        return this.nextToken();
    };

    Lexer.prototype.isNext = function (tokenType, distance) {
        /// <summary>
        ///   Checks if the given token type is next to be found.
        /// </summary>

        return this.peekToken(distance || 0).type === tokenType;
    };

    return Lexer;
}());

zz.Parser = (function () {
    'use strict';

    /// <summary>
    /// Contains a parser.
    /// </summary>

    function Parser() {
        this.lexer = new zz.Lexer();
    }

    Parser.prototype.lexer = zz.Lexer.prototype;

    Parser.prototype.parse = function (inputText) {
        /// <summary>
        ///   Parses the given input text.
        /// </summary>
        /// <param type="String" name="inputText">
        ///   The input text to parse.
        /// </param>

        this.lexer.reset();
        this.lexer.bufferInput(inputText);
    };

    Parser.prototype.list = function () {
        /// <summary>
        ///   Matches a list.
        /// </summary>

        var elements;

        this.lexer.match(zz.Token.names.LBRACKET);
        elements = this.elements();
        this.lexer.match(zz.Token.names.RBRACKET);

        return elements;
    };

    Parser.prototype.elements = function () {
        /// <summary>
        ///   Matches a set of elements.
        /// </summary>

        var elements = [];

        elements.push(this.phrase());

        while (this.lexer.isNext(zz.Token.names.PIPE)) {
            this.lexer.nextToken();
            elements.push(this.phrase());
        }

        return new zz.Token(zz.Token.names.ELEMENTS, elements);
    };

    Parser.prototype.element = function () {
        /// <summary>
        ///   Matches a single element.
        /// </summary>
        var lId, rId;

        if (this.lexer.isNext(zz.Token.names.WORD)) {
            return new zz.Token(zz.Token.names.ELEMENT, this.lexer.nextToken());
        } else if (this.lexer.isNext(zz.Token.names.LBRACKET)) {
            return new zz.Token(zz.Token.names.ELEMENT, this.list());
        } else {
            throw 'Expected identifier or "["';
        }
    };

    Parser.prototype.phrase = function () {
        /// <summary>
        ///   Matches a phrase.
        /// </summary>

        var pieces = [],
            piece;

        do {
            if (this.lexer.isNext(zz.Token.names.WORD)) {
                piece = this.word();
            } else if (this.lexer.isNext(zz.Token.names.LBRACKET)) {
                piece = this.list();
            } else {
                throw "Expected WORD or '['";
            }

            if (this.lexer.isNext(zz.Token.names.QUESTION)) {
                this.lexer.match(zz.Token.names.QUESTION);
                piece.optional = true;
            } else {
                piece.optional = false;
            }

            pieces.push(piece);
        } while (this.lexer.isNext(zz.Token.names.WORD) || this.lexer.isNext(zz.Token.names.LBRACKET));

        return new zz.Token(zz.Token.names.PHRASE, pieces);
    };

    Parser.prototype.word = function () {
        /// <summary>
        ///   Matches a single word.
        /// </summary>

        return this.lexer.match(zz.Token.names.WORD);
    };

    return Parser;
}());

zz.Word = (function () {
    'use strict';

    /// <summary>
    /// Represents a single word to be matched with out going transitions.
    /// </summary>

    function Word(text, transitions, optional) {
        /// <summary>
        ///   Constructs a new word.
        /// </summary>
        /// <param name="text" type="String">
        ///   The text to be matched.
        /// </param>
        /// <param name="transitions" type="Array">
        ///   The set of all transitions out of this word.
        /// </param>
        /// <param name="optional">
        ///   Indicates if the word is part of an optional transition.
        /// </param>

        var that = this;

        this.text = text;
        this.transitions = transitions;
        this.accept = false;
        this.optional = optional;

        if (transitions.length === 0) {
            this.accept = true;
        }

        $.each(transitions, function (i, transition) {
            if (transition.optional && transition.accept) {
                // Optional accept follows, it can be bypassed and therefore we
                // can also accept.
                that.accept = true;
            }
        });
    }

    Word.prototype.word = '';
    Word.prototype.transitions = [];
    Word.prototype.accept = false;
    Word.prototype.optional = false;

    Word.prototype.match = function (words) {
        /// <summary>
        ///   Matches the given set of words agains the word graph.
        /// </summary>
        /// <param name="words" type="Array">
        ///   An array of strings containing the words to match.
        /// </param>
        /// <returns type="bool">
        ///   true if the words matched, false otherwise.
        /// </returns>

        var nextWord,
            nextList,
            matched = false;

        if (words.length === 0) {
            return this.accept;
        }

        nextWord = words[0];
        nextList = words.slice(1, words.length);

        $(this.transitions).each(function (index, transition) {
            if (transition.text.toLocaleLowerCase() === nextWord && transition.match(nextList)) {
                matched = true;
            }
        });

        return matched;
    };

    Word.prototype.predict = function (words) {
        /// <summary>
        ///   Finds predictions for word completion based on the current input.
        /// </summary>
        /// <param name="words" type="Array">
        ///   An array of strings containing the words to match.
        /// </param>
        /// <returns type="bool">
        ///   true if the words matched, false otherwise.
        /// </returns>

        var nextWord,
            nextList,
            predictions = [];

        nextWord = words[0];
        nextList = words.slice(1, words.length);

        if (words.length === 1) {
            $(this.transitions).each(function (index, transition) {
                if (/^@/.test(transition.text)) {
                    // Ignore anything starting with an @
                    return;
                }

                if (transition.text.toLocaleLowerCase().slice(0, nextWord.length) === nextWord) {
                    // TODO: Only include deltas here so they can be appended?
                    predictions.push(transition.text.slice(nextWord.length, transition.text.length));
                }
            });

            return predictions;
        }

        $(this.transitions).each(function (index, transition) {
            if (transition.text.toLocaleLowerCase() === nextWord) {
                predictions = predictions.concat(transition.predict(nextList));
            }
        });

        return predictions;
    };

    return Word;
}());

zz.Compiler = (function () {
    'use strict';

    /// <summary>
    /// Contains a compiler.
    /// </summary>

    function Compiler() {
        this.parser = new zz.Parser();
    }

    Compiler.prototype.parser = zz.Parser.prototype;

    Compiler.prototype.compile = function (inputText) {
        /// <summary>
        ///   Compiles the given input text.
        /// </summary>
        /// <param name="inputText" type="String">
        ///   The list to compile.
        /// </param>
        /// <returns type="zz.Word">
        ///   The root word.
        /// </returns>

        var transitions,
            phrase,
            accept = new zz.Word('@accept', [], true);
        
        this.parser.parse(inputText);
        phrase = this.parser.phrase();
        transitions = this.compilePhrase(phrase, [accept]);

        return new zz.Word('@root', transitions);
    };

    Compiler.prototype.compileList = function (list, following) {
        /// <summary>
        ///   Compiles the given list.
        /// </summary>
        /// <param name="list" type="zz.Token">
        ///   The list to compile.
        /// </param>
        /// <param name="following" type="Array" optional="true">
        ///   Optional list of transitions that come after the current phrase.
        /// </param>
        /// <returns type="Array">
        ///   The list of all possible transition that this list adds.
        /// </returns>

        var transitions = [],
            that = this;

        following = following || [];

        // All of the options from each branch of the list become our options
        $(list.value).each(function (index, phrase) {
            if (phrase.type !== zz.Token.names.PHRASE) {
                throw 'Compiler expected PHRASE but found ' + phrase.type + '"';
            }

            transitions = transitions.concat(that.compilePhrase(phrase, following));
        });

        return transitions;
    };

    Compiler.prototype.compilePhrase = function (phrase, following) {
        /// <summary>
        ///   Compiles the given list.
        /// </summary>
        /// <param name="list" type="zz.Token">
        ///   The list to compile.
        /// </param>
        /// <param name="following" type="Array" optional="true">
        ///   Optional list of transitions that come after the current phrase.
        /// </param>
        /// <returns type="Array">
        ///   The list of all possible transition that this list adds.
        /// </returns>

        var phrases = phrase.value.slice(),
            transitions = following || [],
            that = this;
        following = following || [];

        // Process the phrases in reverse order
        phrases.reverse();
        $(phrases).each(function (index, node) {
            var word,
                newTransitions;
            if (node.type === zz.Token.names.WORD) {
                // Single word
                word = new zz.Word(node.value, transitions, node.optional);

                if (node.optional) {
                    transitions = transitions.slice();
                } else {
                    transitions = [];
                }

                transitions.push(word);
            } else if (node.type === zz.Token.names.ELEMENTS) {
                // List
                newTransitions = that.compileList(node, transitions);

                if (node.optional) {
                    newTransitions = newTransitions.concat(transitions);
                }

                transitions = newTransitions;
            } else {
                throw 'Compiler expected WORD or LIST but found "' + node.type + '"';
            }

        });

        return transitions;
    };

    return Compiler;
}());

zz.autoComplete = function (items) {
    /// <summary>
    ///   Sets up an autocomplete list.
    /// </summary>
    /// <param name="items" type="Array">
    ///   An array of strings to set as the autocomplete list.
    /// </param>

    'use strict';
    var parent = $('.auto-complete');
    parent.empty();

    $(items).each(function (index, text) {
        parent.append('<li>' + text + '</li>');
    });
};

function lex(input) {
    /// <summary>
    ///   Parses the given set of input.
    /// </summary>

    'use strict';
    var lexer = new zz.Lexer(),
        token;
    lexer.bufferInput(input);

    do {
        token = lexer.nextToken();
        console.log(token.type);
    } while (token.type !== zz.Token.names.EOF);
}

function parse(input) {
    /// <summary>
    ///   Parses the given set of input.
    /// </summary>

    'use strict';
    var parser = new zz.Parser();
    parser.lexer.bufferInput(input);
    return parser.phrase();
}

function compile(input) {
    /// <summary>
    ///   Compiles the given set of input.
    /// </summary>

    'use strict';
    var parser = new zz.Parser(),
        compiler = new zz.Compiler(),
        phrase;

    parser.lexer.bufferInput(input);
    phrase = parser.phrase();
    return new zz.Word('@root', compiler.compilePhrase(phrase), false);
}

function match(line, input) {
    return compile(input).match(line.toLocaleLowerCase().split(/\s+/));
}

function predict(line, input) {
    var predictions = compile(input).predict(line.toLocaleLowerCase().split(/\s+/)),
        i;

    for (i = predictions.length - 1; i >= 0; i -= 1) {
        predictions[i] = line + predictions[i] + ' ';
    }

    return predictions;
}
