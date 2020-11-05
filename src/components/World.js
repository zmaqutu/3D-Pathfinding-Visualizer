import React from 'react'
import Grid from './Grid';
import { Canvas } from "react-three-fiber";
import Floor from './Floor';
import Tiles from './Tiles'
import { Plane, OrbitControls, PerspectiveCamera } from 'drei'

function World(props) {
    return (
        <>
        <Canvas colorManagement camera={{position: [0, 35, 0], fov: 50}}>
        <ambientLight intensity = {0.3}/>
        <Floor />
        <Grid gridDimensions = {30}/>
        <Tiles />
        <OrbitControls />
      </Canvas>
      </>
    )
}

export default World

