Particleground
==============

A JavaScript plugin for snazzy background particle systems. Includes an optional parallax effect controlled by the mouse on desktop devices and gyroscope on mobile devices. Works in any browser that supports HTML5 canvas.

[See a demo](https://jnicol.github.io/particleground)

## Usage
    
    particleground(document.getElementById('your-element');

jQuery:

    $('#your-element').particleground();

## Options

Options can be set by passing an options object to the constructor.

Here is an example of setting the color of the particle system dots and lines:

    particleground(document.getElementById('your-element'), {
        dotColor: '#ff0000',
        lineColor: '#ff0000'
    });

jQuery:

    $('#your-element').particleground({
        dotColor: '#ff0000',
        lineColor: '#ff0000'
    });

Here is a full list of options, and their default values:

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

Particleground exposes public methods which can be used to interact with your Particleground instance e.g.

    var pg = particleground(document.getElementById('your-element');
    pg.pause(); 

jQuery:

    $('#your-element').particlegound('pause');

### pause()

Pauses the particle system.

### start()

Restarts the particle system if you previously paused it.

### destroy()

Removes the plugin from your element.

## Credits

Particleground was inspired by http://requestlab.fr/ and http://disruptivebydesign.com/

## Contributors

Horia Dragomir: Removed jQuery dependency and improved rendering performance
