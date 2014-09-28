/* - ------------- - */
/* - FRASER MODULE - */
/* - ------------- - */

//On Window Resize....
$(function() {
    $(window).bind("load resize", function() {
    
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
        
        if (width < 768) {
            //updates for mobile
            
        } else {
        	//updates for full version
        	
        }

    })
})


//Setup
$( document ).ready( function() {
	
	//Listen for all button clicks...
	$( "#frmod-page-wrapper" ).find(".button").on("click", function(event) {
	
		var btnId = $(this).attr('id');
		
		//Handle video playlist clicks		
		if (btnId.substring(0, 7) == "vid_btn") {
		
			var vidId = $(this).attr('data-vid-id');
			launchVideo( vidId );
			return;
		}
		
		//All other btns
		switch ( btnId ) {
			case "bubble_orange":
				changeStop(1, this);
			break;
			case "bubble_navy":
				changeStop(2, this);
			break;
			case "bubble_red":
				changeStop(3, this);
			break;
			case "bubble_blue":
				changeStop(4, this);
			break;
			case "bubble_green":
				changeStop(5, this);
			break;
			
		}
		
	});
	

	//Change current stop and display
	function changeStop( stopId, btnRef ) {
	
		$(".bubble-nav .button").removeClass('active');
		$(btnRef).addClass('active');
		
		$(".stop_container").hide();
		$("#stop_"+stopId).fadeIn('slow');
	
	}	

	//Set initial view
	$(".stop_container").hide();
	$("#stop_intro").show();

});



//YT Video Player
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '270',
		width: '440',
		videoId: '1Z9vUwRoBWw',
		events: {
			'onReady': onPlayerReady
		}
	});
}

function onPlayerReady(event) {
	console.log("player ready");
}

function launchVideo( youtubeVidId ){
	console.log("launchVideo: "+youtubeVidId);
	player.loadVideoById( youtubeVidId );
}
