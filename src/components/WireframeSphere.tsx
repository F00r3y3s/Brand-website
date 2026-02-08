'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WireframeSphere() {
    const meshRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // Rotate the wireframe sphere
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }

        if (particlesRef.current) {
            particlesRef.current.rotation.y -= 0.001;
        }
    });

    // Create floating particles
    const { positions, geometry } = useMemo(() => {
        const particleCount = 100;
        const pos = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const radius = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        return { positions: pos, geometry: geo };
    }, []);

    return (
        <group>
            {/* Wireframe Sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshBasicMaterial
                    color="#D4AF37"
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Inner Glow Sphere */}
            <mesh>
                <sphereGeometry args={[1.7, 32, 32]} />
                <meshBasicMaterial
                    color="#D4AF37"
                    transparent
                    opacity={0.05}
                />
            </mesh>

            {/* Floating Particles */}
            <points ref={particlesRef} geometry={geometry}>
                <pointsMaterial
                    size={0.05}
                    color="#E5C47B"
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>
        </group>
    );
}
