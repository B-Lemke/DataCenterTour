
AFRAME.registerComponent("arena", {
    schema : {
        manifest : { type: 'asset'},
        videoSphere : {type: 'string'},
    },

    init: function(){
        var self = this;
        var data = this.data;

        //Add event listener to be called from outside this component
        this.el.addEventListener('loadNewPlace', function(event){
            self.loadPlace(event.detail.place);
        });
    
        //Load the json
        new THREE.FileLoader().load(self.data.manifest, function(json){
           data.jsonparsed = (JSON.parse(json));

            
            //Loop through the places in the json and preload the videos and images into assets
            Object.keys(data.jsonparsed.places).forEach(function(key){

                if(data.jsonparsed.places[key].video != null){
                    var video = document.createElement('video');
                    video.setAttribute('id', data.jsonparsed.places[key].name + "VideoId");
                    video.setAttribute('loop', true);
                    video.setAttribute('style', 'display: none;');
                    video.setAttribute('crossorigin', 'anonymous');
                    video.setAttribute('playsinline', true);
                    video.setAttribute('webkit-playsinline', true);
                    video.setAttribute('src', data.jsonparsed.places[key].video);    

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(video);
                }

                
                if(data.jsonparsed.places[key].image != null){
                    var image = document.createElement('img');
                    image.setAttribute('id', data.jsonparsed.places[key].name + "ImageId");
                    image.setAttribute('crossorigin', 'anonymous');
                    image.setAttribute('src', data.jsonparsed.places[key].image);    

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(image);
                }

            });

            //Loop through icons and load them into assets
            Object.keys(data.jsonparsed.icons).forEach(function(key){
                console.log(data.jsonparsed.icons[key]);
                console.log(data.jsonparsed.icons[key].image);
                if(data.jsonparsed.icons[key].image != null){
                    var image = document.createElement('img');
                    image.setAttribute('id', data.jsonparsed.icons[key].name + "Icon");
                    image.setAttribute('crossorigin', 'anonymous');
                    image.setAttribute('src', data.jsonparsed.icons[key].image);    

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(image);
                }
            });

           
            self.initManifest(data.jsonparsed); 

        });
    },

    initManifest : function(manifest){
        //Set the starting location
        var startPlace = manifest.places[manifest.startPlace];
        this.loadPlace(startPlace);
    },

    loadPlace : function(place){
        var data = this.data;
        console.log(place);
        //Passed in from the outside as a string, not a json object
        if(typeof place == "string"){
            place = data.jsonparsed.places[place];
        }
 
        var sceneEl = document.querySelector('a-scene');

        if (place.video != null){
            //Find the asset that matches the video
            var videos = document.querySelectorAll("video");
            var videosphere = document.querySelector(data.videoSphere);       

            var videoFound = false;

            for (var i = 0; i < videos.length; i++) {
            
                //Set the video that matches on the videosphere
                if(videos[i].src.endsWith(place.video)){
                    console.log("Match");
                    videosphere.setAttribute('src', '#' + videos[i].id);
                    video = document.querySelector("#" + videos[i].id);
 
                    video.currentTime = 0;
                    video.play();

                    videoFound = true;
                } 
            } 
            if(!videoFound){
                //Error handling for videos that aren't found
                console.log("Video not found");
            }
            //Set the videosphere's rotation because a lot of these videos are not facing the right way.
            videosphere.setAttribute("rotation", "0 " + place.videoRotation + " 0");

        }else{
            console.log("Video null");
        }
        

        // place interactions in scene
        var interaction;
        var interactionEntity;
        for(var i = 0; i < place.interactions.length; i++){
            interaction = place.interactions[i];
            interactionEntity = document.createElement('a-entity');
            


            if(interaction.kind == "navigationIcon"){
                //Retrieve the icon
                var image = document.querySelector("#" + interaction.icon + "Icon");
                
                //Send the payload and the icon
                interactionEntity.setAttribute("navigation_icon", {
                    payload : JSON.stringify(interaction.payload),
                    icon : image
                });
                console.log("Testing");
            } else{
                console.log(interaction.kind);
            }
            sceneEl.appendChild(interactionEntity);
        }

        

    }

})