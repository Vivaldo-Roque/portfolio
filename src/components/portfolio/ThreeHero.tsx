import { useEffect, useRef } from "react";
import * as THREE from "three";
import portrait from "@/assets/vivaldo-portrait.jpg";
import graduation from "@/assets/me_graduation_ceremony.jpg";
import workstation from "@/assets/work_station.jpg";
import cadet from "@/assets/me_42cadet.jpg";
import { useLanguage } from "@/context/language-context";
import {
  buildPhotoAccurateLowPoly,
  EJECT_SLOTS,
  samplePose,
  smoothstep01,
} from "./serra-da-leba-3d";

export type StageMode = "tech";

type Card = { tag: string; title: string; subtitle: string; image: string; badge: string };

/** Chapter index → photo. Edit here or in YAML (three_card_N_*) to update slides. */
const CARD_IMAGES: Record<number, string | undefined> = {
  1: portrait,          // About — retrato
  2: graduation,        // Origin — cerimónia de formatura
  3: workstation,       // Work — estação de trabalho
  4: cadet,             // Skills — 42 Luanda cadete
};

export default function ThreeHero({ activeChapter = 0 }: { activeChapter?: number }) {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);
  const cardSlotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mobileSlotRef = useRef<HTMLDivElement>(null);
  const mobileCardRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeChapter);
  activeRef.current = activeChapter;

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
    scene.fog = new THREE.FogExp2("#000000", 0.011);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    camera.position.set(0, 0.4, 33);

    // Photo-sampled low-poly Serra da Leba
    const texLoader = new THREE.TextureLoader();
    const lebaTex = texLoader.load(`${import.meta.env.BASE_URL}img/header.jpg`, (tex) => {
      if (tex.image) scene.add(buildPhotoAccurateLowPoly(tex.image as HTMLImageElement));
    });
    lebaTex.colorSpace = THREE.SRGBColorSpace;

    // Mist sprites
    const mistTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,255,255,0.28)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const mists: THREE.Sprite[] = [];
    for (let i = 0; i < 8; i++) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: mistTex,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
          color: "#dfe8e2",
        }),
      );
      s.scale.set(16 + Math.random() * 14, 4.5, 1);
      s.position.set(
        (Math.random() - 0.5) * 34,
        -4 + Math.random() * 10,
        1 + Math.random() * 6,
      );
      scene.add(s);
      mists.push(s);
    }

    // Birds in flight
    const birdMat = new THREE.MeshBasicMaterial({
      color: "#FFFFFF",
      side: THREE.DoubleSide,
      fog: false,
    });
    const wingGeo = new THREE.BufferGeometry();
    wingGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([0, 0, 0.28, 0, 0, -0.28, 0.95, 0, -0.08]),
        3,
      ),
    );
    type Bird = {
      g: THREE.Group;
      l: THREE.Mesh;
      r: THREE.Mesh;
      speed: number;
      flap: number;
      off: number;
      baseY: number;
      amp: number;
      depthPhase: number;
      z0: number;
    };
    const birds: Bird[] = [];
    const COUNT = window.innerWidth < 700 ? 14 : 24;
    for (let i = 0; i < COUNT; i++) {
      const g = new THREE.Group();
      const l = new THREE.Mesh(wingGeo, birdMat);
      const r = new THREE.Mesh(wingGeo, birdMat);
      r.scale.x = -1;
      g.add(l, r);
      g.scale.setScalar(0.45 + Math.random() * 0.65);
      scene.add(g);
      birds.push({
        g,
        l,
        r,
        speed: 1.4 + Math.random() * 1.8,
        flap: 5.5 + Math.random() * 4,
        off: Math.random() * 60,
        baseY: -2 + Math.random() * 9,
        amp: 0.7 + Math.random() * 1.6,
        depthPhase: Math.random() * Math.PI * 2,
        z0: 3 + Math.random() * 12,
      });
    }

    // 3D Rubik rig with 4 ejectable chapter cubies
    const techRig = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.78, 0.78, 0.78);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);
    const darkMat = new THREE.MeshBasicMaterial({ color: "#080a09" });
    const greenEdge = new THREE.LineBasicMaterial({
      color: "#2FBF71",
      transparent: true,
      opacity: 0.92,
    });
    const boneEdge = new THREE.LineBasicMaterial({
      color: "#B8C2BC",
      transparent: true,
      opacity: 0.42,
    });

    type Cubie = {
      g: THREE.Group;
      gx: number;
      gy: number;
      gz: number;
      mats: (THREE.MeshBasicMaterial | THREE.LineBasicMaterial)[];
      baseOpacity: number[];
      eject: number;
    };
    const cubies: Cubie[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const slot = EJECT_SLOTS.findIndex(([a, b, c]) => a === x && b === y && c === z);
          const ejectable = slot !== -1;
          const isAccent =
            ejectable || (x === 1 && y === 1) || (x === -1 && z === 1 && y === 0);
          const bodyMat = ejectable ? darkMat.clone() : darkMat;
          if (ejectable) bodyMat.transparent = true;
          const edgeMat = ejectable
            ? (greenEdge.clone() as THREE.LineBasicMaterial)
            : isAccent
              ? greenEdge
              : boneEdge;
          if (ejectable) edgeMat.opacity = 1;

          const g = new THREE.Group();
          g.add(new THREE.Mesh(boxGeo, bodyMat), new THREE.LineSegments(edgeGeo, edgeMat));
          g.position.set(x * 0.88, y * 0.88, z * 0.88);
          techRig.add(g);
          cubies.push({
            g,
            gx: x,
            gy: y,
            gz: z,
            mats: ejectable ? [bodyMat, edgeMat] : [],
            baseOpacity: ejectable ? [1, edgeMat.opacity] : [],
            eject: ejectable ? slot + 1 : 0,
          });
        }
      }
    }

    const ring1 = new THREE.Mesh(
      new THREE.RingGeometry(2.85, 2.88, 64),
      new THREE.MeshBasicMaterial({
        color: "#2FBF71",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.48,
      }),
    );
    ring1.rotation.x = Math.PI / 2.4;
    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(3.45, 3.47, 64),
      new THREE.MeshBasicMaterial({
        color: "#8A948E",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      }),
    );
    ring2.rotation.y = Math.PI / 3;
    techRig.add(ring1, ring2);
    scene.add(techRig);

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

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    const SPAN = 44;
    let raf = 0;
    let smoothProgress = 0;
    let cachedSlotLeft = 0;
    let cachedSlotTop = 0;
    let cachedSlotW = 300;
    let cachedSlotH = 360;
    let cachedDist = 18;
    let cachedWorldW = 4.2;
    let cachedWorldH = 5.1;
    const ejectState = [0, 0, 0, 0, 0];

    const rigWorldPos = new THREE.Vector3();
    const targetWorld = new THREE.Vector3();
    const targetLocal = new THREE.Vector3();
    const slotPos = new THREE.Vector3();
    const poppedPos = new THREE.Vector3();
    const arcMidPos = new THREE.Vector3();
    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const rigQInv = new THREE.Quaternion();
    const camQ = new THREE.Quaternion();
    const baseQ = new THREE.Quaternion();
    const spinQ = new THREE.Quaternion();
    const faceQ = new THREE.Quaternion();
    const euler = new THREE.Euler();

    const measureSlotDom = () => {
      const desktopSlot = cardSlotRef.current;
      const mobileSlot = mobileSlotRef.current;
      let r = desktopSlot?.getBoundingClientRect();
      if ((!r || r.width === 0) && mobileSlot) {
        r = mobileSlot.getBoundingClientRect();
      }
      if (r && r.width > 0) {
        cachedSlotLeft = r.left;
        cachedSlotTop = r.top;
        cachedSlotW = r.width;
        cachedSlotH = r.height;
      }
    };
    measureSlotDom();
    window.addEventListener("resize", measureSlotDom);

    const updateCardSlotCache = () => {
      measureSlotDom();
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      techRig.getWorldPosition(rigWorldPos);
      cachedDist = camera.position.distanceTo(rigWorldPos);
      const ndcX = ((cachedSlotLeft + cachedSlotW / 2) / vw) * 2 - 1;
      const ndcY = -(((cachedSlotTop + cachedSlotH / 2) / vh) * 2 - 1);
      dir.set(ndcX, ndcY, 0.5).unproject(camera).sub(camera.position).normalize();
      targetWorld.copy(camera.position).addScaledVector(dir, cachedDist);
      const worldPerPx =
        (2 * cachedDist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / vh;
      cachedWorldW = cachedSlotW * worldPerPx;
      cachedWorldH = cachedSlotH * worldPerPx;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = reduced ? 0 : clock.getElapsedTime();
      const vh = window.innerHeight || 1;
      const targetProgress = Math.max(0, Math.min(4, window.scrollY / vh));
      smoothProgress += (targetProgress - smoothProgress) * 0.068;
      const sp = smoothProgress;

      const activeTarget = Math.round(targetProgress);
      const onChapterSlot =
        activeTarget >= 1 &&
        activeTarget <= 4 &&
        Math.abs(targetProgress - activeTarget) < 0.35;

      for (let c = 1; c <= 4; c++) {
        const wantOpen = onChapterSlot && activeTarget === c;
        if (wantOpen) {
          ejectState[c] += (1 - ejectState[c]) * 0.052;
          if (ejectState[c] > 0.999) ejectState[c] = 1;
        } else {
          ejectState[c] += (0 - ejectState[c]) * 0.068;
          if (ejectState[c] < 0.001) ejectState[c] = 0;
        }
      }

      const pose = samplePose(sp);

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      camera.position.set(
        pose.camPos[0] + mouse.x * 1.4 + Math.sin(t * 0.15) * 0.35,
        pose.camPos[1] - mouse.y * 0.9 + Math.cos(t * 0.18) * 0.22,
        pose.camPos[2] + 9,
      );
      camera.lookAt(pose.lookAt[0], pose.lookAt[1], pose.lookAt[2]);
      camera.updateMatrixWorld();

      techRig.position.set(
        pose.rigPos[0] + mouse.x * 0.6,
        pose.rigPos[1] - mouse.y * 0.4 + Math.sin(t * 1.1) * 0.15,
        pose.rigPos[2],
      );
      techRig.rotation.set(
        pose.rigRot[0] + t * 0.15,
        pose.rigRot[1] + t * 0.22,
        pose.rigRot[2],
      );
      techRig.updateMatrixWorld();

      const fract = Math.sin((sp % 1) * Math.PI);
      const expand = 0.88 + fract * 0.36;

      updateCardSlotCache();
      const cardWorldW = cachedWorldW;
      const cardWorldH = cachedWorldH;

      techRig.getWorldQuaternion(rigQInv).invert();
      camera.getWorldQuaternion(camQ);
      faceQ.copy(rigQInv).multiply(camQ);

      let activeE = 0;
      let displayChapter = activeRef.current;
      for (let c = 1; c <= 4; c++) {
        if (ejectState[c] > activeE) {
          activeE = ejectState[c];
          displayChapter = c;
        }
      }

      for (const c of cubies) {
        slotPos.set(c.gx * expand, c.gy * expand, c.gz * expand);
        euler.set(0, c.gy === 1 ? sp * 1.5 : 0, 0);
        baseQ.setFromEuler(euler);

        const e = c.eject ? ejectState[c.eject] : 0;

        if (e <= 0.001) {
          c.g.position.copy(slotPos);
          c.g.scale.set(1, 1, 1);
          c.g.quaternion.copy(baseQ);
          c.mats.forEach((m, i) => (m.opacity = c.baseOpacity[i]));
          continue;
        }

        const out = smoothstep01(0, 0.35, e);
        const fly = smoothstep01(0.18, 0.88, e);
        const unfold = smoothstep01(0.62, 0.96, e);

        targetLocal.copy(targetWorld);
        techRig.worldToLocal(targetLocal);

        poppedPos.copy(slotPos).multiplyScalar(1 + 1.35 * out);
        arcMidPos.addVectors(poppedPos, targetLocal).multiplyScalar(0.5);
        arcMidPos.y += 1.4;
        arcMidPos.z += 2.6;

        pA.lerpVectors(poppedPos, arcMidPos, fly);
        pB.lerpVectors(arcMidPos, targetLocal, fly);
        c.g.position.lerpVectors(pA, pB, fly);

        const midSpin = Math.sin(fly * Math.PI);
        euler.set(midSpin * 1.1, midSpin * Math.PI * 0.85, midSpin * 0.5);
        spinQ.setFromEuler(euler);
        c.g.quaternion.copy(baseQ).slerp(faceQ, fly).multiply(spinQ);

        const sx = THREE.MathUtils.lerp(1, Math.max(1, cardWorldW / 0.78), unfold);
        const sy = THREE.MathUtils.lerp(1, Math.max(1, cardWorldH / 0.78), unfold);
        const sz = THREE.MathUtils.lerp(1, 0.12, unfold);
        c.g.scale.set(sx, sy, sz);

        const fade = 1 - smoothstep01(0.84, 0.99, e);
        c.mats.forEach((m, i) => (m.opacity = c.baseOpacity[i] * fade));
      }

      ring1.rotation.z = t * 0.3;
      ring2.rotation.x = -t * 0.2;

      const k = smoothstep01(0.78, 0.98, activeE);
      const applyCardTransform = (el: HTMLDivElement | null, isCompact: boolean) => {
        if (!el) return;
        el.style.opacity = String(k);
        el.style.transform = isCompact
          ? `perspective(700px) rotateX(${(1 - k) * 18}deg) scale(${0.78 + 0.22 * k})`
          : `perspective(900px) rotateY(${(1 - k) * -18}deg) scale(${0.72 + 0.28 * k})`;
        el.style.visibility = k < 0.005 ? "hidden" : "visible";
        if (el.dataset.chapter !== String(displayChapter)) {
          el.dataset.chapter = String(displayChapter);
        }
      };
      applyCardTransform(cardRef.current, false);
      applyCardTransform(mobileCardRef.current, true);

      mists.forEach((s, i) => {
        s.position.x += 0.008 + (i % 3) * 0.003;
        if (s.position.x > 22) s.position.x = -22;
      });

      birds.forEach((b) => {
        const p = (b.off + t * b.speed) % SPAN;
        const x = p - SPAN / 2;
        const z = b.z0 + Math.sin(t * 0.45 + b.depthPhase) * 5.5;
        const y = b.baseY + Math.sin(t * 0.7 + b.depthPhase) * b.amp;
        b.g.position.set(x, y, z);
        b.g.rotation.y = -Math.PI / 2 + Math.cos(t * 0.45 + b.depthPhase) * 0.35;
        b.g.rotation.z = Math.sin(t * 0.7 + b.depthPhase) * 0.12;
        const f = Math.sin(t * b.flap + b.depthPhase) * 0.75;
        b.l.rotation.z = f;
        b.r.rotation.z = -f;
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measureSlotDom);
      lebaTex.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const lastChapterRef = useRef<number>(1);
  if (activeChapter >= 1 && activeChapter <= 4) {
    lastChapterRef.current = activeChapter;
  }
  const effectiveChapter =
    activeChapter >= 1 && activeChapter <= 4 ? activeChapter : lastChapterRef.current;
  const cardImage = CARD_IMAGES[effectiveChapter];
  const activeCard: Card | undefined = cardImage
    ? {
        tag: t(`three_card_${effectiveChapter}_tag`),
        title: t(`three_card_${effectiveChapter}_title`),
        subtitle: t(`three_card_${effectiveChapter}_subtitle`),
        badge: t(`three_card_${effectiveChapter}_badge`),
        image: cardImage,
      }
    : undefined;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden bg-black"
    >
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle landmark caption */}
      <p className="font-mono-code absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.25em] text-white/45 sm:bottom-6 sm:text-[10px] sm:tracking-[0.3em]">
        Serra da Leba · Huíla, Angola
      </p>

      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/85 via-black/55 to-transparent md:w-3/5" />

      {/* Mobile Compact Ejected Card Slot */}
      <div
        ref={mobileSlotRef}
        className="absolute bottom-11 right-4 left-4 z-10 h-[4.75rem] sm:left-auto sm:w-80 lg:hidden"
      >
        <div
          ref={mobileCardRef}
          className="flex h-full w-full items-center gap-3 rounded-2xl border border-white/15 bg-black/85 p-2.5 backdrop-blur-md"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          {activeCard && (
            <>
              <img
                src={activeCard.image}
                alt={activeCard.title}
                className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover object-[50%_20%]"
                style={{ filter: "grayscale(0.3) contrast(1.06)" }}
              />
              <div className="min-w-0 flex-1">
                <span className="font-mono-code inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-moss">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                  {activeCard.badge}
                </span>
                <p className="font-display truncate text-xs font-semibold text-white sm:text-sm">
                  {activeCard.title}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {activeCard.subtitle}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Right-hand card slot */}
      <div className="absolute inset-y-0 right-8 z-10 hidden items-center lg:flex xl:right-16">
        <div ref={cardSlotRef} className="relative h-[22rem] w-72 xl:w-80">
          <div
            ref={cardRef}
            className="absolute inset-0 overflow-hidden rounded-2xl border border-white/15 bg-black/85 p-3 backdrop-blur-md"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {activeCard && (
              <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-black">
                <img
                  src={activeCard.image}
                  alt={activeCard.title}
                  className="h-full w-full object-cover object-[50%_22%]"
                  style={{ filter: "grayscale(0.55) contrast(1.08) brightness(0.95)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="font-mono-code absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-input bg-black/75 px-2.5 py-1 text-[9px] uppercase tracking-widest text-foreground backdrop-blur">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                  {activeCard.badge}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-mono-code text-[10px] uppercase tracking-widest text-moss">
                    {activeCard.tag}
                  </p>
                  <p className="font-display mt-0.5 text-sm font-semibold text-foreground">
                    {activeCard.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{activeCard.subtitle}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
