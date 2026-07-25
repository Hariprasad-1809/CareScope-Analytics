import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// 1. Mouse Interaction Component (tilts the scene)
const InteractiveGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Soft easing transition for pointer movement tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.4, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.4, 0.05);
      // Auto constant slow rotation
      groupRef.current.rotation.y += 0.001;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

// 2. Main Animated Node Network
const NodesNetwork: React.FC = () => {
  const nodeCount = 35;
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const [nodes, setNodes] = useState<{ pos: THREE.Vector3; initialPos: THREE.Vector3; speed: number; phase: number }[]>([]);

  // Generate random stable nodes
  useEffect(() => {
    const initialNodes = Array.from({ length: nodeCount }, () => {
      const x = (Math.random() - 0.5) * 6;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 6;
      const pos = new THREE.Vector3(x, y, z);
      return {
        pos: pos.clone(),
        initialPos: pos.clone(),
        speed: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2
      };
    });
    setNodes(initialNodes);
  }, []);

  // Animate node movements (floating oscillation)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (nodes.length === 0) return;
    
    nodes.forEach((node, i) => {
      const offset = Math.sin(time * node.speed + node.phase) * 0.15;
      const updatedPos = node.initialPos.clone().add(new THREE.Vector3(
        offset * Math.cos(node.phase),
        offset * Math.sin(node.phase),
        offset * Math.tan(node.phase * 0.1)
      ));
      
      // Update mesh positions directly for performance
      if (nodesRef.current[i]) {
        nodesRef.current[i].position.copy(updatedPos);
      }
    });
  });

  // Calculate lines between nearby nodes
  const lines = React.useMemo(() => {
    if (nodes.length === 0) return [];
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    const maxDistance = 2.5;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < maxDistance) {
          connections.push([nodes[i].pos, nodes[j].pos]);
        }
      }
    }
    return connections;
  }, [nodes]);

  return (
    <>
      {/* Node Spheres */}
      {nodes.map((node, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) nodesRef.current[idx] = el;
          }}
          position={node.pos}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial 
            color={idx % 3 === 0 ? '#14B8A6' : '#3B82F6'} 
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Connection Lines */}
      {lines.map((line, idx) => (
        <Line
          key={idx}
          points={[line[0], line[1]]}
          color="#3B82F6"
          lineWidth={1}
          opacity={0.15}
          transparent
        />
      ))}
    </>
  );
};

// 3. Camera adjustments and Responsive handler
export const Hero3D: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Performance Optimization: Hide 3D component on mobile
  if (isMobile) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-medical-blue/10 to-teal-glow/5 rounded-xl border border-slate-800">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-medical-blue/10 border border-medical-blue flex items-center justify-center text-medical-blue animate-pulse mb-3">
            <span className="font-bold text-xs">3D API</span>
          </div>
          <p className="text-xs text-slate-400">Telemetry Visualizer active</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <InteractiveGroup>
          <NodesNetwork />
        </InteractiveGroup>
      </Canvas>
    </div>
  );
};
export default Hero3D;
