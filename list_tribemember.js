//
// author DNSTW (stivens)
// Updated by grabie2 on 13.01.2021
//
(function() {
    let mode = game_data.mode;
    if (mode === null)
        mode = (new URL(window.location)).searchParams.get('mode');

    if ((game_data.screen == 'ally' && mode == 'members')) {
        try {
            $('table.vis:contains(Ranking globalny)').attr('id', 'ally_content');
        } catch {
            ;
        }
        var table = $('#ally_content');
        var theader = $('table th:contains(Funkcje)').clone().text('Dodać?');
    } else if (game_data.screen == 'info_ally') {
        try {
            $('table.vis:contains(Ranking globalny)').attr('id', 'ally_content');
        } catch {
            ;
        }
        var table = $('#ally_content');
        var theader = $('table th:contains(Nazwa)').clone().text('Dodać?');
    } else if (game_data.screen == 'info_member') {
        var table = $('th:contains(Ranking globalny)').parent().parent().parent();
        var theader = $('table th:contains(Wioski)').clone().find('a').text('Dodać?');
    } else {
        UI.InfoMessage('Das Skript sollte mit der Stammesmitgliederübersicht verwendet werden.', 5000, 'error');
        throw new Error('Skrypt przerwany.');
    }
    var popup_content = `<div style="text-align:center" id="mailing_popup">
                        <input type="radio" name="type" value="mailing" checked> Lista mailingowa<br>
                        <input type="radio" name="type" value="bbcode"> Lista z bbcode<br><br><br>
                        <button type="button" class="btn" id="check_all_btn">Zaznacz wszystkich</button>
                        <button type="button" class="btn" id="ready_btn">Stwórz listę</button><br><br><hr><br><br>
                        <textarea id="list_textar" style="width: 90%" rows="7"></textarea>
                    </div>`;

    function createPopup(title, content, options) {
        const {
            width,
            height,
            onClose
        } = options;
        const updateContainement = (element) => {
            const maxBottom = $(document).height() - $(element).outerHeight();
            const maxRight = $(document).width() - $(element).outerWidth();
            const minTop = $(".top_bar").height();
            element.draggable("option", "containment", [0, minTop, maxRight, maxBottom])
        };
        const closeLink = $('<a href="#">X</a>');
        const titleBar = $('<div class="popup_menu"></div>').append(title).append(closeLink);
        const contentDiv = $('<div class="popup_content"></div>').append(content);
        if (height)
            contentDiv.css({
                height
            });
        const popup = $('<div class="popup_style" style="position: fixed;"></div>').append(titleBar).append(contentDiv);
        if (width)
            popup.css({
                width
            });
        const helper = $('<div class="popup_helper"></div>').append(popup);
        UI.Draggable(popup);
        $('#ds_body').append(helper);
        closeLink.click(() => {
            if (onClose)
                onClose(popup);
            helper.remove();
        });
        updateContainement(popup);
        $(window).resize(() => updateContainement(popup));
        popup.show();
    };
    if ($('#mailing_popup').length === 0) {
        createPopup('Tworzenie listy graczy', popup_content, {
            width: 400
        });
        $('#ready_btn').on('click', function() {
            var type = $('input[name = "type"]:checked').val();
            var result = '';
            switch (type) {
                case 'mailing':
                    $('.mailing_chkbox').each(function() {
                        if ($(this).is(':checked')) {
                            result += $(this).attr('value') + ";";
                        }
                    });
                    break;
                case 'bbcode':
                    $('.mailing_chkbox').each(function() {
                        if ($(this).is(':checked')) {
                            result += '[player]' + $(this).attr('value') + "[/player]\r\n";
                        }
                    });
                    break;
            }
            $('#list_textar').text(result);
        });
        $('#check_all_btn').on('click', function() {
            $('.mailing_chkbox').each((index, checkbox) => {
                $(checkbox).attr('checked', true);
            });
        });
        $(table).find('th:first').before(theader);
        var members = $(table).find('tr:not(:first-child)');
        $(members).each(function() {
            var name = $(this).find('td')[0];
            name = $(name).find('a').text().trim();
            if ($(this).find('input.mailing_chkbox').length === 0)
                $(this).find('td:first').before('<td class="lit-item"><input type="checkbox" class="mailing_chkbox" value="' + name + '"></td>');
        });
    }
})()