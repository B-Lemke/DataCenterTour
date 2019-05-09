//Node list fix for ForEach in edge
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

AFRAME.registerComponent('navigation_icon', { 
    schema: {
        payload : {type: "string"},
        icon: {type: "selector"}
    },

    /*
        payload comes from a json file and contains the information needed to create a location sphere and its label
    */

    init: function () {
        //additional cleanup line to make sure the parent a-entity gets cleaned up
        this.el.setAttribute("class", "cleanFromScene");

        var data = this.data;
        var payload = JSON.parse(this.data.payload);
        var el = document.createElement('a-plane');
        var sceneEl = document.querySelector('a-scene');
        
        el.setAttribute('scale', '2 2 2');

        //If an icon rotation hasn't been set, set one
        var iconRotation = payload.iconRotation != null ? payload.iconRotation : 0;
        //If an icon rotation hasn't been set, set one
        if(payload.iconRotation != "look-at"){
            var rotationVector = {"x" : 270, "y" : iconRotation, "z": 0};
            el.setAttribute('rotation', rotationVector);
        } else {
            el.setAttribute('look-at', '#camera');
        }

        el.setAttribute('material', 'transparent:true; alphaTest: 0.5; opacity:0.9; src: #' + payload.icon);

        //Give the entity a class we can refer to it by later, and make it clickable
        el.setAttribute("class", "navIcon clickable cleanFromScene"); 
        el.setAttribute("position", payload.position); 

        sceneEl.appendChild(el);

        //Event listener for interaction
        el.addEventListener('click', function (evt) {

            //Get the arena and load the next place
            var arena = document.querySelector("[arena]");
              
            arena.emit("loadNewPlace", {place: payload.place});

        });
    
    }


});



