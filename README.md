Particleground
==============

A jQuery plugin for snazzy background particle systems. Includes an optional parallax effect controlled by the mouse on desktop devices and gyroscope on mobile devices. Works in any browser that supports HTML5 canvas.

[See a demo](https://jnicol.github.io/particleground)

## Usage

    $('#your-element').particleground();

## Options

Options can be set by passing an options object to the constructor.

Here is an example of setting the color of the particle system dots and lines:

    $('#your-element').particleground({
        dotColor: '#ff0000',
        lineColor: '#ff0000'
    });

Here is a full list of options, and their default values:

### width

    window.screen.width

By default the canvas is wide enough to fill viewport when it is 100% screen wide.

### height

    window.screen.height

By default the canvas is tall enough to fill viewport when it is 100% screen high.

### minSpeedX

    0.1

### maxSpeedX

    0.7

### minSpeedY

    0.1

### maxSpeedY

    0.7

### directionX

    'center'

Can be one of `'center'`, `'left' or `'right'`. `'center'` means that the dots will bounce off the edges of the canvas.

### directionY

    'center'

Can be one of `'center'`, `'up'` or `'down'`. `'center'` means that the dots will bounce off the edges of the canvas.

### density

    10000

Determines how many particles will be generated: one particle every n pixels.

### dotColor

    '#666666'

### lineColor

    '#666666'

### particleRadius

    7

Dot size

### lineWidth

    1

### curvedLines

    false

### proximity

    100

How close two dots need to be, in pixels, before they join.

### parallax

    true

### parallaxMultiplier

    5

The lower the number, the more extreme the parallax effect wil be.

### onInit

    function() {}

A callback executed after Particleground initializes.

### onDestroy

    function() {}

A callback executed after Particleground is destroyed.

## Methods

### pause

Pauses the particle system.

    $('#your-element').particlegound('pause');

### start

Restarts the particle system if you previously paused it.

    $('#your-element').particlegound('start');

### destroy

Removes the plugin from your element.

    $('#your-element').particlegound('destroy');

## Credits

Particleground was inspired by http://requestlab.fr/ and http://disruptivebydesign.com/ 
