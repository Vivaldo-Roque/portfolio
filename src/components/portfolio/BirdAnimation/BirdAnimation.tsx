import React, { useEffect, useRef } from "react";
import { createBird, createBoid } from "./boids";

export const BirdAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDestroyed = false;
    let animationFrameId: number;
    let mouseMoveListener: (e: MouseEvent) => void;
    let resizeListener: () => void;

    const initThree = () => {
      const THREE = (window as any).THREE;
      if (!THREE) return;

      const Bird = createBird(THREE);
      const Boid = createBoid(THREE);

      // Set up scene variables
      let SCREEN_WIDTH = container.clientWidth;
      let SCREEN_HEIGHT = container.clientHeight;
      let SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2;
      let SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

      const camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
      camera.position.z = 450;

      const scene = new THREE.Scene();
      const birds: any[] = [];
      const boids: any[] = [];

      for (let i = 0; i < 50; i++) {
        const boid = new (Boid as any)();
        boid.position.x = Math.random() * 400 - 200;
        boid.position.y = Math.random() * 400 - 200;
        boid.position.z = Math.random() * 400 - 200;
        boid.velocity.x = Math.random() * 2 - 1;
        boid.velocity.y = Math.random() * 2 - 1;
        boid.velocity.z = Math.random() * 2 - 1;
        boid.setAvoidWalls(true);
        boid.setWorldSize(500, 500, 400);

        boids.push(boid);

        const birdGeometry = new (Bird as any)();
        const birdMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const bird = new THREE.Mesh(birdGeometry, birdMaterial);

        bird.phase = Math.floor(Math.random() * 62.83);
        bird.position = boid.position;
        scene.add(bird);
        birds.push(bird);
      }

      // v51 CanvasRenderer setup
      const renderer = new THREE.CanvasRenderer();
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      container.appendChild(renderer.domElement);

      mouseMoveListener = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const vector = new THREE.Vector3(mouseX - SCREEN_WIDTH_HALF, -mouseY + SCREEN_HEIGHT_HALF, 0);

        for (let i = 0; i < boids.length; i++) {
          const boid = boids[i];
          vector.z = boid.position.z;
          boid.repulse(vector);
        }
      };

      resizeListener = () => {
        SCREEN_WIDTH = container.clientWidth;
        SCREEN_HEIGHT = container.clientHeight;
        SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2;
        SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      };

      window.addEventListener("mousemove", mouseMoveListener, false);
      window.addEventListener("resize", resizeListener, false);

      const render = () => {
        for (let i = 0; i < birds.length; i++) {
          const boid = boids[i];
          boid.run(boids);

          const bird = birds[i];
          // Pure black — matéria escura
          bird.material.color.r = bird.material.color.g = bird.material.color.b = 0;

          bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
          bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());

          bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
          bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
        }

        renderer.render(scene, camera);
      };

      const animate = () => {
        if (isDestroyed) return;
        animationFrameId = requestAnimationFrame(animate);
        render();
      };

      animate();
    };

    let script: HTMLScriptElement | null = null;
    if ((window as any).THREE) {
      initThree();
    } else {
      // Load Three.js v51
      script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/51/three.min.js";
      script.async = true;
      script.onload = () => {
        if (!isDestroyed) {
          initThree();
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      isDestroyed = true;
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (mouseMoveListener) {
        window.removeEventListener("mousemove", mouseMoveListener);
      }
      if (resizeListener) {
        window.removeEventListener("resize", resizeListener);
      }
      cancelAnimationFrame(animationFrameId);
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      id="bird-container"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        opacity: 0.8,
      }}
    />
  );
};
