/*
 *  I would like to give a special thanks to the author of this code.
 *  I found the code here: https://codepen.io/jtrdev/pen/yLVJogz
 *  Which references the original source: http://pages.cs.wisc.edu/~lizy/mrdoob-three.js-ef5f05d/examples/canvas_geometry_birds.html
 *
 */

import * as THREE from 'three';
import { Bird } from './Bird.js';
import { Boid } from './Boid.js';

// Changed here!
// Select the container
var container = document.getElementById("bird-container");

var SCREEN_WIDTH = container.clientWidth,
    SCREEN_HEIGHT = container.clientHeight,
    SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2,
    SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

// var SCREEN_WIDTH = window.innerWidth,
//     SCREEN_HEIGHT = window.innerHeight,
//     SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2,
//     SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

var camera, scene, renderer,
    birds, bird;

var boid, boids;

if (isWebGLAvailable()) {
    init();
    animate();
} else {
    container.textContent = 'WebGL nao suportado no navegador.';
}

function isWebGLAvailable() {
    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function init() {

    camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.z = 450;

    scene = new THREE.Scene();

    birds = [];
    boids = [];

    // changed here, max value was 200
    for (var i = 0; i < 50; i++) {

        boid = boids[i] = new Boid();
        boid.position.x = Math.random() * 400 - 200;
        boid.position.y = Math.random() * 400 - 200;
        boid.position.z = Math.random() * 400 - 200;
        boid.velocity.x = Math.random() * 2 - 1;
        boid.velocity.y = Math.random() * 2 - 1;
        boid.velocity.z = Math.random() * 2 - 1;
        boid.setAvoidWalls(true);
        boid.setWorldSize(500, 500, 400);

        // silhouette dark tone (grayscale) — low base lightness
        const c = new THREE.Color();
        const hue = 0; // irrelevant when sat=0
        const sat = 0.0; // grayscale
        const baseL = 0.0; // absolute dark baseline
        c.setHSL(hue, sat, baseL);
        const mat = new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide });
        bird = birds[i] = new THREE.Mesh(new Bird(), mat);
        bird.phase = Math.floor(Math.random() * 62.83);
        bird.position.copy(boids[i].position);
        bird.userData = { baseL: baseL };
        scene.add(bird);


    }

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Changed here
    // document.body.appendChild(renderer.domElement);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    SCREEN_WIDTH = container.clientWidth;
    SCREEN_HEIGHT = container.clientHeight;
    SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2;
    SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

function onDocumentMouseMove(event) {

    var vector = new THREE.Vector3(event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0);

    for (var i = 0, il = boids.length; i < il; i++) {

        boid = boids[i];

        vector.z = boid.position.z;

        boid.repulse(vector);

    }

}

//

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    for (var i = 0, il = birds.length; i < il; i++) {

        boid = boids[i];
        boid.run(boids);

        bird = birds[i];
        bird.position.copy(boids[i].position);

        // adjust lightness slightly by depth to keep silhouette effect
        var brightness = (500 - bird.position.z) / 1000;
        brightness = brightness * 0.08;  // very subtle variation
        var baseL = bird.userData && bird.userData.baseL !== undefined ? bird.userData.baseL : 0.03;
        var newL = Math.max(0, Math.min(1, baseL + brightness));
        bird.material.color.setHSL(0, 0, newL);

        bird.rotation.y = Math.atan2(- boid.velocity.z, boid.velocity.x);
        bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());

        bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
        var position = bird.geometry.getAttribute('position');
        var wingY = Math.sin(bird.phase) * 5;
        position.setY(4, wingY);
        position.setY(5, wingY);
        position.needsUpdate = true;

    }

    renderer.render(scene, camera);
}