AFRAME.registerComponent('hotspot', { 
    schema: {
        payload : {type: "string"},
        icon: {type: "selector"}
    },

    /*
        payload comes from a json file and contains the information needed to create a location sphere and its label
    */

    init: function () {
        //additional cleanup line to make sure the parent a-entity gets cleaned up
        this.el.setAttribute("class", "cleanFromScene");


        var data = this.data;
        var payload = JSON.parse(this.data.payload);
        var el = document.createElement('a-plane');
        
        var sceneEl = document.querySelector('a-scene');
        
        var hotspotScale = payload.hotspotScale != null ? payload.hotspotScale : 1;
        el.setAttribute('width', hotspotScale);
        el.setAttribute('fit-texture', true);

        //If an icon rotation hasn't been set, set one
        if(payload.hotspotRotation != "look-at"){
            var iconRotation = payload.hotspotRotation != null ? payload.hotspotRotation : {"x" : 0, "y" : 0, "z": 0};
            el.setAttribute('rotation', iconRotation);
        } else {
            el.setAttribute('look-at', '#camera');
        }
        el.setAttribute('geometry', 'primitive: plane;');
        el.setAttribute('material', 'transparent:true; alphaTest: 0.5; opacity:0.9; src: #' + data.icon.id);

        //Give the entity a class we can refer to it by later, and make it clickable
        el.setAttribute("class", "hotspot clickable cleanFromScene"); 
        el.setAttribute("id", payload.title + "Hotspot"); 
        el.setAttribute("position", payload.position); 

        sceneEl.appendChild(el);

        //Event listener for interaction
        
        el.addEventListener('click', function (evt) {
            if(el.getAttribute('visible') == true){
                el.classList.remove("clickable");
                el.setAttribute('visible', false);

                if(payload.hotspotType === "text"){
                    
                //Create a text box
                var newPopup = document.createElement("a-entity");
                newPopup.setAttribute('position', payload.position);
                if(payload.textboxRotation != "look-at"){
                    newPopup.setAttribute('rotation', payload.textboxRotation);
                } else{
                    newPopup.setAttribute("look-at", "#camera");
                }

                newPopup.setAttribute('geometry', 'primitive: plane; width:auto; height: auto;');
                newPopup.setAttribute('material', 'color: white');
                newPopup.setAttribute('id', payload.title);
                newPopup.setAttribute('text', 'width: 6; color: black; zOffset: 0.01; align:center; value: ' + payload.hotspotText);

                newPopup.setAttribute("class", "hotspotText");

                } else if (payload.hotspotType =="image" || payload.hotspotType =="audio"){
                    //Image hotspot, or the image for an audio hotspot
                    var newPopup = document.createElement("a-plane");
                    newPopup.setAttribute("class", "hotspotImage");
                    newPopup.setAttribute('position', payload.position);

                    var imageScale = payload.imageScale != null ? payload.imageScale : 1;
                    newPopup.setAttribute('width', imageScale);
                    newPopup.setAttribute('fit-texture', true);

                    if(payload.imageRotation != "look-at"){
                        newPopup.setAttribute('rotation', payload.imageRotation);
                    } else{
                        newPopup.setAttribute("look-at", "#camera");
                    }

                    newPopup.setAttribute('material', 'transparent:true; alphaTest:0.5; opacity:1; src: #' + payload.hotspotImage + 'hotspotImage' );

                    if (payload.hotspotType =="audio"){
                        
                        closeAudio();
                        closeVideos();


                        //play audioclip
                        var audio = document.querySelector("#" + payload.hotspotAudio + "hotspotAudio");
                        audio.play();
                        

                        //Add event listener for when this audio ends
                        audio.addEventListener('ended', function removeAudioWhenDone() {
                            newPopup.emit('click');
                        });
                    }

                }else if(payload.hotspotType =="video"){


                    //Pause the videosphere if playing.
                    videosphere = document.querySelector("a-videosphere");
                    if(videosphere.getAttribute('src') != null){
                        document.querySelector(videosphere.getAttribute('src')).pause();
                    }

                    closeVideos();
                    closeAudio();

                    var newPopup = document.createElement("a-plane");

                    newPopup.setAttribute('position', '0 3 -3');
                    newPopup.setAttribute("material", "src: #" + payload.hotspotVideo + "hotspotVideo");
                    console.log(newPopup);


                    video = document.querySelector("#" + payload.hotspotVideo + "hotspotVideo");
                    console.log(video);
                    video.currentTime = 0;
                    video.play();

                    //Add event listener for when this video ends
                    video.addEventListener('ended', function removeVideoWhenDone() {
                        newPopup.emit('click');
                    });

                }

                

                if (newPopup != undefined){
                    //For all hotspots except video
                    newPopup.setAttribute("class", "clickable cleanFromScene");
                    sceneEl.appendChild(newPopup);

                    newPopup.addEventListener('click', function (evt) {

                        if (payload.hotspotType =="audio"){
                            //Stop the audio clip that is currently playing and reset the clip
                            var audio = document.querySelector("#" + payload.hotspotAudio + "hotspotAudio");
                            audio.pause();
                            audio.currentTime = 0;
                            //console.log(audio);
                            
                            //Trick to get rid of the anonymous event listeners on the audio files that were cuasing issues. Clones the audio file and gets rid of the event listeners on the old one.
                            audioClone = audio.cloneNode(true);
                            audio.parentNode.replaceChild(audioClone, audio);
                        }


                        if(payload.hotspotType=="video"){
                            var video = document.querySelector("#" + payload.hotspotVideo + "hotspotVideo");
                            video.pause();
                            video.currentTime=0;

                            //Trick to get rid of the anonymous event listeners on the video files that were cuasing issues. Clones the video file and gets rid of the event listeners on the old one.
                            videoClone = video.cloneNode(true);
                            video.parentNode.replaceChild(videoClone, video);


                            //Pause the videosphere if playing.
                            videosphere = document.querySelector("a-videosphere");
                            if(videosphere.getAttribute('src') != null){
                                document.querySelector(videosphere.getAttribute('src')).play();
                            }
                        }

                        var hotspot = document.querySelector("#"+payload.title+"Hotspot");
                        hotspot.setAttribute('visible', true);
                        hotspot.classList.add("clickable");

                        newPopup.parentNode.removeChild(newPopup);
                    });


                }
            }

        });
    
    },

   

});


