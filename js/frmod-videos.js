//YouTube-based Video Player
var tag;
var firstScriptTag;
var ytplayers = [];
var playerInfoList;
var videosInitialized = false;

function initVideos(){
	
	tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	playerInfoList = [	{id:'orange-player',height:'248',width:'440',videoId:''},
						{id:'navy-player',height:'248',width:'440',videoId:''},
						{id:'red-player',height:'248',width:'440',videoId:''},
						{id:'blue-player',height:'248',width:'440',videoId:''},
						{id:'green-player',height:'248',width:'440',videoId:''}
						];

}

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
	 events: {
            'onStateChange': onPlayerStateChange
          },
	 playerVars: { 'autoplay': 0, 'controls': 0, 'rel':0, 'showInfo':0, 'modestbranding':1, 'wmode':"Opaque" } //Disable related videos and extra info
  });
  
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		//Video finished, show poster thumbnail
		// $("#stop_"+curStopId).find(".video-player-container .player-poster").show();
	}

}

function pauseCurrentPlayer () {
	
	if (curStopId > -1) ytplayers[curStopId-1].pauseVideo();
	
}

var mobilePlayback = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	mobilePlayback = true;
}

function launchVideo( youtubeVidId ){

	if (mobilePlayback==true) {
		//Mobile does not allow playback to start 
		//without direct user interaction, so we 
		//cue the video instead, then the user starts
		//playback by clicking big red play button.
		ytplayers[curStopId-1].cueVideoByUrl( youtubeVidId );
	} else {
		//On desktop browsers we can start right away.
		ytplayers[curStopId-1].loadVideoByUrl( youtubeVidId );
	}

}
