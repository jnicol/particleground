Particleground
==============

A jQuery plugin for elegant background particle systems. Includes an optional parallax effect controlled by the mouse on desktop devices and gyroscope on mobile devices.

## Usage

    $('#your-element').particleground();

## Options

Options can be overridden by passing an options object to the constructor.

Here is an example of setting the color of the particle system dots and lines:

    $('#your-element').particleground({
        dotColor: '#ff0000',
        lineColor: '#ff0000'
    });

Here is a full list of options, and their default values:

    width: window.screen.width, // Wide enough to fill viewport @ 100% screen width
    height: window.screen.height, // Tall enough to fill viewport @ 100% screen height
    minSpeedX: 0.1,
    maxSpeedX: 0.7,
    minSpeedY: 0.1,
    maxSpeedY: 0.7,
    directionX: 'center', // 'center', left' or 'right. 'center' = dots bounce off edges
    directionY: 'center', // 'center', up' or 'down. 'center' = dots bounce off edges
    density: 10000,
    dotColor: '#666666',
    lineColor: '#666666',
    particleRadius: 7, // Dot size
    lineWidth: 1,
    curvedLines: false,
    proximity: 100, // How close two dots need to be before they join
    parallax: true,
    parallaxMultiplier: 5, // The lower the number, the greater the parallax effect
    onInit: function() {},
    onDestroy: function() {}
