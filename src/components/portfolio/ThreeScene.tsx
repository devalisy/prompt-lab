"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 15, 30);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.4, 0.6, 128, 16),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x4ade80),
        metalness: 0.6,
        roughness: 0.2,
        wireframe: false,
        transparent: true,
        opacity: 0.15,
        emissive: new THREE.Color(0x4ade80),
        emissiveIntensity: 0.08,
      })
    );
    torusKnot.position.y = 0.5;
    scene.add(torusKnot);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.08, 32, 64),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x4ade80),
        transparent: true,
        opacity: 0.2,
      })
    );
    innerRing.position.y = 0.5;
    scene.add(innerRing);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.04, 16, 96),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x60a5fa),
        transparent: true,
        opacity: 0.12,
      })
    );
    outerRing.position.y = 0.5;
    scene.add(outerRing);

    const particleCount = 800;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 40;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 40;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(0x4ade80),
      size: 0.04,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      target.x += (mouse.x - target.x) * 0.05;
      target.y += (mouse.y - target.y) * 0.05;

      torusKnot.rotation.x = t * 0.15 + target.y * 0.3;
      torusKnot.rotation.y = t * 0.2 + target.x * 0.3;
      torusKnot.position.y = 0.5 + Math.sin(t * 0.3) * 0.3;

      innerRing.rotation.x = Math.PI / 3 + t * 0.1;
      innerRing.rotation.y = t * 0.15 + target.x * 0.2;
      innerRing.position.y = 0.5 + Math.sin(t * 0.3 + 1) * 0.3;

      outerRing.rotation.x = -Math.PI / 4 + t * 0.05;
      outerRing.rotation.y = t * 0.08 - target.x * 0.15;
      outerRing.position.y = 0.5 + Math.sin(t * 0.3 + 2) * 0.3;

      particles.rotation.y = t * 0.02;

      camera.position.x += (target.x * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (-target.y * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 45%, black, transparent)" }}
    />
  );
}
