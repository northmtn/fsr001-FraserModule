/* - ------------- - */
/* - FRASER MODULE - */
/* - ------------- - */

var mode = "desktop";
var currentStopColor = "gray";
var curStopId = -1;
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

//On Window Resize....
$(function() {
    $(window).bind("load resize", function() {

        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;

        if (width < 992) {
            //updates for mobile
            if (mode=="desktop") {
            	//move content into mobile nav
            	$(".stop_container.orange").insertAfter("#bubble_orange");
            	$(".stop_container.navy").insertAfter("#bubble_navy");
            	$(".stop_container.red").insertAfter("#bubble_red");
            	$(".stop_container.blue").insertAfter("#bubble_blue");
            	$(".stop_container.green").insertAfter("#bubble_green");

				$(".printables-dropdown").hide();

				$(".col-md-7").each(function(){
					$printable = $(this).find(".panel-default").last();
					$printable.insertBefore($(this).next(".col-md-5").find(".panel-default").last());
				});
            }
			mode = "mobile";
			$( "#frmod-page-wrapper" ).removeClass("desktop").addClass("mobile");

        } else {
        	if (mode=="mobile") {
        		//move content outside of nav
        		$(".stop_container").insertAfter( "#stop_intro" );
				$(".col-md-5").each(function(){
					$printable = $(this).find("#btn_printables").parent();
					$(this).parent().find(".col-md-7").first().append($printable);
				});

				$(".mobile-window-container").remove();
				$(".video-fullscreen").remove();

        	}
			mode = "desktop";
			$( "#frmod-page-wrapper" ).removeClass("mobile").addClass("desktop");
        }

		if(videosInitialized == false){
			videosInitialized = true;
			initVideos();
		}

    })
})


