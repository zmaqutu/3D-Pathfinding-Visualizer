import React from 'react'
import './App.scss';
import Grid from './components/Grid';
import { Canvas } from "react-three-fiber";
import Floor from './components/Floor';
import Tiles from './components/Tiles'

import { Plane, OrbitControls, PerspectiveCamera } from 'drei'
import World from './components/World';


function App() {
  let width = window.innerWidth,
				height = window.innerHeight;
  return (
    <>
      <World/>
    </>
  );
}

export default App;
