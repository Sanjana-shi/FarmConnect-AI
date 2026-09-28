import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, Pause, FastForward, SkipForward, ArrowRight, 
  Sparkles, CheckCircle2, ShieldCheck, Tractor, Users, 
  IndianRupee, Calendar, MapPin, Layers, RotateCcw,
  Volume2, VolumeX, Volume1, Music, Mic, MicOff, Wind, Sliders, Bell, Check, Languages, Globe,
  Eye, EyeOff, Sun
} from 'lucide-react';
import { FarmConnectStore } from '../../data/store';
import { pleasantAudio } from '../../services/pleasantAudioEngine';
import { LanguageCode } from '../../types';
import { LANGUAGES } from '../../data/translations';
import { LANGUAGE_VOICE_MAP, VoiceTranslationService } from '../../services/voiceTranslationService';

interface AgriculturalIntro3DProps {
  selectedLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  onComplete: () => void;
  onOpenAuth?: (mode: 'LOGIN' | 'REGISTER') => void;
}

interface StepInfo {
  timeStart: number;
  timeEnd: number;
  badge: string;
  title: string;
  subtitle: string;
  detail: string;
  icon: string;
}

const INTRO_STEPS: StepInfo[] = [
  {
    timeStart: 0,
    timeEnd: 5,
    badge: 'STAGE 1: DAWN OF THE DELTA',
    title: 'Transforming Indian Agriculture',
    subtitle: 'Connecting Cauvery Delta Farmers & Skilled Workers',
    detail: 'Over 140 million agricultural workers power India’s fields. FarmConnect AI unites farm owners and seasonal harvesting specialists on a transparent, digital network.',
    icon: '🌾'
  },
  {
    timeStart: 5,
    timeEnd: 11,
    badge: 'STAGE 2: SMART ONBOARDING',
    title: 'Frictionless Registration & Role Verification',
    subtitle: 'Instant Profile Creation in 8 Indian Languages',
    detail: 'Farmers list land size & active crop cycles. Harvesters, tractor operators, and bundlers register with regional skills, fair daily rates, and verified trust scores.',
    icon: '📝'
  },
  {
    timeStart: 11,
    timeEnd: 17,
    badge: 'STAGE 3: AI FIELD MATCHING',
    title: 'Intelligent Crop & Labor Matchmaking',
    subtitle: 'Distance-Optimized Crews for Paddy, Sugarcane & Cotton',
    detail: 'Gemini AI calculates harvest urgency, weather windows, and radial distance to mobilize experienced labor crews within minutes, cutting crop spoilage.',
    icon: '⚡'
  },
  {
    timeStart: 17,
    timeEnd: 23,
    badge: 'STAGE 4: ATTENDANCE & INSTANT PAYOUTS',
    title: 'Direct UPI Settlement & Real-time Attendance',
    subtitle: 'Zero Middlemen • 100% Wage Transparency',
    detail: 'One-click daily field attendance and instant UPI wage disbursal straight to bank accounts with verified UTR numbers, elevating rural dignity and prosperity.',
    icon: '💳'
  },
  {
    timeStart: 23,
    timeEnd: 28,
    badge: 'STAGE 5: HARVEST NETWORK READY',
    title: 'Welcome to FarmConnect AI',
    subtitle: 'The Complete Agricultural Workforce Management System',
    detail: 'Experience live job broadcasting, labor dispatch, real-time tracking, and automated wage ledger. Ready to begin?',
    icon: '🚜'
  }
];

