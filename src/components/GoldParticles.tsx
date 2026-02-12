'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GoldParticles({ count = 200 }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    // Generate random particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = Math.random() * 100 - 50;
            const y = Math.random() * 100 - 50;
            const z = Math.random() * 100 - 50;

            temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        const currentMesh = mesh.current;
        if (!currentMesh) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;

            // Orbit movement
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Update positions
            particle.mx += (state.mouse.x * 100 - particle.mx) * 0.01;
            particle.my += (state.mouse.y * 100 - 1 - particle.my) * 0.01;

            dummy.position.set(
                (particle.mx / 10) * a + x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Scale pulsing
            const scale = (Math.cos(t) + 2) / 2; // size varies between 0.5 and 1.5
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            currentMesh.setMatrixAt(i, dummy.matrix);
        });

        currentMesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight ref={lightRef} distance={40} intensity={2} color="#D4AF37" />
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <dodecahedronGeometry args={[0.08, 0]} />
                <meshPhongMaterial color="#D4AF37" emissive="#8B6F47" transparent opacity={0.8} />
            </instancedMesh>
        </>
    );
}
