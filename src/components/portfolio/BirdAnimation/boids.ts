export function createBird(THREE: any) {
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
  return Bird;
}

export function createBoid(THREE: any) {
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
  return Boid;
}
