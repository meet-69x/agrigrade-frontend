import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DOnion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing canvas elements (prevents duplicate canvas in React Strict Mode)
    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Single Procedural 3D Onion Model Group
    const onionGroup = new THREE.Group();

    // Main Bulb Geometry (Oblong Spheroid)
    const bulbGeometry = new THREE.SphereGeometry(1.6, 48, 48);
    bulbGeometry.scale(1.0, 1.18, 1.0); // Natural onion shape

    // Rich Papery Golden-Amber Material
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0xc98a2c,
      roughness: 0.3,
      metalness: 0.15,
    });

    const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
    onionGroup.add(bulbMesh);

    // Tech CV Wireframe Bounding Box
    const cageGeometry = new THREE.BoxGeometry(3.6, 3.9, 3.6);
    const cageMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4ff3f,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
    onionGroup.add(cageMesh);

    // Top Dry Stem Closure
    const stemGeometry = new THREE.ConeGeometry(0.35, 1.1, 16);
    stemGeometry.translate(0, 2.0, 0);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x6e4827, roughness: 0.8 });
    const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
    onionGroup.add(stemMesh);

    // Bottom Root Base Plate
    const rootGeometry = new THREE.CylinderGeometry(0.4, 0.1, 0.35, 16);
    rootGeometry.translate(0, -1.95, 0);
    const rootMaterial = new THREE.MeshStandardMaterial({ color: 0x473722, roughness: 0.9 });
    const rootMesh = new THREE.Mesh(rootGeometry, rootMaterial);
    onionGroup.add(rootMesh);

    scene.add(onionGroup);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0xd4ff3f, 2.8); // Electric Lime Rim Light
    rimLight.position.set(5, 5, 5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xff6b35, 2.2); // Warm Orange fill light
    fillLight.position.set(-5, -3, -2);
    scene.add(fillLight);

    // 5. Mouse Parallax Movement
    const handleMouseMove = (e: MouseEvent) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mousePos.current = {
        x: (e.clientX - halfX) * 0.001,
        y: (e.clientY - halfY) * 0.001,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous Auto-Rotation
      onionGroup.rotation.y += 0.008;
      cageMesh.rotation.x += 0.003;

      // Smooth Mouse Parallax Tilt
      onionGroup.rotation.x += (mousePos.current.y - onionGroup.rotation.x) * 0.06;
      onionGroup.rotation.z += (-mousePos.current.x - onionGroup.rotation.z) * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    // 7. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      {/* Background Radial Glow Ring */}
      <div className="absolute w-72 h-72 rounded-full bg-[#D4FF3F]/10 filter blur-3xl pointer-events-none animate-pulse-glow" />

      {/* WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive HUD Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#14170F]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#2A2E22] text-[11px] font-mono text-[#D4FF3F] flex items-center gap-2 pointer-events-none shadow-dark-card">
        <span className="w-2 h-2 rounded-full bg-[#D4FF3F] animate-ping" />
        <span>Single 3D CV Mesh • Interactive Cursor Tilt</span>
      </div>
    </div>
  );
};
