/*
---
description: Animated sprites

license: MIT-style

authors: Olivier Gasc (gasc.olivier@gmail.com)

requires:
- Class
- Array
- Options
- Events
- Asset

provides: [Animation, AnimationObjectStatic, AnimationObjetCanvas, AnimationObjectAnimated]
---
*/

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60)
            }
})()

Animation = new Class({
    Implements: Options,

    frame: 0,
    running: false,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    layers: [],

    referer: null,

    options: {
        container: 'container'
    },

    initialize: function(options) {
        this.setOptions(options)

        this.ctx = document.getElementById(this.options.container).getContext('2d')
        this.canvas = document.id(this.options.container)
        this.width = this.canvas.width
        this.height = this.canvas.height

        this.play()

        this.canvas.addEvent('click', function(e) {
            var p = this.canvas.getPosition(),
                x = e.client.x - p.x,
                y = e.client.y - p.y,
                f = false,
                a = []

            find:
            for (var i = this.layers.length - 1; i >= 0; i--) {
                if (this.layers[i] !== undefined) {
                    a = this.layers[i]
                    for (var j = a.length - 1; j >= 0; j--) {
                        if (a[j] !== undefined && a[j].options.onClicked) {
                            if (x >= a[j].x
                                    && x <= a[j].x + (a[j].width / a[j].options.cases.x)
                                    && y >= a[j].y
                                    && y <= a[j].y + (a[j].height / a[j].options.cases.y)) {
                                a[j].options.onClicked.attempt([a[j], { x: x, y: y }], this)
                                break find
                            }
                        }
                    }
                }
            }
        }.bind(this))

        return this
    },

    play: function() {
        this.frame = 0
        this.running = true
        this.run()

        return this
    },

    run: function(time) {
        if (this.running) {
            requestAnimFrame(this.run.bind(this))
            this.clear()
            this.render(time)
            this.frame++
        }

        return this
    },

    render: function(time) {
        this.layers.each(function(layer, i) {
            layer.sort(function (a, b) {
                if (a.y + (a.height / a.options.cases.y) > b.y + (b.height / b.options.cases.y))
                    return 1
                if (a.y + (a.height / a.options.cases.y) < b.y + (b.height / b.options.cases.y))
                    return -1
                return 0
            })
        }.bind(this))

        this.layers.each(function(layer) {
            layer.each(function(animationObjet) {
                animationObjet.draw.attempt([], animationObjet)
            }.bind(this))
        }.bind(this))

        return this
    },

    clear: function() {
        this.ctx.clearRect(0, 0, this.canvas.getSize().x, this.canvas.getSize().x)

        return this
    },

    add: function(o) {
        if (this.layers[o.layer] === undefined) this.layers[o.layer] = []

        this.layers[o.layer].push(o)

        return this
    },

    setReferer: function(o) {
        this.referer = o

        return this
    },

    getRefererType: function() {
        return typeOf(this.referer) === 'object' ? instanceOf(this.referer) : this.referer
    }
})


AnimationObjetStatic = new Class({
    Implements: Options,

    LAYER_DEFAULT : 1000,

    animation: null,
    buffer: {},
    image: null,
    width : 0,
    height : 0,
    x: 0,
    y: 0,
    layer: null,
    shown: false,
    loaded: false,

    options: {
        url: null,
        start: { x: 0, y: 0 },
        cases: { x: 1, y: 1 },
        layer: 0,

        onLoad: function() {},
        onBeforeDraw: function() {},
        onHide: function() {},
        onShow: function() {},
        onClicked: null
    },

    initialize: function(animation, options) {
        this.setOptions(options)

        this.animation = animation
        this.x = this.options.start.x
        this.y = this.options.start.y
        this.layer = this.LAYER_DEFAULT + this.options.layer

        this.image = Asset.image(this.options.url, { onLoad: this.onLoad.bind(this) })

        return this
    },

    onLoad: function(img) {
        this.width = +this.image.get('width')
        this.height = +this.image.get('height')
        this.loaded = true

        this.options.onLoad.attempt([], this)
    },

    draw: function() {
        if (this.loaded && this.shown) {
            this.options.onBeforeDraw.attempt([], this)

            this.animation.ctx.drawImage(
                this.image,
                0,
                0,
                this.width / this.options.cases.x,
                this.height / this.options.cases.y,
                this.x,
                this.y,
                this.width / this.options.cases.x,
                this.height / this.options.cases.y)
        }
    },

    hide: function() {
        if (this.loaded && this.shown) {
            this.shown = false
            this.options.onHide.attempt([], this)
        }
    },

    show: function() {
        if (this.loaded && !this.shown) {
            this.shown = true
            this.options.onShow.attempt([], this)
        }
    }
})

AnimationObjetCanvas = new Class({
    Implements: AnimationObjetStatic,

    options: {
        canvas: null,
        start: { x: 0, y: 0 },
        cases: { x: 1, y: 1 },
        layer: 0,

        onLoad: function() {},
        onBeforeDraw: function() {},
        onHide: function() {},
        onShow: function() {},
        onClicked: null
    },

    initialize: function(animation, options) {
        this.setOptions(options)

        this.animation = animation
        this.x = this.options.start.x
        this.y = this.options.start.y
        this.layer = this.LAYER_DEFAULT + this.options.layer

        this.image = this.options.canvas
        this.onLoad(this.image)

        return this
    },

    onLoad: function(img) {
        this.width = +this.image.get('width')
        this.height = +this.image.get('height')
        this.loaded = true

        this.options.onLoad.attempt([], this)
    },

    draw: function() {
        if (this.loaded && this.shown) {
            this.options.onBeforeDraw.attempt([], this)

            this.animation.ctx.drawImage(
                this.image,
                0,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height)
        }
    }
})

AnimationObjetAnimated = new Class({
    Implements: AnimationObjetStatic,

    column: 0,
    periodical: null,

    options: {
        url: null,
        start: { x: 0, y: 0 },
        cases: { x: 1, y: 1 },
        layer: 0,
        step: 100,
        line: 0,
        order: 1,
        autorun: false,

        onLoad: function() {},
        onBeforeDraw: function() {},
        onHide: function() {},
        onShow: function() {},
        onClicked: null
    },

    initialize: function(animation, options) {
        this.setOptions(options)

        this.animation = animation
        this.x = this.options.start.x
        this.y = this.options.start.y
        this.layer = this.LAYER_DEFAULT + this.options.layer

        this.image = Asset.image(this.options.url, { onLoad: this.onLoad.bind(this) })

        if (this.options.autorun && this.options.step)
            this.start()

        return this
    },

    draw: function() {
        if (this.loaded && this.shown) {
            this.options.onBeforeDraw.attempt([], this)

            this.animation.ctx.drawImage(
                this.image,
                this.column * this.width / this.options.cases.x,
                this.options.line * this.height / this.options.cases.y,
                this.width / this.options.cases.x,
                this.height / this.options.cases.y,
                this.x,
                this.y,
                this.width / this.options.cases.x,
                this.height / this.options.cases.y)
        }
    },

    stop: function() {
        if (this.periodical) {
            clearInterval(this.periodical)
            this.periodical = null
        }
    },

    start: function() {
        if (!this.periodical) {
            this.periodical = setInterval(function() {
                this.column = this.column < this.options.cases.x - 1 ? this.column + 1 : 0
            }.bind(this), this.options.step)
        }
    }
})