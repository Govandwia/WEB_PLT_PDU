import * as THREE from 'three';
import { SENSORS, TOOL_LENGTH } from '../data/sensors.js';

/** 1 satuan scene = 312.5 ft kedalaman (skala visual: 48 satuan = 15.000 ft) */
export const FT_PER_UNIT = 312.5;
export const MAX_DEPTH_FT = 15000;

/** Lapisan batuan melintang dari permukaan hingga kedalaman > 15.000 ft */
export const LAYERS = [
  { id: 'soil', name: 'Tanah Permukaan', top: 0, bottom: -3.5, color: 0xC98E5A, pattern: 'dots', depth: '0 - 1.100 ft' },
  { id: 'sand', name: 'Batu Pasir (Sandstone)', top: -3.5, bottom: -11, color: 0xF2CF8D, pattern: 'dots', depth: '1.100 - 3.400 ft' },
  { id: 'shale', name: 'Batu Serpih (Shale Seal)', top: -11, bottom: -20, color: 0xAFC2A6, pattern: 'lines', depth: '3.400 - 6.250 ft' },
  { id: 'reservoir', name: '★ Lapisan Minyak Utama (Reservoir)', top: -20, bottom: -31, color: 0xEBA640, pattern: 'dots', depth: '6.250 - 9.700 ft' },
  { id: 'deep_sand', name: 'Batu Pasir Dalam & Gas', top: -31, bottom: -40, color: 0xD4B278, pattern: 'lines', depth: '9.700 - 12.500 ft' },
  { id: 'water', name: 'Lapisan Air Asin (Aquifer)', top: -40, bottom: -48, color: 0x7DBCE3, pattern: 'waves', depth: '12.500 - 15.000 ft' },
  { id: 'basement', name: 'Batuan Dasar Granit (Basement)', top: -48, bottom: -58, color: 0x8A9A86, pattern: 'lines', depth: '> 15.000 ft' }
];

const VIEW_HEIGHT = 25; // Rentang vertikal yang nyaman di layar sekaligus

