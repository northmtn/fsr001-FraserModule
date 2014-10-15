/* - ------------- - */
/* - FRASER MODULE - */
/* - ------------- - */

var mode = "desktop";
var currentStopColor = "gray";
var curStopId = -1;

//On Window Resize....
$(function() {
    $(window).bind("load resize", function() {
    
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
        
        if (width < 768) {
            //updates for mobile
            if (mode=="desktop") {
            	//move content into mobile nav
            	$(".stop_container.orange").insertAfter("#bubble_orange");
            	$(".stop_container.navy").insertAfter("#bubble_navy");
            	$(".stop_container.red").insertAfter("#bubble_red");
            	$(".stop_container.blue").insertAfter("#bubble_blue");
            	$(".stop_container.green").insertAfter("#bubble_green");
            }
			mode = "mobile";
            
        } else {
        	if (mode=="mobile") {
        		//move content outside of nav
        		$(".stop_container").insertAfter( "#stop_intro" );
        	}
			mode = "desktop";
        }

    })
})


//Setup
$( document ).ready( function() {
	
	//Listen for all button clicks...
	$( "#frmod-page-wrapper" ).find(".button").on("click", function(event) {
	
		var btnId = $(this).attr('id');
		console.log(btnId);
		
		//Handle video playlist clicks		
		if (btnId.substring(0, 7) == "vid_btn") {
		
			var vidId = $(this).attr('data-vid-id');
			launchVideo( vidId );
			return;
		}
		
		//All other btns
		switch ( btnId ) {
			case "bubble_orange":
				changeStop(1, "orange", this);
			break;
			case "bubble_navy":
				changeStop(2, "navy", this);
			break;
			case "bubble_red":
				changeStop(3, "red", this);
			break;
			case "bubble_blue":
				changeStop(4, "blue", this);
			break;
			case "bubble_green":
				changeStop(5, "green", this);
			break;
			case "btn_printables":
				$( this ).parent().find(".printables-dropdown").toggle();
			break;
			case "btn_dropdown_print":
				printFiveThingsToKnow();
			break;
			
		}
		
	});
	

	//Change current stop and display
	function changeStop( stopId, stopColor, btnRef ) {
		
		$(".bubble-nav .button").removeClass('active');
		$(btnRef).addClass('active');
		
		$(".stop_container").hide();
		$("#stop_"+stopId).fadeIn('slow');
		
		pauseCurrentPlayer();
		
		currentStopColor = stopColor;
		curStopId = stopId;
	
	}
	
	function printFiveThingsToKnow() {
				
		//Set text
		var printDiv = $("#hidden_printables_container #5_things_to_know");
		var titleTxt = $("#bubble_"+currentStopColor).find(".huge").first().text();
		var fiveThings = $($("#stop_"+curStopId).find(".printables-dropdown p").get().reverse());
				
		$(printDiv).find("h3").text(titleTxt);
		$(printDiv).find("p").remove();//clear previous list
		$(fiveThings).each( function(){
			$(this).clone().insertAfter( $(printDiv).find("h3") );
		});
		
		//Set style
		$(printDiv).removeClass("orange red navy green blue").addClass( currentStopColor );
		
		//Print
		$(printDiv).printThis();
	
	}
	
	//Set initial view
	$(".stop_container").hide();
	$("#stop_intro").show();

});



//YouTube Video Player
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytplayers = [];
var playerInfoList = [	{id:'orange-player',height:'248',width:'440',videoId:''},
						{id:'navy-player',height:'248',width:'440',videoId:''},
						{id:'red-player',height:'248',width:'440',videoId:''},
						{id:'blue-player',height:'248',width:'440',videoId:''},
						{id:'green-player',height:'248',width:'440',videoId:''} ];

function onYouTubeIframeAPIReady() {

	if(typeof playerInfoList === 'undefined') return; 
	
	for(var i = 0; i < playerInfoList.length; i++) {
		var curplayer = createPlayer(playerInfoList[i]);
		ytplayers.push(curplayer);
	}

}
function createPlayer(playerInfo) {

  return new YT.Player(playerInfo.id, {
     height: playerInfo.height,
     width: playerInfo.width,
     videoId: playerInfo.videoId,
     playerVars: { 'autoplay': 0, 'controls': 2, 'rel':0, 'showInfo':0 } //Disable related videos and extra info
  });
  
}

function pauseCurrentPlayer () {
	
	if (curStopId > -1) ytplayers[curStopId-1].pauseVideo();
	
}

function launchVideo( youtubeVidId ){
	
	console.log("launchVideo: " + youtubeVidId);
	ytplayers[curStopId-1].loadVideoByUrl( youtubeVidId );
	
}
