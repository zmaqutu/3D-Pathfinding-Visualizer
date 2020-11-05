import React, { useRef } from 'react'
import { MeshLambertMaterial } from 'three';

function Grid(props) {
    const mesh = useRef(null);
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          <gridHelper args = {[props.gridDimensions, props.gridDimensions, "hotpink", "hotpink"] }/>
          <axesHelper />
        </mesh>
    )
}

export default Grid
