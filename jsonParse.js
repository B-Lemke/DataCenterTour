
AFRAME.registerComponent("arena", {
    schema: {
        manifest: { type: 'asset' },
        videoSphere: { type: 'string' },
    },

    init: function () {
        var self = this;
        var data = this.data;

        data.CompletetionList = [];
        data.VisitedList = [];

        //Add event listener to be called from outside this component
        this.el.addEventListener('loadNewPlace', function (event) {
            self.loadPlace(event.detail.place);
        });

        //Load the json
        new THREE.FileLoader().load(self.data.manifest, function (json) {
            data.jsonparsed = (JSON.parse(json));

            //Loop through "other images" (welcome, etc.) and load them into assets
            Object.keys(data.jsonparsed.otherImages).forEach(function (key) {
                if (data.jsonparsed.otherImages[key].image != null) {
                    var image = document.createElement('img');
                    image.setAttribute('id', data.jsonparsed.otherImages[key].name + "otherImg");
                    image.setAttribute('crossorigin', 'anonymous');
                    image.setAttribute('src', data.jsonparsed.otherImages[key].image);

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(image);
                }
            });

            //Loop through the places in the json and preload the videos and images into assets
            Object.keys(data.jsonparsed.places).forEach(function (key) {

                if (data.jsonparsed.places[key].video != null) {
                    var video = document.createElement('video');
                    video.setAttribute('id', data.jsonparsed.places[key].name + "VideoId");
                    video.setAttribute('loop', true);
                    video.setAttribute('style', 'display: none;');
                    video.setAttribute('crossorigin', 'anonymous');
                    video.setAttribute('playsinline', true);
                    video.setAttribute('webkit-playsinline', true);
                    //video.setAttribute('preload', 'auto');
                    video.setAttribute('src', data.jsonparsed.places[key].video);

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(video);
                }


                if (data.jsonparsed.places[key].image != null) {
                    var image = document.createElement('img');
                    image.setAttribute('id', data.jsonparsed.places[key].name + "ImageId");
                    image.setAttribute('crossorigin', 'anonymous');
                    image.setAttribute('src', data.jsonparsed.places[key].image);

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(image);
                }

                
                //Set-Up the course completion stuff
                if (data.jsonparsed.places[key].CountsTowardCompletetion == true){
                    data.CompletetionList.push(data.jsonparsed.places[key].name);
                }

            });

            //Loop through icons and load them into assets
            Object.keys(data.jsonparsed.icons).forEach(function (key) {
                if (data.jsonparsed.icons[key].image != null) {
                    var image = document.createElement('img');
                    image.setAttribute('id', data.jsonparsed.icons[key].name + "Icon");
                    image.setAttribute('crossorigin', 'anonymous');
                    image.setAttribute('src', data.jsonparsed.icons[key].image);

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(image);
                }
            });

            //Loop through hotspot images and load them into assets
            Object.keys(data.jsonparsed.hotspotImages).forEach(function (key) {
                if (data.jsonparsed.hotspotImages[key].image != null) {
                    var image = document.createElement('img');
                    image.setAttribute('id', data.jsonparsed.hotspotImages[key].name + "hotspotImage");
                    image.setAttribute('crossorigin', 'anonymous');
                    image.setAttribute('src', data.jsonparsed.hotspotImages[key].image);

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(image);
                }
            });


            //Loop through hotspot audio and load them into assets
            Object.keys(data.jsonparsed.hotspotAudio).forEach(function (key) {
                if (data.jsonparsed.hotspotAudio[key].audio != null) {
                    var audio = document.createElement('audio');
                    audio.setAttribute('id', data.jsonparsed.hotspotAudio[key].name + "hotspotAudio");
                    audio.setAttribute('crossorigin', 'anonymous');
                    audio.setAttribute('src', data.jsonparsed.hotspotAudio[key].audio);

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(audio);
                }
            });

            //Loop through hotspot videos and load them into assets
            Object.keys(data.jsonparsed.hotspotVideos).forEach(function (key) {
                if (data.jsonparsed.hotspotVideos[key].video != null) {
                    var vid = document.createElement('video');
                    vid.setAttribute('id', data.jsonparsed.hotspotVideos[key].name + "hotspotVideo");
                    vid.setAttribute('crossorigin', 'anonymous');
                    vid.setAttribute('playsinline', "");
                    vid.setAttribute('webkit-playsinline', "");
                    vid.setAttribute('src', data.jsonparsed.hotspotVideos[key].video);

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(vid);
                }
            });

            document.querySelector("#messageArea").emit("fadeOutGo");
            self.initManifest(data.jsonparsed);
        });
    },

    initManifest: function (manifest) {
        //Set the starting location
        var startPlace = manifest.places[manifest.startPlace];
        this.loadPlace(startPlace);
    },

    loadPlace: function (place) {
        var data = this.data;


        //Load all videos in assets and the videosphere
        var videos = document.querySelectorAll("video");
        var videosphere = document.querySelector(data.videoSphere);

        /////////Cleanup the Scene
        //Get an array of cleanable things in the scene and remove them
        var cleanables = document.querySelectorAll(".cleanFromScene");

        cleanables.forEach(function (cleaner) {

            cleaner.parentNode.removeChild(cleaner);
        });


        //Pause any video that is already playing
        if (videosphere.getAttribute('src') != null) {
            var currentSource = document.querySelector(videosphere.getAttribute('src'));
            if (currentSource.nodeName == "VIDEO") {
                currentSource.pause();
            }
        }

        //If passed in from the outside as a string, not a json object
        if (typeof place == "string") {
            place = data.jsonparsed.places[place];
        }

        if(place.CountsTowardCompletetion){
            //If this place is required for completion, and is not included in the visited list, add it
    
            if (!data.VisitedList.includes(place.name)){
                data.VisitedList.push(place.name);


                var arraysEqual = areArraysEqualSets(data.VisitedList, data.CompletetionList);
                var messageArea = document.querySelector("#messageArea");

                //do something once the arrays are equal, that means that all of the locations have been visited.
                if(arraysEqual)
                {
                    //Complete message
                    messageArea.setAttribute("text", "value: All Scenes Viewed. Continue Exploring At Your Leisure.; width: 10; align: center; transparent: true; alphaTest: 0.5" );  
                    setTimeout(function()
                    { 
                        messageArea.emit("fadeOutGo"); 
                    }, 5000);
                }
                else
                {
                    //Not compelte, x/x seen message display
                    var message = data.VisitedList.length + "/" + data.CompletetionList.length + " Scenes Viewed";
                    messageArea.setAttribute("text", "value: " + message + "; width: 10; align: center; alphaTest: 0.5; transparent: true;");
                    setTimeout(function()
                        { 
                            messageArea.emit("fadeOutGo"); 
                        }, 3000);
                }
                messageArea.emit("fadeInGo");  


            }


        }



        var sceneEl = document.querySelector('a-scene');

        if (place.video != null) {
            //Find the asset that matches the video
            var videoFound = false;

            for (var i = 0; i < videos.length; i++) {

                //Set the video that matches on the videosphere
                if (videos[i].src.endsWith(place.video)) {

                    videosphere.setAttribute('src', '#' + videos[i].id);
                    video = document.querySelector("#" + videos[i].id);

                    //video.currentTime = 0; This line causes major bugs in firefox. Bug 1507193 on bugzilla
                    video.play();

                    videoFound = true;
                }
            }
            if (!videoFound) {
                //Error handling for videos that aren't found
                console.log("Video not found");
            }

            //Set the videosphere's rotation because a lot of these videos are not facing the right way.
            videosphere.setAttribute("rotation", "0 " + place.videoRotation + " 0");

        }
        else {
            if (place.image != null) {
                //No video, just an image for this palce
                var images = document.querySelectorAll("img");

                for (var i = 0; i < images.length; i++) {
                    if (images[i].src.endsWith(place.image)) {
                        videosphere.setAttribute('src', '#' + images[i].id);
                    }
                }
            //Set the videosphere's rotation because a lot of these pictures are not facing the right way.
            videosphere.setAttribute("rotation", "0 " + place.videoRotation + " 0");

            }
            else {
                console.log("Video null");
            }
        }

        // place interactions in scene
        var interaction;
        var interactionEntity;
        for (var i = 0; i < place.interactions.length; i++) {
            interaction = place.interactions[i];
            interactionEntity = document.createElement('a-entity');



            if (interaction.kind == "navigationIcon") {
                //Retrieve the icon
                var image = document.querySelector("#" + interaction.icon + "Icon");

                //Send the payload and the icon
                interactionEntity.setAttribute("navigation_icon", {
                    payload: JSON.stringify(interaction.payload),
                    icon: image
                });
            } else if (interaction.kind == "hotspot") {
                //Retrieve the icon
                var image = document.querySelector("#" + interaction.icon + "Icon");

                //Send the payload and the icon
                interactionEntity.setAttribute("hotspot", {
                    payload: JSON.stringify(interaction.payload),
                    icon: image
                });
            }
            else {
                console.log(interaction.kind);
            }
            sceneEl.appendChild(interactionEntity);
        }



    }

})




// assumes array elements are primitive types
function areArraysEqualSets(a1, a2) {
    let superSet = {};
    for (let i = 0; i < a1.length; i++) {
      const e = a1[i] + typeof a1[i];
      superSet[e] = 1;
    }
  
    for (let i = 0; i < a2.length; i++) {
      const e = a2[i] + typeof a2[i];
      if (!superSet[e]) {
        return false;
      }
      superSet[e] = 2;
    }
  
    for (let e in superSet) {
      if (superSet[e] === 1) {
        return false;
      }
    }
  
    return true;
  }