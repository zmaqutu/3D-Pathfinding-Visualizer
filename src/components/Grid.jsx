import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import rwc from 'random-weighted-choice';
import { useFrame } from '@react-three/fiber';

import img from './floor_texture.jpg';
import { tweenToColor, getNodesInShortestPathOrder, tweenGroup } from './algorithms/helpers';
import { weightedSearchAlgorithm } from './algorithms/weightedSearchAlgorithm.js';
import { unweightedSearchAlgorithm } from './algorithms/unweightedSearchAlgorithm.js';
import { randomMaze, recursiveDivisionMaze } from './algorithms/mazeAlgorithms';
import WallObjects from './Walls';

const GRID_SIZE = 300;
const ROWS = 30;
const COLS = 30;

// Builds a non-indexed plane and registers a vertex `color` attribute.
// After toNonIndexed, each quad owns 6 unique vertices laid out as two tris.
function buildGeometry() {
   const geom = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, COLS, ROWS).toNonIndexed();
   const vertexCount = geom.getAttribute('position').count;
   const colors = new Float32Array(vertexCount * 3);
   for (let i = 0; i < colors.length; i++) colors[i] = 1; // white
   geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
   return geom;
}

// Cell (row, col) -> the 6 vertex indices the cell owns in the non-indexed
// PlaneGeometry. Plane iterates ix (col) fast, iy (row) slow.
function vertexOffsetsFor(row, col) {
   const base = (row * COLS + col) * 6;
   return [base, base + 1, base + 2, base + 3, base + 4, base + 5];
}

