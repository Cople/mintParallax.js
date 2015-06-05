(function(window, document, $) {
    "use strict";

    var pluginName = "mintParallax";
    var transformName = "transform" in document.documentElement ? "transform" : "WebkitTransform";
    var transitionName = "transition" in document.documentElement ? "transition" : "WebkitTransition";
    var supportDeviceOrientation = !!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|mobi|tablet|opera mini)/i);
    var rAF =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    var cAF = window.cancelAnimationFrame || function(id) {
        window.clearTimeout(id);
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function detectSupport(event) {
            window.removeEventListener("deviceorientation", detectSupport);
            supportDeviceOrientation = event && event.beta != null;
        });
    };

    function mintParallax(container) {
        this.container = typeof container == "string" ? document.querySelector(container) : container;
        this.layers = Array.prototype.slice.call(this.container.querySelectorAll("[data-depth]"));
        this.renderBind = this.render.bind(this);
        this.devOrientHandlerBind = this.devOrientHandler.bind(this);
        this.mouseMoveHandlerBind = this.mouseMoveHandler.bind(this);
        this.initialise();
    };

    mintParallax.prototype.initialise = function() {
        var rect = this.container.getBoundingClientRect();
        var offsetLeft = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
        var offsetTop = rect.top + (document.documentElement.scrollTop || document.body.scrollTop);

        this.cHalfWidth = (rect.width || rect.right - rect.left) / 2;
        this.cHalfHeight = (rect.height || rect.bottom - rect.top) / 2;
        this.cX = offsetLeft + this.cHalfWidth;
        this.cY = offsetTop + this.cHalfHeight;

        this.xRange = parseInt(this.container.getAttribute("data-x-range") || this.cHalfWidth * 0.2);
        this.yRange = parseInt(this.container.getAttribute("data-y-range") || this.cHalfHeight * 0.2);
        this.invertX = this.container.getAttribute("data-invert-x") == "true";
        this.invertY = this.container.getAttribute("data-invert-y") == "true";

        this.layers.forEach(function(layer) {
            layer.vx = layer.vy = layer.mx = layer.my = 0;
            layer.depth = parseFloat(layer.getAttribute("data-depth") || 0.5);
            if (!supportDeviceOrientation) layer.style[transitionName] = ".3s ease-out";
        });

        this.enable();
    };

    mintParallax.prototype.mouseMoveHandler = function(e) {
        var self = this;
        var x = (e.pageX - this.cX) / this.cHalfWidth * self.xRange * (self.invertX ? -1 : 1);
        var y = (e.pageY - this.cY) / this.cHalfHeight * self.yRange * (self.invertY ? -1 : 1);

        this.layers.forEach(function(layer) {
            layer.vx = x;
            layer.vy = y;
            layer.style[transformName] = "translate3d(" + layer.vx * layer.depth + "px," + layer.vy * layer.depth + "px,0)";
        });
    };

    mintParallax.prototype.devOrientHandler = function(e) {
        this.orientationData = {
            x: e.beta,
            y: e.gamma > 180 ? e.gamma - 360 : e.gamma
        };
    };

    mintParallax.prototype.render = function() {
        if (this.orientationData) {
            var self = this;
            var x = this.orientationData.y / 90 * self.xRange * (self.invertX ? -1 : 1);
            var y = this.orientationData.x / 90 * self.yRange * (self.invertY ? -1 : 1);

            this.layers.forEach(function(layer) {
                layer.mx = -x;
                layer.my = -y;

                switch (window.orientation) {
                    case -90:
                        var _mx = layer.mx;
                        layer.mx = layer.my * -1;
                        layer.my = _mx;
                        break;
                    case 90:
                        var _mx = layer.mx;
                        layer.mx = layer.my;
                        layer.my = _mx * -1;
                        break;
                    case 180:
                        layer.mx *= -1;
                        layer.my *= -1;
                        break;
                };

                layer.vx += (layer.mx - layer.vx) * 0.1;
                layer.vy += (layer.my - layer.vy) * 0.1;

                layer.style[transformName] = "translate3d(" + layer.vx * layer.depth + "px," + layer.vy * layer.depth + "px,0)";
            });
        };
        this.rId = rAF(this.renderBind);
    };

    mintParallax.prototype.enable = function() {
        if (supportDeviceOrientation) {
            window.addEventListener("deviceorientation", this.devOrientHandlerBind);
            this.rId = rAF(this.renderBind);
        } else {
            this.container.addEventListener("mousemove", this.mouseMoveHandlerBind);
        };
    };

    mintParallax.prototype.disable = function() {
        if (supportDeviceOrientation) {
            window.removeEventListener("deviceorientation", this.devOrientHandlerBind);
            cAF(this.rId);
        } else {
            this.container.removeEventListener("mousemove", this.mouseMoveHandlerBind);
        };
    };

    window[pluginName] = mintParallax;

    if ($) {
        $.fn[pluginName] = function(method) {
            return this.each(function() {
                var $el = $(this);
                if (typeof method == "string") {
                    $el.data(pluginName)[method]();
                } else {
                    if (!$el.data(pluginName)) $el.data(pluginName, new mintParallax(this));
                };
            });
        };
    };
})(window, document, window.Zepto || window.jQuery);