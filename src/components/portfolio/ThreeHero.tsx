import { useEffect, useRef } from "react";
import * as THREE from "three";
import portrait from "@/assets/vivaldo-portrait.jpg";
import { useLanguage } from "../../context/language-context";

export type StageMode = "tech";

type Pose = {
  camPos: [number, number, number];
  lookAt: [number, number, number];
  rigPos: [number, number, number];
  rigRot: [number, number, number];
};

// 5 camera keyframes across Hero + 4 Chapters
// On chapters 1..4 the central Rubik rig sits in the center-mid gap (between left text and right card)
// so the ejected cubie has a clear, visible 3D flight path from the cube to the right card!
const POSES: Pose[] = [
  {
    camPos: [0, 0.4, 24],
    lookAt: [0, 0.2, 0],
    rigPos: [5.4, 0.8, 12],
    rigRot: [0.35, -0.55, 0.12],
  },
  {
    camPos: [-3.2, 2.2, 18.5],
    lookAt: [-1.4, 1.5, 0],
    rigPos: [-0.4, 1.9, 8.8],
    rigRot: [0.55, 0.75, -0.18],
  },
  {
    camPos: [2.8, -0.8, 16.5],
    lookAt: [0.8, -1.1, 0],
    rigPos: [1.3, -0.6, 7.4],
    rigRot: [-0.35, 1.45, 0.25],
  },
  {
    camPos: [-1.8, -1.9, 17.5],
    lookAt: [-0.4, -1.5, 0],
    rigPos: [-0.1, -1.4, 8.2],
    rigRot: [0.22, -1.1, -0.12],
  },
  {
    camPos: [0, 1.6, 22],
    lookAt: [0, 0, 0],
    rigPos: [0.6, 1.2, 11],
    rigRot: [0.7, 2.2, 0.3],
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

function samplePose(progress: number): Pose {
  const clamped = Math.max(0, Math.min(POSES.length - 1, progress));
  const idx = Math.min(POSES.length - 2, Math.floor(clamped));
  const k = smooth(clamped - idx);
  const a = POSES[idx];
  const b = POSES[idx + 1];
  return {
    camPos: [lerp(a.camPos[0], b.camPos[0], k), lerp(a.camPos[1], b.camPos[1], k), lerp(a.camPos[2], b.camPos[2], k)],
    lookAt: [lerp(a.lookAt[0], b.lookAt[0], k), lerp(a.lookAt[1], b.lookAt[1], k), lerp(a.lookAt[2], b.lookAt[2], k)],
    rigPos: [lerp(a.rigPos[0], b.rigPos[0], k), lerp(a.rigPos[1], b.rigPos[1], k), lerp(a.rigPos[2], b.rigPos[2], k)],
    rigRot: [lerp(a.rigRot[0], b.rigRot[0], k), lerp(a.rigRot[1], b.rigRot[1], k), lerp(a.rigRot[2], b.rigRot[2], k)],
  };
}

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Anatomical 2.5D relief of `/img/header.jpg` (Serra da Leba)
function serraRelief(u: number, v: number): number {
  const x = (u - 0.5) * 46;
  const y = (v - 0.5) * 30;
  // Iconic vertical cliff promontory (center-left)
  const cliff = Math.exp(-Math.pow((x + 3.2) / 9.5, 2) - Math.pow((y - 2.4) / 6.2, 2)) * 3.8;
  // Right mountain massif
  const rightMassif = Math.exp(-Math.pow((x - 13) / 13, 2) - Math.pow((y - 0.5) / 8, 2)) * 3.1;
  // Foreground rocky viewpoint at bottom-right
  const fgRocks = Math.max(0, (u - 0.52) * 2.2) * Math.max(0, (0.48 - v) * 2.4) * 3.5;
  // Distant left plateau (Chela escarpment)
  const farLeft = Math.exp(-Math.pow((x + 17) / 8, 2) - Math.pow((y - 0.8) / 4, 2)) * 1.6;
  // Sky recedes into the background
  const skyMask = v > 0.68 ? Math.max(0.15, 1 - (v - 0.68) * 2.8) : 1;
  return (cliff + rightMassif + fgRocks + farLeft) * skyMask;
}

/**
 * Builds a high-detail Delaunay-like triangulated low-poly mesh directly from the real
 * Serra da Leba photograph (`img`), sampling every triangle's true pixels (sky, clouds,
 * vertical rock striations, forest canopy, hairpin walls, and waterfall chutes) and
 * mapping them into a harmonized palette of blacks, charcoals, slates, and emerald greens.
 */
function buildPhotoAccurateLowPoly(img: HTMLImageElement): THREE.Group {
  const group = new THREE.Group();
  group.position.set(4.5, -0.5, -2);

  const cw = 360;
  const ch = 240;
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, cw, ch);
  const pixels = ctx.getImageData(0, 0, cw, ch).data;

  const sampleRGB = (u: number, v: number): [number, number, number] => {
    const px = Math.max(0, Math.min(cw - 1, Math.floor(u * cw)));
    const py = Math.max(0, Math.min(ch - 1, Math.floor((1 - v) * ch)));
    const idx = (py * cw + px) * 4;
    return [pixels[idx] / 255, pixels[idx + 1] / 255, pixels[idx + 2] / 255];
  };

  // High-density triangulation (88 x 58 = 10,208 triangles) so clouds, cliff faces, road walls,
  // and rock gullies from the real photo are unmistakably recognizable
  const cols = 88;
  const rows = 58;
  const W = 46;
  const H = 30;
  const geo = new THREE.PlaneGeometry(W, H, cols, rows);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const col = i % (cols + 1);
    const row = Math.floor(i / (cols + 1));
    let x = pos.getX(i);
    let y = pos.getY(i);
    if (col > 0 && col < cols && row > 0 && row < rows) {
      x += (hash(i * 3.7) - 0.5) * (W / cols) * 0.68;
      y += (hash(i * 7.9) - 0.5) * (H / rows) * 0.68;
      pos.setX(i, x);
      pos.setY(i, y);
    }
    const u = Math.max(0, Math.min(1, x / W + 0.5));
    const v = Math.max(0, Math.min(1, y / H + 0.5));
    const [r, g, b] = sampleRGB(u, v);
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    // Extra micro-relief from real photo luminance on rock faces & clouds
    const z = serraRelief(u, v) + (luma - 0.4) * 0.65 + (hash(i * 13.3) - 0.5) * 0.22;
    pos.setZ(i, z);
  }

  const nonIdx = geo.toNonIndexed();
  nonIdx.computeVertexNormals();
  const nPos = nonIdx.attributes.position;
  const nNorm = nonIdx.attributes.normal;
  const colors = new Float32Array(nPos.count * 3);

  const lightDir = new THREE.Vector3(-0.3, 0.6, 0.74).normalize();
  const edgePositions: number[] = [];
  const greenEdgePositions: number[] = [];

  for (let i = 0; i < nPos.count; i += 3) {
    const x0 = nPos.getX(i), y0 = nPos.getY(i), z0 = nPos.getZ(i);
    const x1 = nPos.getX(i + 1), y1 = nPos.getY(i + 1), z1 = nPos.getZ(i + 1);
    const x2 = nPos.getX(i + 2), y2 = nPos.getY(i + 2), z2 = nPos.getZ(i + 2);

    const cx = (x0 + x1 + x2) / 3;
    const cy = (y0 + y1 + y2) / 3;
    const u = Math.max(0, Math.min(1, cx / W + 0.5));
    const v = Math.max(0, Math.min(1, cy / H + 0.5));

    // Multi-point supersampling inside the triangle for accurate feature detection
    const [r0, g0, b0] = sampleRGB(u, v);
    const [r1, g1, b1] = sampleRGB(Math.min(1, u + 0.004), v);
    const [r2, g2, b2] = sampleRGB(u, Math.min(1, v + 0.004));
    const r = (r0 + r1 + r2) / 3;
    const g = (g0 + g1 + g2) / 3;
    const b = (b0 + b1 + b2) / 3;

    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC > 0.01 ? (maxC - minC) / maxC : 0;

    const nx = nNorm.getX(i);
    const ny = nNorm.getY(i);
    const nz = nNorm.getZ(i);
    const shade = 0.75 + 0.35 * Math.max(0, nx * lightDir.x + ny * lightDir.y + nz * lightDir.z);

    // Feature classification directly from real Serra da Leba photo pixels:
    const isSkyZone = v > 0.62 && b > r * 1.15;
    const isCloud = isSkyZone && luma > 0.56 && sat < 0.42;
    // Sunlit tan rock (r >= g) vs. green vegetation (g > r): this separation is what makes the
    // iconic vertical cliff + hairpin walls pop as bright silver against a very dark forest
    const isRockOrRoadWall = !isSkyZone && r >= g * 1.04 && r > b * 1.15 && luma > 0.22;
    const isLushVegetation = !isSkyZone && !isRockOrRoadWall;

    let fr = 0, fg = 0, fb = 0;

    if (isCloud) {
      const cloudIntensity = THREE.MathUtils.clamp((luma - 0.5) * 2.1, 0.2, 1);
      fr = (0.16 + cloudIntensity * 0.4) * shade;
      fg = (0.19 + cloudIntensity * 0.45) * shade;
      fb = (0.18 + cloudIntensity * 0.42) * shade;
    } else if (isSkyZone) {
      const horizonGlow = Math.pow(Math.max(0, 1 - (v - 0.58) / 0.42), 1.5);
      fr = 0.008 + horizonGlow * 0.03;
      fg = 0.012 + horizonGlow * 0.07;
      fb = 0.012 + horizonGlow * 0.05;
    } else if (isRockOrRoadWall) {
      // Bright silver-gray cliff & retaining walls (highest contrast element of the scene)
      const rockBright = Math.pow(luma, 0.8) * shade;
      fr = 0.12 + rockBright * 0.7;
      fg = 0.14 + rockBright * 0.76;
      fb = 0.13 + rockBright * 0.72;
    } else if (isLushVegetation) {
      // Very dark emerald forest so rock + road dominate the silhouette
      const canopy = Math.pow(luma, 1.1) * shade;
      fr = 0.008 + canopy * 0.05;
      fg = 0.03 + canopy * 0.24;
      fb = 0.018 + canopy * 0.11;
    } else {
      // Distant Chela plateau on the far left (misty slate-emerald)
      fr = 0.06 + luma * 0.24;
      fg = 0.1 + luma * 0.32;
      fb = 0.09 + luma * 0.27;
    }

    // Subtle facet-to-facet crystal contrast so individual low-poly triangles catch the eye
    const facetBoost = 0.92 + hash(i * 5.3) * 0.18;
    // Edge vignette: the landscape melts into the pure-black backdrop at its borders
    const edgeD = Math.max(Math.abs(u - 0.5) * 2, Math.abs(v - 0.5) * 2.1);
    const edgeFade = 1 - THREE.MathUtils.smoothstep(edgeD, 0.72, 1.0);
    const k2 = facetBoost * edgeFade;
    fr = Math.min(1, fr * k2);
    fg = Math.min(1, fg * k2);
    fb = Math.min(1, fb * k2);

    for (let k = 0; k < 3; k++) {
      colors[(i + k) * 3] = fr;
      colors[(i + k) * 3 + 1] = fg;
      colors[(i + k) * 3 + 2] = fb;
    }

    // Collect vector wireframe edges (stronger on cliff rock, clouds & switchbacks)
    const zLift = 0.035;
    const targetArr = isRockOrRoadWall && luma > 0.38 ? greenEdgePositions : edgePositions;
    targetArr.push(
      x0, y0, z0 + zLift, x1, y1, z1 + zLift,
      x1, y1, z1 + zLift, x2, y2, z2 + zLift,
      x2, y2, z2 + zLift, x0, y0, z0 + zLift,
    );
  }

  nonIdx.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mesh = new THREE.Mesh(
    nonIdx,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }),
  );
  group.add(mesh);

  // Subtle vector triangle mesh across the entire landscape (sky, clouds, mountain)
  const grayWireGeo = new THREE.BufferGeometry();
  grayWireGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
  const grayWire = new THREE.LineSegments(
    grayWireGeo,
    new THREE.LineBasicMaterial({ color: "#38423d", transparent: true, opacity: 0.24 }),
  );
  group.add(grayWire);

  // Emerald vector wireframe highlights on the cliff face & hairpin retaining walls
  const greenWireGeo = new THREE.BufferGeometry();
  greenWireGeo.setAttribute("position", new THREE.Float32BufferAttribute(greenEdgePositions, 3));
  const greenWire = new THREE.LineSegments(
    greenWireGeo,
    new THREE.LineBasicMaterial({ color: "#2FBF71", transparent: true, opacity: 0.36 }),
  );
  group.add(greenWire);

  // =========================================================================
  // EXACT VECTORIZED SERRA DA LEBA ROAD + WATERFALL CHUTES + 3D LOW-POLY CLOUDS
  // =========================================================================
  const uvToWorld = (u: number, v: number, zOff = 0.22) => {
    const x = (u - 0.5) * W;
    const y = (v - 0.5) * H;
    const z = serraRelief(u, v) + zOff;
    return new THREE.Vector3(x, y, z);
  };

  // Exact UV coordinates traced from `/img/header.jpg` of the Serra da Leba hairpin road!
  const roadUVs: [number, number][] = [
    [0.93, 0.565], // top-right pass entry
    [0.88, 0.525],
    [0.64, 0.495],
    [0.425, 0.482], // upper bridge & loop 1 (left)
    [0.655, 0.452], // loop 2 (right)
    [0.342, 0.415], // loop 3 (stone wall left)
    [0.685, 0.365], // loop 4 (far right hairpin turn)
    [0.265, 0.312], // loop 5 (wide left hairpin turn)
    [0.59, 0.27],   // loop 6 (mid-right turn)
    [0.445, 0.245], // mid-left inflection
    [0.688, 0.198], // lower-right bus hairpin turn
    [0.43, 0.21],   // lower sweep
    [0.16, 0.045],  // bottom-left exit into the valley
  ];

  const roadCurve = new THREE.CatmullRomCurve3(
    roadUVs.map(([u, v]) => uvToWorld(u, v, 0.32)),
    false,
    "centripetal",
    0.18,
  );
  const roadPts = roadCurve.getPoints(240);

  // Primary road as a bright emerald RIBBON (clearly visible, unlike a 1px line) + soft glow underlay
  const buildRibbon = (pts: THREE.Vector3[], halfW: number, color: string, opacity: number) => {
    const verts: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[Math.min(pts.length - 1, i + 1)];
      const o = pts[Math.max(0, i - 1)];
      const tx = q.x - o.x;
      const ty = q.y - o.y;
      const len = Math.hypot(tx, ty) || 1;
      const nx = -ty / len;
      const ny = tx / len;
      verts.push(p.x + nx * halfW, p.y + ny * halfW, p.z, p.x - nx * halfW, p.y - ny * halfW, p.z);
      if (i < pts.length - 1) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(idx);
    return new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }),
    );
  };
  group.add(buildRibbon(roadPts.map((p) => new THREE.Vector3(p.x, p.y, p.z - 0.01)), 0.42, "#2FBF71", 0.16));
  group.add(buildRibbon(roadPts, 0.14, "#2FBF71", 0.95));

  // Primary glowing emerald vector line for the iconic road
  const roadLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(roadPts),
    new THREE.LineBasicMaterial({ color: "#7DFFB5", transparent: true, opacity: 0.9 }),
  );
  group.add(roadLine);

  // Secondary parallel guardrail vector line in crisp silver-gray (stone retaining walls)
  const wallPts = roadPts.map((p) => new THREE.Vector3(p.x, p.y - 0.17, p.z - 0.03));
  const wallLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(wallPts),
    new THREE.LineBasicMaterial({ color: "#B8C4BC", transparent: true, opacity: 0.55 }),
  );
  group.add(wallLine);

  // Twin rock waterfall chutes on the right of the hairpin road (visible in /img/header.jpg at u~0.70..0.85)
  const chute1 = new THREE.CatmullRomCurve3([
    uvToWorld(0.705, 0.49, 0.28),
    uvToWorld(0.745, 0.41, 0.28),
    uvToWorld(0.795, 0.31, 0.28),
    uvToWorld(0.845, 0.23, 0.28),
  ]).getPoints(50);
  const chute2 = new THREE.CatmullRomCurve3([
    uvToWorld(0.725, 0.485, 0.28),
    uvToWorld(0.768, 0.4, 0.28),
    uvToWorld(0.82, 0.3, 0.28),
    uvToWorld(0.87, 0.22, 0.28),
  ]).getPoints(50);
  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(chute1),
      new THREE.LineBasicMaterial({ color: "#7F8F85", transparent: true, opacity: 0.45 }),
    ),
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(chute2),
      new THREE.LineBasicMaterial({ color: "#2FBF71", transparent: true, opacity: 0.35 }),
    ),
  );

  // 3D Low-Poly Geometric Clouds floating in the sky at the exact cloud positions of /img/header.jpg
  const cloudSpots: [number, number, number, number][] = [
    [-16.5, 5.2, 0.4, 1.35],
    [-12.2, 6.4, 0.7, 1.65],
    [-7.8, 7.1, 0.5, 1.25],
    [1.8, 7.8, 0.6, 1.55],
    [6.4, 7.4, 0.8, 1.85],
    [11.2, 7.9, 0.5, 1.35],
  ];
  const cloudFillMat = new THREE.MeshBasicMaterial({
    color: "#1c221f",
    transparent: true,
    opacity: 0.72,
  });
  const cloudWireMat = new THREE.LineBasicMaterial({
    color: "#5b6b62",
    transparent: true,
    opacity: 0.42,
  });

  cloudSpots.forEach(([cx, cy, cz, sc], idx) => {
    const cGeo = new THREE.IcosahedronGeometry(1.4 * sc, 1);
    cGeo.scale(2.1, 0.55, 0.7);
    const cPos = cGeo.attributes.position;
    for (let k = 0; k < cPos.count; k++) {
      cPos.setX(k, cPos.getX(k) + (hash(k * 3.1 + idx) - 0.5) * 0.35);
      cPos.setY(k, cPos.getY(k) + (hash(k * 7.7 + idx) - 0.5) * 0.18);
    }
    cGeo.computeVertexNormals();
    const cMesh = new THREE.Mesh(cGeo, cloudFillMat);
    const cEdges = new THREE.LineSegments(new THREE.EdgesGeometry(cGeo, 12), cloudWireMat);
    const cGroup = new THREE.Group();
    cGroup.add(cMesh, cEdges);
    cGroup.position.set(cx, cy, cz);
    group.add(cGroup);
  });

  return group;
}

