Animated sprites
===========

A javascript Mootools plugin for sprites and animation drawing into canvas.


How to use
----------

Syntax of animation manager :

    var animation = new AnimationManager('canvasId');


Syntax of the connectors added in the animation manager :

    animation.add(new AnimationStatic(animation, {
        image: null,                    // image object
        start: { x: 0, y: 0 },          // initial coordonates of the image
        offset: { x: 0, y: 0 },         // offset coordonates in the canvas
        cases: { x: 1, y: 1 },          // number of animations in the sprite
        layer: 0,                       // group assigned to display the sprite - lower value is deeper in the background

        onLoad: function() {},          // triggered after loading image
        onBeforeDraw: function() {},    // triggered before each frame draw
        onHide: function() {},          // triggered while hiding a sprite
        onShow: function() {},          // triggered while showing a sprite
        onClicked: null,                // triggered on a click event on the sprite - null: check click events deeper in the background, empty function : disable click on the sprite area
        onEnter: null,                  // triggered on entering the sprite
        onLeave: null                   // triggered on leaving the sprite
    }[, referer]))

    animation.add(new AnimationAnimated(animation, {
        image: null,                    // image object
        start: { x: 0, y: 0 },          // initial coordonates of the image
        offset: { x: 0, y: 0 },         // offset coordonates in the canvas
        cases: { x: 1, y: 1 },          // number of animations in the sprite
        layer: 0,                       // group assigned to display the sprite - lower value is deeper in the background

        step: 100,                      // time in ms between two animations
        line: 0,                        // line played ( defined in cases.y )
        order: 1,                       // TODO : play order, not implemented yet
        autorun: false,                 // auto start playing

        onLoad: function() {},          // triggered after loading image
        onBeforeDraw: function() {},    // triggered before each frame
        onAfterDraw: function() {},     // triggered after each frame
        onHide: function() {},          // triggered while hiding a sprite
        onShow: function() {},          // triggered while showing a sprite
        onClicked: null,                // triggered on a click event on the sprite - null: check click events deeper in the background, empty function : disable click on the sprite area
        onEnter: null,                  // triggered on entering the sprite
        onLeave: null                   // triggered on leaving the sprite
    }[, referer]))

    animation.add(new AnimationCanvas(animation, {
        canvas: null,                   // canvas object
        start: { x: 0, y: 0 },          // initial coordonates of the canvas
        offset: { x: 0, y: 0 },         // offset coordonates in the canvas
        cases: { x: 1, y: 1 },          // number of animations in the canvas
        layer: 0,                       // group assigned to display the canvas - lower value is deeper in the background

        onLoad: function() {},          // triggered after loading image
        onBeforeDraw: function() {},    // triggered before each frame draw
        onHide: function() {},          // triggered while hiding a canvas
        onShow: function() {},          // triggered while showing a canvas
        onClicked: null,                // triggered on a click event on the canvas - null: check click events deeper in the background, empty function : disable click on the canvas area
        onEnter: null,                  // triggered on entering the canvas
        onLeave: null                   // triggered on leaving the canvas
    }[, referer]))


Behaviour
----------

The animation manager hosts connectors and draw them, using their own customized draw() function every frame.
Using add() function will add a connector to the stack, displaying next frame.

This plugin is more or less meant to be used as a middleware, drived by another class.

The change of connectors' events will change live the way the animation is played.

Currently written connectors, planning to add more soon :

 - Static sprite connector : meant to display fixed sprites without animation
 - Animated sprite connector : meant to display animated sprites
 - Canvas connector : meant to inject pre-rendered canvas in the main canvas, ie generated background which don't need to be updated every frame


Demo
----------

Coming soon