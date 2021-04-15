var coords = [];
var outputID = 'villageList';
var isEncoded = true;
var mapOverlay;
var selectedVillages = [];
if ('TWMap' in window) mapOverlay = TWMap;

function fnRefresh() {
    $('#coord_picker').draggable();
    $('#' + outputID).prop('value', coords.map(function(e) {
        return isEncoded ? '[coord]' + e + '[\/coord]' : e;
    }).join(isEncoded ? '\n' : ' '));

}

function closeCoordArea() {
	jQuery('#coord_picker').remove();
	var mapOverlay = TWMap;
	mapOverlay.mapHandler.spawnSector = mapOverlay.mapHandler._spawnSector;
	mapOverlay.map._handleClick = mapOverlay.map._DShandleClick;
	mapOverlay.reload();
}

function resetCoordArea() {
	$('.coordArea').val('')
	UI.SuccessMessage(('Auswahl gelöscht!'), 4000);
}

function copyCoordArea() {
	const coords = jQuery('#villageList').val().trim();
	if (coords.length !== 0) {
		jQuery('#villageList').select();
		document.execCommand('copy');
		UI.SuccessMessage(('Kopiert!'), 4000);
	} else {
		UI.ErrorMessage(('Nichts zum kopieren gefunden! :-('), 4000);
	}
}
$(document).ready(function() {
	if (jQuery('#coord_picker').length < 1) {
		jQuery('body').append(srcHTML);
		jQuery('#coord_picker').draggable();
	} else {
		UI.ErrorMessage(('Script läuft bereits!'));
	}
    if ($('#' + outputID).length <= 0) {
        if (window.game_data.screen == 'map') {
            var srcHTML = '<div id="coord_picker" style="padding: 3px; z-index: 99999; position: absolute; top: 90px; width: auto; height: auto; background-color:#CEBC98; background-image: url(../graphic/index/bg-tile.jpg); border:2px solid; visibility: visible"><a class="popup_box_close custom-close-button" style="right: 0; top: 0;" onClick="closeCoordArea();" href="#">&nbsp;</a><center><span style="color:black;align:center;"><b>Wählen Sie Dörfer aus der Karte aus.</b></span><br/><span style="color:black;align:center;"><i>(auf die Dörfer klicken)</span><br/><br/><center><input type="checkbox" id="cbBBEncode" onClick="isEncoded=this.checked;fnRefresh();"' + (isEncoded ? 'checked' : '') + '/>BB-Code?<br/><textarea class="coordArea" id="' + outputID + '" cols="40" rows="10"resize="none" value="" onFocus="this.select();"></textarea><br/><input type="button" class="btn btn-confirm-no" value="Auswahl löschen" onClick="resetCoordArea();"><input type="button" class="btn btn-confirm-yes" value="Auswahl Kopieren" onClick="copyCoordArea();"><br/></div>';
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
	mapOverlay.mapHandler._spawnSector = mapOverlay.mapHandler.spawnSector;
	mapOverlay.map._DShandleClick = mapOverlay.map._handleClick;
});