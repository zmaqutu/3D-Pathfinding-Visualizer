import React, { useRef } from 'react'

import {useFrame } from "react-three-fiber";

function Grid() {
    const mesh = useRef(null);
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
    return (
        <mesh ref = {mesh}>
          <planeBufferGeometry attach = 'geometry' args = {[5, 5,1]} />
          <meshStandardMaterial attach = 'material' color="hotpink"/> 
        </mesh>
    )
}

export default Grid
