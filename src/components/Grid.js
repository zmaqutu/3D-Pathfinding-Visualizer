import React, { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import img from './floor_texture.jpg';
import { tweenToColor, getNodesInShortestPathOrder } from './algorithms/helpers'
import TWEEN from '@tweenjs/tween.js';
import { weightedSearchAlgorithm } from "./algorithms/weightedSearchAlgorithm.js";
import { unweightedSearchAlgorithm } from "./algorithms/unweightedSearchAlgorithm.js";
import { randomMaze, recursiveDivisionMaze } from './algorithms/mazeAlgorithms';
import { useThree } from 'react-three-fiber';
import * as tf from '@tensorflow/tfjs';




function Grid(props) {

  let groundMaterial;
  let groundMesh;
  let mouseDownX = 0;
  let mouseDownY = 0;
  let previousHoverNodeId;
  let currentHoverNodeId;

  let mouseIsUp = true;

  //const [mouseIsUp, setMouseIsUp] = useState(true);
  
  const [groundGeometry, setGroundGeometry] = useState(new THREE.PlaneGeometry(300,300,30,30));
  //const [runState, setRunState] = useState(props.worldProperties.runState);
  const selectedAlgorithm = props.selectedAlgorithm;
  const selectedMazeAlgorithm = props.selectedMazeAlgorithm;
  const runState = props.worldProperties.runState;
  const clearTheWalls = props.worldProperties.clearWalls; //rename this variable
  const clearThePath = props.worldProperties.clearPath; // rename this variable too
  const algorithmSpeed = props.algorithmSpeed;

  //groundGeometry.rotateX(-Math.PI / 2)

  const {
    camera,
  } = useThree();

  



  useEffect(() => {
    if(props.worldProperties.runState === true){
      visualizeAlgorithm();
    }
    else if(props.worldProperties.clearWalls === true){
      clearWalls();
    }
    else if(props.worldProperties.clearPath === true){
      qLearning();
      clearPath();
    }
    else if(props.selectedMazeAlgorithm === "randomMaze"){
      clearPath();
      let nodesToAnimate = [];
      randomMaze(terrain.grid, nodesToAnimate, "wall");
      animateMaze(nodesToAnimate, "wall", 30);
    }
    else if(props.selectedMazeAlgorithm === "recursiveDivision"){
      clearPath();
      let nodesToAnimate = [];
      recursiveDivisionMaze(
        terrain.grid, 
        2, 
        terrain.grid.length - 3,
         2, 
         terrain.grid.length - 3, 
         "horizontal",
         false,
         nodesToAnimate,
         "wall");

         animateMaze(nodesToAnimate, "wall", 30)
    }
    //const algorithmSpeed = props.algorithmSpeed;
    //console.log(algorithmSpeed);
  }, [runState, clearTheWalls, clearThePath, selectedMazeAlgorithm]);


  const loader = useMemo(() => new THREE.TextureLoader().load(img,
    function(texture){
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 30;
        texture.repeat.y = 30;
        groundMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          side: THREE.FrontSide,
          vertexColors: THREE.FaceColors,
        });
        groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
				groundMesh.receiveShadow = true;
    }), [img]);

    
    
    groundMaterial = new THREE.MeshLambertMaterial({
      map: loader,
      side: THREE.FrontSide,
      vertexColors: THREE.FaceColors,
    });

    const mesh = useRef(null);
    
    
    const [terrain, setTerrain] = useState({
      grid: initializeGrid(),
      states: initStates(),
      q_table: Array(props.worldProperties.rows).fill().map(() => Array(props.worldProperties.cols).fill(0)),
      //records: qLearning(),
      actions : { left:[0,-1], down: [1,0], right:[0,1], up:[-1,0]}
    });
  function initializeGrid(){
    let tempGrid = []
    for(let i = 0; i < 30; i++){
        let currentRow = [];
        for(let j = 0; j < 30; j++){
            let node = createNode(i, j);
            currentRow.push(node);
        }
        tempGrid.push(currentRow);
    }
    //setState(tempStateGrid)
    renderLoop();
   return tempGrid;
  }   

  function createNode(row, col){

    let status = "default";
    let faces = {};

    let faceIndex = row * 2 * props.worldProperties.cols + col * 2 ;
    //console.log(groundGeometry.getAttribute(""))
  
    faces[1] = groundGeometry.faces[faceIndex];


    faceIndex = faceIndex % 2 === 0 ? faceIndex + 1 : faceIndex - 1;
    faces[2] = groundGeometry.faces[faceIndex];

    if(row === props.worldProperties.start.row && col === props.worldProperties.start.col){
      status = "start";
    }
    else if(row === props.worldProperties.finish.row && col === props.worldProperties.finish.col){
      status = "finish";
    }
    let node = {
        id: row * props.worldProperties.cols + col,
        row: row,
        col: col,
        faces: faces,
        status: status,
        distance: Infinity,
        totalDistance: Infinity,
        heuristicDistance: null,
        direction: null,
        weight: 0,
        qValue: 0,
        reward: 0,
        previousNode: null,
    };
    if(status === "start"){
      tweenToColor(node, groundGeometry, [props.worldProperties.colors.start]);
      
    }
    else if(status === "finish"){
      node.reward = 100;
      tweenToColor(node, groundGeometry, [props.worldProperties.colors.finish]);
    }
    return node;
  }
  function initStates(){
    let tempStateGrid = [];
    for(let row = 0; row < props.worldProperties.rows; row++){
      for(let col = 0; col < props.worldProperties.cols;col++){
        tempStateGrid.push([row,col]);
      }
    }
    //console.log(tempStateGrid)
    return tempStateGrid;
  }

  function renderLoop(){
    window.requestAnimationFrame(renderLoop);
    //if(props.resetStatus){
      hoverLoop();
   // }
    TWEEN.update();
  }

  function hoverLoop(){
    if(mouseIsUp || currentHoverNodeId === previousHoverNodeId){
      return;
    }
    else{
      previousHoverNodeId = currentHoverNodeId;
      let nodeRow = Math.floor(currentHoverNodeId / props.worldProperties.rows);
      let nodeCol = currentHoverNodeId % props.worldProperties.cols
      if((nodeRow === props.worldProperties.start.row && nodeCol === props.worldProperties.start.col) 
        || (nodeRow === props.worldProperties.finish.row && nodeCol === props.worldProperties.finish.col)){
        return;
      }
      else if(terrain.grid[nodeRow][nodeCol].status === "wall"){
        terrain.grid[nodeRow][nodeCol].status = "default";
        tweenToColor(terrain.grid[nodeRow][nodeCol], groundGeometry, [props.worldProperties.colors.default]);
      }
      else
      {
        terrain.grid[nodeRow][nodeCol].status = "wall";
        tweenToColor(terrain.grid[nodeRow][nodeCol], groundGeometry, [props.worldProperties.colors.wall]);
      }
    
    }
    //get coordinates of node i just clicked on
    
  }

  function mouseUpHandler(event){
    if((mouseDownX !== event.clientX) || (mouseDownY !== event.clientY)){
      return;
    }
    else
    {
      let nodeId = findNodeId(event.faceIndex);
      if((nodeId.nodeRow === props.worldProperties.start.row && nodeId.nodeCol === props.worldProperties.start.col) 
        || (nodeId.nodeRow === props.worldProperties.finish.row && nodeId.nodeCol === props.worldProperties.finish.col)){
      return;
      }
      else if(terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status === "wall"){
        terrain.grid[nodeId.nodeRow][nodeId.nodeCol].reward = 0;
        terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status = "default";
        tweenToColor(terrain.grid[nodeId.nodeRow][nodeId.nodeCol], groundGeometry, [props.worldProperties.colors.default]);
        //console.log(terrain.grid[nodeId.nodeRow][nodeId.nodeCol]);
      }
      else
      {
        terrain.grid[nodeId.nodeRow][nodeId.nodeCol].reward = -100;
        terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status = "wall";
        tweenToColor(terrain.grid[nodeId.nodeRow][nodeId.nodeCol], groundGeometry, [props.worldProperties.colors.wall]);
        //console.log(terrain.grid[nodeId.nodeRow][nodeId.nodeCol]);
      }
      //console.log(terrain.grid)
    }

  }
    
  
  function findNodeId(faceIndex){
    let linearIndex = Math.floor(faceIndex / 2);
    return {
      nodeRow: Math.floor(linearIndex / props.worldProperties.rows),
      nodeCol: linearIndex % props.worldProperties.cols,
    }
  }
  function mouseDownHandler(event){
      mouseDownX = event.clientX;     //set X and Y mouse coordinates when mouseDown
      mouseDownY = event.clientY;
  }
  
  function visualizeAlgorithm(){
    console.log("Dijkstra Dijkstra Dijkstra");
    clearPath();
    let nodesToAnimate = [];
    let processedSuccessfuly;
    const startNode = terrain.grid[props.worldProperties.start.row][props.worldProperties.start.col];
    const finishNode = terrain.grid[props.worldProperties.finish.row][props.worldProperties.finish.col];
    if(selectedAlgorithm.type === "weighted"){
      processedSuccessfuly = weightedSearchAlgorithm(
        terrain.grid,
        startNode,
        finishNode,
        nodesToAnimate,
        selectedAlgorithm.algorithm,
        selectedAlgorithm.heuristic,
      );
      console.log(processedSuccessfuly);
    }
    else{
      processedSuccessfuly = unweightedSearchAlgorithm(
        terrain.grid,
        startNode,
        finishNode,
        nodesToAnimate,
        selectedAlgorithm.algorithm,
      );
    }
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    //add conditions for unweighted and no paths found
    //console.log(algorithmSpeed + " is the speed were using")
    animateAlgorithm(nodesToAnimate, nodesInShortestPathOrder, algorithmSpeed);
    
    
  }
  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, timerDelay){
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
				if (i === visitedNodesInOrder.length) {
					setTimeout(() => {
						animateShortestPath(nodesInShortestPathOrder, 5 * timerDelay);
					}, timerDelay * i);
					return;
				}
				if ((visitedNodesInOrder[i].row === props.worldProperties.start.row &&
            visitedNodesInOrder[i].col === props.worldProperties.start.col) ||
					(visitedNodesInOrder[i].row === props.worldProperties.finish.row &&
						visitedNodesInOrder[i].col === props.worldProperties.finish.col)
				) {
					continue;
				}
				setTimeout(() => {
					const node = visitedNodesInOrder[i];
					if (!node) return;
					tweenToColor(
						node,
						groundGeometry,
						[{ r: 1.0, g: 0.321, b: 0.784 }, props.worldProperties.colors.visited],
						300,
						{ position: false }
					);
				}, timerDelay * i);
      }
      
  }
  function animateShortestPath(nodesInShortestPathOrder, timerDelay){
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        tweenToColor(node, groundGeometry, [props.worldProperties.colors.path], undefined, {
          position: false,
        });
        if (i === nodesInShortestPathOrder.length - 1) {
                }
      }, timerDelay * i);
    }
    props.updateRunState(false);
    //console.log(terrain.grid[5][5]);
  }

  function qLearning(){
    let i = 0
    while(i < 1){
      let currentState = terrain.states[Math.floor(Math.random() * terrain.states.length)]
      while(terrain.grid[currentState[0]][currentState[1]].status !== "finish" || terrain.grid[currentState[0]][currentState[1]].status === "wall"){
        let action = chooseAction(currentState);
        //console.log(action);

      }
      i++;
    }
  }
  function chooseAction(currentState){
    var rwc = require("random-weighted-choice");
    let actionOptions = [
      {weight: 7, id: "true"},
      {weight: 2, id: "false"}
    ];
    let chosenOption = rwc(actionOptions)
    let takingRandomAction = (chosenOption === "true");//true or false;
    let actions = ["left","down","right","up"];
    
    if(takingRandomAction){
      //let random_index = random.randint(0,len(actions) - 1)
      let randomIndex = Math.floor(Math.random() * actions.length)
			let selectedAction = actions[randomIndex]
			let actionChange = terrain.actions[selectedAction]
      if(isValidState([actionChange[0] + currentState[0],actionChange[1] + currentState[1]])){
        //console.log(selectedAction)
        return selectedAction;
      }
    }
    else{
      let policyCandidates = {}
      for(let action in terrain.actions){
        let nextState = [terrain.actions[action][0]+currentState[0],terrain.actions[action][1]+currentState[1]]
        if (isValidState(nextState)){
				//console.log(terrain.q_table);
					policyCandidates[nextState] = terrain.q_table[nextState[1]][nextState[0]]
        }
      }

      //let maxState = max(policy_candidates, key=policy_candidates.get)
      let maxQValue = Object.keys(policyCandidates).reduce((a, v) => Math.max(a, policyCandidates[v]), -Infinity);
      let maxState = Object.keys(policyCandidates).filter(v => policyCandidates[v] === maxQValue);
			//let maxQValue = policy_candidates[maxState]
			let listOfMax = [];
      for(let maxCandidate in policyCandidates){
        if(policyCandidates[maxCandidate] === maxQValue){
          listOfMax.push(maxCandidate);
        }
      }
      let randomIndex = Math.floor(Math.random() * listOfMax.length);
			maxState = listOfMax[randomIndex];
      //Now we can use the max_state(state with the maximum q value to find the actioned perfomed to get there)
			let action_dy = maxState[0] - currentState[0];
			let action_dx = maxState[1] - currentState[1];

      for(let action in terrain.actions){
        if(terrain.actions[action] == [action_dy,action_dx]){
          return action;
        }
      }
    }

  }
  function isValidState(nextState){
    if (nextState[0] < 0 || nextState[0] >= props.worldProperties.row || 
        nextState[1] < 0 || nextState[1] >= props.worldProperties.col){ return false;}
		return true
  }

  function clearWalls(){
    for(let i = 0; i < props.worldProperties.rows; i++){
      for(let j = 0; j < props.worldProperties.cols; j++){
        if(terrain.grid[i][j].status === "wall"){
          terrain.grid[i][j].status = "default";
          terrain.grid[i][j].reward = 0;
          tweenToColor(terrain.grid[i][j], groundGeometry, [props.worldProperties.colors.default])
        }
      }
    }
    props.stopClearWalls();
  }
  function clearPath(){
    TWEEN.removeAll();
    for(let i = 0; i < props.worldProperties.rows; i++){
      for(let j = 0; j < props.worldProperties.cols; j++){
        if(i === props.worldProperties.start.row && j === props.worldProperties.start.col){
          terrain.grid[i][j].status = "start"; 
        }
        if(i === props.worldProperties.finish.row && j === props.worldProperties.finish.col){
          terrain.grid[i][j].status = "finish"; 
        }
        
        if(terrain.grid[i][j].status === "visited"){
          terrain.grid[i][j].status = "default";
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
  function animateMaze(nodesToAnimate, type, timerDelay){
    clearWalls();
    for(let i = 0; i < nodesToAnimate.length; i++){
      let nodeRow = nodesToAnimate[i].row;
      let nodeCol = nodesToAnimate[i].col
      setTimeout(() => {
        //const node = nodesToAnimate[i];
       // node.status = type;
       terrain.grid[nodeRow][nodeCol].status = "wall";
       terrain.grid[nodeRow][nodeCol].reward = -100;
      tweenToColor(terrain.grid[nodeRow][nodeCol], groundGeometry, [props.worldProperties.colors.wall]);
      }, timerDelay * i);
      props.stopMazeSelection();
    }
  }
 
  return (
    <mesh ref = {mesh} position = {[0,0,0]}>
      <gridHelper args = {[300, props.gridDimensions, 0x5c78bd, 0x5c78bd] }/>
      <mesh rotation={[-Math.PI /2, 0, 0]} 
        position={[0,-0.1,0]} 
        receiveShadow = {true}
        onPointerDown={ (e) => {
          mouseIsUp = false;
          mouseDownHandler(e)
        }}
      onPointerUp = {e => {
        if(props.resetStatus === true || mouseIsUp === true){
          mouseIsUp = true;
        }
        mouseUpHandler(e)
      }}
      onPointerMove = {e => {
        if(mouseIsUp === true || props.resetStatus === false){
          return;
        }
        else if(mouseIsUp === false){
          currentHoverNodeId = Math.floor(e.faceIndex/2);
          return;
        }
      }}
      >
      <primitive attach = 'geometry' object = {groundGeometry}  />  
      <primitive attach = 'material' object = {groundMaterial}  />   
      </mesh>
      <axesHelper />
    </mesh>
    )
}


export default Grid
