import React, { useRef } from 'react'
import { MeshLambertMaterial } from 'three';

function Grid() {
    const mesh = useRef(null);
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          <gridHelper args = {[30, 30, "hotpink", "hotpink"] }/>
          <axesHelper />
        </mesh>
    )
}

export default Grid