const smoothstep01 = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Ejection amount of the cubie that becomes the info card of chapter `c`.
 * 0 while the cube transforms alone, 1 when chapter `c` is settled on screen.
 * Ramps up over the 0.6 scroll-units before the chapter and back down over the 0.6 after it,
 * so between two chapters the card has always folded back into the cube.
 */
const ejectAmount = (sp: number, c: number) =>
  smoothstep01(c - 0.6, c, sp) * (1 - smoothstep01(c, c + 0.6, sp));

// Which cube slots (gx, gy, gz) become the card of chapter 1..4
const EJECT_SLOTS: [number, number, number][] = [
  [1, 1, 1],
  [1, 0, 1],
  [1, -1, 1],
  [1, 1, -1],
];

type Card = { tag: string; title: string; subtitle: string; image: string; badge: string };

const CARD_IMAGES: Record<number, string | undefined> = {
  1: portrait,
  2: "/img/works/vivacubesolver.jpg",
  3: "/img/works/cfoptrainer.png",
  4: "/img/works/flutter_web_ecommerce_1.png",
};

export default function ThreeHero({ activeChapter = 0 }: { activeChapter?: number }) {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);
  const cardSlotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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
    const lebaTex = texLoader.load("/img/header.jpg", (tex) => {
      if (tex.image) scene.add(buildPhotoAccurateLowPoly(tex.image as HTMLImageElement));
    });
    lebaTex.colorSpace = THREE.SRGBColorSpace;

    // Mist
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
        new THREE.SpriteMaterial({ map: mistTex, transparent: true, opacity: 0.16, depthWrite: false, color: "#dfe8e2" }),
      );
      s.scale.set(16 + Math.random() * 14, 4.5, 1);
      s.position.set((Math.random() - 0.5) * 34, -4 + Math.random() * 10, 1 + Math.random() * 6);
      scene.add(s);
      mists.push(s);
    }

    // Birds (white)
    const birdMat = new THREE.MeshBasicMaterial({ color: "#FFFFFF", side: THREE.DoubleSide, fog: false });
    const wingGeo = new THREE.BufferGeometry();
    wingGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0.28, 0, 0, -0.28, 0.95, 0, -0.08]), 3),
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

    // =========================================================================
    // 3D Rubik rig. Four of its cubies are "ejectable": they leave the cube, fly to the
    // right-hand card slot, flatten into the card, and fold back in on the next scroll.
    // =========================================================================
    const techRig = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.78, 0.78, 0.78);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);
    const darkMat = new THREE.MeshBasicMaterial({ color: "#080a09" });
    const greenEdge = new THREE.LineBasicMaterial({ color: "#2FBF71", transparent: true, opacity: 0.92 });
    const boneEdge = new THREE.LineBasicMaterial({ color: "#B8C2BC", transparent: true, opacity: 0.42 });

    type Cubie = {
      g: THREE.Group;
      gx: number;
      gy: number;
      gz: number;
      mats: (THREE.MeshBasicMaterial | THREE.LineBasicMaterial)[];
      baseOpacity: number[];
      eject: number; // chapter index it serves, or 0
    };
    const cubies: Cubie[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const slot = EJECT_SLOTS.findIndex(([a, b, c]) => a === x && b === y && c === z);
          const ejectable = slot !== -1;
          const isAccent = ejectable || (x === 1 && y === 1) || (x === -1 && z === 1 && y === 0);
          const bodyMat = ejectable ? darkMat.clone() : darkMat;
          if (ejectable) {
            bodyMat.transparent = true;
          }
          const edgeMat = ejectable
            ? (greenEdge.clone() as THREE.LineBasicMaterial)
            : isAccent
              ? greenEdge
              : boneEdge;
          if (ejectable) {
            edgeMat.opacity = 1;
          }
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
      new THREE.MeshBasicMaterial({ color: "#2FBF71", side: THREE.DoubleSide, transparent: true, opacity: 0.48 }),
    );
    ring1.rotation.x = Math.PI / 2.4;
    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(3.45, 3.47, 64),
      new THREE.MeshBasicMaterial({ color: "#8A948E", side: THREE.DoubleSide, transparent: true, opacity: 0.25 }),
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
    // Separate per-chapter ejection states [0..1] for chapters 1..4
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
      const slot = cardSlotRef.current;
      if (slot) {
        const r = slot.getBoundingClientRect();
        cachedSlotLeft = r.left;
        cachedSlotTop = r.top;
        cachedSlotW = r.width || 300;
        cachedSlotH = r.height || 360;
      }
    };
    measureSlotDom();
    window.addEventListener("resize", measureSlotDom);

    const updateCardSlotCache = () => {
      if (cachedSlotW <= 0) measureSlotDom();
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      techRig.getWorldPosition(rigWorldPos);
      cachedDist = camera.position.distanceTo(rigWorldPos);
      const ndcX = ((cachedSlotLeft + cachedSlotW / 2) / vw) * 2 - 1;
      const ndcY = -(((cachedSlotTop + cachedSlotH / 2) / vh) * 2 - 1);
      dir.set(ndcX, ndcY, 0.5).unproject(camera).sub(camera.position).normalize();
      targetWorld.copy(camera.position).addScaledVector(dir, cachedDist);
      const worldPerPx = (2 * cachedDist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / vh;
      cachedWorldW = cachedSlotW * worldPerPx;
      cachedWorldH = cachedSlotH * worldPerPx;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = reduced ? 0 : clock.getElapsedTime();
      const vh = window.innerHeight || 1;
      const targetProgress = Math.max(0, Math.min(4, window.scrollY / vh));
      // Responsive camera & cube travel with zero initial pause
      smoothProgress += (targetProgress - smoothProgress) * 0.068;
      const sp = smoothProgress;

      // Trigger cubie flight IMMEDIATELY as soon as the user scrolls toward a chapter
      // (no waiting for smoothProgress to catch up first — eliminates the "stutter/delay" feeling!)
      const activeTarget = Math.round(targetProgress);
      const onChapterSlot = activeTarget >= 1 && activeTarget <= 4 && Math.abs(targetProgress - activeTarget) < 0.35;

      for (let c = 1; c <= 4; c++) {
        const wantOpen = onChapterSlot && activeTarget === c;
        if (wantOpen) {
          // Starts flying out immediately while the central cube is rotating into place
          ejectState[c] += (1 - ejectState[c]) * 0.052;
          if (ejectState[c] > 0.999) ejectState[c] = 1;
        } else {
          // Retracts immediately and smoothly back into the central cube as soon as you scroll away
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
      techRig.rotation.set(pose.rigRot[0] + t * 0.15, pose.rigRot[1] + t * 0.22, pose.rigRot[2]);
      techRig.updateMatrixWorld();

      // The cube "breathes" between chapters
      const fract = Math.sin((sp % 1) * Math.PI);
      const expand = 0.88 + fract * 0.36;

      // Recompute world target position of the right-hand card slot at the current camera & rig pose
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

        // Phase 1 (e: 0 -> 0.35): unlatch & pop outward from the cube socket along its radial normal
        // Phase 2 (e: 0.20 -> 0.88): travel along a curved 3D parabolic arc toward the right card slot while tumbling
        // Phase 3 (e: 0.65 -> 1.00): unfold from a 3D cubie into the flat card frame and crossfade to the HTML card
        const out = smoothstep01(0, 0.35, e);
        const fly = smoothstep01(0.18, 0.88, e);
        const unfold = smoothstep01(0.62, 0.96, e);

        targetLocal.copy(targetWorld);
        techRig.worldToLocal(targetLocal);

        poppedPos.copy(slotPos).multiplyScalar(1 + 1.35 * out);
        // Parabolic midpoint bowed toward the camera (+Z) and slightly upward (+Y) so the cubie's journey is clearly seen
        arcMidPos
          .addVectors(poppedPos, targetLocal)
          .multiplyScalar(0.5);
        arcMidPos.y += 1.4;
        arcMidPos.z += 2.6;

        // Quadratic Bezier interpolation: poppedPos -> arcMidPos -> targetLocal
        pA.lerpVectors(poppedPos, arcMidPos, fly);
        pB.lerpVectors(arcMidPos, targetLocal, fly);
        c.g.position.lerpVectors(pA, pB, fly);

        // Add a graceful 3D showcase spin during mid-flight before aligning flat with the camera
        const midSpin = Math.sin(fly * Math.PI);
        euler.set(midSpin * 1.1, midSpin * Math.PI * 0.85, midSpin * 0.5);
        spinQ.setFromEuler(euler);
        c.g.quaternion.copy(baseQ).slerp(faceQ, fly).multiply(spinQ);

        const sx = THREE.MathUtils.lerp(1, Math.max(1, cardWorldW / 0.78), unfold);
        const sy = THREE.MathUtils.lerp(1, Math.max(1, cardWorldH / 0.78), unfold);
        const sz = THREE.MathUtils.lerp(1, 0.12, unfold);
        c.g.scale.set(sx, sy, sz);

        // Keep the green wireframe cubie 100% visible throughout its entire flight and unfold,
        // only fading out in the final 15% as the HTML card content materializes inside it
        const fade = 1 - smoothstep01(0.84, 0.99, e);
        c.mats.forEach((m, i) => (m.opacity = c.baseOpacity[i] * fade));
      }

      // Non-ejected cubies keep the cube-wide transformation; rings spin
      ring1.rotation.z = t * 0.3;
      ring2.rotation.x = -t * 0.2;

      // HTML card: materializes inside the unfolded cubie frame at the end of its flight,
      // and dematerializes immediately back into the 3D cubie as soon as scrolling begins
      const card = cardRef.current;
      if (card) {
        const k = smoothstep01(0.78, 0.98, activeE);
        card.style.opacity = String(k);
        card.style.transform = `perspective(900px) rotateY(${(1 - k) * -18}deg) scale(${0.72 + 0.28 * k})`;
        card.style.visibility = k < 0.005 ? "hidden" : "visible";
        if (card.dataset.chapter !== String(displayChapter)) {
          card.dataset.chapter = String(displayChapter);
        }
      }

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

  const cardImage = CARD_IMAGES[activeChapter];
  const activeCard: Card | undefined = cardImage
    ? {
        tag: t(`three_card_${activeChapter}_tag`),
        title: t(`three_card_${activeChapter}_title`),
        subtitle: t(`three_card_${activeChapter}_subtitle`),
        badge: t(`three_card_${activeChapter}_badge`),
        image: cardImage,
      }
    : undefined;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden bg-black">
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle landmark caption */}
      <p className="font-mono-code absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.25em] text-white/45 sm:bottom-6 sm:text-[10px] sm:tracking-[0.3em]">
        Serra da Leba · Huíla, Angola
      </p>

      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/85 via-black/55 to-transparent md:w-3/5" />

      {/* Mobile Compact Ejected Card (bottom-right above caption on phones/tablets < lg) */}
      {activeCard && (
        <div className="absolute bottom-11 right-4 left-4 z-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/85 p-2.5 backdrop-blur-md sm:left-auto sm:w-80 lg:hidden">
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
            <p className="truncate text-[11px] text-muted-foreground">{activeCard.subtitle}</p>
          </div>
        </div>
      )}

      {/* Desktop Right-hand card slot: the ejected cubie flies here and the card takes over */}
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
                  <p className="font-mono-code text-[10px] uppercase tracking-widest text-moss">{activeCard.tag}</p>
                  <p className="font-display mt-0.5 text-sm font-semibold text-foreground">{activeCard.title}</p>
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

