/**
 * Particleground
 *
 * @author Jonathan Nicol - @mrjnicol
 * @version 1.0.1
 * @description Creates a canvas based particle system background
 *
 * Inspired by:
 * http://requestlab.fr/
 * http://disruptivebydesign.com/
 * 
 * @license The MIT License (MIT)
 * 
 * Copyright (c) 2014 Jonathan Nicol - @mrjnicol
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

;(function($) {
  var pluginName = 'particleground';

  function Plugin(element, options) {
    var el = element;
    var $el = $(element);
    var canvasSupport = !!document.createElement('canvas').getContext;
    var canvas;
    var ctx;
    var particles = [];
    var raf;
    var mouseX = 0;
    var mouseY = 0;
    var winW;
    var winH;
    var desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
    var orientationSupport = !!window.DeviceOrientationEvent;
    var tiltX = 0;
    var tiltY = 0;
    var paused = false;

    options = $.extend({}, $.fn[pluginName].defaults, options);

    /**
     * Init
     */
    function init() {
      if (!canvasSupport) { return; }

      //Create canvas
      $canvas = $('<canvas class="pg-canvas" style="display:block;"></canvas>');
      $el.prepend($canvas);
      canvas = $canvas[0];
      ctx = canvas.getContext('2d');
      styleCanvas();

      // Create particles
      var numParticles = Math.round((canvas.width * canvas.height) / options.density);
      for (var i = 0; i < numParticles; i++) {
        var p = new Particle();
        p.setStackPos(i);
        particles.push(p);
      };

      $(window).on('resize', function() {
        resizeHandler();
      });

      $(document).on('mousemove', function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
      });

      if (orientationSupport && !desktop) {
        window.addEventListener('deviceorientation', function () {
          // Contrain tilt range to [-30,30]
          tiltY = Math.min(Math.max(-event.beta, -30), 30);
          tiltX = Math.min(Math.max(-event.gamma, -30), 30);
        }, true);
      }

      draw();
      hook('onInit');
    }

    /**
     * Style the canvas
     */
    function styleCanvas() {
      canvas.width = $el.width();
      canvas.height = $el.height();
      ctx.fillStyle = options.dotColor;
      ctx.strokeStyle = options.lineColor;
      ctx.lineWidth = options.lineWidth;
    }

    /**
     * Draw particles 
     */
    function draw() {
      if (!canvasSupport) { return; }

      winW = $(window).width();
      winH = $(window).height();

      // Wipe canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particle positions
      for (var i = 0; i < particles.length; i++) {
        particles[i].updatePosition();
      };
      // Draw particles
      for (var i = 0; i < particles.length; i++) {
        particles[i].draw();
      };

      // Call this function next time screen is redrawn
      if (!paused) {
        raf = requestAnimationFrame(draw);
      }
    }

    /**
     * Add/remove particles.
     */
    function resizeHandler() {
      // Resize the canvas
      styleCanvas();

      // Remove particles that are outside the canvas
      for (i = particles.length - 1; i >= 0; i--) {
        if (particles[i].position.x > $el.width() || particles[i].position.y > $el.height()) {
          particles.splice(i, 1);
        }
      };

      // Adjust partivcle density
      var numParticles = Math.round((canvas.width * canvas.height) / options.density);
      if (numParticles > particles.length) {
        while (numParticles > particles.length) {
          var p = new Particle();
          particles.push(p);
        }
      } else if (numParticles < particles.length) {
        particles.splice(numParticles);
      }

      // Re-index particles
      for (i = particles.length - 1; i >= 0; i--) {
        particles[i].setStackPos(i);
      };
    }

    /**
     * Pause particle system 
     */
    function pause() {
      paused = true;
    }

    /**
     * Start particle system 
     */
    function start() {
      paused = false;
      draw();
    }

    /**
     * Particle 
     */
    function Particle() {
      this.stackPos;
      this.active = true;
      this.layer = Math.ceil(Math.random() * 3);
      this.parallaxOffsetX = 0;
      this.parallaxOffsetY = 0;
      // Initial particle position
      this.position = {
        x: Math.ceil(Math.random() * canvas.width),
        y: Math.ceil(Math.random() * canvas.height)
      }
      // Random particle speed, within min and max values
      this.speed = {}
      switch (options.directionX) {
        case 'left':
          this.speed.x = +(-options.maxSpeedX + (Math.random() * options.maxSpeedX) - options.minSpeedX).toFixed(2);
          break;
        case 'right':
          this.speed.x = +((Math.random() * options.maxSpeedX) + options.minSpeedX).toFixed(2);
          break;
        default:
          this.speed.x = +((-options.maxSpeedX / 2) + (Math.random() * options.maxSpeedX)).toFixed(2);
          this.speed.x += this.speed.x > 0 ? options.minSpeedX : -options.minSpeedX;
          break;
      }
      switch (options.directionY) {
        case 'up':
          this.speed.y = +(-options.maxSpeedY + (Math.random() * options.maxSpeedY) - options.minSpeedY).toFixed(2);
          break;
        case 'down':
          this.speed.y = +((Math.random() * options.maxSpeedY) + options.minSpeedY).toFixed(2);
          break;
        default:
          this.speed.y = +((-options.maxSpeedY / 2) + (Math.random() * options.maxSpeedY)).toFixed(2);
          this.speed.x += this.speed.y > 0 ? options.minSpeedY : -options.minSpeedY;
          break;
      }
    } 

    /**
     * Draw particle 
     */
    Particle.prototype.draw = function() {
      // Draw circle
      ctx.beginPath();
      ctx.arc(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY, options.particleRadius / 2, 0, Math.PI * 2, true); 
      ctx.closePath();
      ctx.fill();

      // Draw lines
      ctx.beginPath();
      // Iterate over all particles which are higher in the stack than this one
      for (var i = particles.length - 1; i > this.stackPos; i--) {
        var p2 = particles[i];

        // Pythagorus theorum to get distance between two points
        var a = this.position.x - p2.position.x
        var b = this.position.y - p2.position.y
        var dist = Math.sqrt((a * a) + (b * b)).toFixed(2);

        // If the two particles are in proximity, join them
        if (dist < options.proximity) {
          ctx.moveTo(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY);
          if (options.curvedLines) {
            ctx.quadraticCurveTo(Math.max(p2.position.x, p2.position.x), Math.min(p2.position.y, p2.position.y), p2.position.x + p2.parallaxOffsetX, p2.position.y + p2.parallaxOffsetY);
          } else {
            ctx.lineTo(p2.position.x + p2.parallaxOffsetX, p2.position.y + p2.parallaxOffsetY);
          }
        }
      }
      ctx.stroke();
      ctx.closePath();
    }

    /**
     * update particle position 
     */
    Particle.prototype.updatePosition = function() {
      if (options.parallax) {
        if (orientationSupport && !desktop) {
          // Map tiltX range [-30,30] to range [0,winW]
          var ratioX = (winW - 0) / (30 - -30);
          pointerX = (tiltX - -30) * ratioX + 0;
          // Map tiltY range [-30,30] to range [0,winH]
          var ratioY = (winH - 0) / (30 - -30);
          pointerY = (tiltY - -30) * ratioY + 0;
        } else {
          pointerX = mouseX;
          pointerY = mouseY;
        }
        // Calculate parallax offsets
        this.parallaxTargX = (pointerX - (winW / 2)) / (options.parallaxMultiplier * this.layer);
        this.parallaxOffsetX += (this.parallaxTargX - this.parallaxOffsetX) / 10; // Easing equation
        this.parallaxTargY = (pointerY - (winH / 2)) / (options.parallaxMultiplier * this.layer);
        this.parallaxOffsetY += (this.parallaxTargY - this.parallaxOffsetY) / 10; // Easing equation
      }

      switch (options.directionX) {
        case 'left':
          if (this.position.x + this.speed.x + this.parallaxOffsetX < 0) {
            this.position.x = $el.width() - this.parallaxOffsetX;
          }
          break;
        case 'right':
          if (this.position.x + this.speed.x + this.parallaxOffsetX > $el.width()) {
            this.position.x = 0 - this.parallaxOffsetX;
          }
          break;
        default:
          // If particle has reached edge of canvas, reverse its direction
          if (this.position.x + this.speed.x + this.parallaxOffsetX > $el.width() || this.position.x + this.speed.x + this.parallaxOffsetX < 0) {
            this.speed.x = -this.speed.x;
          }
          break;
      }

      switch (options.directionY) {
        case 'up':
          if (this.position.y + this.speed.y + this.parallaxOffsetY < 0) {
            this.position.y = $el.height() - this.parallaxOffsetY;
          }
          break;
        case 'down':
          if (this.position.y + this.speed.y + this.parallaxOffsetY > $el.height()) {
            this.position.y = 0 - this.parallaxOffsetY;
          }
          break;
        default:
          // If particle has reached edge of canvas, reverse its direction
          if (this.position.y + this.speed.y + this.parallaxOffsetY > $el.height() || this.position.y + this.speed.y + this.parallaxOffsetY < 0) {
            this.speed.y = -this.speed.y;
          }
          break;
      }

      // Move particle
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;
    }

    /**
     * Setter: particle stacking position
     */
    Particle.prototype.setStackPos = function(i) {
      this.stackPos = i;
    }

    function option (key, val) {
      if (val) {
        options[key] = val;
      } else {
        return options[key];
      }
    }

    function destroy() {
      $el.find('.pg-canvas').remove();
      hook('onDestroy');
      $el.removeData('plugin_' + pluginName);
    }

    function hook(hookName) {
      if (options[hookName] !== undefined) {
        options[hookName].call(el);
      }
    }

    init();

    return {
      option: option,
      destroy: destroy,
      start: start,
      pause: pause
    };
  }

  $.fn[pluginName] = function(options) {
    if (typeof arguments[0] === 'string') {
      var methodName = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);
      var returnVal;
      this.each(function() {
        if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
          returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
        }
      });
      if (returnVal !== undefined){
        return returnVal;
      } else {
        return this;
      }
    } else if (typeof options === "object" || !options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    }
  };

  $.fn[pluginName].defaults = {
    minSpeedX: 0.1,
    maxSpeedX: 0.7,
    minSpeedY: 0.1,
    maxSpeedY: 0.7,
    directionX: 'center', // 'center', 'left' or 'right'. 'center' = dots bounce off edges
    directionY: 'center', // 'center', 'up' or 'down'. 'center' = dots bounce off edges
    density: 10000, // How many particles will be generated: one particle every n pixels
    dotColor: '#666666',
    lineColor: '#666666',
    particleRadius: 7, // Dot size
    lineWidth: 1,
    curvedLines: false,
    proximity: 100, // How close two dots need to be before they join
    parallax: true,
    parallaxMultiplier: 5, // The lower the number, the more extreme the parallax effect
    onInit: function() {},
    onDestroy: function() {}
  };

})(jQuery);

/**
 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 * @see: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * @see: http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * @license: MIT license
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());