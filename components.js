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

AFRAME.registerComponent('hotspot', { 
    schema: {
        payload : {type: "string"},
        icon: {type: "selector"}
    },

    /*
        payload comes from a json file and contains the information needed to create a location sphere and its label
    */

    init: function () {
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
        el.setAttribute("class", "hotspot clickable cleanFromScene"); 
        el.setAttribute("id", payload.title + "Hotspot"); 
        el.setAttribute("position", payload.position); 

        sceneEl.appendChild(el);

        //Event listener for interaction
        
        el.addEventListener('click', function (evt) {
            if(el.getAttribute('visible') == true){
                el.classList.remove("clickable");
                el.setAttribute('visible', false);

                //Create a text box
                
                var newTextbox = document.createElement("a-entity");
                newTextbox.setAttribute('position', payload.position);
                newTextbox.setAttribute('rotation', '270 ' + iconRotation + ' 0');
                newTextbox.setAttribute('geometry', 'primitive: plane; width: auto; height: auto;');
                newTextbox.setAttribute('material', 'color: blue');
                newTextbox.setAttribute('id', payload.title);
                newTextbox.setAttribute('text', 'width: 4; value: ' + payload.hotspotText);
                newTextbox.setAttribute("class", "hotspotText clickable cleanFromScene"); 

                newTextbox.addEventListener('click', function (evt) {
                    console.log("Test");
                    var hotspot = document.querySelector("#"+this.getAttribute("id")+"Hotspot");
                    hotspot.setAttribute('visible', true);
                    hotspot.classList.add("clickable");
                    this.parentNode.removeChild(this);

                });

                sceneEl.appendChild(newTextbox);
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

