import * as THREE from "three";

export type Pose = {
  camPos: [number, number, number];
  lookAt: [number, number, number];
  rigPos: [number, number, number];
  rigRot: [number, number, number];
};

// 5 camera keyframes across Hero + 4 Chapters
export const POSES: Pose[] = [
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

// Which cube slots (gx, gy, gz) become the card of chapter 1..4
export const EJECT_SLOTS: [number, number, number][] = [
  [1, 1, 1],
  [1, 0, 1],
  [1, -1, 1],
  [1, 1, -1],
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export const smoothstep01 = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function samplePose(progress: number): Pose {
  const clamped = Math.max(0, Math.min(POSES.length - 1, progress));
  const idx = Math.min(POSES.length - 2, Math.floor(clamped));
  const k = smooth(clamped - idx);
  const a = POSES[idx];
  const b = POSES[idx + 1];
  return {
    camPos: [
      lerp(a.camPos[0], b.camPos[0], k),
      lerp(a.camPos[1], b.camPos[1], k),
      lerp(a.camPos[2], b.camPos[2], k),
    ],
    lookAt: [
      lerp(a.lookAt[0], b.lookAt[0], k),
      lerp(a.lookAt[1], b.lookAt[1], k),
      lerp(a.lookAt[2], b.lookAt[2], k),
    ],
    rigPos: [
      lerp(a.rigPos[0], b.rigPos[0], k),
      lerp(a.rigPos[1], b.rigPos[1], k),
      lerp(a.rigPos[2], b.rigPos[2], k),
    ],
    rigRot: [
      lerp(a.rigRot[0], b.rigRot[0], k),
      lerp(a.rigRot[1], b.rigRot[1], k),
      lerp(a.rigRot[2], b.rigRot[2], k),
    ],
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
  const cliff = Math.exp(-Math.pow((x + 3.2) / 9.5, 2) - Math.pow((y - 2.4) / 6.2, 2)) * 3.8;
  const rightMassif = Math.exp(-Math.pow((x - 13) / 13, 2) - Math.pow((y - 0.5) / 8, 2)) * 3.1;
  const fgRocks = Math.max(0, (u - 0.52) * 2.2) * Math.max(0, (0.48 - v) * 2.4) * 3.5;
  const farLeft = Math.exp(-Math.pow((x + 17) / 8, 2) - Math.pow((y - 0.8) / 4, 2)) * 1.6;
  const skyMask = v > 0.68 ? Math.max(0.15, 1 - (v - 0.68) * 2.8) : 1;
  return (cliff + rightMassif + fgRocks + farLeft) * skyMask;
}

/**
 * Builds a high-detail Delaunay-like triangulated low-poly mesh directly from the real
 * Serra da Leba photograph (`img`), sampling every triangle's true pixels and mapping
 * them into a harmonized palette of blacks, charcoals, slates, and emerald greens.
 */
export function buildPhotoAccurateLowPoly(img: HTMLImageElement): THREE.Group {
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
    const x0 = nPos.getX(i),
      y0 = nPos.getY(i),
      z0 = nPos.getZ(i);
    const x1 = nPos.getX(i + 1),
      y1 = nPos.getY(i + 1),
      z1 = nPos.getZ(i + 1);
    const x2 = nPos.getX(i + 2),
      y2 = nPos.getY(i + 2),
      z2 = nPos.getZ(i + 2);

    const cx = (x0 + x1 + x2) / 3;
    const cy = (y0 + y1 + y2) / 3;
    const u = Math.max(0, Math.min(1, cx / W + 0.5));
    const v = Math.max(0, Math.min(1, cy / H + 0.5));

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

    const isSkyZone = v > 0.62 && b > r * 1.15;
    const isCloud = isSkyZone && luma > 0.56 && sat < 0.42;
    const isRockOrRoadWall = !isSkyZone && r >= g * 1.04 && r > b * 1.15 && luma > 0.22;
    const isLushVegetation = !isSkyZone && !isRockOrRoadWall;

    let fr = 0,
      fg = 0,
      fb = 0;

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
      const rockBright = Math.pow(luma, 0.8) * shade;
      fr = 0.12 + rockBright * 0.7;
      fg = 0.14 + rockBright * 0.76;
      fb = 0.13 + rockBright * 0.72;
    } else if (isLushVegetation) {
      const canopy = Math.pow(luma, 1.1) * shade;
      fr = 0.008 + canopy * 0.05;
      fg = 0.03 + canopy * 0.24;
      fb = 0.018 + canopy * 0.11;
    } else {
      fr = 0.06 + luma * 0.24;
      fg = 0.1 + luma * 0.32;
      fb = 0.09 + luma * 0.27;
    }

    const facetBoost = 0.92 + hash(i * 5.3) * 0.18;
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

    const zLift = 0.035;
    const targetArr = isRockOrRoadWall && luma > 0.38 ? greenEdgePositions : edgePositions;
    targetArr.push(
      x0,
      y0,
      z0 + zLift,
      x1,
      y1,
      z1 + zLift,
      x1,
      y1,
      z1 + zLift,
      x2,
      y2,
      z2 + zLift,
      x2,
      y2,
      z2 + zLift,
      x0,
      y0,
      z0 + zLift,
    );
  }

  nonIdx.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mesh = new THREE.Mesh(
    nonIdx,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }),
  );
  group.add(mesh);

  const grayWireGeo = new THREE.BufferGeometry();
  grayWireGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
  group.add(
    new THREE.LineSegments(
      grayWireGeo,
      new THREE.LineBasicMaterial({ color: "#38423d", transparent: true, opacity: 0.24 }),
    ),
  );

  const greenWireGeo = new THREE.BufferGeometry();
  greenWireGeo.setAttribute("position", new THREE.Float32BufferAttribute(greenEdgePositions, 3));
  group.add(
    new THREE.LineSegments(
      greenWireGeo,
      new THREE.LineBasicMaterial({ color: "#2FBF71", transparent: true, opacity: 0.36 }),
    ),
  );

  const uvToWorld = (u: number, v: number, zOff = 0.22) => {
    const x = (u - 0.5) * W;
    const y = (v - 0.5) * H;
    const z = serraRelief(u, v) + zOff;
    return new THREE.Vector3(x, y, z);
  };

  const roadUVs: [number, number][] = [
    [0.93, 0.565],
    [0.88, 0.525],
    [0.64, 0.495],
    [0.425, 0.482],
    [0.655, 0.452],
    [0.342, 0.415],
    [0.685, 0.365],
    [0.265, 0.312],
    [0.59, 0.27],
    [0.445, 0.245],
    [0.688, 0.198],
    [0.43, 0.21],
    [0.16, 0.045],
  ];

  const roadCurve = new THREE.CatmullRomCurve3(
    roadUVs.map(([u, v]) => uvToWorld(u, v, 0.32)),
    false,
    "centripetal",
    0.18,
  );
  const roadPts = roadCurve.getPoints(240);

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
      verts.push(
        p.x + nx * halfW,
        p.y + ny * halfW,
        p.z,
        p.x - nx * halfW,
        p.y - ny * halfW,
        p.z,
      );
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
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
  };

  group.add(
    buildRibbon(
      roadPts.map((p) => new THREE.Vector3(p.x, p.y, p.z - 0.01)),
      0.42,
      "#2FBF71",
      0.16,
    ),
  );
  group.add(buildRibbon(roadPts, 0.14, "#2FBF71", 0.95));

  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(roadPts),
      new THREE.LineBasicMaterial({ color: "#7DFFB5", transparent: true, opacity: 0.9 }),
    ),
  );

  const wallPts = roadPts.map((p) => new THREE.Vector3(p.x, p.y - 0.17, p.z - 0.03));
  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(wallPts),
      new THREE.LineBasicMaterial({ color: "#B8C4BC", transparent: true, opacity: 0.55 }),
    ),
  );

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
    const cGroup = new THREE.Group();
    cGroup.add(
      new THREE.Mesh(cGeo, cloudFillMat),
      new THREE.LineSegments(new THREE.EdgesGeometry(cGeo, 12), cloudWireMat),
    );
    cGroup.position.set(cx, cy, cz);
    group.add(cGroup);
  });

  return group;
}