AFRAME.registerComponent('welcome_screen', { 
    schema: {
    },
    //changed to update to make sure that the scaling on the fit-texture was working
    update: function () {
      
        //If not a mobile device, stop the scene from autoplaying. This was because of the autoplay issues in some broswers.
        if(!AFRAME.utils.device.isMobile()){


            this.buttonMoved = false;
            //This deals with autoplay issues where the browser requires an interaction before videos can be played.
    
            var el = this.el;
            var sceneEl = document.querySelector('a-scene');
    
    
            var plane = document.createElement("a-plane");
    
            plane.setAttribute('material', 'transparent:true; opacity:1; src: #welcomeImageotherImg' );
            plane.setAttribute('width', 4)
            plane.setAttribute('position', '0 3 -3');
            plane.setAttribute('id', 'welcomePlane');
            sceneEl.appendChild(plane);
            plane.setAttribute("fit-texture", "");
    
            var button = document.createElement("a-plane");
    
            button.setAttribute('material', 'transparent:true; opacity:1; src: #welcomeButtonotherImg' );
            button.setAttribute('width', 1.5)
            button.setAttribute('class', 'clickable');
            button.setAttribute('id', 'welcomeButton');
    
            sceneEl.appendChild(button);
            button.setAttribute("fit-texture", "");
            
            
            //Remove everything from the scene and play the videosphere
            button.addEventListener('click', function (evt) {

                sceneEl.removeChild(plane);
                sceneEl.removeChild(button);
                camera.setAttribute("look-controls-enabled", true);

                //play videosphere
                var videosphere = document.querySelector("a-videosphere");
                if(videosphere.getAttribute('src') != null){
                    document.querySelector(videosphere.getAttribute('src')).play();
                }
            });



        }
        
       

    },
    tick: function (time, timeDelta){
        if(!AFRAME.utils.device.isMobile()){
            //Had to wait for the resizing to happen to set these.
            if(!this.buttonMoved){
                var plane = document.querySelector("#welcomePlane");
                var button = document.querySelector("#welcomeButton");
                if(plane.getAttribute("geometry")!=undefined && button.getAttribute("geometry")!=undefined)
                {

                    this.buttonMoved = true;
                    var buttonheight = (plane.getAttribute("position").y) - (plane.getAttribute("geometry").height)/2 + .225 ; 
                    button.setAttribute('position', '0 ' + buttonheight + ' -3');


                    
                    var camera = document.querySelector("a-camera");
                    camera.setAttribute('position', {x:0, y:3, z:0});
                    camera.setAttribute("look-controls-enabled", false);

                }
            }
        }
    }

});


/*
fade-in is an animation component written to fade elements into a scene by ramping up their opacity linearly. 
The animation is triggered by emiting the event fadeInGo on an element with this component.
*/
AFRAME.registerComponent('fade-in', {
    init: function () {
        var el = this.el;
        if (el.hasAttribute("text")) {
            el.setAttribute("animation__fade-in", {
                "property": "text.opacity",
                "dur": 1000,
                "easing": "linear",
                "from": 0,
                "to": 1,
                "startEvents": "fadeInGo"
            });
        }
        else {
            el.setAttribute("animation__fade-in", {
                "property": "material.opacity",
                "dur": 1000,
                "easing": "linear",
                "from": 0,
                "to": 1,
                "startEvents": "fadeInGo"
            });
        }


        //Make sure the element is visible when it begins fading in.
        el.addEventListener('animationbegin', function(e){
            this.setAttribute("visible", "true");
       });
    },
});

/*
fade-out is an animation component written to fade elements out of a scene by ramping down their opacity linearly. 
The animation is triggered by emiting the event fadeOutGo on an element with this component.
*/
AFRAME.registerComponent('fade-out', {
    init: function () {
        var el = this.el;


        if (el.hasAttribute("text")) {
            //fade out for text
            el.setAttribute("animation__fade-out", {
                "property": "text.opacity",
                "dur": 1500,
                "easing": "linear",
                "from": 1,
                "to": 0,
                "startEvents": "fadeOutGo"
            });
        } else {
            //fade out for everything else
            el.setAttribute("animation__fade-out", {
                "property": "material.opacity",
                "dur": 1500,
                "easing": "linear",
                "from": 1,
                "to": 0,
                "startEvents": "fadeOutGo"
            });
        }


        //Prevent it from sticking around transparently
        el.addEventListener('animationcomplete__fade-out', function(e){
            this.setAttribute("visible", "false");
        });

    }


});


function closeVideos(){
    
    //Look through all of the video files, and check if they are currently playing.
    var allVideo = document.querySelectorAll("video");
    allVideo.forEach(function(videoClip){
        if (!videoClip.paused){
            //If the clip is not paused, then run the ended event on it to stop it and end it so the new audio can start
            var event = new Event('ended');
            videoClip.dispatchEvent(event);
        }
    })
}

function closeAudio(){
    //Look through all of the audio files, and check if they are currently playing.
    var allAudio = document.querySelectorAll("audio");
    allAudio.forEach(function(audioclip){
        if (!audioclip.paused){
            //If the clip is not paused, then run the ended event on it to stop it and end it so the new audio can start
            var event = new Event('ended');
            audioclip.dispatchEvent(event);
        }
    })
}