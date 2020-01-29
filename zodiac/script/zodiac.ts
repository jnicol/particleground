"use static"

class Zodiac {
    options: any = {
        direction: [0, 0],
        velocity: [[.1, 0.3], [.1, .3]],
        bounce: [true, true],
        parallax: .2,
        density: 5000,
        proximity: 50,
        //dotColor: '#aaa',
        dotRadius: [1,5],
        lineColor: '#aaa',
        lineWidth: 1,
        //backgroundColor: 'rgba(20,20,20,.2)',
    };

    constructor(canvas: any, options: any = {}) {

        var canvas = (typeof canvas == 'string' || canvas instanceof String) ?
            document.getElementById(canvas) : canvas;

        if (canvas.tagName != 'CANVAS') throw "no canvas";

        for (var key in options) { this.options[key] = options[key]; }
        options = this.options;

        var ctx = canvas.getContext('2d', { alpha: !options.backgroundColor }),
            particles = [],
            tilt = [0, 0],
            radius = [].concat(options.dotRadius),
            parallax = options.parallax/2 / (radius[1] ? (radius[1] - radius[0]) : radius[0]);

        var update = function () {
            var w = canvas.width,
                h = canvas.height;

            if (options.backgroundColor) {
                ctx.fillStyle = options.backgroundColor;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = options.dotColor;
            } else {
                ctx.clearRect(0, 0, w, h);
            }

            ctx.beginPath();

            for (var i = 0, p, x, y; i < particles.length; i++) {
                p = particles[i];

                /* MOVE */
                p[1] += p[3];
                p[2] += p[4];

                /* POSITION */
                if (options.parallax) {
                    var fac = p[0] * parallax;
                    p[5] += (tilt[0] * fac - p[5]) / 10;
                    p[6] += (tilt[1] * fac - p[6]) / 10;
                }

                x = p[1] + p[5];
                y = p[2] + p[6];

                if (x < 0 || x > w)
                    (options.direction[0]) ? (p[1] = ((x + w) % w) - p[5]) : (p[3] = -p[3]);

                if (y < 0 || y > h)
                    (options.direction[1]) ? (p[2] = ((y + h) % h) - p[6]) : (p[4] = -p[4]);

                var r = radius[1] ? p[0] : radius[0];
                /* DRAW */
                ctx.moveTo(x + r, y);
                ctx.arc(x, y, r, 0, Math.PI * 2);

                // loop back no double connections
                for (var j = i - 1; j >= 0; j--) {
                    var q = particles[j],
                        dx = q[1] - p[1],
                        dy = q[2] - p[2],
                        dist = Math.sqrt((dx * dx) + (dy * dy));

                    if (dist < options.proximity) {
                        var x = p[1] + p[5],
                            y = p[2] + p[6],
                            x2 = q[1] + q[5],
                            y2 = q[2] + q[6],
                            a = Math.atan2(y2 - y, x2 - x),
                            r2 = radius[1] ? q[0] : radius[0],
                            cos = Math.cos(a),
                            sin = Math.sin(a);

                        x += r * cos;
                        y += r * sin;
                        x2 -= r2 * cos;
                        y2 -= r2 * sin;

                        ctx.moveTo(x, y);
                        ctx.lineTo(x2, y2);
                    }
                }
            };
            ctx.stroke();
            options.dotColor && ctx.fill();

            requestAnimationFrame(update);
        }


        var onMousemove = function (ev?: MouseEvent) {
            tilt[0] = ev.pageX - window.innerWidth / 2;
            tilt[1] = ev.pageY - window.innerHeight / 2;
        }

        var onOrientation = function (ev?: any) {
            tilt[0] = Math.min(Math.max(-ev.beta, -30), 30) * (window.innerWidth / 30);
            tilt[1] = Math.min(Math.max(-ev.gamma, -30), 30) * (window.innerHeight / 30);

        }

        var onResize = function () {

            var w = canvas.width = canvas.offsetWidth,
                h = canvas.height = canvas.offsetHeight,
                v = options.velocity,
                d = options.direction,
                random = Math.random;

            var num = Math.ceil((w * h) / options.density);

            for (var i = particles.length - 1; i >= 0; i--)
                if (particles[i][1] > w || particles[i][2] > h)
                    particles.splice(i, 1);

            if (num < particles.length)
                particles.splice(num);

            while (num > particles.length)
                particles.push([
                    Math.ceil(radius[1] ? (random() * (radius[1] - radius[0]) + radius[0]) : random() * radius[0]), //z
                    Math.ceil(random() * w), //x
                    Math.ceil(random() * h), //y
                    //  (random)direction * clamped random velocity
                    (d[0] || ((random() > .5) ? 1 : -1)) * (random() * (v[0][1] - v[0][0]) + v[0][0]), //vx
                    (d[1] || ((random() > .5) ? 1 : -1)) * (random() * (v[1][1] - v[1][0]) + v[1][0]), //vy
                    0, 0 // offset
                ]);


            ctx.strokeStyle = options.lineColor;
            ctx.fillStyle = options.dotColor;
            ctx.lineWidth = options.lineWidth;
        }

        window.addEventListener('resize', onResize, false);
        document.addEventListener('mousemove', onMousemove, false);
        window.addEventListener('deviceorientation', onOrientation, false);
        onResize();
        update();
    }
}
