import React from 'react'
import './App.scss';
import Grid from './components/Grid';
import { Canvas } from "react-three-fiber";

import { Plane } from 'drei'


function App() {
  return (
    <>
      <Canvas>
        <Grid />
        {/*<Plane attach= "material" color="hotpink" />*/}
      </Canvas>
    
    </>
  );
}

export default App;