function makeTexture(hex, pattern, repeatX, repeatY) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const base = new THREE.Color(hex);
  g.fillStyle = '#' + base.getHexString();
  g.fillRect(0, 0, size, size);

  const dark = '#' + base.clone().offsetHSL(0, 0, -0.07).getHexString();
  const light = '#' + base.clone().offsetHSL(0, 0, 0.06).getHexString();

  if (pattern === 'lines') {
    g.strokeStyle = dark;
    g.lineWidth = 2;
    for (let y = 10; y < size; y += 18) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(size, y + (Math.random() - 0.5) * 4);
      g.stroke();
    }
  } else if (pattern === 'waves') {
    g.strokeStyle = light;
    g.lineWidth = 2;
    for (let y = 12; y < size; y += 22) {
      g.beginPath();
      for (let x = 0; x <= size; x += 4) {
        const yy = y + Math.sin((x / size) * Math.PI * 4) * 3;
        x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }
  } else {
    for (let i = 0; i < 220; i++) {
      g.fillStyle = Math.random() < 0.5 ? dark : light;
      g.beginPath();
      g.arc(Math.random() * size, Math.random() * size, Math.random() * 1.8 + 0.6, 0, Math.PI * 2);
      g.fill();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class RigScene {
  /**
   * @param {HTMLElement} container
   * @param {{onFrame?:Function, onToolClick?:Function}} opts
   */
  constructor(container, opts = {}) {
    this.container = container;
    this.onFrame = opts.onFrame || (() => {});
    this.onToolClick = opts.onToolClick || (() => {});

    this.wellX = 0;
    this.truckX = 10;
    this.sheaveCenter = new THREE.Vector3(this.wellX + 0.6, 15.3, 0);
    this.sheaveR = 0.6;
    this.drumTop = new THREE.Vector3(this.truckX - 2.6, 2.85, 0);

    this.toolLen = TOOL_LENGTH;
    this.minTop = 1.6 + this.toolLen;          // alat menggantung di menara rig (+6.3)
    this.maxTop = -48 + this.toolLen * 0.7;     // ujung bawah alat mencapai 15.000 ft (-44.7)
    this.toolTop = this.minTop;
    this.targetTop = this.minTop;
    this.speed = 0;

    // Kamera vertikal yang dinamis mengikuti kedalaman
    this.currentCameraY = 6;

    this.yaw = 0;
    this.pitch = 0.08;
    this.targetYaw = 0;
    this.targetPitch = 0.08;

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.toolMeshes = [];
    this.bandMats = {};
    this.oil = [];
    this.clouds = [];

    this._initRenderer();
    this._buildSky();
    this._buildGround();
    this._buildWell();
    this._buildRig();
    this._buildTruck();
    this._buildCables();
    this._buildTool();
    this._bindEvents();

    this._loop = this._loop.bind(this);
    this.raf = requestAnimationFrame(this._loop);
  }

  /* ---------------------------------------------------------------- setup */
  _initRenderer() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 500);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xd8c8a8, 2.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(25, 45, 45);
    this.scene.add(sun);

    // Lampu aksen pada tool string saat di dalam tanah
    this.toolLight = new THREE.PointLight(0xffa336, 1.5, 18);
    this.scene.add(this.toolLight);

    this.resizeObserver = new ResizeObserver(() => this._resize());
    this.resizeObserver.observe(this.container);
    this._resize();
  }

  _resize() {
    this.w = this.container.clientWidth || 1200;
    this.h = this.container.clientHeight || 700;
    this.renderer.setSize(this.w, this.h);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
  }

  _updateCamera() {
    const aspect = this.w / this.h;
    let viewH = VIEW_HEIGHT;
    let targetX;

    if (aspect <= 1.15) {
      // Pada layar HP vertikal (aspect <= 1.15), zoom pas dan pusat di antara Rig & Winch Truck
      viewH = 24;
      this.visW = viewH * aspect;
      targetX = this.wellX + 3.2;
    } else {
      const minW = aspect < 1.35 ? 44 : 56;
      if (viewH * aspect < minW) viewH = minW / aspect;
      this.visW = viewH * aspect;
      const rigFraction = aspect < 1.3 ? 0.18 : 0.22;
      targetX = this.wellX + this.visW * (0.5 - rigFraction);
    }
    this.centerX = targetX;

    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const dist = viewH / 2 / Math.tan(fov / 2);

    const target = new THREE.Vector3(this.centerX, this.currentCameraY, 0);
    const dir = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch)
    );
    this.camera.position.copy(target).addScaledVector(dir, dist);
    this.camera.lookAt(target);
  }

  _box(x0, x1, y0, y1, z0, z1, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    this.scene.add(m);
    return m;
  }

  _strut(group, a, b, r, mat) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    group.add(m);
    return m;
  }

  /* ------------------------------------------------------------- sky/bg */
  _buildSky() {
    // Bukit di kejauhan
    const hillMat = new THREE.MeshLambertMaterial({ color: 0xA8D98F });
    const hillMat2 = new THREE.MeshLambertMaterial({ color: 0x8FCB7A });
    [[25, -8, -70, 22, 2.6, hillMat], [70, -10, -80, 26, 2.2, hillMat2], [-30, -12, -75, 24, 2.4, hillMat2], [120, -9, -90, 28, 2.5, hillMat]]
      .forEach(([x, y, z, r, sx, mat]) => {
        const hill = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), mat);
        hill.scale.set(sx, 0.55, 1);
        hill.position.set(x, y, z);
        this.scene.add(hill);
      });

    // Awan
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.25 });
    for (let i = 0; i < 7; i++) {
      const cloud = new THREE.Group();
      const puffs = 3 + Math.floor(Math.random() * 3);
      for (let p = 0; p < puffs; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.3 + Math.random() * 0.9, 16, 12), cloudMat);
        puff.position.set(p * 1.6, Math.random() * 0.6, Math.random() * 0.5);
        puff.scale.y = 0.75;
        cloud.add(puff);
      }
      cloud.position.set(-40 + i * 24 + Math.random() * 8, 11 + Math.random() * 5, -30 - Math.random() * 10);
      cloud.userData.speed = 0.4 + Math.random() * 0.5;
      this.clouds.push(cloud);
      this.scene.add(cloud);
    }
  }

  /* ------------------------------------------------------------- ground */
  _buildGround() {
    const tw = 1.9; // setengah lebar celah potongan sumur
    const xL = -150, xR = 260;
    const zBack = -14, zFront = 3, zTrench = -1.6;

    LAYERS.forEach(layer => {
      const h = layer.top - layer.bottom;
      const widthL = this.wellX - tw - xL;
      const widthR = xR - (this.wellX + tw);
      const matL = new THREE.MeshLambertMaterial({ map: makeTexture(layer.color, layer.pattern, widthL / 8, h / 8) });
      const matR = new THREE.MeshLambertMaterial({ map: makeTexture(layer.color, layer.pattern, widthR / 8, h / 8) });
      const backColor = new THREE.Color(layer.color).multiplyScalar(0.78);
      const matB = new THREE.MeshLambertMaterial({ color: backColor });

      this._box(xL, this.wellX - tw, layer.bottom, layer.top, zBack, zFront, matL);
      this._box(this.wellX + tw, xR, layer.bottom, layer.top, zBack, zFront, matR);
      this._box(this.wellX - tw, this.wellX + tw, layer.bottom, layer.top, zBack, zTrench, matB);

      // Garis pembatas lapisan geologi
      const edge = new THREE.MeshBasicMaterial({ color: new THREE.Color(layer.color).multiplyScalar(0.7) });
      this._box(xL, xR, layer.bottom - 0.05, layer.bottom + 0.05, zFront, zFront + 0.03, edge);
    });

    // Rumput di atas tanah
    const grass = new THREE.MeshLambertMaterial({ color: 0x7BC86C });
    this._box(xL, this.wellX - tw, 0, 0.28, zBack, zFront + 0.05, grass);
    this._box(this.wellX + tw, xR, 0, 0.28, zBack, zFront + 0.05, grass);

    // Garis kuning tebal permukaan tanah (seperti sketsa user)
    this._box(xL, xR, 0.26, 0.40, zFront + 0.06, zFront + 0.12, new THREE.MeshBasicMaterial({ color: 0xFACC15 }));
  }

  /* --------------------------------------------------------------- well */
  _buildWell() {
    const r = 1.3;
    const top = 0.4, bottom = -52; // Kedalaman sumur diperpanjang hingga -52 unit (> 15.000 ft)
    const wellHeight = top - bottom;

    // Pipa casing (potongan setengah bagian belakang agar alat terlihat)
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide });
    const casing = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, wellHeight, 32, 1, true, Math.PI / 2, Math.PI),
      casingMat
    );
    casing.position.set(this.wellX, (top + bottom) / 2, 0);
    this.scene.add(casing);

    // Cairan fluida transparan di dalam zona minyak & air
    const fluid = new THREE.Mesh(
      new THREE.CylinderGeometry(r - 0.05, r - 0.05, 30, 24, 1, true, Math.PI / 2, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    fluid.position.set(this.wellX, -33, 0);
    this.scene.add(fluid);

    // Sambungan kopling pipa (collar) setiap 3 unit (~950 ft)
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.6, roughness: 0.3 });
    for (let y = -2; y > bottom; y -= 3) {
      const collar = new THREE.Mesh(new THREE.TorusGeometry(r + 0.02, 0.07, 6, 32, Math.PI), collarMat);
      collar.rotation.x = Math.PI / 2;
      collar.rotation.z = Math.PI;
      collar.position.set(this.wellX, y, 0);
      this.scene.add(collar);
    }

    // Lubang perforasi di zona reservoir minyak (y: -20 sampai -30)
    const perfMat = new THREE.MeshBasicMaterial({ color: 0x5B3A12, side: THREE.DoubleSide });
    for (let y = -20.5; y > -30.5; y -= 0.8) {
      for (let a = Math.PI * 0.6; a < Math.PI * 1.45; a += 0.28) {
        const perf = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), perfMat);
        perf.position.set(this.wellX + Math.sin(a) * (r - 0.01), y + (Math.random() - 0.5) * 0.2, Math.cos(a) * (r - 0.01));
        perf.lookAt(this.wellX, perf.position.y, 0);
        this.scene.add(perf);
      }
    }

    // Partikel minyak yang masuk dari perforasi
    const oilMat = new THREE.MeshLambertMaterial({ color: 0x9A5B13 });
    for (let i = 0; i < 90; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), oilMat);
      this._resetOil(p, true);
      this.oil.push(p);
      this.scene.add(p);
    }
  }

  _resetOil(p, randomPhase = false) {
    const side = Math.random() < 0.5 ? -1 : 1;
    p.userData.startX = this.wellX + side * 1.2;
    p.userData.y0 = -20.5 - Math.random() * 9.5;
    p.userData.t = randomPhase ? Math.random() : 0;
    p.userData.drift = (Math.random() - 0.5) * 0.6;
    p.position.set(p.userData.startX, p.userData.y0, (Math.random() - 0.5) * 0.8);
  }

  /* ---------------------------------------------------------------- rig */
  _buildRig() {
    const g = new THREE.Group();
    g.position.x = this.wellX;
    const orange = new THREE.MeshStandardMaterial({ color: 0xF15A24, metalness: 0.3, roughness: 0.45 });
    const white = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, metalness: 0.3, roughness: 0.5 });
    const grey = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.5, roughness: 0.4 });

    const floorY = 1.4;
    // Substruktur & lantai rig
    [[-2.6, -2.6], [2.6, -2.6], [2.6, 2.6], [-2.6, 2.6]].forEach(([x, z]) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.35, floorY, 0.35), grey);
      post.position.set(x, floorY / 2 + 0.2, z);
      g.add(post);
    });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.25, 6.2), grey);
    floor.position.y = floorY + 0.2;
    g.add(floor);

    // Menara trapesium
    const base = 2.4, topW = 0.55, mastTop = 15;
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const levels = 7;
    const ring = (t) => {
      const w = base + (topW - base) * t;
      const y = floorY + 0.3 + (mastTop - floorY - 0.3) * t;
      return corners.map(([cx, cz]) => new THREE.Vector3(cx * w, y, cz * w));
    };
    const bottomRing = ring(0), topRing = ring(1);
    for (let i = 0; i < 4; i++) this._strut(g, bottomRing[i], topRing[i], 0.12, orange);
    for (let l = 0; l < levels; l++) {
      const r0 = ring(l / levels), r1 = ring((l + 1) / levels);
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        this._strut(g, r1[i], r1[j], 0.05, white);
        this._strut(g, r0[i], r1[j], 0.04, white);
      }
    }

    // Crown block & sheave
    const crown = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 1.8), orange);
    crown.position.y = mastTop + 0.25;
    g.add(crown);
    this.sheave = new THREE.Mesh(new THREE.TorusGeometry(this.sheaveR, 0.12, 8, 24), grey);
    this.sheave.position.set(0.6, this.sheaveCenter.y, 0);
    g.add(this.sheave);
    const spokes = new THREE.Mesh(new THREE.BoxGeometry(this.sheaveR * 2, 0.08, 0.08), grey);
    this.sheave.add(spokes);
    const spokes2 = spokes.clone();
    spokes2.rotation.z = Math.PI / 2;
    this.sheave.add(spokes2);

    // Bendera PDU
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6), grey);
    pole.position.set(-0.6, mastTop + 1.2, 0);
    g.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.6), new THREE.MeshBasicMaterial({ color: 0xF15A24, side: THREE.DoubleSide }));
    flag.position.set(-0.1, mastTop + 1.6, 0);
    g.add(flag);
    this.flag = flag;

    // Kepala sumur (wellhead)
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 1.0, 20, 1, true), grey);
    wh.material = grey.clone();
    wh.material.side = THREE.DoubleSide;
    wh.position.y = 0.7;
    g.add(wh);

    this.scene.add(g);
  }

  /* -------------------------------------------------------------- truck */
  _buildTruck() {
    const g = new THREE.Group();
    g.position.set(this.truckX, 0.28, 0);
    const orange = new THREE.MeshStandardMaterial({ color: 0xF15A24, metalness: 0.3, roughness: 0.45 });
    const white = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, metalness: 0.2, roughness: 0.5 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x9BD3F5, metalness: 0.6, roughness: 0.15 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.45, 2.5), dark);
    chassis.position.y = 0.95;
    g.add(chassis);

    const lab = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.5, 2.5), white);
    lab.position.set(-0.1, 2.4, 0);
    g.add(lab);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.62, 0.35, 2.52), orange);
    stripe.position.set(-0.1, 2.3, 0);
    g.add(stripe);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.0, 2.4), orange);
    cab.position.set(2.65, 2.15, 0);
    g.add(cab);
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 2.0), glass);
    windshield.position.set(3.56, 2.55, 0);
    g.add(windshield);
    const sideWin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 2.42), glass);
    sideWin.position.set(2.8, 2.6, 0);
    g.add(sideWin);

    // Drum gulungan kabel
    this.drum = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.9, 24), orange);
    this.drum.rotation.x = Math.PI / 2;
    this.drum.position.set(-2.6, 2.0, 0);
    g.add(this.drum);
    const drumBand = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.12, 1.92), dark);
    this.drum.add(drumBand);
    drumBand.rotation.x = -Math.PI / 2;

    [-2.3, 0.3, 2.6].forEach(x => {
      [-1.3, 1.3].forEach(z => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 18), dark);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, 0.55, z);
        g.add(wheel);
      });
    });

    this.scene.add(g);
  }

  /* ------------------------------------------------------------- cables */
  _buildCables() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6 });
    const from = this.drumTop.clone();
    const to = new THREE.Vector3(this.sheaveCenter.x + this.sheaveR, this.sheaveCenter.y, 0);
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const diag = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 6), mat);
    diag.position.copy(from).add(to).multiplyScalar(0.5);
    diag.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    this.scene.add(diag);

    this.downCable = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 6), mat);
    this.downCable.position.x = this.wellX;
    this.scene.add(this.downCable);
  }

  /* --------------------------------------------------------------- tool */
  _buildTool() {
    const g = new THREE.Group();
    g.position.x = this.wellX;
    const steel = new THREE.MeshStandardMaterial({ color: 0xDCE3EA, metalness: 0.55, roughness: 0.3 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xF15A24, metalness: 0.3, roughness: 0.4 });
    const R = 0.42;

    const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.25, 12), steel);
    connector.position.y = 0.12;
    g.add(connector);

    let y = 0;
    SENSORS.forEach(s => {
      const mid = y - s.h / 2;
      const bandMat = new THREE.MeshLambertMaterial({ color: s.color, emissive: 0x000000 });
      this.bandMats[s.id] = bandMat;

      if (s.id === 'spin') {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, s.h, 12), steel);
        shaft.position.y = mid;
        [y - 0.06, y - s.h + 0.06].forEach(ry => {
          const ringM = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.1, 20), steel);
          ringM.position.y = ry;
          ringM.userData.sensorId = s.id;
          g.add(ringM);
          this.toolMeshes.push(ringM);
        });
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, s.h, 4), steel);
          rod.position.set(Math.cos(a) * (R - 0.03), mid, Math.sin(a) * (R - 0.03));
          g.add(rod);
        }
        this.impeller = new THREE.Group();
        this.impeller.position.y = mid;
        for (let b = 0; b < 3; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.2), bandMat);
          const holder = new THREE.Group();
          holder.rotation.y = (b / 3) * Math.PI * 2;
          blade.position.x = 0.3;
          blade.rotation.x = 0.55;
          blade.userData.sensorId = s.id;
          holder.add(blade);
          this.impeller.add(holder);
          this.toolMeshes.push(blade);
        }
        shaft.userData.sensorId = s.id;
        g.add(shaft, this.impeller);
        this.toolMeshes.push(shaft);
      } else {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, s.h, 20), s.id === 'head' ? orange : steel);
        body.position.y = mid;
        body.userData.sensorId = s.id;
        g.add(body);
        this.toolMeshes.push(body);

        if (s.id !== 'head') {
          const band = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.03, R + 0.03, Math.min(0.2, s.h * 0.35), 20), bandMat);
          band.position.y = mid;
          band.userData.sensorId = s.id;
          g.add(band);
          this.toolMeshes.push(band);
        }
        if (s.id === 'temp') {
          const probe = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 10), bandMat);
          probe.rotation.z = -Math.PI / 2;
          probe.position.set(R + 0.12, mid, 0);
          g.add(probe);
        }
      }

      const joint = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.015, R + 0.015, 0.05, 20), new THREE.MeshStandardMaterial({ color: 0x94A3B8 }));
      joint.position.y = y - s.h;
      g.add(joint);
      y -= s.h;
    });

    const nose = new THREE.Mesh(new THREE.ConeGeometry(R, 0.3, 20), steel);
    nose.rotation.z = Math.PI;
    nose.position.y = y - 0.15;
    g.add(nose);

    this.toolGroup = g;
    this.scene.add(g);
  }

  /* ------------------------------------------------------------- events */
  _bindEvents() {
    const el = this.renderer.domElement;
    let down = null;

    this._onPointerDown = (e) => {
      down = { x: e.clientX, y: e.clientY, yaw: this.targetYaw, pitch: this.targetPitch, moved: false };
    };
    this._onPointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      if (down) {
        const dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) down.moved = true;
        this.targetYaw = THREE.MathUtils.clamp(down.yaw - dx * 0.003, -0.4, 0.4);
        this.targetPitch = THREE.MathUtils.clamp(down.pitch + dy * 0.0015, 0.02, 0.25);
      } else {
        el.style.cursor = this._hitTool() ? 'pointer' : 'grab';
      }
    };
    this._onPointerUp = () => {
      if (down && !down.moved) {
        const hit = this._hitTool();
        if (hit) this.onToolClick(hit);
      }
      down = null;
    };

    // Scroll mouse wheel langsung untuk menjelajah ke bawah sumur
    this._onWheel = (e) => {
      const frac = this.getFraction();
      if ((frac >= 0.999 && e.deltaY > 0) || (frac <= 0.001 && e.deltaY < 0)) return;
      e.preventDefault();
      const deltaFrac = (e.deltaY > 0 ? 1 : -1) * 0.038;
      this.addFraction(deltaFrac);
    };

    el.addEventListener('pointerdown', this._onPointerDown);
    el.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
    el.addEventListener('wheel', this._onWheel, { passive: false });
  }

  _hitTool() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.toolMeshes, false);
    return hits.length ? hits[0].object.userData.sensorId : null;
  }

  /* --------------------------------------------------------- public API */
  /** fraction 0 = di menara, 1 = kedalaman maksimum 15.000 ft */
  setFraction(f) {
    const clamped = THREE.MathUtils.clamp(f, 0, 1);
    this.targetTop = this.minTop + clamped * (this.maxTop - this.minTop);
  }

  addFraction(delta) {
    this.setFraction(this.getFraction() + delta);
  }

  getFraction() {
    return (this.toolTop - this.minTop) / (this.maxTop - this.minTop);
  }

  goToDepth(ft) {
    this.setFraction(ft / MAX_DEPTH_FT);
  }

  goToReservoir() {
    this.goToDepth(8000);
  }

  goToSurface() {
    this.setFraction(0);
  }

  highlight(sensorId) {
    Object.entries(this.bandMats).forEach(([id, mat]) => {
      mat.emissive.set(id === sensorId ? mat.color : 0x000000);
      mat.emissiveIntensity = id === sensorId ? 0.7 : 0;
    });
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this._onPointerDown);
    el.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    el.removeEventListener('wheel', this._onWheel);
    this.scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (o.material.map) o.material.map.dispose();
        o.material.dispose();
      }
    });
    this.renderer.dispose();
    el.remove();
  }

  /* --------------------------------------------------------------- loop */
  _project(v) {
    const p = v.clone().project(this.camera);
    return {
      x: (p.x + 1) / 2 * this.w,
      y: (1 - p.y) / 2 * this.h,
      visible: p.z < 1 && p.y > -1.2 && p.y < 1.2
    };
  }

  _loop() {
    this.raf = requestAnimationFrame(this._loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // Gerak turun/naik alat yang halus
    const diff = this.targetTop - this.toolTop;
    let step = THREE.MathUtils.clamp(diff * 2.8 * dt, -7 * dt, 7 * dt);
    if (Math.abs(diff) < 0.003) step = diff;
    this.toolTop += step;
    this.speed = dt > 0 ? step / dt : 0;

    this.toolGroup.position.y = this.toolTop;
    const cableTop = this.sheaveCenter.y;
    const cableLen = Math.max(0.01, cableTop - this.toolTop - 0.25);
    this.downCable.scale.y = cableLen;
    this.downCable.position.y = this.toolTop + 0.25 + cableLen / 2;

    this.drum.rotation.y += step * 1.3;
    this.sheave.rotation.z += step * 1.6;

    const toolCenter = this.toolTop - this.toolLen / 2;
    this.toolLight.position.set(this.wellX, toolCenter, 1.2);

    // Kamera mengikuti posisi alat saat turun ke bawah tanah
    // Di permukaan (y > 0), kamera tetap melihat menara rig (y = 5.5)
    // Di bawah tanah, kamera meluncur turun bersama alat hingga kedalaman > 15.000 ft
    const desiredCameraY = THREE.MathUtils.clamp(toolCenter, -44, 5.5);
    this.currentCameraY += (desiredCameraY - this.currentCameraY) * 0.08;

    const inReservoir = toolCenter <= -20 && toolCenter >= -31;
    if (this.impeller) this.impeller.rotation.y += (inReservoir ? 16 : 1.2 + Math.abs(this.speed) * 0.8) * dt;

    // Partikel minyak
    this.oil.forEach(p => {
      const d = p.userData;
      d.t += dt * 0.35;
      if (d.t > 1) { this._resetOil(p); return; }
      const inward = Math.min(d.t / 0.2, 1);
      p.position.x = d.startX + (this.wellX + d.drift - d.startX) * inward;
      p.position.y = d.y0 + Math.max(0, d.t - 0.15) * 8;
    });

    this.clouds.forEach(c => {
      c.position.x += c.userData.speed * dt;
      if (c.position.x > this.centerX + 90) c.position.x = this.centerX - 90;
    });
    if (this.flag) this.flag.rotation.y = Math.sin(t * 2) * 0.25;

    this.yaw += (this.targetYaw - this.yaw) * 0.08;
    this.pitch += (this.targetPitch - this.pitch) * 0.08;
    this._updateCamera();
    this.renderer.render(this.scene, this.camera);

    // Titik acuan untuk bubble penjelasan
    const V = THREE.Vector3;
    const cableMid = this.drumTop.clone().lerp(new V(this.sheaveCenter.x + this.sheaveR, this.sheaveCenter.y, 0), 0.5);
    const anchors = {
      rig: this._project(new V(this.wellX - 1.2, 9.5, 0)),
      truck: this._project(new V(this.truckX - 1.5, 4.2, 0)),
      cable: this._project(cableMid),
      casing: this._project(new V(this.wellX - 1.2, -4.5, 0)),
      tool: this._project(new V(this.wellX + 0.6, toolCenter, 0)),
      reservoir: this._project(new V(this.wellX + 2.8, -25.5, 1))
    };
    LAYERS.forEach(l => {
      anchors['layer_' + l.id] = this._project(new V(this.centerX + this.visW * 0.35, (l.top + l.bottom) / 2, 3));
    });

    // Hitung kedalaman aktual dalam feet (0 hingga 15.000 ft)
    const depthFt = Math.max(0, Math.min(MAX_DEPTH_FT, Math.round(this.getFraction() * MAX_DEPTH_FT)));
    const layer = LAYERS.find(l => toolCenter <= l.top && toolCenter > l.bottom);

    this.onFrame({
      anchors,
      depthFt,
      fraction: this.getFraction(),
      speedFtMin: Math.abs(this.speed * FT_PER_UNIT * 60 / 100),
      layerName: layer ? layer.name : 'Di menara (di atas tanah)',
      layerId: layer ? layer.id : 'surface',
      moving: Math.abs(diff) > 0.01
    });
  }
}
