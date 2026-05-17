import React, { useState, useRef } from 'react';
import Grid from './Grid';
import { Canvas } from '@react-three/fiber';
import Floor from './Floor';
import Controls from './Controls';
import { Box, Select, MenuItem } from '@mui/material';
import Tutorial from './Tutorial';
import Settings from './Settings';
import { AwesomeButton, AwesomeButtonProgress } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";

const headerControlSx = {
   '& > *': {
      background: '#1E88E5',
      border: 0,
      borderRadius: '3px',
      color: 'white',
      width: '150px',
      height: '44px',
      marginLeft: '10px',
      fontFamily: 'inherit',
      fontWeight: 600,
      fontStyle: 'normal',
   },
};

function World() {
   const width = window.innerWidth;
   const height = window.innerHeight;

   const [selectedAlgorithm, setSelectedAlgorithm] = useState({});
   const [runState, setRunState] = useState(false);
   const [resetCamera, setResetCamera] = useState(false);
   const [clearWalls, setClearWalls] = useState(false);
   const [clearPath, setClearPath] = useState(false);
   const [trainAgent, setTrainAgent] = useState(false);
   const [agentKnowledge, setAgentKnowledge] = useState("");
   const cameraPosition = useRef([200, 250, 250]);
   const [selectedMazeAlgorithm, setSelectedMazeAlgorithm] = useState("");
   const [algorithmSpeed, setAlgorithmSpeed] = useState("15");
   const [selected_algo_is_undefined, setAlgo] = useState(true);

   const [policyCuriosity, setPolicyCuriosity] = useState(0.8);
   const [selectedWallType, setSelectedWallType] = useState("building");

   const [applyingSettings, setApplyingSettings] = useState(false);
   const [settingsConfig, setConfig] = useState({
      epochs: 1000,
      startRow: 5,
      startCol: 5,
      finishRow: 25,
      finishCol: 25,
      learningRate: 0.2,
      agentCuriosity: 0.8,
   });

   const [visualizeOptimalPolicy, setVisualizeOptimalPolicy] = useState(false);

   function updateRunState(newState) { setRunState(newState); }
   function stopClearPath() { setClearPath(false); }
   function stopClearWalls() { setClearWalls(false); }
   function startTraining() { setTrainAgent(true); }
   function stopTraining() { setTrainAgent(false); }
   function resetAgentKnowledge() { setAgentKnowledge("clearMemory"); }
   function agentResetDone() { setAgentKnowledge(""); }
   function configureSettings(userEpochs, userStartRow, userStartCol, userFinishRow, userFinishCol, userLearningRate, userAgentCuriosity) {
      setConfig({
         epochs: Number(userEpochs),
         startRow: Number(userStartRow),
         startCol: Number(userStartCol),
         finishRow: Number(userFinishRow),
         finishCol: Number(userFinishCol),
         learningRate: Number(userLearningRate),
         agentCuriosity: Number(userAgentCuriosity),
      });
      setApplyingSettings(true);
   }
   function finishApplyingSettings() { setApplyingSettings(false); }
   function visualizePolicy() { setVisualizeOptimalPolicy(true); }
   function updateAgentCuriosity(agentQ) { setPolicyCuriosity(agentQ); }
   function finishedOptimalPolicy() { setVisualizeOptimalPolicy(false); }

   function handleOnChange(event) {
      const value = event.target.value;
      setAlgo(value === undefined || value === "");
      if (value === "Dijkstra") {
         setSelectedAlgorithm({ algorithm: "Dijkstra", type: "weighted", heuristic: "" });
      } else if (value === "qLearning") {
         setSelectedAlgorithm({ algorithm: "Q-Learning", type: "machine-learning", heuristic: "" });
      } else if (value === "aStar") {
         setSelectedAlgorithm({ algorithm: "aStar", type: "weighted", heuristic: "poweredManhattanDistance" });
      } else if (value === "BFS") {
         setSelectedAlgorithm({ algorithm: "BFS", type: "unweighted", heuristic: "" });
      } else if (value === "DFS") {
         setSelectedAlgorithm({ algorithm: "DFS", type: "unweighted", heuristic: "" });
      }
   }
   function updateResetStatus() { setResetCamera(false); }
   function handleMazeChange(event) { setSelectedMazeAlgorithm(event.target.value); }
   function stopMazeSelection() { setSelectedMazeAlgorithm(""); }

   return (
      <>
         <div className="header" align="center">
            <Box className="header_items" sx={headerControlSx}>
               <Select name="algorithms" id="algorithms" displayEmpty defaultValue="" onChange={handleOnChange}>
                  <MenuItem value="">Select Algorithm</MenuItem>
                  <MenuItem value="qLearning">Q-Learning</MenuItem>
                  <MenuItem value="Dijkstra">Dijkstra's Algorithm</MenuItem>
                  <MenuItem value="aStar">A* Search</MenuItem>
                  <MenuItem value="BFS">Breadth First Search</MenuItem>
                  <MenuItem value="DFS">Depth First Search</MenuItem>
               </Select>
            </Box>
            <Box className="header_items" sx={headerControlSx}>
               <Select name="mazes" id="mazes" displayEmpty defaultValue="" onChange={handleMazeChange}>
                  <MenuItem value="">Select Maze</MenuItem>
                  <MenuItem value="randomMaze">Random Maze</MenuItem>
                  <MenuItem value="recursiveDivision">Recursive Division</MenuItem>
               </Select>
            </Box>
            <Box className="header_items" sx={headerControlSx}>
               <Select name="wallType" id="wallType" value={selectedWallType} onChange={(e) => setSelectedWallType(e.target.value)}>
                  <MenuItem value="building">Buildings</MenuItem>
                  <MenuItem value="tree">Trees</MenuItem>
               </Select>
            </Box>
            <div className="header_items">
               <AwesomeButtonProgress
                  type="secondary"
                  size="medium"
                  disabled={runState || selected_algo_is_undefined}
                  loadingLabel="Visualizing..."
                  resultLabel="Success"
                  ripple
                  onPress={(event, release) => {
                     setTimeout(() => {
                        release(true, '');
                        setRunState(true);
                     }, 1000);
                  }}
               >
                  Visualize
               </AwesomeButtonProgress>
            </div>
            <div className="header_items">
               <AwesomeButtonProgress
                  type="secondary"
                  size="medium"
                  disabled={runState}
                  loadingLabel="Clearing Path..."
                  resultLabel="Path Cleared :-)"
                  ripple
                  onPress={(event, release) => {
                     setTimeout(() => {
                        release(true, '');
                        setClearPath(true);
                     }, 150);
                  }}
               >
                  Clear Path
               </AwesomeButtonProgress>
            </div>
            <div className="header_items">
               <AwesomeButtonProgress
                  type="secondary"
                  size="medium"
                  disabled={runState}
                  loadingLabel="Clearing Walls..."
                  resultLabel="Walls Cleared :-)"
                  ripple
                  onPress={(event, release) => {
                     setTimeout(() => {
                        release(true, '');
                        setClearWalls(true);
                     }, 550);
                  }}
               >
                  Clear Walls
               </AwesomeButtonProgress>
            </div>
            <div className="header_items">
               <AwesomeButton
                  type="secondary"
                  size="medium"
                  ripple
                  onPress={() => setResetCamera(!resetCamera)}
               >
                  Setup World
               </AwesomeButton>
            </div>
            <Box className="header_items" sx={headerControlSx}>
               <Select name="algorithmSpeed" id="algorithmSpeed" displayEmpty defaultValue="15" onChange={e => setAlgorithmSpeed(e.target.value)}>
                  <MenuItem value="">Select Speed</MenuItem>
                  <MenuItem value="15">Fast</MenuItem>
                  <MenuItem value="25">Medium</MenuItem>
                  <MenuItem value="80">Slow</MenuItem>
               </Select>
            </Box>
            <div className="header_items">
               <AwesomeButton
                  type="secondary"
                  size="medium"
                  ripple
                  onPress={() => resetAgentKnowledge()}
               >
                  Reset Agent
               </AwesomeButton>
            </div>
         </div>
         <Tutorial />
         <Settings
            startTraining={startTraining}
            configureSettings={configureSettings}
            updateAgentCuriosity={updateAgentCuriosity}
            visualizePolicy={visualizePolicy}
         />
         <Canvas
            camera={{
               position: cameraPosition.current,
               fov: 53,
               aspect: width / height,
               near: 1,
               far: 5000,
            }}
         >
            <ambientLight intensity={Math.PI} color={0xBBC2D0} />
            <hemisphereLight
               color={"hsl(0.6, 1, 0.6)"}
               groundColor={0x87775d}
               intensity={0.1 * Math.PI}
               position={[0, 5, 0]}
            />
            <directionalLight
               color={"hsl(0.1, 1, 0.95)"}
               intensity={0.5 * Math.PI}
               position={[-70, 122.5, 70]}
               castShadow
            />
            <Grid
               gridDimensions={30}
               updateRunState={updateRunState}
               stopClearPath={stopClearPath}
               stopClearWalls={stopClearWalls}
               stopMazeSelection={stopMazeSelection}
               stopTraining={stopTraining}
               agentResetDone={agentResetDone}
               finishApplyingSettings={finishApplyingSettings}
               visualizeOptimalPolicy={visualizeOptimalPolicy}
               policyCuriosity={policyCuriosity}
               finishedOptimalPolicy={finishedOptimalPolicy}
               resetStatus={resetCamera}
               agentKnowledge={agentKnowledge}
               selectedAlgorithm={selectedAlgorithm}
               selectedMazeAlgorithm={selectedMazeAlgorithm}
               algorithmSpeed={algorithmSpeed}
               applyingSettings={applyingSettings}
               settingsConfig={settingsConfig}
               selectedWallType={selectedWallType}
               worldProperties={{
                  rows: 30,
                  cols: 30,
                  runState: runState,
                  clearPath: clearPath,
                  clearWalls: clearWalls,
                  trainAgent: trainAgent,
                  start: { row: settingsConfig.startRow, col: settingsConfig.startCol },
                  finish: { row: settingsConfig.finishRow, col: settingsConfig.finishCol },
                  colors: {
                     start: { r: 0, g: 1, b: 0 },
                     finish: { r: 1, g: 0, b: 0 },
                     wall: { r: 0.109, g: 0.109, b: 0.45 },
                     visited: { r: 0.329, g: 0.27, b: 0.968 },
                     path: { r: 1, g: 1, b: 0 },
                     default: { r: 1, g: 1, b: 1 },
                  },
                  nodeDimensions: { height: 10, width: 10 },
               }}
            />
            <Floor />
            <Controls
               resetStatus={resetCamera}
               updateResetStatus={updateResetStatus}
            />
         </Canvas>
      </>
   );
}

export default World;
