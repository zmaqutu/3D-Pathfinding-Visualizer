import React from 'react'
import './App.scss';
import Grid from './components/Grid';
import { Canvas } from "react-three-fiber";
import Floor from './components/Floor';

import { Plane, OrbitControls } from 'drei'


function App() {
  return (
    <>
      <Canvas colorManagement camera={{position: [-20, 30, 5], fov: 60}}>
        <ambientLight intensity = {0.3}/>
        <Floor>
        </Floor>
        <Grid />
        {/*<Plane attach= "material" color="hotpink" />*/}
        <OrbitControls />
      </Canvas>
    
    </>
  );
}

export default App;
