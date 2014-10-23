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
				
				$(".col-md-7").each(function(){
					$printable = $(this).find(".panel-default").last();
					$printable.insertBefore($(this).next(".col-md-5").find(".panel-default").last());
				});
				/*$(".printables-button").each(function(){
					var $activity = ($(this).parent().parent().next(".col-md-5").find(".activities-button").first());
					//$(this).insertBefore($activity);
				});*/
            }
			mode = "mobile";
            
        } else {
        	if (mode=="mobile") {
        		//move content outside of nav
        		$(".stop_container").insertAfter( "#stop_intro" );
				$(".col-md-5").each(function(){
					$printable = $(this).find(".panel-default:eq( 1 )");
					$(this).parent().find(".col-md-7").first().append($printable);
				});
				
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
		
			$(this).addClass("selected").siblings().removeClass("selected");
			
			var vidId = $(this).attr('data-vid-id');
			launchVideo( vidId );
			return;
		}
		
		//Handle things-to-do popup navigation
		if (btnId.substring(0, 7) == "things-") {

			if (btnId == 'things-close') $("#navy-tool-popup #view-main").show().siblings('.container').hide();
			if (btnId == 'things-tips') $("#navy-tool-popup #view-tips").show().siblings('.container').hide();
			if (btnId == 'things-journal') $("#navy-tool-popup #view-journal").show().siblings('.container').hide();
			return;
			
		}
		
		//Handle tool show/hide buttons
		if (btnId.substring(0, 4) == "pop-") {
		
			var popupId = btnId.substring(4);
			$("#"+popupId).fadeIn();
			return;
			
		}
		
		//Handle tool popup clicks	
		if (btnId.substring(0, 11) == "tool-orange") {
			
			//show info
			var infoSection = btnId.substring(14);
			$("#orange-tool-popup .info-display").children("div").hide();
			$("#orange-tool-popup .info-display").children("div[id='info-"+infoSection+"']").show();
			
			//move tri
			var btnTop = parseInt($("#orange-tool-popup #"+btnId).position().top) + 12;
			$("#orange-tool-popup #tool-1-tri").css("top", btnTop);
			
			//activate btn
			$("#orange-tool-popup .button").removeClass('active');
			$("#orange-tool-popup #"+btnId).addClass('active');
	
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
			case "btn_popup_close":
				//Close open popup
				$(this).closest('.tool-popup').hide();
			break;
			default:
			
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

