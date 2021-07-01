import React, { useState, useRef } from 'react';
import Grid from './Grid';
import Mars from './Mars';
import { Canvas } from 'react-three-fiber';
import Floor from './Floor';
import Controls from './Controls'; 
import { Button, Select, MenuItem } from '@material-ui/core'
import BorderClearIcon from '@material-ui/icons/BorderClear';
import TerrainIcon from '@material-ui/icons/Terrain';
import UndoIcon from '@material-ui/icons/Undo';
import { spacing } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
import Tutorial from './Tutorial';
import { AwesomeButton, AwesomeButtonProgress } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";


//<OrbitControls enabled = {!worldSetup} />
function World(props) {
   let width = window.innerWidth;
   let height = window.innerHeigh;



   const [selectedAlgorithm,  setSelectedAlgorithm] = useState({});     // keeps track of the algorithm we choose
   const [runState, setRunState] = useState(false);                     //when runState is true the visualizer algorithm is running
   const [resetCamera, setResetCamera] = useState(false);               //when resetCamera is true we reset the camera position
   const [clearWalls, setClearWalls] = useState(false);
   const [clearPath, setClearPath] = useState(false);
   const cameraPosition = useRef([0,375,0]);
   const [selectedMazeAlgorithm, setSelectedMazeAlgorithm] = useState("");
   const [algorithmSpeed, setAlgorithmSpeed] = useState("15");
   const [selected_algo_is_undefined, setAlgo] = useState(true)
   
   const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        //margin: theme.spacing(1),
        background: '#1E88E5',
        border: 0,
        borderRadius: 3,
        color: 'white',
        width: '150px',
        height: '44px',
        'margin-left': '10px',
        'font-family': 'inherit',
        'font-weight': 600,
        'font-style': 'normal',
      },
    },
  }));

  const classes = useStyles();


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
       if(event.target.value !== undefined){
           setAlgo(false);
        }
       if(event.target.value === undefined){
        setAlgo(true);
        }
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
        <div className = "header" align = "center" >
            <div className={classes.root}>
                <Select name = "algorithms" id = "algorithms" displayEmpty onChange={e => handleOnChange(e)}>
                    <MenuItem>Select Algorithm</MenuItem>
                    <MenuItem value = "Dijkstra">Dijkstra's Algorithm</MenuItem>
                    <MenuItem value = "aStar">A* Search</MenuItem>
                    <MenuItem value = "BFS">Breadth First Search</MenuItem>
                    <MenuItem value = "DFS">Depth First Search</MenuItem>
                    <MenuItem value = "Q-Learning">Q-Learning</MenuItem>

                </Select>
            </div>
            <div className={classes.root}>
                <Select name = "mazes" id = "mazes" displayEmpty onChange = {e => handleMazeChange(e)}>
                    <MenuItem>Select Maze</MenuItem>
                    <MenuItem value = "randomMaze">Random Maze</MenuItem>
                    <MenuItem value = "recursiveDivision">Recursive Division</MenuItem>
                </Select>
            </div>
            <div className = "header_items">
                <AwesomeButtonProgress 
                    type = "secondary"
                    size = "medium"
                    disabled = {runState || selected_algo_is_undefined}
                    loadingLabel = "Visualizing..."
                    resultLabel = "Success"
                    ripple = {true}
                    action={(element, next) => {
                        setTimeout(() => {
                            next(true, '');
                            setRunState(true)
                        }, 1000);
                    }}
                    >
                    Visualize
                </AwesomeButtonProgress>
            </div>
            <div className = "header_items">
                <AwesomeButtonProgress 
                    type = "secondary"
                    size = "medium"
                    disabled = {runState}
                    loadingLabel = "Clearing Path..."
                    resultLabel = "Path Cleared :-)"
                    ripple = {true}
                    action={(element, next) => {
                        setTimeout(() => {
                            next(true, '');
                            setClearPath(true)
                        }, 150);
                    }}
                    >
                    Clear Path
                </AwesomeButtonProgress>
            </div>
            <div className = "header_items">
                <AwesomeButtonProgress 
                    type = "secondary"
                    size = "medium"
                    disabled = {runState}
                    loadingLabel = "Clearing Walls..."
                    resultLabel = "Walls Cleared :-)"
                    ripple = {true}
                    action={(element, next) => {
                        setTimeout(() => {
                            next(true, '');
                            setClearWalls(true)
                        }, 550);
                    }}
                    >
                    Clear Walls
                </AwesomeButtonProgress>
            </div>
        <div className = "header_items">
        <AwesomeButton 
            type = "secondary"
            size = "medium"
            ripple = {true}
            action={(element, next) => {
                setResetCamera(!resetCamera)
            }}
            >
            Setup World
        </AwesomeButton>
        </div>
        <div className={classes.root}>
        <Select name = "algorithmSpeed" id = "algorithmSpeed" displayEmpty onChange = { e=> setAlgorithmSpeed(e.target.value)}>
            <MenuItem>Select Speed</MenuItem>
            <MenuItem value = "15">Fast</MenuItem>
            <MenuItem value = "25">Medium</MenuItem>
            <MenuItem value = "80">Slow</MenuItem>
        </Select>
        </div>
        </div>
        <Tutorial />
        <Canvas colorManagement 
        camera={
            {
                position: cameraPosition.current,
                fov: 53,
                aspect: width / height,
                near: 1, 
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

