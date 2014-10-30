//YouTube-based Video Player

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
     playerVars: { 'autoplay': 0, 'controls': 2, 'rel':0, 'showInfo':0, 'wmode':"Opaque" } //Disable related videos and extra info
  });
  
}

function pauseCurrentPlayer () {
	
	if (curStopId > -1) ytplayers[curStopId-1].pauseVideo();
	
}

function launchVideo( youtubeVidId ){
	
	console.log("launchVideo: " + youtubeVidId);
	ytplayers[curStopId-1].loadVideoByUrl( youtubeVidId );
	
}

