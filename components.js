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
        el.setAttribute('rotation', '270 ' + iconRotation + ' 0');
        el.setAttribute('material', 'transparent:true; opacity:0.9; src: #' + data.icon.id);

        //Give the entity a class we can refer to it by later, and make it clickable
        el.setAttribute("class", "navIcon clickable cleanFromScene"); 
        el.setAttribute("position", payload.position); 

        sceneEl.appendChild(el);

        //Event listener for interaction
        el.addEventListener('click', function (evt) {

            //Get the arena and load the next place
            var arena = document.querySelector("[arena]");
            console.log("Arena: " + arena);
                
            arena.emit("loadNewPlace", {place: payload.place});

        });
    
    }


});

AFRAME.registerComponent('welcome_screen', { 
    schema: {
    },
    init: function () {
        //This deals with autoplay issues where the browser requires an interaction before videos can be played.

        var el = this.el;
        var sceneEl = document.querySelector('a-scene');


        var plane = document.createElement("a-plane");
        plane.setAttribute('text', 'width: 6; color: black; zOffset: 0.01; align:center; value: Get Started;');
        plane.setAttribute('position', '1 3 -10');
        plane.setAttribute('class', 'clickable');
        sceneEl.appendChild(plane);

        var camera = document.querySelector("a-camera");
        camera.setAttribute("look-controls-enabled", false);

        //Remove everything from the scene and play the videosphere
        plane.addEventListener('click', function (evt) {
            sceneEl.removeChild(plane);
            camera.setAttribute("look-controls-enabled", true);

            //play videosphere
            var videosphere = document.querySelector("a-videosphere");
            if(videosphere.getAttribute('src') != null){
                document.querySelector(videosphere.getAttribute('src')).play();
            }
    

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
        el.setAttribute('scale', `${hotspotScale} ${hotspotScale} ${hotspotScale}`);

        //If an icon rotation hasn't been set, set one
        if(payload.hotspotRotation != "look-at"){
            var iconRotation = payload.hotspotRotation != null ? payload.hotspotRotation : {"x" : 0, "y" : 0, "z": 0};
            el.setAttribute('rotation', iconRotation);
        } else {
            el.setAttribute('look-at', '#camera');
        }
        el.setAttribute('material', 'transparent:true; opacity:0.9; src: #' + data.icon.id);

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

                newPopup.setAttribute('geometry', 'primitive: plane; width: auto; height: auto;');
                newPopup.setAttribute('material', 'color: white');
                newPopup.setAttribute('id', payload.title);
                newPopup.setAttribute('text', 'width: 6; color: black; zOffset: 0.01; align:center; value: ' + payload.hotspotText);

                newPopup.setAttribute("class", "hotspotText");

                } else if (payload.hotspotType =="image"){
                    //Image hotspot
                    var newPopup = document.createElement("a-plane");
                    newPopup.setAttribute("class", "hotspotImage");
                    newPopup.setAttribute('position', payload.position);

                    var imageScale = payload.imageScale != null ? payload.imageScale : 1;
                    newPopup.setAttribute('scale', `${imageScale} ${imageScale} ${imageScale}`);


                    if(payload.imageRotation != "look-at"){
                        newPopup.setAttribute('rotation', payload.imageRotation);
                    } else{
                        newPopup.setAttribute("look-at", "#camera");
                    }
                    console.log('#' + payload.hotspotImage + 'hotspotImage');
                    newPopup.setAttribute('material', 'transparent:true; opacity:1; src: #' + payload.hotspotImage + 'hotspotImage' );
            
                }

                //For both text and images
                newPopup.setAttribute("class", "clickable cleanFromScene");
                sceneEl.appendChild(newPopup);
                newPopup.addEventListener('click', function (evt) {
                    console.log("Test");
                    var hotspot = document.querySelector("#"+payload.title+"Hotspot");
                    hotspot.setAttribute('visible', true);
                    hotspot.classList.add("clickable");
                    this.parentNode.removeChild(this);
                });

            }

        });
    
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

    }


});

