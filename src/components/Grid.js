import React, { useRef } from 'react'

import {useFrame } from "react-three-fiber";

function Grid() {
    const mesh = useRef(null);
    {/*useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.005));*/}
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          {/*<boxBufferGeometry attach = 'geometry' args = {[5, 5,0]} />
          <meshStandardMaterial attach = 'material' color="hotpink" />*/}
          <gridHelper args = {[30, 30, "hotpink", "hotpink"] }/>
          <axesHelper />
        </mesh>
    )
}

export default Grid
