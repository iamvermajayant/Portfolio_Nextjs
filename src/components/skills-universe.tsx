"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

// ─── Skill data ───────────────────────────────────────────────────────────────

export interface Skill {
  label: string;
  color: string;   // sphere base color (hex)
  icon: string;    // path to logo image (e.g., "/react-logo.svg")
  size?: number;   // radius multiplier 0.8–1.4
}

export const DEFAULT_SKILLS: Skill[] = [
  { label: "React",       color: "#61DAFB", icon: "/react-icon.png",  size: 1.2 },
  { label: "Next.js",     color: "#888888", icon: "/nextjs-icon.png",  size: 1.1 },
  { label: "TypeScript",  color: "#3178C6", icon: "/ts-icon.png", size: 1.0 },
  { label: "JavaScript",  color: "#F7DF1E", icon: "/js-icon.png", size: 1.0 },
  { label: "Node.js",     color: "#5FA04E", icon: "/nodejs-icon.png",  size: 1.1 },
  { label: "Python",      color: "#3776AB", icon: "/python-icon.png", size: 1.0 },
  { label: "Docker",      color: "#2496ED", icon: "/docker-icon.png", size: 1.0 },
  { label: "PostgreSQL",  color: "#4169E1", icon: "/postgres-icon.png", size: 0.9 },
  { label: "WebRTC",      color: "#FF6B35", icon: "/webrtc-icon.png", size: 0.9 },
  { label: "Supabase",    color: "#3ECF8E", icon: "/supabase-icon.png", size: 0.9 },
  { label: "Kubernetes",  color: "#326CE5", icon: "/k8s-icon.png",  size: 0.9 },
  { label: "C++",         color: "#00599C", icon: "/cpp-icon.png", size: 0.85 },
  { label: "Java",        color: "#E76F00", icon: "/java-icon.png", size: 0.85 },
  { label: "SQL",         color: "#CC2927", icon: "/sql-icon.png", size: 0.85 },
  { label: "Go",          color: "#00ACD7", icon: "/go-icon.png", size: 0.85 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToVec3(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ─── Single skill ball ────────────────────────────────────────────────────────

interface BallState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  radius: number;
  skill: Skill;
  randomForce: THREE.Vector3;  // continuous random drift
  forceTimer: number;
}

interface SkillBallProps {
  state: BallState;
  mouseWorld: React.MutableRefObject<THREE.Vector3>;
  allBalls: React.MutableRefObject<BallState[]>;
  bounds: { x: number; y: number; z: number };
  index: number;
}

function SkillBall({ state, mouseWorld, allBalls, bounds, index }: SkillBallProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const logoRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const scaleTarget = useRef(1);
  const currentScale = useRef(1);

  // Try to load texture, fallback to generated texture on error
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      state.skill.icon,
      (texture) => {
        texture.needsUpdate = true;
        setLogoTexture(texture);
      },
      undefined,
      () => {
        // Fallback: create canvas texture with skill label
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        
        // Draw circle background
        ctx.fillStyle = state.skill.color;
        ctx.beginPath();
        ctx.arc(256, 256, 200, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 140px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = state.skill.label.substring(0, 2).toUpperCase();
        ctx.fillText(text, 256, 256);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        setLogoTexture(texture);
      }
    );
  }, [state.skill.icon, state.skill.color, state.skill.label]);

  // Shared material per ball — created once
  const material = useMemo(() => {
    const base = hexToVec3(state.skill.color);
    return new THREE.MeshPhysicalMaterial({
      color: base,
      metalness: 0.2,
      roughness: 0.15,
      transmission: 0.15,
      thickness: 0.5,
      envMapIntensity: 1.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.95,
    });
  }, [state.skill.color]);

  const glowMaterial = useMemo(() => {
    const base = hexToVec3(state.skill.color);
    return new THREE.MeshBasicMaterial({
      color: base,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
    });
  }, [state.skill.color]);

  const logoMaterial = useMemo(() => {
    if (!logoTexture) return null;
    return new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [logoTexture]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const pos = state.position;
    const vel = state.velocity;
    const r = state.radius;

    // Ping-pong physics: continuous fast motion with random direction changes
    state.forceTimer -= delta;
    if (state.forceTimer <= 0) {
      // Add random impulse for direction variation
      state.randomForce.set(
        randomInRange(-0.8, 0.8),
        randomInRange(-0.8, 0.8),
        randomInRange(-0.3, 0.3)
      );
      state.forceTimer = randomInRange(1.5, 3.5);
    }

    // Apply random impulse
    vel.addScaledVector(state.randomForce, delta * 0.5);

    // Mouse repulsion — strong and immediate
    const toMouse = new THREE.Vector3().subVectors(pos, mouseWorld.current);
    const mouseDist = toMouse.length();
    const repelRadius = r * 6;
    if (mouseDist < repelRadius && mouseDist > 0.01) {
      const force = ((repelRadius - mouseDist) / repelRadius) * 0.25;
      vel.addScaledVector(toMouse.normalize(), force);
    }

    // Ball–ball collision with bounce
    for (let i = 0; i < allBalls.current.length; i++) {
      if (i === index) continue;
      const other = allBalls.current[i];
      const diff = new THREE.Vector3().subVectors(pos, other.position);
      const dist = diff.length();
      const minDist = r + other.radius + 0.2;
      if (dist < minDist && dist > 0.001) {
        const push = ((minDist - dist) / minDist) * 0.08;
        vel.addScaledVector(diff.normalize(), push);
      }
    }

    // Speed cap — higher for ping-pong feel
    const maxSpeed = 3.5;
    if (vel.length() > maxSpeed) vel.setLength(maxSpeed);

    // Minimal damping — keep energy high
    vel.multiplyScalar(0.995);

    // Integrate position
    pos.addScaledVector(vel, delta * 60 * 0.016);

    // Strong bounce off bounds — ping-pong style
    const restitution = 0.85; // High bounce coefficient
    if (pos.x > bounds.x - r) { 
      pos.x = bounds.x - r; 
      vel.x *= -restitution;
      vel.y += randomInRange(-0.2, 0.2); // Add spin variation
    }
    if (pos.x < -bounds.x + r) { 
      pos.x = -bounds.x + r; 
      vel.x *= -restitution;
      vel.y += randomInRange(-0.2, 0.2);
    }
    if (pos.y > bounds.y - r) { 
      pos.y = bounds.y - r; 
      vel.y *= -restitution;
      vel.x += randomInRange(-0.2, 0.2);
    }
    if (pos.y < -bounds.y + r) { 
      pos.y = -bounds.y + r; 
      vel.y *= -restitution;
      vel.x += randomInRange(-0.2, 0.2);
    }
    if (pos.z > bounds.z - r) { 
      pos.z = bounds.z - r; 
      vel.z *= -restitution;
    }
    if (pos.z < -bounds.z + r) { 
      pos.z = -bounds.z + r; 
      vel.z *= -restitution;
    }

    // Apply to mesh
    meshRef.current.position.copy(pos);
    if (glowRef.current) glowRef.current.position.copy(pos);
    if (logoRef.current) logoRef.current.position.copy(pos);

    // Slow self-rotation for depth feel
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.06;

    // Scale spring toward target
    scaleTarget.current = hovered ? 1.18 : 1.0;
    currentScale.current += (scaleTarget.current - currentScale.current) * 0.15;
    meshRef.current.scale.setScalar(currentScale.current);
    if (glowRef.current) glowRef.current.scale.setScalar(currentScale.current * 1.3);
  });

  return (
    <group>
      {/* Glow halo */}
      <mesh ref={glowRef} position={state.position.clone()}>
        <sphereGeometry args={[state.radius, 32, 32]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>

      {/* Main sphere */}
      <mesh
        ref={meshRef}
        position={state.position.clone()}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[state.radius, 64, 64]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Billboard logo — always faces camera, larger size */}
      {logoMaterial && (
        <Billboard
          follow
          lockX={false}
          lockY={false}
          lockZ={false}
          position={state.position.clone()}
        >
          <mesh ref={logoRef}>
            <planeGeometry args={[state.radius * 1.4, state.radius * 1.4]} />
            <primitive object={logoMaterial} attach="material" />
          </mesh>
        </Billboard>
      )}

      {/* Skill name tooltip on hover */}
      {hovered && (
        <Billboard position={[state.position.x, state.position.y - state.radius - 0.4, state.position.z]} follow>
          <Text
            fontSize={0.26}
            anchorX="center"
            anchorY="middle"
            color={state.skill.color}
            outlineWidth={0.025}
            outlineColor="rgba(0,0,0,0.9)"
            fontWeight={700}
          >
            {state.skill.label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ skills }: { skills: Skill[] }) {
  const { viewport } = useThree();
  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0));

  const bounds = useMemo(() => ({
    x: viewport.width / 2 - 0.5,
    y: viewport.height / 2 - 0.5,
    z: 3,
  }), [viewport]);

  // Initialise ball states with random forces
  const ballsRef = useRef<BallState[]>([]);
  useMemo(() => {
    ballsRef.current = skills.map((skill) => {
      const r = (skill.size ?? 1.0) * 0.72;
      return {
        skill,
        radius: r,
        position: new THREE.Vector3(
          randomInRange(-bounds.x + r, bounds.x - r),
          randomInRange(-bounds.y + r, bounds.y - r),
          randomInRange(-bounds.z + r, bounds.z - r)
        ),
        velocity: new THREE.Vector3(
          randomInRange(-2.0, 2.0),  // Faster initial velocity
          randomInRange(-2.0, 2.0),
          randomInRange(-0.8, 0.8)
        ),
        randomForce: new THREE.Vector3(
          randomInRange(-0.6, 0.6),
          randomInRange(-0.6, 0.6),
          randomInRange(-0.2, 0.2)
        ),
        forceTimer: randomInRange(1, 2.5),
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  // Track mouse in world space
  const handlePointerMove = useCallback((e: any) => {
    mouseWorld.current.set(e.point.x, e.point.y, e.point.z);
  }, []);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, -3, -4]} intensity={0.3} color="#9999ff" />
      <pointLight position={[0, 0, 8]} intensity={0.5} color="#ffffff" />

      {/* Invisible plane to capture mouse world position */}
      <mesh onPointerMove={handlePointerMove} visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      {ballsRef.current.map((state, i) => (
        <SkillBall
          key={state.skill.label}
          state={state}
          mouseWorld={mouseWorld}
          allBalls={ballsRef}
          bounds={bounds}
          index={i}
        />
      ))}
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface SkillsUniverseProps {
  skills?: Skill[];
  height?: number;
}

export function SkillsUniverse({ skills = DEFAULT_SKILLS, height = 600 }: SkillsUniverseProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        height,
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.04) 0%, rgba(0,0,0,0) 65%), radial-gradient(ellipse at 80% 80%, rgba(236,72,153,0.03) 0%, transparent 55%)",
      }}
    >
      {/* Subtle grid mesh background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene skills={skills} />
      </Canvas>
    </div>
  );
}
