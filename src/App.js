import React from 'react'
import './App.scss';
import Grid from './components/Grid';
import { Canvas } from "react-three-fiber";
import Floor from './components/Floor';

import { Plane, OrbitControls, PerspectiveCamera } from 'drei'


function App() {
  let width = window.innerWidth,
				height = window.innerHeight;
  return (
    <>
      <Canvas colorManagement camera={{position: [-20, 30, 0], fov: 50}}>
        <ambientLight intensity = {0.3}/>
        <Floor />
        <Grid />
        <OrbitControls />
      </Canvas>
    
    </>
  );
}

export default App;