//Setup
$( document ).ready( function() {

	//Listen for all button clicks...
	$( "#frmod-page-wrapper" ).find(".button").on("click", function(event) {

		var btnId = $(this).attr('id');
		var title = $(this).attr("title");

		//Handle video playlist clicks
		if (btnId.substring(0, 7) == "vid_btn") {

			var btn = this;

			//click from poster-thumb. simulate click on first quote.
			if ($(this).hasClass("player-poster")===true) {
				btn = $('.stop_container.'+currentStopColor).find('.video-list #vid_btn').first();
			}

			$(btn).addClass("selected").siblings().removeClass("selected");

			var vidId = $(btn).attr('data-vid-id');

			if(width > 556){
				launchVideo( vidId );
				togglePoster(false);
			} else{
				var arr = vidId.split("/");
				var id = arr[arr.length-1];
				createMobileWindow("", $("#mobile-video").html(), true);
				$(".mobile-window #youtube").attr("src", "http://www.youtube.com/embed/"+id+"?autoplay=1&modestbranding=1&showinfo=0&rel=0&wmode=transparent");
			}

			return;
		}

		//Handle things-to-do popup navigation
		if (btnId.substring(0, 7) == "things-") {

			if (btnId == 'things-close') $("#navy-tool-popup #view-main").show().siblings('.info-display').hide();
			if (btnId == 'things-tips') $("#navy-tool-popup #view-tips").show().siblings('.info-display').hide();
			if (btnId == 'things-journal') $("#navy-tool-popup #view-journal").show().siblings('.info-display').hide();
			return;

		}

		//Handle tool show/hide buttons
		if (btnId.substring(0, 4) == "pop-") {

			var popupId = btnId.substring(4);

			if(mode == "desktop"){
				//shift popup on top of content
				var p = $("#"+popupId);
				$(p).css('top', 0);
				$(p).show();
				var topOffset = parseInt((p).position().top) - 235;
				$(p).css('top', -topOffset);
				$(p).hide();
				$(p).fadeIn('fast');

				pauseCurrentPlayer();
				$('.video-player-container #'+currentStopColor+'-player').css('visibility', 'hidden');

				return;
			} else {
				if($("#"+popupId+"-mobile").find(".my-gallery").length){
					createMobileWindow(title, $("#"+popupId+"-mobile").html());
					$(".mobile-window .my-gallery").swipeshow({autostart: false});
				} else{
					createMobileWindow(title, $("#"+popupId+"-mobile").html(), false, true);
				}
				return;
			}
		}

		//Handle blue tool polaroid selection
		if (btnId.substring(0, 8) == "polaroid") {

			$(this).toggleClass('selected');
			$(this).siblings('#'+btnId).toggleClass('selected');

		}

		//Handle tool popup clicks
		if (btnId.substring(0, 11) == "tool-orange") {

			//show info
			var infoSection = btnId.substring(12);
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
				if(mode == "desktop"){
					$( this ).parent().find(".printables-dropdown").toggle();
				} else{
					createMobileWindow("5 Things To Know:", $( this ).parent().find(".printables-dropdown").html(), false, true);
					$(".mobile-window p").each(function(){
						if($(this).html().length == 1){
							$(this).remove();
						}
					});
					$(".mobile-window p").replaceWith(function(){
						return $("<li />").append($(this).contents());
					});
					$(".mobile-window li").wrapAll("<ul />");
				}
			break;
			case "btn_dropdown_print":
				printFiveThingsToKnow();
			break;
			case "print_photo_card":
				printPhotoCard();
			break;
			case "btn_popup_close":
				//Close open popup
				$(this).closest('.tool-popup').hide();
				$('.video-player-container #'+currentStopColor+'-player').css('visibility', 'visible');
			break;
			default:

			break;
		}

	});

	//Listen for any special rollover states
	var polpreview = $('#blue-tool-popup #polaroid-preview');
	$( "#frmod-page-wrapper" ).find("#blue-tool-popup #thumb-grid .button.thumb").hover(
		function(event) {
			var psrc = $(this).find("img").first().attr('src');
			psrc = psrc.replace("polaroids-thumb", "polaroids-print");
			$(polpreview).find("img").first().attr('src', psrc);
			$(polpreview).stop().fadeIn('fast');
		}, function(event) {
			$(polpreview).stop().fadeOut('fast');
		}
	);


	//Change current stop and display
	function changeStop( stopId, stopColor, btnRef ) {

		$(".bubble-nav .button").removeClass('active');
		$(btnRef).addClass('active');

		$(".stop_container").hide();
		$("#stop_"+stopId).fadeIn('slow');

		//show default poster thumb
		togglePoster(true);

		pauseCurrentPlayer();

		currentStopColor = stopColor;
		curStopId = stopId;

	}

	function togglePoster(show){
		if (show){
			$("#stop_"+curStopId).find(".video-player-container .player-poster").show();
			if (!is_firefox){
				$('.video-player-container #'+currentStopColor+'-player').css('width', 0);
				setTimeout(function(){ //IE8 Quirk
					$('.video-player-container #'+currentStopColor+'-player').css('width', 0);
				}, 200);
			}
			
		}else{
			$("#stop_"+curStopId).find(".video-player-container .player-poster").hide();
			if (!is_firefox){
				$('.video-player-container #'+currentStopColor+'-player').css('width', 440);
			}
		}
	}

	function printPhotoCard() {

		//Set text
		var printDiv = $("#hidden_printables_container #photo_card");
		var selectedPhotos = $($("#stop_"+curStopId).find(".tool-popup #thumb-grid .thumb.selected").get());

		$(printDiv).find(".photo-box").each( function(index){

			if (index < $(selectedPhotos).length){

				$(this).show();
				$(this).css('visibility', 'visible');
				var selectedPhoto = $(selectedPhotos).eq(index);

				var newSrc = $(selectedPhoto).find("img").first().attr('src');
				newSrc = newSrc.replace("polaroids-thumb", "polaroids-print");

				var title = $(selectedPhoto).find("p").attr('print-title');

				$(this).find("img").attr('src', newSrc);
				$(this).find("img").attr('alt', title);
				$(this).find("p").html( title );

			} else {
				$(this).find("img").attr('src', '');
				$(this).css('visibility', 'hidden');
				if (index > 11) $(this).hide();
			}

		});

		//Set style
		$(printDiv).removeClass("orange red navy green blue").addClass( currentStopColor );

		//Wait for all print images to finish loadig before printing
		var $images = $(printDiv).find("img[src!='']");
		var loaded_images_count = 0;

		$images.load(function(){
			loaded_images_count++;
			if (loaded_images_count == $images.length) {
				//Print
				$(printDiv).printThis();
				$images.unbind( "load" );
			}
		});

	}

	function printFiveThingsToKnow() {

		//Set text
		var printDiv = $("#hidden_printables_container #five_things_to_know");
		var titleTxt = $("#bubble_"+currentStopColor).find(".huge").first().text();
		var fiveThings = $($("#stop_"+curStopId).find(".printables-dropdown p").get().reverse());

		$(printDiv).find("h2").text(titleTxt);
		$(printDiv).find("p:not(.footer)").remove();//clear previous list
		$(fiveThings).each( function(){
			$(this).clone().insertAfter( $(printDiv).find("h2") );
		});

		//Set style
		var printColor = currentStopColor;
		if (printColor == 'orange') printColor = 'orange-p'; //Prevent border disappearance bug
		$(printDiv).removeClass("orange-p red navy green blue").addClass( printColor );

		//Print
		$(printDiv).printThis();

	}

	function createMobileWindow(title, html, video, tapToExit){
		video = typeof video !== 'undefined' ? video : false;
		tapToExit = typeof tapToExit !== 'undefined' ? tapToExit : false;

		$("#frmod-page-wrapper").append('<div class="mobile-window-container"><div class="mobile-window"><div class="btn-window-close '+currentStopColor+'">X</div><h3>'+title+'</h3>' + html + '</div></div>');

		if(video == true){
			$(".mobile-window-container").addClass("video-fullscreen");


			//This is a hack to circumvent an issue with yt player blocking our close button after fs playback
			// setInterval(function(){
			// 	$("#myxCloseButton").remove();
			// 	$("#frmod-page-wrapper").append('<div id="myxCloseButton" style="backround:#ffff00; top:10px; left:10px; position:fixed; z-index:9999999999; padding:20px; margin:20px; width:100px; height100px;">CLOSE<br>CLOSE<br>CLOSE<br>CLOSE</div>');
			// 	$("#myxCloseButton").on("click", function(event){
			// 		$(".mobile-window-container").remove();
			// 	});
			// }, 750);

		}

		$(".btn-window-close").on("click", function(event){
			$(".mobile-window-container").remove();
		});

		$(".mobile-window-container").on("click", function(event){
			$(".mobile-window-container").remove();
		});



		if(tapToExit == true){
			var overLink = false;
			$(".mobile-window a").on("mouseover", function(){
				overLink = true;
			});
			$(".mobile-window a").on("mouseout", function(){
				overLink = false;
			});
			$(".mobile-window").click(function(){
				if(overLink == false){
					$(".btn-window-close").trigger("click");
					$(".mobile-window-container").remove();
				}
			});
		}
	}

	//Set initial view
	$(".stop_container").hide();
	$("#stop_intro").show();
});
