/* - ------------- - */
/* - FRASER MODULE - */
/* - ------------- - */

var mode = "desktop";
var currentStopColor = "gray";

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
				//Print 5 Things to know
				//TODO - populate 5Things printable with current section's content
				$("#5_things_to_know").removeClass("orange red navy green blue").addClass( currentStopColor );
				$("#5_things_to_know").printThis();
			break;
			
		}
		
	});
	

	//Change current stop and display
	function changeStop( stopId, stopColor, btnRef ) {
	
		$(".bubble-nav .button").removeClass('active');
		$(btnRef).addClass('active');
		
		$(".stop_container").hide();
		$("#stop_"+stopId).fadeIn('slow');
		
		currentStopColor = stopColor;
	
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
		height: '248',
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