function Grid(props) {

   const meshRef = useRef(null);
   const groundGeometry = useMemo(buildGeometry, []);
   const groundMaterial = useMemo(
      () => new THREE.MeshLambertMaterial({
         vertexColors: true,
         side: THREE.FrontSide,
      }),
      []
   );

   // Async texture load. Material renders white until the texture arrives.
   useEffect(() => {
      const loader = new THREE.TextureLoader();
      loader.load(img, (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         texture.repeat.set(30, 30);
         texture.colorSpace = THREE.SRGBColorSpace;
         groundMaterial.map = texture;
         groundMaterial.needsUpdate = true;
      });
   }, [groundMaterial]);

   // Drive tween updates from r3f's render loop.
   useFrame(() => { tweenGroup.update(); });

   // Mouse-drag wall painting needs values that survive across event handlers
   // without re-triggering renders.
   const dragRef = useRef({
      mouseDownX: 0,
      mouseDownY: 0,
      mouseIsUp: true,
      previousHoverNodeId: null,
      currentHoverNodeId: null,
   });

   // Imperative grid state. Mutated by algorithms; never reassigned.
   const terrainRef = useRef(null);
   if (terrainRef.current === null) {
      terrainRef.current = initialTerrain();
   }

   // Walls are 3D meshes layered on top of the floor. Keyed by `row*COLS+col`
   // for O(1) add/remove.
   const [walls, setWalls] = useState({});

   function addWall(row, col, type) {
      const id = row * COLS + col;
      setWalls((prev) => ({ ...prev, [id]: { row, col, type } }));
   }
   function removeWall(row, col) {
      const id = row * COLS + col;
      setWalls((prev) => {
         if (!(id in prev)) return prev;
         const next = { ...prev };
         delete next[id];
         return next;
      });
   }

   function initialTerrain() {
      const grid = [];
      for (let row = 0; row < ROWS; row++) {
         const currentRow = [];
         for (let col = 0; col < COLS; col++) {
            currentRow.push(createNode(row, col));
         }
         grid.push(currentRow);
      }
      return {
         grid,
         states: initStates(),
         q_table: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
         records: [],
         optimalPolicy: [],
         actions: { left: [0, -1], down: [1, 0], right: [0, 1], up: [-1, 0] },
         discountFactor: 0.8,
         alpha: 0.1,
         start: [props.settingsConfig.startRow, props.settingsConfig.startCol],
         finish: [props.settingsConfig.finishRow, props.settingsConfig.finishCol],
      };
   }

   function createNode(row, col) {
      let status = 'default';
      if (row === props.worldProperties.start.row && col === props.worldProperties.start.col) {
         status = 'start';
      } else if (row === props.worldProperties.finish.row && col === props.worldProperties.finish.col) {
         status = 'finish';
      }
      const node = {
         id: row * COLS + col,
         row,
         col,
         vertexOffsets: vertexOffsetsFor(row, col),
         color: { r: 1, g: 1, b: 1 },
         status,
         wallType: null,
         distance: Infinity,
         totalDistance: Infinity,
         heuristicDistance: null,
         direction: null,
         weight: 0,
         qValue: 0,
         reward: 0,
         visits: 0,
         onceSpecial: false,
         previousNode: null,
      };
      if (status === 'start') {
         node.onceSpecial = true;
         tweenToColor(node, groundGeometry, [props.worldProperties.colors.start]);
      } else if (status === 'finish') {
         node.reward = 100;
         node.onceSpecial = true;
         tweenToColor(node, groundGeometry, [props.worldProperties.colors.finish]);
      }
      return node;
   }

   function initStates() {
      const out = [];
      for (let row = 0; row < ROWS; row++) {
         for (let col = 0; col < COLS; col++) {
            out.push([row, col]);
         }
      }
      return out;
   }

   const runState = props.worldProperties.runState;
   const trainTheAgent = props.worldProperties.trainAgent;
   const clearTheWalls = props.worldProperties.clearWalls;
   const clearThePath = props.worldProperties.clearPath;
   const selectedMazeAlgorithm = props.selectedMazeAlgorithm;
   const agentKnowledge = props.agentKnowledge;
   const applyingSettings = props.applyingSettings;
   const visualizeThePolicy = props.visualizeOptimalPolicy;

   useEffect(() => {
      if (props.applyingSettings) {
         resetTerrainConfig();
      }
      if (props.visualizeOptimalPolicy) {
         calculateOptimalPolicy();
         animateOptimalPolicy();
         props.finishedOptimalPolicy();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [applyingSettings, visualizeThePolicy]);

   // Scatter a mix of buildings and trees on first mount so the grid doesn't
   // start empty. Cells are chosen up-front, then dropped in over time so the
   // city assembles itself (matches the maze-generation cadence).
   useEffect(() => {
      const terrain = terrainRef.current;
      const start = props.worldProperties.start;
      const finish = props.worldProperties.finish;
      const placements = [];
      const seen = new Set();
      const target = 80;
      let tries = 0;
      while (placements.length < target && tries < target * 6) {
         tries++;
         const row = Math.floor(Math.random() * ROWS);
         const col = Math.floor(Math.random() * COLS);
         const id = row * COLS + col;
         if (seen.has(id)) continue;
         seen.add(id);
         if ((row === start.row && col === start.col) ||
             (row === finish.row && col === finish.col)) continue;
         placements.push({ row, col, type: Math.random() < 0.55 ? 'building' : 'tree' });
      }
      const stepMs = 25;
      const timers = placements.map((p, i) =>
         setTimeout(() => {
            const node = terrain.grid[p.row][p.col];
            node.status = 'wall';
            node.wallType = p.type;
            node.reward = -100;
            node.visits = -1;
            tweenToColor(node, groundGeometry, [props.worldProperties.colors.wall]);
            addWall(p.row, p.col, p.type);
         }, i * stepMs)
      );
      return () => timers.forEach(clearTimeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      const terrain = terrainRef.current;
      if (props.agentKnowledge === 'clearMemory') {
         terrain.records = [];
         terrain.q_table = Array(ROWS).fill().map(() => Array(COLS).fill(0));
         props.agentResetDone();
      }
      if (props.worldProperties.runState === true) {
         if (props.selectedAlgorithm.type === 'machine-learning') {
            animateQlearning();
         } else {
            visualizeAlgorithm();
         }
      } else if (props.worldProperties.clearWalls === true) {
         clearWalls();
      } else if (props.worldProperties.clearPath === true) {
         clearPath();
      } else if (props.worldProperties.trainAgent === true) {
         qLearning();
      } else if (props.selectedMazeAlgorithm === 'randomMaze') {
         clearPath();
         const nodesToAnimate = [];
         randomMaze(terrain.grid, nodesToAnimate, 'wall');
         animateMaze(nodesToAnimate, 'wall', 30);
      } else if (props.selectedMazeAlgorithm === 'recursiveDivision') {
         clearPath();
         const nodesToAnimate = [];
         recursiveDivisionMaze(
            terrain.grid, 2, terrain.grid.length - 3, 2, terrain.grid.length - 3,
            'horizontal', false, nodesToAnimate, 'wall'
         );
         animateMaze(nodesToAnimate, 'wall', 30);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [runState, clearTheWalls, clearThePath, selectedMazeAlgorithm, trainTheAgent, agentKnowledge]);

   function findNodeId(faceIndex) {
      const linearIndex = Math.floor(faceIndex / 2);
      return {
         nodeRow: Math.floor(linearIndex / COLS),
         nodeCol: linearIndex % COLS,
      };
   }

   function toggleWallAt(row, col) {
      const terrain = terrainRef.current;
      const start = props.worldProperties.start;
      const finish = props.worldProperties.finish;
      if ((row === start.row && col === start.col) || (row === finish.row && col === finish.col)) {
         return;
      }
      const node = terrain.grid[row][col];
      if (node.status === 'wall') {
         node.status = 'default';
         node.wallType = null;
         node.reward = 0;
         node.visits = 0;
         tweenToColor(node, groundGeometry, [props.worldProperties.colors.default]);
         removeWall(row, col);
      } else {
         const type = props.selectedWallType || 'building';
         node.status = 'wall';
         node.wallType = type;
         node.visits = -1;
         node.reward = -100;
         tweenToColor(node, groundGeometry, [props.worldProperties.colors.wall]);
         addWall(row, col, type);
      }
   }

   function mouseDownHandler(event) {
      dragRef.current.mouseDownX = event.clientX;
      dragRef.current.mouseDownY = event.clientY;
   }

   function mouseUpHandler(event) {
      const drag = dragRef.current;
      if ((drag.mouseDownX !== event.clientX) || (drag.mouseDownY !== event.clientY)) {
         return;
      }
      const { nodeRow, nodeCol } = findNodeId(event.faceIndex);
      toggleWallAt(nodeRow, nodeCol);
   }

   function onPointerMove(e) {
      const drag = dragRef.current;
      if (drag.mouseIsUp) return;
      const id = Math.floor(e.faceIndex / 2);
      if (id === drag.previousHoverNodeId) return;
      drag.previousHoverNodeId = id;
      const nodeRow = Math.floor(id / COLS);
      const nodeCol = id % COLS;
      toggleWallAt(nodeRow, nodeCol);
   }

   function visualizeAlgorithm() {
      const terrain = terrainRef.current;
      clearPath();
      const nodesToAnimate = [];
      const startNode = terrain.grid[props.worldProperties.start.row][props.worldProperties.start.col];
      const finishNode = terrain.grid[props.worldProperties.finish.row][props.worldProperties.finish.col];
      const selectedAlgorithm = props.selectedAlgorithm;
      if (selectedAlgorithm.type === 'weighted') {
         weightedSearchAlgorithm(
            terrain.grid, startNode, finishNode, nodesToAnimate,
            selectedAlgorithm.algorithm, selectedAlgorithm.heuristic,
         );
      } else {
         unweightedSearchAlgorithm(
            terrain.grid, startNode, finishNode, nodesToAnimate,
            selectedAlgorithm.algorithm,
         );
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      animateAlgorithm(nodesToAnimate, nodesInShortestPathOrder, props.algorithmSpeed);
   }

   function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, timerDelay) {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
         if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
               animateShortestPath(nodesInShortestPathOrder, 5 * timerDelay);
            }, timerDelay * i);
            return;
         }
         const node = visitedNodesInOrder[i];
         if ((node.row === props.worldProperties.start.row && node.col === props.worldProperties.start.col) ||
             (node.row === props.worldProperties.finish.row && node.col === props.worldProperties.finish.col)) {
            continue;
         }
         setTimeout(() => {
            tweenToColor(
               node, groundGeometry,
               [{ r: 1.0, g: 0.321, b: 0.784 }, props.worldProperties.colors.visited],
               300, { position: false }
            );
         }, timerDelay * i);
      }
   }

   function animateShortestPath(nodesInShortestPathOrder, timerDelay) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
         setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            tweenToColor(node, groundGeometry, [props.worldProperties.colors.path], undefined, {
               position: false,
            });
         }, timerDelay * i);
      }
      props.updateRunState(false);
   }

   function animateQlearning() {
      const terrain = terrainRef.current;
      clearPath();
      const minimum = -10;
      const maximum = 100;
      for (let i = 0; i < terrain.records.length; i++) {
         for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
               const node = terrain.grid[row][col];
               if (terrain.records[i][row][col] === 0 ||
                  node.status === 'wall' || node.status === 'start' || node.status === 'finish') {
                  continue;
               }
               const ratio = 2 * (terrain.records[i][row][col] - minimum) / (maximum - minimum);
               let blue = Math.max(0, 255 * (1 - ratio));
               let red = Math.max(0, 255 * (ratio - 1));
               let green = 255 - blue - red;
               red /= 255; green /= 255; blue /= 255;
               setTimeout(() => {
                  tweenToColor(node, groundGeometry, [{ r: red, g: green, b: blue }], 5, { position: false });
               }, 1000);
            }
         }
      }
      props.updateRunState(false);
   }

   function animateOptimalPolicy() {
      const terrain = terrainRef.current;
      for (let i = 2; i < terrain.optimalPolicy.length; i++) {
         const headRow = terrain.optimalPolicy[i][0];
         const headCol = terrain.optimalPolicy[i][1];
         const tailRow = terrain.optimalPolicy[i - 1][0];
         const tailCol = terrain.optimalPolicy[i - 1][1];

         const head = terrain.grid[headRow][headCol];
         const tail = terrain.grid[tailRow][tailCol];
         if (head.status === 'start' || tail.status === 'start') continue;

         setTimeout(() => {
            if (head.status === 'finish') return;
            tweenToColor(tail, groundGeometry, [props.worldProperties.colors.path], undefined, { position: false });
            tweenToColor(head, groundGeometry, [{ r: 0, g: 0, b: 0 }], undefined, { position: false });
         }, 5 * i * props.algorithmSpeed);
      }
   }

   function qLearning() {
      const terrain = terrainRef.current;
      if (props.settingsConfig.epochs > 0) {
         terrain.records = [];
      }
      for (let i = 0; i < props.settingsConfig.epochs; i++) {
         let currentState;
         if (i > 0.75 * props.settingsConfig.epochs) {
            currentState = [props.settingsConfig.startRow, props.settingsConfig.startCol];
         } else {
            currentState = terrain.states[Math.floor(Math.random() * terrain.states.length)];
         }
         let steps = 0;
         while (
            !(currentState[0] === props.settingsConfig.finishRow && currentState[1] === props.settingsConfig.finishCol)
            && terrain.grid[currentState[0]][currentState[1]].status !== 'wall'
            && steps < 1000
         ) {
            let curiosity = props.settingsConfig.agentCuriosity;
            if (i > 0.75 * props.settingsConfig.epochs) {
               curiosity = 0.4;
            }
            const action = chooseAction(currentState, curiosity);
            const action_dy = terrain.actions[action][0];
            const action_dx = terrain.actions[action][1];
            const nextState = [action_dy + currentState[0], action_dx + currentState[1]];

            const currentQValue = terrain.q_table[currentState[0]][currentState[1]];
            const maxState = [action_dy + currentState[0], action_dx + currentState[1]];
            const maxQValue = terrain.q_table[maxState[0]][maxState[1]];

            const temporal_difference =
               terrain.grid[nextState[0]][nextState[1]].reward +
               terrain.discountFactor * (maxQValue - currentQValue);
            const q_value = currentQValue + props.settingsConfig.learningRate * temporal_difference;
            terrain.q_table[currentState[0]][currentState[1]] = parseFloat(q_value.toFixed(2));

            terrain.grid[currentState[0]][currentState[1]].visits += 1;
            currentState = nextState;
            steps++;
         }
         terrain.records.push(getRecord());
      }
      props.stopTraining();
   }

   function chooseAction(currentState, e_greedy) {
      const terrain = terrainRef.current;
      const actionOptions = [
         { weight: e_greedy * 10, id: 'true' },
         { weight: 10 * (1 - e_greedy), id: 'false' },
      ];
      const takingRandomAction = (rwc(actionOptions) === 'true');
      const actions = ['left', 'down', 'right', 'up'];

      if (takingRandomAction) {
         while (true) {
            const randomIndex = Math.floor(Math.random() * actions.length);
            const selectedAction = actions[randomIndex];
            const actionChange = terrain.actions[selectedAction];
            if (isValidState([actionChange[0] + currentState[0], actionChange[1] + currentState[1]])) {
               return selectedAction;
            }
         }
      } else {
         const policyCandidates = {};
         for (const action in terrain.actions) {
            const nextState = [terrain.actions[action][0] + currentState[0], terrain.actions[action][1] + currentState[1]];
            if (isValidState(nextState)) {
               policyCandidates[nextState] = terrain.q_table[nextState[0]][nextState[1]];
            }
         }
         const maxQValue = Number(
            Object.keys(policyCandidates).reduce((a, v) => Math.max(a, policyCandidates[v]), -Infinity)
         );
         const listOfMax = [];
         for (const maxCandidate in policyCandidates) {
            if (policyCandidates[maxCandidate] === maxQValue) {
               listOfMax.push(maxCandidate.split(',').map(Number));
            }
         }
         const randomIndex = Math.floor(Math.random() * listOfMax.length);
         const maxState = listOfMax[randomIndex];
         const action_dy = maxState[0] - currentState[0];
         const action_dx = maxState[1] - currentState[1];
         for (const action in terrain.actions) {
            if (terrain.actions[action][0] === action_dy && terrain.actions[action][1] === action_dx) {
               return action;
            }
         }
      }
   }

   function isValidState(nextState) {
      if (nextState[0] < 0 || nextState[0] >= ROWS || nextState[1] < 0 || nextState[1] >= COLS) return false;
      return true;
   }

   function getRecord() {
      const terrain = terrainRef.current;
      const record = Array(ROWS).fill().map(() => Array(COLS).fill(0));
      for (let i = 0; i < terrain.states.length; i++) {
         const state = terrain.states[i];
         record[state[0]][state[1]] = terrain.q_table[state[0]][state[1]];
      }
      return record;
   }

   function resetTerrainConfig() {
      const terrain = terrainRef.current;
      for (let row = 0; row < ROWS; row++) {
         for (let col = 0; col < COLS; col++) {
            if (terrain.grid[row][col].status === 'wall') continue;
            if (row === props.settingsConfig.startRow && col === props.settingsConfig.startCol) {
               terrain.grid[row][col].status = 'start';
               terrain.grid[row][col].onceSpecial = true;
            } else if (row === props.settingsConfig.finishRow && col === props.settingsConfig.finishCol) {
               terrain.grid[row][col].status = 'finish';
               terrain.grid[row][col].reward = 100;
               terrain.grid[row][col].onceSpecial = true;
            } else {
               terrain.grid[row][col].status = 'default';
               terrain.grid[row][col].reward = 0;
               if (terrain.grid[row][col].onceSpecial) {
                  tweenToColor(terrain.grid[row][col], groundGeometry, [props.worldProperties.colors.default]);
               }
            }
         }
      }
      props.finishApplyingSettings();
   }

   function calculateOptimalPolicy() {
      const terrain = terrainRef.current;
      let currentState = [props.settingsConfig.startRow, props.settingsConfig.startCol];
      const policyList = [currentState];

      while (
         !(currentState[0] === props.settingsConfig.finishRow && currentState[1] === props.settingsConfig.finishCol)
         && terrain.grid[currentState[0]][currentState[1]].status !== 'wall'
      ) {
         const maxAction = chooseAction(currentState, props.policyCuriosity);
         const action_dy = terrain.actions[maxAction][0];
         const action_dx = terrain.actions[maxAction][1];
         const nextState = [action_dy + currentState[0], action_dx + currentState[1]];
         policyList.push(nextState);
         currentState = nextState;
      }
      terrain.optimalPolicy = policyList;
   }

   function clearWalls() {
      const terrain = terrainRef.current;
      for (let i = 0; i < ROWS; i++) {
         for (let j = 0; j < COLS; j++) {
            if (terrain.grid[i][j].status === 'wall' || terrain.q_table[i][j] < 0) {
               terrain.grid[i][j].status = 'default';
               terrain.grid[i][j].wallType = null;
               terrain.grid[i][j].reward = 0;
               tweenToColor(terrain.grid[i][j], groundGeometry, [props.worldProperties.colors.default]);
            }
         }
      }
      setWalls({});
      props.stopClearWalls();
   }

   function clearPath() {
      const terrain = terrainRef.current;
      tweenGroup.removeAll();
      for (let i = 0; i < ROWS; i++) {
         for (let j = 0; j < COLS; j++) {
            if (i === props.worldProperties.start.row && j === props.worldProperties.start.col) {
               terrain.grid[i][j].status = 'start';
               terrain.grid[i][j].visits = -1;
            }
            if (i === props.worldProperties.finish.row && j === props.worldProperties.finish.col) {
               terrain.grid[i][j].status = 'finish';
            }
            if (terrain.grid[i][j].status === 'visited' || terrain.grid[i][j].visits > 0) {
               terrain.grid[i][j].status = 'default';
               tweenToColor(terrain.grid[i][j], groundGeometry, [props.worldProperties.colors.default]);
            }
            terrain.grid[i][j].distance = Infinity;
            terrain.grid[i][j].totalDistance = Infinity;
            terrain.grid[i][j].heuristicDistance = null;
            terrain.grid[i][j].direction = null;
            terrain.grid[i][j].previousNode = null;
         }
      }
      props.stopClearPath();
   }

   function animateMaze(nodesToAnimate, type, timerDelay) {
      const terrain = terrainRef.current;
      clearWalls();
      const wallType = props.selectedWallType || 'building';
      for (let i = 0; i < nodesToAnimate.length; i++) {
         const nodeRow = nodesToAnimate[i].row;
         const nodeCol = nodesToAnimate[i].col;
         setTimeout(() => {
            terrain.grid[nodeRow][nodeCol].status = 'wall';
            terrain.grid[nodeRow][nodeCol].wallType = wallType;
            terrain.grid[nodeRow][nodeCol].reward = -100;
            terrain.grid[nodeRow][nodeCol].visits = -1;
            tweenToColor(terrain.grid[nodeRow][nodeCol], groundGeometry, [props.worldProperties.colors.wall]);
            addWall(nodeRow, nodeCol, wallType);
         }, timerDelay * i);
      }
      props.stopMazeSelection();
   }

   return (
      <mesh ref={meshRef} position={[0, 0, 0]}>
         <gridHelper args={[GRID_SIZE, props.gridDimensions, 0x5c78bd, 0x5c78bd]} />
         <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.1, 0]}
            receiveShadow
            geometry={groundGeometry}
            material={groundMaterial}
            onPointerDown={(e) => {
               dragRef.current.mouseIsUp = false;
               dragRef.current.previousHoverNodeId = null;
               mouseDownHandler(e);
            }}
            onPointerUp={(e) => {
               if (!dragRef.current.mouseIsUp) {
                  dragRef.current.mouseIsUp = true;
                  mouseUpHandler(e);
               }
            }}
            onPointerOut={() => { dragRef.current.mouseIsUp = true; }}
            onPointerMove={onPointerMove}
         />
         <WallObjects walls={walls} />
         <axesHelper />
      </mesh>
   );
}

export default Grid;
