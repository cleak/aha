/// <reference path="../Bindings/refs.js" />

zz.Page = (function () {
    'use strict';

    /// <summary>
    ///   Represents a page of text.
    /// </summary>

    function Page (container, writeSpeed) {
        /// <summary>
        ///   Contsucts a new empty page associated with the given container.
        /// </summary>
        /// <param name="container" type="Element">
        ///   The container the page is associated with.
        /// </param>
        /// <param name="writeSpeed" type="Number" optional="true">
        ///  Optional speed to write to the page with new text in char / ms.
        /// </param>

        var that = this;

        this.container = container;
        this.writeSpeed = writeSpeed || 15;
        this.currentPage = $(container).children('.page:first');
        this.wordQueue = [];
        this.nextChar = 0;

        setInterval(function () {
            that._doWrite();
        }, this.writeSpeed);

        this.passageTokenizer = new zz.PassageTokenizer();
    }

    Page.prototype.container = Element.prototype;
    Page.prototype.currentPage = Element.prototype;
    Page.prototype.passageTokenizer = zz.PassageTokenizer.prototype;
    Page.prototype.writeSpeed = 1;
    Page.prototype.wordQueue = [];
    Page.prototype.nextChar = 0;

    Page.prototype.canFit = function (text) {
        /// <summary>
        ///   Checks if the given text can fit on the page.
        /// </summary>
        /// <param name="text" type="String">
        ///   The text to check.
        /// </param>
        /// <returns type="Boolean">
        ///   true if the text fits, false otherwise.
        /// </returns>

        var page = $(this.currentPage),
            fits,
            span;

        page.append('<span class="deleteMe">' + text + '</span>');
        span = page.find('.deleteMe');

        //fits = (page[0].scrollHeight <= page.outerHeight());
        fits = (span.offset().top + span.height() < page.offset().top + page.height());

        page.children('.deleteMe').remove();

        return fits;
    };

    Page.prototype.write = function (text, speedMultiplier) {
        /// <summary>
        ///   Writes the given text to the page at the given speed.
        /// </summary>
        /// <param name="text" type="String">
        ///   The text to write to the page.
        /// </param>
        /// <param name="speedMultiplier" type="Number" optional="true">
        ///   The optional speed multiplier at which to write the text.
        /// </param>

        var words = this.passageTokenizer.tokenize(text);

        speedMultiplier = speedMultiplier || 1;

        this.wordQueue = this.wordQueue.concat(words);
    };

    Page.prototype._doWrite = function (text, speedMultiplier) {
        /// <summary>
        ///   Performs an increment of writing work.
        /// </summary>

        var nextWord;

        if (this.wordQueue.length === 0) {
            return;
        }

        nextWord = this.wordQueue[0];
            
        // Check if we've filled up the page
        if (this.nextChar === 0 && !this.canFit(this.wordQueue[0])) {
            this.addPage();
        }

        if (nextWord[0] === zz.PassageTokenizer.Tokens.WORD) {
            this.currentPage.append(nextWord[1][this.nextChar]);
            this.nextChar += 1;
        } else if (nextWord[0] === zz.PassageTokenizer.Tokens.WHITE_SPACE) {
            //this.currentPage.append('&nbsp;');
            this.currentPage.append(' ');
            this.nextChar += 1;
        } else if (nextWord[0] === zz.PassageTokenizer.Tokens.LINE_BREAK) {
            this.currentPage.append('<br/>');
            this.wordQueue.splice(0, 1);
            return;
        }

        // Pop off the next word if we've finished it
        if (this.nextChar >= nextWord[1].length) {
            // TODO: Do we want to handle empty words?  Will fail here.
            this.currentPage.append(' ');
            this.wordQueue.splice(0, 1);
            this.nextChar = 0;
        }
    };

    Page.prototype.addPage = function () {
        /// <summary>
        ///   Adds a new page and sets it as the current one.
        /// </summary>

        // TODO: If viewing a previous page, things will get messed up here
        var pages = $(this.container).children('.page');

        if (this.currentPage[0] !== $('.page:last')[0]) {
            // There's an unused page, use it.
            this.currentPage = $('.page:last');
            return;
        }

        pages.hide('fast');
        $(pages[pages.length - 1]).show('fast', function () {
            $(this).removeAttr('style');
        });
        $(this.container).append('<div class="page"></div>');

        this.currentPage = $(this.container).children('.page:last');
    };

    Page.prototype.nextPage = function () {
        /// <summary>
        ///   Turns to the next page if it exists.
        /// </summary>

        var lastPage = $(this.container).children('.page:visible:last'),
            pages = $('.page');

        // Check if there are no more pages
        if (lastPage.next().length === 0) {
            return;
        }

        pages.hide('fast');
        lastPage.show('fast');
        lastPage.next().show();
    };

    Page.prototype.prevPage = function () {
        /// <summary>
        ///   Turns to the next page if it exists.
        /// </summary>

        var firstPage = $(this.container).children('.page:visible:first'),
            pages = $('.page');

        // Check if there's no previous page
        if (firstPage.prev().length === 0) {
            return;
        }

        pages.hide('fast');
        firstPage.show('fast');
        firstPage.prev().show();
    };

    return Page;
}());