import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive 3D Low-Poly Globe with a walking character on top ("Little Prince" planetary walk):
 * - As the user scrolls through the 4 stages (progress 0 -> 3), the globe rotates beneath the walker's feet.
 * - The character's legs and arms swing naturally whenever the globe is rotating (and breathe gently when stopped).
 * - 4 glowing landmark beacons sit around the globe's meridian; as each beacon reaches the top under the walker,
 *   it pulses bright emerald green (`#2FBF71`).
 */
export default function AboutGlobe({
  activeStop,
  onSelectStop,
}: {
  activeStop: number;
  onSelectStop?: (idx: number) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeStopRef = useRef(activeStop);
  activeStopRef.current = activeStop;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.35, 8.2);
    camera.lookAt(0, 0.45, 0);

    // =========================================================================
    // 1. THE 3D LOW-POLY PLANET / GLOBE (Black, Charcoal, Gray & Emerald Green)
    // =========================================================================
    const worldPivot = new THREE.Group();
    worldPivot.position.set(0, -1.05, 0);
    scene.add(worldPivot);

    const R = 2.15;
    const ico = new THREE.IcosahedronGeometry(R, 3);
    const pos = ico.attributes.position;
    const hash = (n: number) => {
      const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    // Sculpt continents vs oceans with subtle low-poly displacement
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const len = Math.hypot(vx, vy, vz) || 1;
      const nx = vx / len;
      const ny = vy / len;
      const nz = vz / len;
      const continent =
        Math.sin(nx * 3.4 + 0.5) * Math.cos(ny * 3.1 - 0.3) +
        Math.sin(nz * 4.2 + 1.1) * 0.45;
      const bump = continent > 0.08 ? 0.06 + (continent - 0.08) * 0.05 : -0.02;
      const r = R + bump;
      pos.setXYZ(i, nx * r, ny * r, nz * r);
    }

    const nonIdx = ico.toNonIndexed();
    nonIdx.computeVertexNormals();
    const nPos = nonIdx.attributes.position;
    const nNorm = nonIdx.attributes.normal;
    const colors = new Float32Array(nPos.count * 3);
    const lightDir = new THREE.Vector3(0.35, 0.8, 0.55).normalize();

    for (let i = 0; i < nPos.count; i += 3) {
      const cx = (nPos.getX(i) + nPos.getX(i + 1) + nPos.getX(i + 2)) / 3;
      const cy = (nPos.getY(i) + nPos.getY(i + 1) + nPos.getY(i + 2)) / 3;
      const cz = (nPos.getZ(i) + nPos.getZ(i + 1) + nPos.getZ(i + 2)) / 3;
      const rad = Math.hypot(cx, cy, cz);
      const isLand = rad > R + 0.025;

      const nx = nNorm.getX(i);
      const ny = nNorm.getY(i);
      const nz = nNorm.getZ(i);
      const shade = 0.55 + 0.45 * Math.max(0, nx * lightDir.x + ny * lightDir.y + nz * lightDir.z);
      const jitter = 0.9 + hash(i * 2.7) * 0.2;

      let r = 0.04, g = 0.05, b = 0.045;
      if (isLand) {
        const isEmeraldPeak = rad > R + 0.075 || hash(i * 7.1) > 0.78;
        if (isEmeraldPeak) {
          r = 0.05 * shade * jitter;
          g = 0.24 * shade * jitter;
          b = 0.14 * shade * jitter;
        } else {
          r = 0.12 * shade * jitter;
          g = 0.15 * shade * jitter;
          b = 0.13 * shade * jitter;
        }
      } else {
        r = 0.03 * shade;
        g = 0.035 * shade;
        b = 0.035 * shade;
      }

      for (let k = 0; k < 3; k++) {
        colors[(i + k) * 3] = r;
        colors[(i + k) * 3 + 1] = g;
        colors[(i + k) * 3 + 2] = b;
      }
    }
    nonIdx.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const globeMesh = new THREE.Mesh(
      nonIdx,
      new THREE.MeshBasicMaterial({ vertexColors: true }),
    );
    worldPivot.add(globeMesh);

    // Crisp vector wireframe over the globe
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(nonIdx),
      new THREE.LineBasicMaterial({ color: "#2a332e", transparent: true, opacity: 0.35 }),
    );
    wire.scale.setScalar(1.002);
    worldPivot.add(wire);

    // Glowing emerald meridian trail (the path the character walks along)
    const trailPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      trailPts.push(new THREE.Vector3(0, Math.cos(a) * (R + 0.07), Math.sin(a) * (R + 0.07)));
    }
    const trailLine = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(trailPts),
      new THREE.LineBasicMaterial({ color: "#2FBF71", transparent: true, opacity: 0.65 }),
    );
    worldPivot.add(trailLine);

    // Equatorial orbital telemetry ring
    const eqRing = new THREE.Mesh(
      new THREE.RingGeometry(R + 0.42, R + 0.44, 72),
      new THREE.MeshBasicMaterial({ color: "#2FBF71", side: THREE.DoubleSide, transparent: true, opacity: 0.25 }),
    );
    eqRing.rotation.x = Math.PI / 2.2;
    eqRing.rotation.y = 0.35;
    worldPivot.add(eqRing);

    // =========================================================================
    // 2. 4 STAGE BEACON ARCHES ON THE GLOBE MERIDIAN (angles: 0, 90, 180, 270 deg)
    // =========================================================================
    const beacons: { group: THREE.Group; ringMat: THREE.MeshBasicMaterial; pillarMat: THREE.MeshBasicMaterial }[] = [];
    for (let s = 0; s < 4; s++) {
      const angle = s * (Math.PI / 2);
      const bGroup = new THREE.Group();
      // Place beacon at angle along the YZ meridian circle
      bGroup.rotation.x = angle;

      const markerHolder = new THREE.Group();
      markerHolder.position.set(0, R + 0.06, 0);

      // Glowing ground pad ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: "#2FBF71",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const pad = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.23, 24), ringMat);
      pad.rotation.x = Math.PI / 2;
      markerHolder.add(pad);

      // Vertical waypoint crystal obelisk beside the path
      const pillarMat = new THREE.MeshBasicMaterial({ color: "#2FBF71", transparent: true, opacity: 0.8 });
      const obeliskGeo = new THREE.OctahedronGeometry(0.11, 0);
      obeliskGeo.scale(0.7, 2.2, 0.7);
      const obelisk = new THREE.Mesh(obeliskGeo, pillarMat);
      obelisk.position.set(0.36, 0.28, 0);
      markerHolder.add(obelisk);

      bGroup.add(markerHolder);
      worldPivot.add(bGroup);
      beacons.push({ group: markerHolder, ringMat, pillarMat });
    }

    // =========================================================================
    // 3. THE WALKING CHARACTER AT THE NORTH SUMMIT OF THE GLOBE
    // =========================================================================
    const walker = new THREE.Group();
    walker.position.set(0, -1.05 + R + 0.08, 0);
    // Face slightly in 3/4 view so the walking stride is clearly visible to the viewer
    walker.rotation.y = 0.42;
    scene.add(walker);

    const bodyFill = new THREE.MeshBasicMaterial({ color: "#111614" });
    const accentFill = new THREE.MeshBasicMaterial({ color: "#2FBF71" });
    const headFill = new THREE.MeshBasicMaterial({ color: "#E8ECEA" });
    const limbFill = new THREE.MeshBasicMaterial({ color: "#1C2420" });
    const edgeWhite = new THREE.LineBasicMaterial({ color: "#E8E8E8", transparent: true, opacity: 0.65 });
    const edgeGreen = new THREE.LineBasicMaterial({ color: "#2FBF71", transparent: true, opacity: 0.9 });

    const makePart = (w: number, h: number, d: number, fill: THREE.Material, edge: THREE.Material, yOffset = 0) => {
      const g = new THREE.Group();
      const geo = new THREE.BoxGeometry(w, h, d);
      geo.translate(0, yOffset, 0);
      g.add(new THREE.Mesh(geo, fill), new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge));
      return g;
    };

    // Torso (with Vivaldo's geometric argyle chest accent)
    const torso = makePart(0.32, 0.44, 0.2, bodyFill, edgeGreen, 0);
    torso.position.y = 0.62;
    walker.add(torso);

    // Backpack / Engineering Pack
    const pack = makePart(0.24, 0.32, 0.14, limbFill, edgeWhite, 0);
    pack.position.set(0, 0.03, -0.17);
    torso.add(pack);

    // Head + Cap visor (inspired by Vivaldo's portrait!)
    const head = new THREE.Group();
    head.position.set(0, 0.36, 0);
    const skull = makePart(0.24, 0.24, 0.24, headFill, edgeWhite, 0);
    const capCrown = makePart(0.26, 0.1, 0.26, bodyFill, edgeGreen, 0);
    capCrown.position.y = 0.11;
    const capVisor = makePart(0.24, 0.035, 0.16, accentFill, edgeGreen, 0);
    capVisor.position.set(0, 0.08, 0.17);
    head.add(skull, capCrown, capVisor);
    torso.add(head);

    // Left & Right Legs (pivoting at the hip y = 0.40)
    const leftLeg = makePart(0.11, 0.38, 0.12, limbFill, edgeWhite, -0.19);
    leftLeg.position.set(-0.09, 0.4, 0);
    const rightLeg = makePart(0.11, 0.38, 0.12, limbFill, edgeWhite, -0.19);
    rightLeg.position.set(0.09, 0.4, 0);
    walker.add(leftLeg, rightLeg);

    // Left & Right Arms (pivoting at the shoulder y = 0.80)
    const leftArm = makePart(0.09, 0.34, 0.1, limbFill, edgeGreen, -0.17);
    leftArm.position.set(-0.22, 0.8, 0);
    const rightArm = makePart(0.09, 0.34, 0.1, limbFill, edgeGreen, -0.17);
    rightArm.position.set(0.22, 0.8, 0);
    walker.add(leftArm, rightArm);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    let smoothScrollProgress = 0;
    let lastGlobeAngle = 0;
    let walkPhase = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = reduced ? 0 : clock.getElapsedTime();

      // Calculate continuous scroll progress across the 4 journey stops [0..3]
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const rawScroll = Math.max(0, Math.min(1, window.scrollY / docHeight));
      const targetStage = rawScroll * 3;
      smoothScrollProgress += (targetStage - smoothScrollProgress) * 0.08;

      // Rotate the globe so the walker steps forward from beacon 0 -> 1 -> 2 -> 3
      const targetAngle = -smoothScrollProgress * (Math.PI / 2);
      const angularVelocity = Math.abs(targetAngle - lastGlobeAngle);
      lastGlobeAngle = targetAngle;

      worldPivot.rotation.x = targetAngle;
      // Subtle slow axial drift so the 3D facets catch the light
      worldPivot.rotation.y = -0.35 + Math.sin(t * 0.25) * 0.08;

      // Walking gait: legs & arms swing strongly when scrolling, plus a steady gentle stroll so the character feels alive
      const walkSpeed = reduced ? 0 : 2.6 + Math.min(14, angularVelocity * 260);
      walkPhase += walkSpeed * 0.016;
      const strideAmplitude = Math.min(0.85, 0.28 + angularVelocity * 38);

      const swing = Math.sin(walkPhase) * strideAmplitude;
      leftLeg.rotation.x = swing;
      rightLeg.rotation.x = -swing;
      leftArm.rotation.x = -swing * 0.85;
      rightArm.rotation.x = swing * 0.85;

      // Vertical bounce at twice the stride frequency + slight forward lean when walking fast
      const bounce = Math.abs(Math.cos(walkPhase)) * 0.045 * (strideAmplitude / 0.4);
      walker.position.y = -1.05 + R + 0.06 + bounce;
      torso.rotation.x = Math.min(0.22, angularVelocity * 12);
      head.rotation.y = Math.sin(t * 0.8) * 0.12;

      // Pulse the active beacon at the top of the globe
      beacons.forEach((b, idx) => {
        const isCurrent = idx === activeStopRef.current;
        const sc = isCurrent ? 1.25 + Math.sin(t * 4) * 0.12 : 0.85;
        b.group.scale.setScalar(sc);
        b.ringMat.opacity = isCurrent ? 0.95 : 0.3;
        b.pillarMat.opacity = isCurrent ? 0.95 : 0.35;
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none">
      <div ref={mountRef} className="h-full w-full" />
      {onSelectStop && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1 rounded-xl border border-border bg-black/75 p-1.5 backdrop-blur-md">
          {["01", "02", "03", "04"].map((num, idx) => {
            const active = idx === activeStop;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onSelectStop(idx)}
                className={`font-mono-code flex-1 rounded-lg py-1.5 text-[10px] uppercase tracking-widest transition ${
                  active
                    ? "bg-white font-semibold text-black"
                    : "text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
