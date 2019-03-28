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
        el.setAttribute('rotation', '270 0 0');
        el.setAttribute('material', 'src: #' + data.icon.id);
        console.log(data.icon);
        //Give the entity a class we can refer to it by later, and make it clickable
        el.setAttribute("class", "navIcon clickable"); 
        el.setAttribute("position", "0 -2 -1"); 

        sceneEl.appendChild(el);
        console.log("added to scene");
        //Event listener for interaction
        /*
        el.addEventListener('click', function (evt) {

            ////////Once any NavigationIcon has been clicked, clean the scene
            if (el.getAttribute('visible') == true) {
                 //Get an array clickable things in the scene and remove them
                var clickables = document.querySelectorAll(".clickable");
                clickables.forEach(function(clicky){
                    clicky.parentNode.removeChild(clicky);
                });     
            }

            //Get the arena and load the next place
            var arena = document.querySelector("[arena]");
            console.log("Arena: " + arena);
                
            arena.emit("loadNewPlace", {place: payload.place});

        });
        */

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

