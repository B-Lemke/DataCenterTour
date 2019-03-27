
AFRAME.registerComponent("arena", {
    schema : {
        manifest : { type: 'asset'},
        videoSphere : {type: 'selector'},
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
           self.initManifest(data.jsonparsed); 
            
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
            
        });
    },

    initManifest : function(manifest){
        //Set the starting location
        var startPlace = manifest.places[manifest.startPlace];
        this.loadPlace(startPlace);
    },

    loadPlace : function(place){

    }


})