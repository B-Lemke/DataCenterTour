AFRAME.registerComponent('device_detector', {
  schema: {},
  init: function () {

    var data = this.data
    var el = this.el;
    data.controllerCount = 0;


    //Check if the device is mobile or not and set a bool
    if(AFRAME.utils.device.isMobile()){
        //Reticle with fuse time out and click
        createReticle();
    } else{
        //Browser. Click controls, no reticle
        removeReticle();
        //Add click controls
        var scene = document.querySelector("a-scene");
        scene.setAttribute('mouse_controls', true);
    }

    //Check headset connected 
    if(AFRAME.utils.device.checkHeadsetConnected()){        

        el.addEventListener('controllerConnected', function(){
            data.controllerCount += 1;
            controllersChanged()
        });
        el.addEventListener('controllerDisconnected', function(){
            data.controllerCount -= 1;
            controllersChanged()
        });

        function controllersChanged(){
            if (data.controllerCount === 0){
                //No controllers connected. Create reticle
                createReticle();
              
            } else {
                //one to many controllers connected. Remove the reticle if present and use controllers
                removeReticle();
       
            }
        }
    }



    //Event listener on entering VR
    document.querySelector('a-scene').addEventListener('enter-vr', function () {
        data.inVR = true;

        if(AFRAME.utils.device.checkHeadsetConnected()){
            //Headset connected, check controller count and see if a reticle needs to be made because of a lack of controllers
            if (data.controllerCount === 0){
                //No controllers connected. Create reticle
                createReticle();
                
            }
        }

     
    });

    //Event listener on exiting VR
    document.querySelector('a-scene').addEventListener('exit-vr', function () {
        data.inVR = false;
       
    });
  },

  update: function () {
  }

});



//Controller connected component
AFRAME.registerComponent('controller_connected', {
    init: function () {
      var el = this.el;
      el.addEventListener('controllerconnected', function (evt) {
        var scene = document.querySelector("a-scene");
        scene.emit('controllerConnected');
      });

      el.addEventListener('controllerdisconnected', function (evt) {
        var scene = document.querySelector("a-scene");
        scene.emit('controllerDisconnected');
      });

    } 
});
  


AFRAME.registerComponent('fuse_cursor', {
    init: function () {
      var el = this.el;

      el.setAttribute('id', 'cursor');
      el.setAttribute('cursor', {"fuse": true});
      el.setAttribute('material', {"color": "white", "shader": "flat"});
      el.setAttribute('fuseTimeout', 2000);
      el.setAttribute('geometry', {"primitive": "ring", "radiusInner": 0.01, "radiusOuter": 0.015});
      el.setAttribute('raycaster', {"objects": ".clickable"});
      el.setAttribute('position', {x: 0, y: 0, z: -.5});
      el.setAttribute('animation__mouseleave', {"property": "scale", "startEvents": "mouseleave", "easing": "easeInCubic", "dur": 500, "to": "1 1 1"});
      el.setAttribute('animation__click', {"property": "scale", "startEvents": "click", "easing": "easeInCubic", "dur": 150, "from": "0.1 0.1 0.1", "to": "1 1 1"});
      el.setAttribute('animation__fusing', {"property": "scale", "startEvents": "fusing", "easing": "easeInCubic", "dur": 1500, "from": "1 1 1", "to": "0.1 0.1 0.1"});
    
    } 
});

AFRAME.registerComponent('mouse_controls', {
    init: function () {
      var el = this.el;
      
      el.setAttribute('cursor', {"rayOrigin": "mouse"});
      el.setAttribute('raycaster', {"objects": ".clickable"});
        
    } 
});



function createReticle(){
    var newCursor = document.createElement('a-entity');
    var camera = document.querySelector('a-camera');
    newCursor.setAttribute("fuse_cursor", true);
    camera.appendChild(newCursor);
}

function removeReticle(){
    //remove the reticle if there is one
    var cursor = document.querySelector("#cursor");
    if(cursor != null){
        //reticle found, remove it
        var camera = document.querySelector('a-camera');
        camera.removeChild(cursor);
    } 
}