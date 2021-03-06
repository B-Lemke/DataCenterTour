/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	if (typeof AFRAME === 'undefined') {
        throw new Error('Component attempted to register before AFRAME was available.');
      }
  
      /**
       * Fit Texture component for A-Frame.
       */
      AFRAME.registerComponent('fit-texture', {
        dependencies: ['geometry', 'material'],
        schema: {
          type: 'boolean',
          default: true
        },
  
        /**
         * Called once when component is attached. Generally for initial setup.
         */
        init: function () { },
  
        /**
         * Called when component is attached and when component data changes.
         * Generally modifies the entity based on the data.
         */
         update: function () {
           if (this.data === false) return;
           var el = this.el;
           var self = this;
           if (self.dimensions) {
             // If texture has already been loaded, and `fit-texture` was reset.
             self.applyTransformation();
           } else {
             var textureLoaded = function(e) {

                var w = e.detail.texture.image.videoWidth || e.detail.texture.image.width;

                var h = e.detail.texture.image.videoHeight || e.detail.texture.image.height;

                // Don't apply transformation on incomplete info
                
                if(h === 0 || w === 0) {console.log("This is the issue"); return;}
                
                // Save dimensions for later updates to `fit-texture`, see above.
                self.dimensions = {w:w, h:h};
                
                self.applyTransformation();
             }
             el.addEventListener('materialvideoloadeddata', textureLoaded);
             el.addEventListener('materialtextureloaded', textureLoaded);

             //Bugs: Lin 86 freaks if the assets aren't loaded.
             //78 never fires off with videos from assets with line 93
           }
         },
         
         applyTransformation: function () {
          var el = this.el;
          var geometry = el.getAttribute('geometry');
  
          // Use self.dimension data from previous texture/video loaded events
          var widthHeightRatio = this.dimensions.h / this.dimensions.w;
  
          if (geometry.width && geometry.height) {
            //console.warn('Using `fit-texture` component on an element with both width and height. Therefore keeping width and changing height to fit the texture. If you want to manually set both width and height, set `fit-texture="false"`. ');
          }
          if (geometry.width) {
            el.setAttribute('height', geometry.width * widthHeightRatio);
          } else if (geometry.height) {
            el.setAttribute('width', geometry.height / widthHeightRatio);
          } else {
            // Neither width nor height is set.
            var tempWidth = 1.0;
            el.setAttribute('width', '' + tempWidth);
            el.setAttribute('height', tempWidth * widthHeightRatio);
          }
        },
  
        /**
         * Called when a component is removed (e.g., via removeAttribute).
         * Generally undoes all modifications to the entity.
         */
        remove: function () { },
  
        /**
         * Called on each scene tick.
         */
        // tick: function (t) { },
  
        /**
         * Called when entity pauses.
         * Use to stop or remove any dynamic or background behavior such as events.
         */
        pause: function () { },
  
        /**
         * Called when entity resumes.
         * Use to continue or add any dynamic or background behavior such as events.
         */
        play: function () { },
      });
  
  
  /***/ }
  /******/ ]);