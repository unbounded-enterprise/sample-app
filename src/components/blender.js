import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
// import { MTLLoader } from 'three';
// import { OBJLoader } from 'three';
import { OBJLoader } from "../../node_modules/three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "../../node_modules/three/examples/jsm/loaders/MTLLoader.js";

export default function BlenderAnimation({ animationFile }) {
  const container = useRef();
  const [animationId, setAnimationId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Function to start the animation
  const playAnimation = () => {
    // Cancel any existing animation
    cancelAnimationFrame(animationId);

    // Set up the animation loop
    const animate = () => {
      setAnimationId(requestAnimationFrame(animate));
      renderer.render(scene, camera);
    };
    animate();
  };

  // Function to pause the animation
  const pauseAnimation = () => {
    // Cancel the animation loop
    cancelAnimationFrame(animationId);
  };

  useEffect(() => {
    // Create a Three.js scene and set up the camera and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.current.offsetWidth / container.current.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.current.offsetWidth, container.current.offsetHeight);
    container.current.appendChild(renderer.domElement);

    // Load the Blender 3D animation using the Three.js OBJLoader and MTLLoader
    const mtlLoader = new MTLLoader();
    mtlLoader.load(`/static/blender/muscle.mtl`, materials => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(`/static/blender/muscle.obj`, object => {
        scene.add(object);
        setLoaded(true);
      });
    });

    // Set up the animation loop
    const animate = () => {
      setAnimationId(requestAnimationFrame(animate));
      renderer.render(scene, camera);
    };
    animate();
  }, [animationFile]);

  return (
    <div>
      {loaded && <button onClick={playAnimation}>Play</button>}
      {loaded && <button onClick={pauseAnimation}>Pause</button>}
      <div ref={container} />
    </div>
  );
}
