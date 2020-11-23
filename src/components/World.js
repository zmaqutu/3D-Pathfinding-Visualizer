import React, { useState } from 'react';
import Grid from './Grid';
import * as THREE from 'three';
import { Canvas } from "react-three-fiber";
import Floor from './Floor';
import Tiles from './Tiles';
import { Plane, OrbitControls, PerspectiveCamera } from 'drei';
import { PlaneBufferGeometry, Scene } from 'three';

function World(props) {
   let width = window.innerWidth;
   let height = window.innerHeigh;

   const [runState, setRunState] = useState(false);

   const groundGeometry1 = new THREE.PlaneGeometry(300,300,30,30);
   const groundMaterial1 = new THREE.MeshLambertMaterial({transparent: false, color: "hotpink"});

   const groundMesh = new THREE.Mesh(groundGeometry1, groundMaterial1);

   function updateRunState(newState){
       setRunState(false);
       console.log(runState)
   }

    return (
        <>
        <select name = "algorithms" id = "algorithms">
            <option value = "Dijkstra">Dijkstra's Algorithm</option>
            <option value = "BFS">BFS</option>
            <option value = "aStar">A* Search</option>
        </select>
        <button onClick = {e => setRunState(true)}>Vizualize</button>
        <Canvas colorManagement 
        camera={
            {
                position: [0, 350, 0],
                 fov: 50,
                  aspect: width / height, 
                  far: 5000
                }
            }
        >
        <ambientLight 
            intensity = {1} 
            color = {0xBBC2D0}/>
        {/*<fog attach = "fog" args = {[0xFFFFFF , 0, 750]}/>*/}
        <hemisphereLight 
            color = {"hsl(0.6, 1, 0.6)"} 
            groundColor = {0x87775d} 
            intensity = {0.1} 
            position = {[0,5,0]} 
        />
        <directionalLight 
            color = {"hsl(0.1, 1, 0.95)"} 
            groundColor = {0x87775d} 
            intensity = {0.5} 
            position = {[-70,122.5,70]} 
            castShadow = {true}
        />     
        
        
        <Grid 
            gridDimensions = {30}
            updateRunState = {updateRunState} 
            worldProperties = {
            {
                rows: 30,
                cols: 30,
                runState: runState,
                start: {
                    row: 5,
                    col: 5,
                },
                finish: {
                    row: 25,
                    col: 25,
                },
                colors: {
                    start: {r: 0, g: 1, b: 0 },
                    finish: {r: 1, g: 0, b: 0},
                    wall: {r: 0.109, g: 0.109, b: 0.45},
                    visited: {r: 0.329, g: 0.27, b: 0.968},
                    path: {r: 1, g: 1, b: 0},
                    default: {r: 1, g: 1, b: 1},
                },
                nodeDimensions:{
                    height: 10,
                    width: 10,
                },
            }
        }/>
        <Floor/>
        <OrbitControls />
      </Canvas>
      </>
    )
}

export default World

