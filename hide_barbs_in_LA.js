//author fmthemaster
//discord: fmthemaster#7485

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function toggleShowAttacked(value) {
	var xhttp = new XMLHttpRequest();

	console.log('toggleShowAttacked called');

	xhttp.open("POST", "/game.php?village="+game_data.village.id+"&screen=am_farm&ajaxaction=toggle_show_attacked&json=1&", true);
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("extended=1&target_screen=am_farm&show_attacked="+value+"&h="+csrf_token);
	xhttp.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {console.log("Toggling ShowAttacked to " + value);
		}
	}
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function GetBarbsInLA(i) {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = async function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	console.log("Read page " + i);
	    	var itempage = htmlToElements(xhttp.responseText);
	    	var npages = jQuery("[class='paged-nav-item']", itempage).length/2;

            var farmicons= jQuery("[class*='farm_village']", itempage);

    		FA_ids = FA_ids.concat($.map(farmicons, function(obj,key){return obj.className.split(" ")[1].split("_")[2]}));
            	console.log(FA_ids);

            if (i<npages){
            	GetBarbsInLA(i+1);
            }
            else {
            	toggleShowAttacked(0);
                HideBarbs();
            };
        }

	};
	xhttp.open("GET", "/game.php?village=" + game_data.village.id + "&screen=am_farm&Farm_page="+i, true);
	wait(200);
	xhttp.send();
};

function HideBarbs(){
	var map_villages = $("#map_container div:not('.map_border') img[id^='map_village']");
    map_villages.each(function(index, obj) {
        var id = $(obj).attr('id').substr(12);
        if (FA_ids.indexOf(id) > -1) {
        	console.log(obj);
        	$(obj).remove();
        	var icons = $("#map_container div:not('.map_border') img[id^='map_cmdicons_"+id+"']");
        	console.log(icons);
        	$.map(icons, function(objin,keyin){console.log(objin);return $(objin).remove();});
        }
    });
};

var FA_ids=[];
toggleShowAttacked(1);
GetBarbsInLA(1);
