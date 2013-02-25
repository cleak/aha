/// <reference path="../Bindings/refs.js" />

(function () {
    var inputBox = $('.input-box input'),
        objectManager = new zz.ObjectManager()
        page = new zz.Page($('#dialog')[0]),
        KEY_TAB = 9,
        KEY_DOWN = 40,
        KEY_UP = 38,
        KEY_SPACE = 32;

    zz.om = objectManager;
    zz.page = page;

    function getSelected() {
        return $('.auto-complete li.selected');
    }

    function updateAutoComplete (event) {
        var predictions,
            selected;

        // Tab for auto complete selection
        if (event.keyCode === KEY_TAB) {
            event.preventDefault();
            if (getSelected().length > 0) {
                this.value = getSelected().text();
            }
        }

        if (event.type === 'keyup' && (event.keyCode === KEY_DOWN || event.keyCode === KEY_UP)) {
            selected = getSelected();
            if (event.keyCode === KEY_DOWN) {
                if (selected.length > 0) {
                    selected.removeClass('selected');
                    selected.next().addClass('selected');
                } else {
                    $('.auto-complete li:first').addClass('selected');
                }


            } else if (event.keyCode === KEY_UP) {
                if (selected.length > 0) {
                    selected.removeClass('selected');
                    selected.prev().addClass('selected');
                } else {
                    $('.auto-complete li:last').addClass('selected');
                }
            }
        }

        if (event.keyCode === KEY_DOWN || event.keyCode === KEY_UP) {
            if (getSelected().length > 0) {
                this.value = getSelected().text();
            }

            return;
        }

        if (event.keyCode === KEY_SPACE && getSelected().length > 0) {
            event.preventDefault();
        }

        if (this.oldValue !== this.value) {
            predictions = objectManager.getPredictions(this.value);
            zz.autoComplete(predictions);

            if ($('.auto-complete li').length === 0) {
                $('.auto-complete').hide();
            } else {
                $('.auto-complete').show();
            }

            // Update color based on if it's valid or not
            var topBar = $('#input-box')
            topBar.removeClass('valid-input');
            topBar.removeClass('invalid-input');

            if (objectManager.run(this.value, true)) {
                topBar.addClass('valid-input');
            } else if(predictions.length === 0) {
                topBar.addClass('invalid-input');
            }

            this.oldValue = this.value;
        }
    }

    // Input box listeners
    inputBox.keypress(updateAutoComplete);
    inputBox.keydown(updateAutoComplete);
    inputBox.keyup(updateAutoComplete);
    inputBox.focus(function () {
        if ($('.auto-complete li').length > 0) {
            $('.auto-complete').show();
        }
    });

    inputBox.blur(function () {
        $('.auto-complete').hide();
    });

    function positionAutoComplete() {
        var input = $('.input-box input');
        $('.auto-complete').css({
            left: input.offset().left,
            top: input.offset().top + input.height() + 5,
            position: 'absolute'
        });
    }

    function sizeContent() {
        var content = $('.content');
        content.height($(window).height() - content.offset().top - 8);
    }

    $(window).resize(function () {
        sizeContent();
        positionAutoComplete();
    });
    positionAutoComplete();

    // Setup auto-complete
    $('#input-form').submit(function (event) {
        event.preventDefault();

        if (getSelected().length === 1) {
            objectManager.run(getSelected().text());
        } else {
            objectManager.run(inputBox.val());
        }
        inputBox.val('');
    });

    $('.prev-page a').click(function () {
        zz.page.prevPage();
    });

    $('.next-page a').click(function () {
        zz.page.nextPage();
    });

    sizeContent();
}());