import {React, useEffect, useState} from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from 'react-three-fiber';

function Mars() {
    //const gltf = useLoader('/scene.gltf', true);
    const [marsModel,setMarsModel] = useState();
    useEffect(() => {
        new GLTFLoader().load('/models/scene.gltf',setMarsModel);
        return null;
    })
    console.log(marsModel)
    return (
       <mesh></mesh>
    )
}

export default Mars
