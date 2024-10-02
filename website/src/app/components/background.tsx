'use client';

import { cn } from '@/app/utils';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;

  highp float rand(vec2 co) {
    return fract(sin(mod(dot(co.xy ,vec2(12.9898,78.233)),3.14))*43758.5453);
  }

  float tnoise(vec2 co){
    vec2 w=co;
    co.y+=co.x/2.;
    const vec2 s=vec2(1.,0.);
    vec2 p=floor(co);
    if(fract(co.x)<fract(co.y))p+=0.5;    
    return rand(p);
  }

  void main() {
    vec2 uv = (vUv * iResolution * 2.0 - iResolution) / 40.0;
    float n = tnoise(uv);
    
    vec3 baseColor = vec3(0.9, 0.9, 0.95);
    vec3 variation = vec3(sin(iTime*n*7.+n*3.141592653589793*2.)*0.1+0.9);
    
    vec4 fragColor = vec4(baseColor * variation, 1.0);
    
    fragColor.rgb += vec3(sin((uv.x-uv.y)*30.)*0.05);
    fragColor.rgb += vec3(rand(uv)*0.1);
    
    fragColor.rgb = clamp(fragColor.rgb, 0.7, 1.0);
    
    gl_FragColor = fragColor;
  }
`;

interface Props {
  className?: string;
}

export const Background: React.FC<Props> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
    });
    materialRef.current = material;

    // Create a plane that fills the screen
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    const animate = (time: number) => {
      if (materialRef.current) {
        materialRef.current.uniforms.iTime.value = time / 1000;
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      requestAnimationFrame(animate);
    };
    animate(0);

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && materialRef.current) {
        const newAspect = window.innerWidth / window.innerHeight;
        cameraRef.current.left = -newAspect;
        cameraRef.current.right = newAspect;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        materialRef.current.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Set isMounted to true after the first render
    renderer.setAnimationLoop(() => {
      if (!isMounted) {
        setIsMounted(true);
      }
    });

    // Cleanup
    const container = containerRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMounted || !rendererRef.current) return;
    rendererRef.current.setAnimationLoop(() => {
      if (!isMounted) {
        setIsMounted(true);
      }
    });
  }, [isMounted]);

  return (
    <div
        ref={containerRef}
        className={cn(
          'pointer-events-none radial-mask absolute inset-0 -z-10 mix-blend-overlay transition-opacity duration-100 ease-out',
          isMounted ? 'opacity-100 duration-1000' : 'opacity-0',
          className,
        )}
      />
  );
};
