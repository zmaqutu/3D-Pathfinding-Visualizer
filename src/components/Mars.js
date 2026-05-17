import React, { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Mars() {
    const [marsModel, setMarsModel] = useState(null);
    useEffect(() => {
        new GLTFLoader().load('/models/scene.gltf', setMarsModel);
    }, []);
    if (!marsModel) return null;
    return <primitive object={marsModel.scene} />;
}

export default Mars;
