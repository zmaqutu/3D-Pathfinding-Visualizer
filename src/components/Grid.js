import React, { useRef } from 'react'

import {useFrame } from "react-three-fiber";

function Grid() {
    const mesh = useRef(null);
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.005))
    return (
        <mesh ref = {mesh} position = {[0,2,-5]}>
          <boxBufferGeometry attach = 'geometry' args = {[5, 5,0]} />
          <meshStandardMaterial attach = 'material' color="hotpink"/> 
        </mesh>
    )
}

export default Grid
