//Download
document.getElementById('bouton-telechargement').addEventListener('click', function () {
    try {
        document.getElementById('lien-telechargement').click();
    } catch (error) {
        // Gérez l'erreur ici, par exemple, en affichant un message à l'utilisateur
        console.error('Une erreur s\'est produite : ' + error.message);
    }
});

var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

// Main
try {
    initHeader();
    initAnimation();
    addListeners();
} catch (error) {
    // Gérez l'erreur ici, par exemple, en affichant un message à l'utilisateur
    console.error('Une erreur s\'est produite lors de l\'initialisation : ' + error.message);
}

function initHeader() {
    try {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height + 'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / 20) {
            for (var y = 0; y < height; y = y + height / 20) {
                var px = x + Math.random() * width / 20;
                var py = y + Math.random() * height / 20;
                var p = { x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j];
                if (!(p1 == p2)) {
                    var placed = false;
                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for (var i in points) {
            var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'initialisation du header : ' + error.message);
    }
}

// Event handling
function addListeners() {
    try {
        if (!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la gestion des événements : ' + error.message);
    }
}

function mouseMove(e) {
    try {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction mouseMove : " + error);
    }
}

function scrollCheck() {
    try {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction scrollCheck : " + error);
    }
}

function resize() {
    try {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height + 'px';
        canvas.width = width;
        canvas.height = height;
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction resize : " + error);
    }
}

// animation
function initAnimation() {
    try {
        animate();
        for (var i in points) {
            shiftPoint(points[i]);
        }
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction initAnimation : " + error);
    }
}

function animate() {
    try {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (var i in points) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction animate : " + error);
    }
}

function shiftPoint(p) {
    try {
        TweenLite.to(p, 1 + 1 * Math.random(), {
            x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100,
            ease: Circ.easeInOut,
            onComplete: function () {
                shiftPoint(p);
            }
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'animation de shiftPoint : " + error);
    }
}

// Canvas manipulation
function drawLines(p) {
    if (!p.active) return;
    try {
        for (var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,' + p.active + ')';
            ctx.stroke();
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors du dessin de lignes : " + error);
    }
}

function Circle(pos, rad, color) {
    var _this = this;

    // constructor
    (function () {
        _this.pos = pos || null;
        _this.radius = rad || null;
        _this.color = color || null;
    })();

    this.draw = function () {
        if (!_this.active) return;
        try {
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
            ctx.fill();
        } catch (error) {
            console.error("Une erreur s'est produite lors du dessin du cercle : " + error);
        }
    };
}

// Util
function getDistance(p1, p2) {
    try {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    } catch (error) {
        console.error("Une erreur s'est produite lors du calcul de la distance : " + error);
        return 0;
    }
}


/* SECTION: requestAnimationFrame polyfill 
* Authors: Erik Möller, fixes from Paul Irish & Tino Zijdel.
* Original File Name: paulirish/rAF.js
* Link: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
* MIT license
*/

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

// Exemple de modification du texte
var textElement = document.querySelector('.text-overlay h1');
textElement.innerText = 'BIENVENUE';