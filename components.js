//Node list fix for ForEach in edge
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}


/*
The location component is used to create the geometry and meshes for the spheres, text and planes for each location that will can be viewed.
It also contains information on what to do when the sphere is clicked on (showing the video and hiding the location spheres).
*/
AFRAME.registerComponent('navigationIcon', {
    //Define the schema for the location sphere    
    schema: {
        payload : {type: "string"}
    },

    /*
        payload comes from a json file and contains the information needed to create a location sphere and its label
    */

    init: function () {
        var data = this.data;
        var payload = JSON.parse(this.data.payload);
        var el = document.createElement('a-entity');
        var sceneEl = document.querySelector('a-scene');



        //Create geometry for SPHERE
        this.sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);

        //Create material for sphere
        texture = new THREE.TextureLoader().load(payload.image);
        console.log(payload.image);
        this.sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

        //Create mesh for sphere
        this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphereMesh.position.set(payload.position.x, payload.position.y, payload.position.z);

        //rotate the sphere's mesh so the home symbol faces the camera. It must be converted from degrees to Radians
        //this.sphereMesh.rotation.y = (data.imageRotation * Math.PI) / 180;

        el.setAttribute("class", "locationSphere");

        el.setObject3D('mesh', this.sphereMesh);
        sceneEl.appendChild(el);



        //Plane and text
        var newPlane = document.createElement('a-entity');

        newPlane.setAttribute('geometry', {
            "primitive": "plane",
            "width": 2,
            "height": 0.8,
        })

        newPlane.setAttribute('position', {
            "x": payload.position.x,
            "y": payload.position.y - 1.4,
            "z": payload.position.z,
        })

        newPlane.setAttribute("material", {
            color: "#330000"
        })

        //Give the entity a class we can refer to it by later
        newPlane.setAttribute("class", "navigationPlane");




        //////////Text Values
        newPlane.setAttribute("text", {
            "value": payload.title,
            "color": "white",
            "align": "center",
            "wrapCount": payload.title.length < 6 ? 8 : payload.title.length+3,
            "zOffset": 0.005,
        });



        sceneEl.appendChild(newPlane);

        newPlane.setAttribute("look-at", "#camera");



        var self = this;
        var videosphere = document.querySelector('#videoSphere');

        //Event listener for interaction
        el.addEventListener('click', function (evt) {

            

            //Get the arena
            var arena = document.querySelector("[arena]");
            console.log("Arena: " + arena);
                
            arena.emit("loadNewPlace", {place: payload.place});

            ////////Once any visible sphere has been clicked for a location, hide the spheres, planes and text
            //Check if the sphere is visible
            if (el.getAttribute('visible') == true) {
                

                //Get an array of all of the sphere and loop through them setting their visibility to false
                var spheres = document.querySelectorAll(".locationSphere");
                for (var i = 0; i < spheres.length; i++) {
                    spheres[i].setAttribute("visible", false);
                }
                var navPlanes = document.querySelectorAll(".navigationPlane");
                for (var i = 0; i < navPlanes.length; i++) {
                    navPlanes[i].setAttribute("visible", false);
                }

                //Any item with the fade-out attribute should run its fadeOutGo animation
                fadeOutItems = document.querySelectorAll("[fade-out]");
                fadeOutItems.forEach(function(fadeItem){
                    fadeItem.emit('fadeOutGo');
                });


                //Make the home button and label visisble
                var homebuttonPlane = document.querySelector(".homeNavigationPlane");
                homebuttonPlane.setAttribute("visible", true);



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

