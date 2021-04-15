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
            var srcHTML = '<div id="coord_picker" style="padding: 3px; z-index: 99999; position: absolute; top: 90px; width: auto; height: auto; background-color:#CEBC98; background-image: url(../graphic/index/bg-tile.jpg); border:2px solid; visibility: visible"><center><span style="color:black;align:center;"><b>Wählen Sie Dörfer aus der Karte aus.</b></span><br/><span style="color:black;align:center;"><i>(auf die Dörfer klicken)</span><br/><br/><center><input type="checkbox" id="cbBBEncode" onClick="isEncoded=this.checked;fnRefresh();"' + (isEncoded ? 'checked' : '') + '/>BB-Code?<br/><textarea id="' + outputID + '" cols="40" rows="10"resize="none" value="" onFocus="this.select();"></textarea><br/><input type="button" class="btn" value="Fenster schließen" onClick="window.location.reload()"></div>';
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
			UI.ErrorMessage(
			`${('Dieses Script muss auf der Karte ausgeführt werden! <a href="/game.php?screen=map" class="btn">zur Karte</a>')}`,
			4000
			);
        }
    }
});