import React, { useState, useRef } from 'react';
import Grid from './Grid';
import * as THREE from 'three';
import { Canvas } from "react-three-fiber";
import Floor from './Floor';
import Tiles from './Tiles';
import { Plane, PerspectiveCamera } from 'drei';
import { PlaneBufferGeometry, Scene } from 'three';
import { useThree } from 'react-three-fiber';
import Controls from './Controls';

//<OrbitControls enabled = {!worldSetup} />
function World(props) {
   let width = window.innerWidth;
   let height = window.innerHeigh;

   const [selectedAlgorithm,  setSelectedAlgorithm] = useState({});     // keeps track of the algorithm we choose
   const [runState, setRunState] = useState(false);                     //when runState is true the visualizer algorithm is running
   const [resetCamera, setResetCamera] = useState(false);               //when resetCamera is true we reset the camera position
   const [clearWalls, setClearWalls] = useState(false);
   const [clearPath, setClearPath] = useState(false);
   const cameraPosition = useRef([0,350,0]);
   const [selectedMazeAlgorithm, setSelectedMazeAlgorithm] = useState("");
   const [algorithmSpeed, setAlgorithmSpeed] = useState("15");


   //calling on this funciton in the child component (Grid) to update runstate in this parent
   function updateRunState(newState){
       setRunState(newState);
   }
   function stopClearPath(){
       setClearPath(false);
   }
   function stopClearWalls(){
       setClearWalls(false);
   }
   function handleOnChange(event){
       if(event.target.value === "Dijkstra"){
           setSelectedAlgorithm({
               algorithm: "Dijkstra",
               type: "weighted", 
               heuristic: "",
           });
       }
       else if(event.target.value === "aStar"){
           setSelectedAlgorithm({
               algorithm: "aStar",
               type: "weighted",
               heuristic: "poweredManhattanDistance",
           });
       }
       else if(event.target.value === "BFS"){
           setSelectedAlgorithm({
               algorithm: "BFS",
               type: "unweighted",
               heuristic: "",
           });
       }
       else if(event.target.value === "DFS"){
           setSelectedAlgorithm({
               algorithm: "DFS",
               type: "unweighted",
               heuristic: ""
           })
       }
   }
   function updateResetStatus(){
       setResetCamera(false);
   }
   function handleMazeChange(event){
       setSelectedMazeAlgorithm(event.target.value);
   }
   function stopMazeSelection(){
       setSelectedMazeAlgorithm("");
   }

    return (
        <>
        <select name = "algorithms" id = "algorithms" onChange={e => handleOnChange(e)}>
            <option>Select Algorithm</option>
            <option value = "Dijkstra">Dijkstra's Algorithm</option>
            <option value = "aStar">A* Search</option>
            <option value = "BFS">Breadth First Search</option>
            <option value = "DFS">Depth First Search</option>
        </select>
        <select name = "mazes" id = "mazes" onChange = {e => handleMazeChange(e)}>
            <option>Select Maze</option>
            <option value = "randomMaze">Random Maze</option>
            <option value = "recursiveDivision">Recursive Division</option>
        </select>
        <button onClick = {e => setRunState(true)}>Vizualize</button>
        <button onClick = {e => setClearPath(true)}>Clear Path</button>
        <button onClick = {e => setClearWalls(true)}>Clear Walls</button>
        <button onClick = {e => setResetCamera(!resetCamera)}>Setup World</button>
        <select name = "algorithmSpeed" id = "algorithmSpeed" onChange = { e=> setAlgorithmSpeed(e.target.value)}>
            <option value = "15">Fast</option>
            <option value = "25">Medium</option>
            <option value = "80">Slow</option>
        </select>
        <Canvas colorManagement 
        camera={
            {
                position: cameraPosition.current,
                 fov: 52.5,
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
            stopClearPath = {stopClearPath}
            stopClearWalls = {stopClearWalls}
            stopMazeSelection = {stopMazeSelection}
            resetStatus = {resetCamera}
            selectedAlgorithm = {selectedAlgorithm}
            selectedMazeAlgorithm = {selectedMazeAlgorithm}
            algorithmSpeed = {algorithmSpeed} 
            worldProperties = {
            {
                rows: 30,
                cols: 30,
                runState: runState,
                clearPath: clearPath,
                clearWalls: clearWalls,
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
        <Controls 
            resetStatus = {resetCamera}
            updateResetStatus = {updateResetStatus}
        />
      </Canvas>
      </>
    )
}

export default World

