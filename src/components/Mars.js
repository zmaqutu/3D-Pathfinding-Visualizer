import React from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';

function Mars() {
    const gltf = useLoader('/scene.gltf', true);
    return (
        <primitive object ={gltf.scene} dispose = {null} />
    )
}

export default Mars