export const AgriculturalIntro3D: React.FC<AgriculturalIntro3DProps> = ({
  selectedLanguage = 'en',
  onLanguageChange,
  onComplete,
  onOpenAuth
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(selectedLanguage);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const totalDuration = 27; // seconds

  // Sync with prop if changed from external
  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== currentLang) {
      const lang = selectedLanguage as LanguageCode;
      setCurrentLang(lang);
      pleasantAudio.setLanguage(lang);
    }
  }, [selectedLanguage]);

  // Pleasant Audio & Interaction States
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [natureEnabled, setNatureEnabled] = useState<boolean>(true);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState<boolean>(false);
  const [isSceneryMode, setIsSceneryMode] = useState<boolean>(false);
  const lastAnnouncedStageRef = useRef<number>(-1);

  const animFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const tractorGroupRef = useRef<THREE.Group | null>(null);
  const wheatInstancesRef = useRef<THREE.InstancedMesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const featureNodesGroupRef = useRef<THREE.Group | null>(null);
  const sunRaysRef = useRef<THREE.Group | null>(null);
  const mistGroupRef = useRef<THREE.Group | null>(null);
  const mouseParallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Determine current active step
  const stepIndex = INTRO_STEPS.findIndex(
    s => currentTime >= s.timeStart && currentTime < s.timeEnd
  );
  const activeStepIndex = stepIndex >= 0 ? stepIndex : INTRO_STEPS.length - 1;
  const currentStep = INTRO_STEPS[activeStepIndex];

  // Harmonious Audio sync with stages
  useEffect(() => {
    if (audioActive && !isMuted && isPlaying) {
      if (lastAnnouncedStageRef.current !== activeStepIndex) {
        lastAnnouncedStageRef.current = activeStepIndex;
        pleasantAudio.playBellChime();
        pleasantAudio.speakStage(activeStepIndex, currentLang, activeStepIndex === 0);
      }
    }
  }, [activeStepIndex, audioActive, isMuted, isPlaying, currentLang]);

  // Handle user selecting language in 3D Intro
  const handleLanguageSelect = (newLang: LanguageCode) => {
    setCurrentLang(newLang);
    pleasantAudio.setLanguage(newLang);
    FarmConnectStore.setLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    // Always announce the newly selected language clearly in audio description
    lastAnnouncedStageRef.current = activeStepIndex;
    pleasantAudio.playBellChime();
    pleasantAudio.speakStage(activeStepIndex, newLang, true);
    VoiceTranslationService.recommendLanguageVoice(newLang, false);
  };

  // Audio Control Handlers
  const handleStartAudio = async () => {
    setShowAudioPrompt(false);
    setAudioActive(true);
    setIsMuted(false);
    pleasantAudio.setLanguage(currentLang);
    await pleasantAudio.start();
    lastAnnouncedStageRef.current = activeStepIndex;
    pleasantAudio.playBellChime();
    // Explicitly announce selected language on start
    pleasantAudio.speakStage(activeStepIndex, currentLang, true);
  };

  const handleSilentMode = () => {
    setShowAudioPrompt(false);
    setAudioActive(false);
    setIsMuted(true);
    pleasantAudio.stop();
  };

  const handleToggleMute = () => {
    if (!audioActive) {
      handleStartAudio();
      return;
    }
    const muted = pleasantAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    pleasantAudio.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      pleasantAudio.toggleMute();
      setIsMuted(false);
    }
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    pleasantAudio.toggleVoice(next);
    if (next && audioActive && !isMuted) {
      pleasantAudio.speakStage(activeStepIndex);
    }
  };

  const handleToggleNature = () => {
    const next = !natureEnabled;
    setNatureEnabled(next);
    pleasantAudio.toggleNature(next);
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      pleasantAudio.stop();
    };
  }, []);

  // Initialize Three.js Agricultural World
  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL Support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup & Dynamic Dawn Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Set natural atmospheric fog that blends harmoniously into the dawn horizon
    scene.fog = new THREE.FogExp2(0x0e3f34, 0.009);

    // 1b. Procedural Cauvery Delta Sunrise Sky Dome
    const createSkyDome = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        // Deep dawn zenith
        grad.addColorStop(0.0, '#031522');
        grad.addColorStop(0.25, '#062933');
        grad.addColorStop(0.46, '#0b4a3c');
        // Glowing dawn horizon colors (golden sunrise, peach, amber)
        grad.addColorStop(0.66, '#b45309');
        grad.addColorStop(0.77, '#f59e0b');
        grad.addColorStop(0.86, '#fde68a');
        grad.addColorStop(0.93, '#fffbeb');
        grad.addColorStop(1.0, '#0f4438'); // Blends with terrain & fog
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      const skyGeo = new THREE.SphereGeometry(240, 32, 24);
      const skyMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        depthWrite: false
      });
      return new THREE.Mesh(skyGeo, skyMat);
    };
    const skyDome = createSkyDome();
    scene.add(skyDome);

    // 1c. Radiant Rising Sun (Dawn of the Delta)
    const sunGroup = new THREE.Group();
    sunGroup.position.set(40, 24, -92);

    // Bright core sun
    const sunCoreGeo = new THREE.SphereGeometry(7, 24, 24);
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    sunGroup.add(sunCore);

    // Golden glowing corona aura
    const sunCoronaGeo = new THREE.RingGeometry(6.8, 20, 32);
    const sunCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunCorona = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
    sunCorona.lookAt(0, 12, 32);
    sunGroup.add(sunCorona);

    // Soft outer atmosphere halo
    const sunHaloGeo = new THREE.RingGeometry(19, 38, 32);
    const sunHaloMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunHalo = new THREE.Mesh(sunHaloGeo, sunHaloMat);
    sunHalo.lookAt(0, 12, 32);
    sunGroup.add(sunHalo);

    // Dynamic radiating sunbeams
    const raysGroup = new THREE.Group();
    sunRaysRef.current = raysGroup;
    const rayCount = 12;
    for (let r = 0; r < rayCount; r++) {
      const angle = (r / rayCount) * Math.PI * 2;
      const rayLen = 24 + (r % 2) * 14;
      const rayGeo = new THREE.ConeGeometry(1.5, rayLen, 8);
      rayGeo.rotateZ(Math.PI / 2);
      rayGeo.translate(rayLen / 2 + 5, 0, 0);
      const rayMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.rotation.z = angle;
      raysGroup.add(ray);
    }
    raysGroup.lookAt(0, 12, 32);
    sunGroup.add(raysGroup);
    scene.add(sunGroup);

    // 1d. Distant Horizon Palm Tree Line (Cauvery Delta Palmyra & Coconut Palms)
    const horizonGroup = new THREE.Group();
    const palmCount = 48;
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.38, 9.5, 7);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.85 });

    for (let p = 0; p < palmCount; p++) {
      const angle = (p / palmCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
      const radius = 68 + (Math.random() - 0.5) * 24;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      if (pz > 28 && Math.abs(px) < 18) continue; // Keep front camera clear

      const palm = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 4.75;
      trunk.rotation.z = (Math.random() - 0.5) * 0.14;
      palm.add(trunk);

      const crown = new THREE.Group();
      crown.position.y = 9.5;
      const frondCount = 7;
      for (let f = 0; f < frondCount; f++) {
        const frondAngle = (f / frondCount) * Math.PI * 2;
        const frondGeo = new THREE.ConeGeometry(0.75, 3.4, 5);
        frondGeo.rotateX(Math.PI / 2.5);
        const frond = new THREE.Mesh(frondGeo, frondMat);
        frond.rotation.y = frondAngle;
        crown.add(frond);
      }
      palm.add(crown);

      const sc = 0.85 + Math.random() * 0.55;
      palm.scale.set(sc, sc, sc);
      palm.position.set(px, -0.4, pz);
      horizonGroup.add(palm);
    }

    // Outer horizon perimeter bunds / rolling hills
    const bundGeo = new THREE.RingGeometry(64, 115, 40, 5);
    bundGeo.rotateX(-Math.PI / 2);
    const bPos = bundGeo.attributes.position;
    for (let b = 0; b < bPos.count; b++) {
      const bx = bPos.getX(b);
      const bz = bPos.getZ(b);
      const dist = Math.sqrt(bx * bx + bz * bz);
      if (dist > 65) {
        const bh = Math.sin(bx * 0.07) * 2.8 + Math.cos(bz * 0.07) * 2.8 + 2.2;
        bPos.setY(b, bh);
      }
    }
    bundGeo.computeVertexNormals();
    const bundMat = new THREE.MeshStandardMaterial({ color: 0x052e16, roughness: 0.95 });
    const bund = new THREE.Mesh(bundGeo, bundMat);
    bund.position.y = -0.7;
    horizonGroup.add(bund);
    scene.add(horizonGroup);

    // 1e. Cauvery Delta Irrigation Canal (வாய்க்கால்) with Reflective Water
    const canalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-45, 0.08, -35),
      new THREE.Vector3(-22, 0.08, -16),
      new THREE.Vector3(-6, 0.08, 6),
      new THREE.Vector3(14, 0.08, 20),
      new THREE.Vector3(42, 0.08, 38)
    ]);
    const canalGeo = new THREE.TubeGeometry(canalCurve, 48, 1.8, 6, false);
    canalGeo.scale(1, 0.07, 1);
    const canalWaterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const canal = new THREE.Mesh(canalGeo, canalWaterMat);
    scene.add(canal);

    // 1f. Drifting Morning Farmland Mist
    const mistGroup = new THREE.Group();
    mistGroupRef.current = mistGroup;
    const mistMat = new THREE.MeshBasicMaterial({
      color: 0xdcfce7,
      transparent: true,
      opacity: 0.13,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    for (let m = 0; m < 9; m++) {
      const mistGeo = new THREE.PlaneGeometry(28 + Math.random() * 18, 9 + Math.random() * 7);
      mistGeo.rotateX(-Math.PI / 2.05);
      const mistMesh = new THREE.Mesh(mistGeo, mistMat);
      mistMesh.position.set(
        (Math.random() - 0.5) * 90,
        1.2 + Math.random() * 2.2,
        (Math.random() - 0.5) * 90
      );
      mistMesh.rotation.y = Math.random() * Math.PI;
      mistGroup.add(mistMesh);
    }
    scene.add(mistGroup);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 12, 32);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Lighting - Golden Hour Sunrise
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.9); // Golden sunlight
    sunLight.position.set(30, 45, -20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    scene.add(sunLight);

    // Secondary fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-25, 20, 30);
    scene.add(fillLight);

    // 5. Undulating Farmland Terrain with Furrows
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 70, 70);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Create organic agricultural ridges & furrows
      const elevation = Math.sin(x * 0.18) * 0.8 + Math.cos(z * 0.12) * 0.9 + Math.sin(z * 0.5) * 0.25;
      posAttr.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x14532d, // Rich paddy soil green
      roughness: 0.85,
      metalness: 0.1,
      flatShading: false
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 6. Instanced Crops (Paddy / Golden Wheat Stalks)
    const stalkCount = 1200;
    const stalkGeo = new THREE.CylinderGeometry(0.04, 0.08, 2.2, 4);
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0x84cc16, // Golden lime paddy green
      roughness: 0.6,
      metalness: 0.1
    });
    const stalkInstances = new THREE.InstancedMesh(stalkGeo, stalkMat, stalkCount);
    wheatInstancesRef.current = stalkInstances;
    stalkInstances.castShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < stalkCount; i++) {
      const rx = (Math.random() - 0.5) * 90;
      const rz = (Math.random() - 0.5) * 90;
      // Leave a center path for the tractor & node pipeline
      if (Math.abs(rx) < 5 && rz > -10 && rz < 25) continue;
      
      const ry = Math.sin(rx * 0.18) * 0.8 + Math.cos(rz * 0.12) * 0.9 + 1.1;
      dummy.position.set(rx, ry, rz);
      dummy.rotation.x = (Math.random() - 0.5) * 0.2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.2;
      dummy.scale.set(
        0.8 + Math.random() * 0.4,
        0.9 + Math.random() * 0.5,
        0.8 + Math.random() * 0.4
      );
      dummy.updateMatrix();
      stalkInstances.setMatrixAt(i, dummy.matrix);
    }
    stalkInstances.instanceMatrix.needsUpdate = true;
    scene.add(stalkInstances);

    // 7. Stylized 3D Agricultural Tractor
    const tractorGroup = new THREE.Group();
    tractorGroupRef.current = tractorGroup;

    // Chassis & Engine Block
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4, metalness: 0.3 }); // Emerald agri tractor
    const bodyGeo = new THREE.BoxGeometry(2.6, 1.4, 4.2);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.3;
    body.castShadow = true;
    tractorGroup.add(body);

    // Driver Cab
    const cabGeo = new THREE.BoxGeometry(2.4, 1.8, 2.0);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x052e16, roughness: 0.2, metalness: 0.5 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 2.6, -0.9);
    cab.castShadow = true;
    tractorGroup.add(cab);

    // Cab Glass Windshield
    const glassGeo = new THREE.BoxGeometry(2.1, 1.2, 0.1);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.7 });
    const windshield = new THREE.Mesh(glassGeo, glassMat);
    windshield.position.set(0, 2.6, 0.15);
    tractorGroup.add(windshield);

    // Big Rear Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.6 }); // Golden amber rim

    const rearWheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16);
    rearWheelGeo.rotateZ(Math.PI / 2);

    const rearLeftWheel = new THREE.Mesh(rearWheelGeo, tireMat);
    rearLeftWheel.position.set(-1.6, 1.2, -1.2);
    rearLeftWheel.castShadow = true;
    tractorGroup.add(rearLeftWheel);

    const rearRightWheel = new THREE.Mesh(rearWheelGeo, tireMat);
    rearRightWheel.position.set(1.6, 1.2, -1.2);
    rearRightWheel.castShadow = true;
    tractorGroup.add(rearRightWheel);

    // Front Wheels
    const frontWheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.6, 16);
    frontWheelGeo.rotateZ(Math.PI / 2);

    const frontLeftWheel = new THREE.Mesh(frontWheelGeo, tireMat);
    frontLeftWheel.position.set(-1.4, 0.7, 1.4);
    frontLeftWheel.castShadow = true;
    tractorGroup.add(frontLeftWheel);

    const frontRightWheel = new THREE.Mesh(frontWheelGeo, tireMat);
    frontRightWheel.position.set(1.4, 0.7, 1.4);
    frontRightWheel.castShadow = true;
    tractorGroup.add(frontRightWheel);

    // Exhaust Chimney Pipe with Puffs
    const pipeGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.8, 8);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5, metalness: 0.7 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(0.9, 2.5, 1.5);
    tractorGroup.add(pipe);

    // Bright Headlights
    const lightGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const headlightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 12);
    headlightGeo.rotateX(Math.PI / 2);

    const hlLeft = new THREE.Mesh(headlightGeo, lightGlowMat);
    hlLeft.position.set(-0.8, 1.5, 2.15);
    tractorGroup.add(hlLeft);

    const hlRight = new THREE.Mesh(headlightGeo, lightGlowMat);
    hlRight.position.set(0.8, 1.5, 2.15);
    tractorGroup.add(hlRight);

    tractorGroup.position.set(0, 0, 10);
    scene.add(tractorGroup);

    // 8. Luminous Feature Nodes Pipeline
    const nodesGroup = new THREE.Group();
    featureNodesGroupRef.current = nodesGroup;

    const nodePositions = [
      { x: -14, y: 3.5, z: 12, label: 'Farmer / Labor Onboarding', color: 0x34d399 },
      { x: -7, y: 4.5, z: 6, label: 'Smart AI Field Matching', color: 0x38bdf8 },
      { x: 0, y: 5.5, z: 0, label: 'Live GPS & Work Attendance', color: 0xfbbf24 },
      { x: 7, y: 4.5, z: -6, label: 'Instant Zero-Fee UPI Settlement', color: 0xa855f7 },
      { x: 14, y: 3.5, z: -12, label: 'Agricultural Dignity & Yield', color: 0x4ade80 }
    ];

    nodePositions.forEach((np, idx) => {
      // Glow sphere
      const sphereGeo = new THREE.SphereGeometry(0.9, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: np.color,
        emissive: np.color,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.5
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(np.x, np.y, np.z);
      nodesGroup.add(sphere);

      // Rotating orbital ring around each node
      const ringGeo = new THREE.TorusGeometry(1.6, 0.08, 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: np.color, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(np.x, np.y, np.z);
      ring.rotation.x = Math.PI / 3;
      ring.name = `ring_${idx}`;
      nodesGroup.add(ring);
    });

    // Connecting Energy Beam Curves
    const curvePoints = nodePositions.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.12, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.75 });
    const beam = new THREE.Mesh(tubeGeo, tubeMat);
    nodesGroup.add(beam);

    scene.add(nodesGroup);

    // 9. Golden Floating Spores & Pollen Particles
    const particleCount = 450;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 80;
      pPositions[i + 1] = Math.random() * 20;
      pPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.35,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 10. Clock for smooth animation
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Render Loop with Cinematic Camera Script
    let elapsedSimTime = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (isPlaying) {
        elapsedSimTime += delta * playbackSpeed;
        if (elapsedSimTime > totalDuration) {
          elapsedSimTime = totalDuration;
          setIsPlaying(false);
        }
        setCurrentTime(elapsedSimTime);
      }

      const t = elapsedSimTime;

      // Animate tractor moving across the field
      if (tractorGroup) {
        tractorGroup.position.z = 18 - (t * 1.3);
        tractorGroup.position.x = Math.sin(t * 0.4) * 3;
        // Subtle engine rumble vibration
        tractorGroup.position.y = 0.3 + Math.sin(t * 14) * 0.04;
        tractorGroup.rotation.y = Math.sin(t * 0.4) * 0.15;
      }

      // Animate orbital rings
      if (nodesGroup) {
        nodesGroup.children.forEach((child) => {
          if (child.name && child.name.startsWith('ring_')) {
            child.rotation.z += 0.02;
          }
        });
      }

      // Animate pollen particles
      if (particles) {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.03;
          if (positions[i] < 0) positions[i] = 20;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }

      // Animate rotating solar flare rays & morning mist drift
      if (sunRaysRef.current) {
        sunRaysRef.current.rotation.z += 0.0025;
      }
      if (mistGroupRef.current) {
        mistGroupRef.current.children.forEach((m, idx) => {
          m.position.x += 0.02 * (idx % 2 === 0 ? 1 : 0.7);
          if (m.position.x > 60) m.position.x = -60;
        });
      }

      // Scripted Cinematic Camera Choreography
      if (camera) {
        // Base choreography coordinates
        let targetX = 0;
        let targetY = 3;
        let targetZ = 5;

        if (t < 5) {
          // Phase 1: High dawn sweep over the entire Cauvery Delta
          const progress = t / 5;
          camera.position.x = THREE.MathUtils.lerp(-22, -10, progress) + mouseParallaxRef.current.x * 0.8;
          camera.position.y = THREE.MathUtils.lerp(18, 11, progress) + mouseParallaxRef.current.y * 0.5;
          camera.position.z = THREE.MathUtils.lerp(35, 26, progress);
          targetX = 0; targetY = 3; targetZ = 5;
        } else if (t < 11) {
          // Phase 2: Close-up on the moving mechanized operations
          const progress = (t - 5) / 6;
          camera.position.x = THREE.MathUtils.lerp(-10, 8, progress) + mouseParallaxRef.current.x * 0.8;
          camera.position.y = THREE.MathUtils.lerp(11, 6, progress) + mouseParallaxRef.current.y * 0.5;
          camera.position.z = THREE.MathUtils.lerp(26, 16, progress);
          if (tractorGroup) {
            targetX = tractorGroup.position.x;
            targetY = 2;
            targetZ = tractorGroup.position.z;
          }
        } else if (t < 17) {
          // Phase 3: Tracking the AI node matchmaking beam
          const progress = (t - 11) / 6;
          camera.position.x = THREE.MathUtils.lerp(8, 16, progress) + mouseParallaxRef.current.x * 0.8;
          camera.position.y = THREE.MathUtils.lerp(6, 12, progress) + mouseParallaxRef.current.y * 0.5;
          camera.position.z = THREE.MathUtils.lerp(16, 5, progress);
          targetX = 0; targetY = 4; targetZ = 0;
        } else if (t < 23) {
          // Phase 4: Focus on UPI digital settlement node
          const progress = (t - 17) / 6;
          camera.position.x = THREE.MathUtils.lerp(16, 5, progress) + mouseParallaxRef.current.x * 0.8;
          camera.position.y = THREE.MathUtils.lerp(12, 7, progress) + mouseParallaxRef.current.y * 0.5;
          camera.position.z = THREE.MathUtils.lerp(5, -12, progress);
          targetX = 7; targetY = 4.5; targetZ = -6;
        } else {
          // Phase 5: Grand panoramic finale
          const progress = (t - 23) / 4;
          camera.position.x = THREE.MathUtils.lerp(5, 0, progress) + mouseParallaxRef.current.x * 0.8;
          camera.position.y = THREE.MathUtils.lerp(7, 14, progress) + mouseParallaxRef.current.y * 0.5;
          camera.position.z = THREE.MathUtils.lerp(-12, 28, progress);
          targetX = 0; targetY = 3; targetZ = 0;
        }

        camera.lookAt(targetX, targetY, targetZ);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseParallaxRef.current.x = ((e.clientX / w) - 0.5) * 3.5;
      mouseParallaxRef.current.y = -((e.clientY / h) - 0.5) * 2.0;
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement && container) {
        try {
          container.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        } catch {}
      }
    };
  }, []);

  // Jump to specific time
  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const handleSkipOrComplete = () => {
    pleasantAudio.stop();
    FarmConnectStore.setSeenIntro(true);
    onComplete();
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    lastAnnouncedStageRef.current = -1;
    if (audioActive && !isMuted) {
      pleasantAudio.playBellChime();
      pleasantAudio.speakStage(0);
    }
  };

  const progressPercent = Math.min(100, (currentTime / totalDuration) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans overflow-hidden select-none animate-fadeIn">
      {/* 3D WebGL Canvas Layer */}
      {webGlSupported ? (
        <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />
      ) : (
        // Clean CSS 3D Animated Fallback with Golden Dawn Delta Sky
        <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-b from-sky-950 via-teal-950 to-emerald-950 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="text-center max-w-xl space-y-4 relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-700/80 border border-emerald-400 flex items-center justify-center text-4xl shadow-2xl animate-pulse">
              🌾
            </div>
            <h2 className="text-2xl font-bold">FarmConnect AI Platform Ecosystem</h2>
            <p className="text-emerald-200 text-sm">
              Connecting farmers with verified agricultural labor across the Cauvery Delta with direct UPI disbursements.
            </p>
          </div>
        </div>
      )}

      {/* Atmospheric Horizon Vignette Gradients - tuned so the 3D dawn sky, rising sun, and lush fields shine brightly */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30 z-10" />

      {/* Top Header Bar */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-xl shadow-lg border border-emerald-400">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white">FarmConnect AI</h1>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-500/30">
                Interactive 3D Intro
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 hidden sm:block">
              India’s Premier Digital Agricultural Workforce Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Multilingual Selector for 3D Audio Description & Experience */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs">
            <Languages className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              id="select_intro_language"
              aria-label="Select Audio Description Language"
              value={currentLang}
              onChange={(e) => handleLanguageSelect(e.target.value as LanguageCode)}
              className="bg-transparent text-white text-[11px] font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Audio Equalizer & Sound Controls Pill */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs">
              <button
                onClick={handleToggleMute}
                className="flex items-center gap-1.5 text-white hover:text-emerald-300 transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label="Toggle audio mute"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                )}
                <span className="text-[11px] font-bold hidden sm:inline">
                  {isMuted ? 'Muted' : 'Audio On'}
                </span>
              </button>

              {/* Animated Equalizer Wave Bars */}
              {!isMuted && audioActive && isPlaying && (
                <div className="flex items-end gap-0.5 h-3 px-1">
                  <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                  <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                  <span className="w-0.5 h-3.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.3s' }} />
                  <span className="w-0.5 h-2.5 bg-emerald-300 rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }} />
                </div>
              )}

              {/* Audio Settings Dropdown Toggle */}
              <button
                onClick={() => setIsAudioSettingsOpen(!isAudioSettingsOpen)}
                className={`p-1 rounded-lg transition-colors ${
                  isAudioSettingsOpen ? 'bg-white/20 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="Audio Settings (Volume, Narration, Nature)"
                aria-label="Open audio settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Audio Settings Popover Panel */}
            {isAudioSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 text-xs space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Music className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pleasant Soundscape</span>
                  </div>
                  <button
                    onClick={() => pleasantAudio.playBellChime()}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-amber-300 text-[10px] font-semibold flex items-center gap-1"
                    title="Test Pleasant Bell Chime"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Chime</span>
                  </button>
                </div>

                {/* Master Volume Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-300 font-semibold">
                    <span>Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    aria-label="Adjust intro volume"
                  />
                </div>

                {/* Voice Narration Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Voice Narration</span>
                  </div>
                  <button
                    onClick={handleToggleVoice}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      voiceEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {voiceEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Nature Birds & Breeze Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span>Birds & Breeze</span>
                  </div>
                  <button
                    onClick={handleToggleNature}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      natureEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {natureEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Scenery Mode Toggle - Inspect Background & Delta Landscape */}
          <button
            onClick={() => setIsSceneryMode(!isSceneryMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              isSceneryMode 
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-lg shadow-amber-900/30' 
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
            title={isSceneryMode ? 'Return to Story View' : 'Full Scenery Mode (Admire 3D Delta Background)'}
            aria-label="Toggle scenic background mode"
          >
            {isSceneryMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">Story View</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Scenery View</span>
              </>
            )}
          </button>

          {/* Quick Skip Intro Button */}
          <button
            onClick={handleSkipOrComplete}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Skip Intro</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Direct Get Started CTA */}
          <button
            onClick={handleSkipOrComplete}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Center Overlay: Dynamic Animated Feature Cards */}
      <div className="relative z-20 flex-1 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
        {/* Top-Right Mini Feature Badges */}
        <div className="flex justify-end">
          <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-xl flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-time Field Match</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <IndianRupee className="w-4 h-4" />
              <span>Instant UPI Pay</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Aadhaar ID</span>
            </div>
          </div>
        </div>

        {/* Pleasant Audio Welcome Prompt Modal */}
        {showAudioPrompt && (
          <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto animate-fadeIn">
            <div className="max-w-md w-full bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center text-white">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-3xl shadow-lg border border-amber-300/30">
                🌾
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  FarmConnect AI 3D Journey
                </h3>
                <p className="text-xs sm:text-sm text-emerald-300 font-semibold">
                  Dawn over the Fertile Indian Farmlands
                </p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enjoy a peaceful, harmonious soundscape featuring morning raga chords, procedural rural birdsong, gentle delta breeze, and narrated stage insights.
              </p>

              {/* Language Selection for Audio Description */}
              <div className="p-3 bg-slate-950/80 border border-emerald-500/30 rounded-2xl text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" />
                    Audio Description Language:
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-[10px] font-extrabold rounded-md">
                    {LANGUAGES.find(l => l.code === currentLang)?.nativeName}
                  </span>
                </div>
                <select
                  id="select_modal_audio_language"
                  aria-label="Choose Audio Description Language"
                  value={currentLang}
                  onChange={(e) => handleLanguageSelect(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                      {lang.flag} {lang.name} — {lang.nativeName}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Audio description will announce your selected language and narrate each farming stage.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleStartAudio}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Experience with Pleasant Audio 🎵</span>
                </button>
                <button
                  onClick={handleSilentMode}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Continue Silently 🔇</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Active Storytelling Overlay Card / Minimal Scenery Pill */}
        {isSceneryMode ? (
          <div className="pointer-events-auto bg-slate-950/70 backdrop-blur-xl border border-amber-400/40 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 animate-fadeIn">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <div className="text-xs">
              <span className="font-extrabold text-amber-300">Cauvery Delta Horizon View:</span>{' '}
              <span className="text-slate-200">Golden sunrise, palmyra treeline & fertile paddy fields</span>
            </div>
            <button
              onClick={() => setIsSceneryMode(false)}
              className="ml-2 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-bold border border-amber-400/30 cursor-pointer"
            >
              Show Story Card
            </button>
          </div>
        ) : (
          <div className="max-w-2xl w-full pointer-events-auto bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl space-y-3 animate-slideUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentStep.icon}</span>
                <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                  {currentStep.badge}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {audioActive && !isMuted && (
                  <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    <span>Audio Synchronized</span>
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400">
                  {Math.floor(currentTime)}s / {totalDuration}s
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-emerald-300 mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentStep.detail}
            </p>

            {/* Interactive Feature Previews during specific steps */}
            {currentTime >= 11 && currentTime < 17 && (
              <div className="pt-2 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-[11px] text-emerald-200 flex items-center gap-1.5 font-bold">
                  <span>🌾 Paddy Harvest Crew</span>
                  <span className="text-emerald-400">98% Match</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-blue-900/60 border border-blue-700/60 text-[11px] text-blue-200 flex items-center gap-1.5 font-bold">
                  <span>📍 Thiruvaiyaru (3.2 km)</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-900/60 border border-amber-700/60 text-[11px] text-amber-200 flex items-center gap-1.5 font-bold">
                  <span>₹750 / Day Fair Rate</span>
                </div>
              </div>
            )}

            {currentTime >= 17 && currentTime < 23 && (
              <div className="pt-2 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700/60 text-[11px] text-purple-200 flex items-center gap-1.5 font-bold">
                  <span>📲 NPCI UPI QR Disbursal</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-[11px] text-emerald-200 flex items-center gap-1.5 font-bold">
                  <span>✓ Direct to Bank Account</span>
                </div>
              </div>
            )}

            {/* Action Call for the final stage */}
            {currentTime >= 23 && (
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSkipOrComplete}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-900/50 transition-all cursor-pointer"
                >
                  <span>Enter FarmConnect AI Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenAuth && (
                  <button
                    onClick={() => {
                      handleSkipOrComplete();
                      onOpenAuth('REGISTER');
                    }}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer"
                  >
                    Create New Account
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Timeline Controls & Scrubber */}
      <footer className="relative z-20 px-6 py-4 bg-slate-950/80 backdrop-blur-md border-t border-white/10 space-y-3">
        {/* Progress Bar / Scrubber */}
        <div className="relative flex items-center group">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.1"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            aria-label="Seek timeline position"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={handleReplay}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Replay from Beginning"
              aria-label="Replay intro"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : 1)}
              className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                playbackSpeed === 1.5 ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {playbackSpeed}x Speed
            </button>

            {/* Stage Quick Step Indicators */}
            <div className="hidden md:flex items-center gap-1.5 pl-4 border-l border-white/15">
              {INTRO_STEPS.map((s, idx) => {
                const isActive = currentTime >= s.timeStart && currentTime < s.timeEnd;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSeek(s.timeStart)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-xs' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    Stage {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline text-[11px]">
              Tip: Drag timeline or hover to orbit view • Sounds are procedurally synthesized
            </span>
            <button
              onClick={handleSkipOrComplete}
              className="font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Enter FarmConnect AI →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
