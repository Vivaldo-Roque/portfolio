import React, { useEffect, useRef } from "react";

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

      // Define Bird Geometry Constructor
      const Bird = function (this: any) {
        const scope = this;
        THREE.Geometry.call(this);

        const v = (x: number, y: number, z: number) => {
          scope.vertices.push(new THREE.Vector3(x, y, z));
        };

        const f3 = (a: number, b: number, c: number) => {
          scope.faces.push(new THREE.Face3(a, b, c));
        };

        v(5, 0, 0);
        v(-5, -2, 1);
        v(-5, 0, 0);
        v(-5, -2, -1);

        v(0, 2, -6);
        v(0, 2, 6);
        v(2, 0, 0);
        v(-3, 0, 0);

        f3(0, 2, 1);
        f3(4, 7, 6);
        f3(5, 6, 7);

        this.computeCentroids();
        this.computeFaceNormals();
      };
      Bird.prototype = Object.create(THREE.Geometry.prototype);

      // Define Boid Constructor
      const Boid = function (this: any) {
        const vector = new THREE.Vector3();
        let _width = 500;
        let _height = 500;
        let _depth = 200;
        let _goal: any;
        const _neighborhoodRadius = 100;
        const _maxSpeed = 2;
        const _maxSteerForce = 0.1;
        let _avoidWalls = false;

        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        const _acceleration = new THREE.Vector3();

        this.setGoal = (target: any) => {
          _goal = target;
        };

        this.setAvoidWalls = (value: boolean) => {
          _avoidWalls = value;
        };

        this.setWorldSize = (width: number, height: number, depth: number) => {
          _width = width;
          _height = height;
          _depth = depth;
        };

        this.run = (boids: any[]) => {
          if (_avoidWalls) {
            vector.set(-_width, this.position.y, this.position.z);
            let avoidVec = this.avoid(vector);
            avoidVec.multiplyScalar(5);
            _acceleration.addSelf(avoidVec);

            vector.set(_width, this.position.y, this.position.z);
            avoidVec = this.avoid(vector);
            avoidVec.multiplyScalar(5);
            _acceleration.addSelf(avoidVec);

            vector.set(this.position.x, -_height, this.position.z);
            avoidVec = this.avoid(vector);
            avoidVec.multiplyScalar(5);
            _acceleration.addSelf(avoidVec);

            vector.set(this.position.x, _height, this.position.z);
            avoidVec = this.avoid(vector);
            avoidVec.multiplyScalar(5);
            _acceleration.addSelf(avoidVec);

            vector.set(this.position.x, this.position.y, -_depth);
            avoidVec = this.avoid(vector);
            avoidVec.multiplyScalar(5);
            _acceleration.addSelf(avoidVec);

            vector.set(this.position.x, this.position.y, _depth);
            avoidVec = this.avoid(vector);
            avoidVec.multiplyScalar(5);
            _acceleration.addSelf(avoidVec);
          }

          if (Math.random() > 0.5) {
            this.flock(boids);
          }
          this.move();
        };

        this.flock = (boids: any[]) => {
          if (_goal) {
            _acceleration.addSelf(this.reach(_goal, 0.005));
          }
          _acceleration.addSelf(this.alignment(boids));
          _acceleration.addSelf(this.cohesion(boids));
          _acceleration.addSelf(this.separation(boids));
        };

        this.move = () => {
          this.velocity.addSelf(_acceleration);
          const l = this.velocity.length();
          if (l > _maxSpeed) {
            this.velocity.divideScalar(l / _maxSpeed);
          }
          this.position.addSelf(this.velocity);
          _acceleration.set(0, 0, 0);
        };

        this.avoid = (target: any) => {
          const steer = new THREE.Vector3();
          steer.copy(this.position);
          steer.subSelf(target);
          steer.multiplyScalar(1 / this.position.distanceToSquared(target));
          return steer;
        };

        this.repulse = (target: any) => {
          const distance = this.position.distanceTo(target);
          if (distance < 150) {
            const steer = new THREE.Vector3();
            steer.sub(this.position, target);
            steer.multiplyScalar(0.5 / distance);
            _acceleration.addSelf(steer);
          }
        };

        this.reach = (target: any, amount: number) => {
          const steer = new THREE.Vector3();
          steer.sub(target, this.position);
          steer.multiplyScalar(amount);
          return steer;
        };

        this.alignment = (boids: any[]) => {
          const velSum = new THREE.Vector3();
          let count = 0;

          for (let i = 0; i < boids.length; i++) {
            if (Math.random() > 0.6) continue;
            const other = boids[i];
            const distance = other.position.distanceTo(this.position);
            if (distance > 0 && distance <= _neighborhoodRadius) {
              velSum.addSelf(other.velocity);
              count++;
            }
          }

          if (count > 0) {
            velSum.divideScalar(count);
            const l = velSum.length();
            if (l > _maxSteerForce) {
              velSum.divideScalar(l / _maxSteerForce);
            }
          }
          return velSum;
        };

        this.cohesion = (boids: any[]) => {
          const posSum = new THREE.Vector3();
          const steer = new THREE.Vector3();
          let count = 0;

          for (let i = 0; i < boids.length; i++) {
            if (Math.random() > 0.6) continue;
            const other = boids[i];
            const distance = other.position.distanceTo(this.position);
            if (distance > 0 && distance <= _neighborhoodRadius) {
              posSum.addSelf(other.position);
              count++;
            }
          }

          if (count > 0) {
            posSum.divideScalar(count);
          }

          steer.sub(posSum, this.position);
          const l = steer.length();
          if (l > _maxSteerForce) {
            steer.divideScalar(l / _maxSteerForce);
          }
          return steer;
        };

        this.separation = (boids: any[]) => {
          const posSum = new THREE.Vector3();
          const repulse = new THREE.Vector3();

          for (let i = 0; i < boids.length; i++) {
            if (Math.random() > 0.6) continue;
            const other = boids[i];
            const distance = other.position.distanceTo(this.position);
            if (distance > 0 && distance <= _neighborhoodRadius) {
              repulse.sub(this.position, other.position);
              repulse.normalize();
              repulse.divideScalar(distance);
              posSum.addSelf(repulse);
            }
          }
          return posSum;
        };
      };

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
