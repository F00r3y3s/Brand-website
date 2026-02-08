'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';

export default function ExpoTorus() {
    const groupRef = useRef<THREE.Group>(null);
    const outerRingRef = useRef<THREE.Mesh>(null);
    const innerRingRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.1;
            groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
        }

        // Pulse effect
        if (outerRingRef.current) {
            outerRingRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.02);
        }
    });

    return (
        <group ref={groupRef} rotation={[0.4, 0, 0]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Main Golden Ring - Complex Lattice Look */}
                <mesh ref={outerRingRef}>
                    <torusGeometry args={[3, 1.2, 16, 100]} />
                    <meshStandardMaterial
                        color="#DDA15E"
                        wireframe
                        transparent
                        opacity={0.8} // Increased from 0.3 for visibility
                        roughness={0.2}
                        metalness={0.9}
                        emissive="#DDA15E"
                        emissiveIntensity={0.5} // Boosted glow
                    />
                </mesh>

                {/* Second Interlaced Ring - Teal */}
                <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]} scale={0.9}>
                    <torusGeometry args={[3, 1, 16, 80]} />
                    <meshStandardMaterial
                        color="#3B7E84"
                        wireframe
                        transparent
                        opacity={0.6} // Increased from 0.2
                        roughness={0.2}
                        metalness={0.9}
                        emissive="#3B7E84"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Inner Core Particles or Geometry */}
                <mesh ref={coreRef}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshStandardMaterial
                        color="#5A375A"
                        wireframe
                        transparent
                        opacity={0.15}
                    />
                </mesh>

                {/* Floating "Orbs" to simulate the artifacts */}
                {[...Array(8)].map((_, i) => (
                    <mesh
                        key={i}
                        position={[
                            3.5 * Math.cos((i / 8) * Math.PI * 2),
                            3.5 * Math.sin((i / 8) * Math.PI * 2),
                            0
                        ]}
                    >
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="#DDA15E" emissive="#DDA15E" emissiveIntensity={2} />
                    </mesh>
                ))}

                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#DDA15E" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3B7E84" />
            </Float>
        </group>
    );
}
