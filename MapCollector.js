var coords = [];
var outputID = 'villageList';
var isEncoded = true;

function fnRefresh() {
    $('#coord_picker').draggable();
    $('#' + outputID).prop('value', coords.map(function(e) {
        return isEncoded ? '[coord]' + e + '[\/coord]' : e;
    }).join(isEncoded ? '\n' : ' '));
}
$(document).ready(function() {
    if ($('#' + outputID).length <= 0) {
        if (window.game_data.screen == 'map') {
            var srcHTML = '<div id="coord_picker" style="padding: 3px; z-index: 99999; position: absolute; top: 90px; width: auto; height: auto; background-color:#CEBC98; background-image: url(../graphic/index/bg-tile.jpg); border:2px solid; visibility: visible"><center><span style="color:blue;align:center;">Entfernen Sie die Koordinaten von der Karte.</span><br/><br/><center><input type="checkbox" id="cbBBEncode" onClick="isEncoded=this.checked;fnRefresh();"' + (isEncoded ? 'checked' : '') + '/>BB-Code?<br/><textarea id="' + outputID + '" cols="40" rows="10"resize="none" value="" onFocus="this.select();/><br/><input type="button" class="btn" value="Fenster schließen" onClick="window.location.reload()"></div>';
            $('body').append($(srcHTML));
            $('#coord_picker').draggable();
            TWMap.map._handleClick = function(e) {
                var pos = this.coordByEvent(e);
                var coord = pos.join('|');
                var village = TWMap.villages[pos.join('')];
                if (village && parseInt(village.points.toString().replace('.', ''), 10)) {
                    var ii = coords.indexOf(coord);
                    if (ii >= 0) coords.splice(ii, 1);
                    else coords.push(coord);
                }
                fnRefresh();
                return false;
            };
        } else {
            var redirect = confirm('Sie befinden sich nicht auf der Kartenansicht.\n\n Zur Kartenansicht wechseln?');
            if (redirect) window.self.location = window.game_data.link_base_pure.replace(/screen\=/i, 'screen=map');
        }
    }
});