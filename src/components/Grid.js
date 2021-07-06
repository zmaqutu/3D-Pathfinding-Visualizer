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
import { math } from '@tensorflow/tfjs';




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
  const trainTheAgent = props.worldProperties.trainAgent;
  const clearTheWalls = props.worldProperties.clearWalls; //rename this variable
  const clearThePath = props.worldProperties.clearPath; // rename this variable too
  const algorithmSpeed = props.algorithmSpeed;
  const agentKnowledge = props.agentKnowledge;
  const applyingSettings = props.applyingSettings;

  const visualizeThePolicy = props.visualizeOptimalPolicy;
  //const settingsConfig = props.settingsConfig;

  //groundGeometry.rotateX(-Math.PI / 2)

  const {
    camera,
  } = useThree();

  useEffect(() => {
    if(props.applyingSettings){
      resetTerrainConfig();
    }
    if(props.visualizeOptimalPolicy){
      calculateOptimalPolicy();
      animateOptimalPolicy();
      props.finishedOptimalPolicy();
    }
  },[applyingSettings, visualizeThePolicy]);



  useEffect(() => {
    /*if( props.applyingSettings=== true){
      resetTerrainConfig();
    }*/
    if(props.agentKnowledge ==="clearMemory"){
      terrain.records = [];
      terrain.q_table = Array(props.worldProperties.rows).fill().map(() => Array(props.worldProperties.cols).fill(0));
      //clearPath();
      props.agentResetDone();
    }
    if(props.worldProperties.runState === true){
      if(props.selectedAlgorithm.type === "machine-learning"){
        animateQlearning()
      }
      else{
      visualizeAlgorithm();
      }
    }
    else if(props.worldProperties.clearWalls === true){
      clearWalls();
    }
    else if(props.worldProperties.clearPath === true){
      clearPath();
    }
    else if(props.worldProperties.trainAgent === true){
      qLearning();
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
  }, [runState, clearTheWalls, clearThePath, selectedMazeAlgorithm, trainTheAgent,agentKnowledge,]);


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
      records: [],
      optimalPolicy: [],
      actions : { "left":[0,-1], "down":[1,0],"right":[0,1], "up":[-1,0]},
      //visits: Array(props.worldProperties.rows).fill().map(() => Array(props.worldProperties.cols).fill(0)),
      discountFactor: 0.8,
      alpha: 0.1,
      start: [props.settingsConfig.startRow,props.settingsConfig.startCol],
      finish: [props.settingsConfig.finishRow,props.settingsConfig.finishCol]
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
    /*var vertices = new Float32Array(5400).fill(0);

    groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute( vertices,3) );
    vertices[0] = 0
    vertices[1]= 1
    vertices[2]= 0

    

    console.log(groundGeometry.getAttribute('color'))
    const tween1 = new TWEEN.Tween(groundGeometry.getAttribute('color'))
                    .to(new THREE.Float32BufferAttribute( vertices,2) ,9000)

    tween1.start()

    tween1.onUpdate(function (object: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, elapsed: number){
      groundGeometry.setAttribute('color',object)
    })
    
   
    //console.log(vertices)
    groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute( vertices,2) );*/

    //setState(tempStateGrid)
    renderLoop();
   return tempGrid;
  }   

  function createNode(row, col){

    let status = "default";
    let faces = {};

    let faceIndex = row * 2 * props.worldProperties.cols + col * 2 ;
    //console.log(groundGeometry)
  
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
        visits: 0,
        onceSpecial: false,
        previousNode: null,
    };
    if(status === "start"){
      node.onceSpecial = true;
      tweenToColor(node, groundGeometry, [props.worldProperties.colors.start]);
      
    }
    else if(status === "finish"){
      node.reward = 100;
      node.onceSpecial = true;
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
  /*function initializeVisits(){
    let visits = {}
    let tempStates = initStates()
    for(let row = 0; row < tempStates.length; row++){
      for(let col = 0; col < tempStates[0].length; col++){
        let state = tempStates[row][col]
        visits[state] = 0;
      }
    }
    return visits;
  }*/

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
       terrain.grid[nodeRow][nodeCol].reward = 0;
        terrain.grid[nodeRow][nodeCol].visits = 0;
        tweenToColor(terrain.grid[nodeRow][nodeCol], groundGeometry, [props.worldProperties.colors.default]);
      }
      else
      {
        terrain.grid[nodeRow][nodeCol].status = "wall";
        terrain.grid[nodeRow][nodeCol].visits = -1;
       terrain.grid[nodeRow][nodeCol].reward = -100;
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

  function animateQlearning(){
    clearPath();
    let minimum = -10;
    let maximum = 100;
    for(let i = 0; i < terrain.records.length;i++){
      //let record = terrain.records[i]
      if(i > 1300){return;}
      for(let row = 0; row < 30; row++){
        for(let col = 0; col < 30; col++){ 
          const node = terrain.grid[row][col];
          if(terrain.records[i][row][col] === 0 || node.status === "wall" || node.status === "start" || node.status === "finish"){continue;}
          let ratio = 2 * (terrain.records[i][row][col]-minimum) / (maximum - minimum)
          let blue = Number(Math.max(0, 255*(1 - ratio)))
          let red = Number(Math.max(0, 255*(ratio - 1)))
          let green = 255 - blue - red

          red /= 255;
          green /= 255;
          blue /= 255;
          
          setTimeout(() => {
            tweenToColor(node, groundGeometry, [{r: red, g: green, b: blue}], 30,{position: false});
            //if (row === 30 - 1) {}
          }, 1000);
        }
      }
    }
    props.updateRunState(false);
  }
  function animateOptimalPolicy(){
    for(let i = 2; i < terrain.optimalPolicy.length;i++){
      let headRow = terrain.optimalPolicy[i][0];
      let headCol = terrain.optimalPolicy[i][1];
      //let torsoRow = terrain.optimalPolicy[i-1][0];
      //let torsoCol = terrain.optimalPolicy[i-1][1];
      let tailRow = terrain.optimalPolicy[i-1][0];
      let tailCol = terrain.optimalPolicy[i-1][1];

      const head = terrain.grid[headRow][headCol];
      //const torso = terrain.grid[torsoRow][torsoCol];
      const tail = terrain.grid[tailRow][tailCol];
      if (head.status === 'start'|| tail.status == 'start'){continue;}


      setTimeout(() => {
        if (head.status === 'finish' ) return;
        //terrain.grid[row][col].status = visited;
        
        //setTimeout(() => {
        //tweenToColor(tail, groundGeometry, [props.worldProperties.colors.path], undefined,{position: false});
        //}, i*props.algorithmSpeed);


        tweenToColor(tail, groundGeometry, [props.worldProperties.colors.path], undefined,{position: false});
        tweenToColor(head, groundGeometry, [{r: 0, g: 0, b: 0}], undefined,{position: false});
        //tweenToColor(torso, groundGeometry, [{r: 0, g: 0, b: 0}], undefined,{position: false});

      }, 5*i*props.algorithmSpeed);

    }
  }
  function qLearning(){
    //reset records
    if(props.settingsConfig.epochs > 0){
      terrain.records = [];
    }
    let i = 0;
    while(i < props.settingsConfig.epochs){
     if(terrain.records.length > 1300){break;}
      if(i > 0.6*props.settingsConfig.epochs){
        let y = props.settingsConfig.startRow;
        let x = props.settingsConfig.startCol;
        var currentState = [y,x]; 
      }
      else{
        var currentState = terrain.states[Math.floor(Math.random() * terrain.states.length)]

      }
      while(!(currentState[0] === props.settingsConfig.finishRow && currentState[1] === props.settingsConfig.finishCol)
        && terrain.grid[currentState[0]][currentState[1]].status !== "wall"){
        
          //setTimeout(() => {
           //tweenToColor(terrain.grid[14][14],groundGeometry,[{ r: 1, g: 0.64, b: 0.0}]);
          //}, props.algorithmSpeed);
          
          
          //let action = chooseAction(currentState, Math.abs(1- (i/props.settingsConfig.epochs)))
          let action = chooseAction(currentState, props.settingsConfig.agentCuriosity)
          if(i > 0.9*props.settingsConfig.epochs){
             action = chooseAction(currentState, 0.4) 
          }
          let action_dy = terrain.actions[action][0]
				  let action_dx = terrain.actions[action][1]
				  let nextState = [action_dy + currentState[0], action_dx + currentState[1]]


          let currentQValue = terrain.q_table[currentState[0]][currentState[1]]
				  //let maximum_action = chooseAction(currentState, 0)//might need to be nextstate
				
          //action_dy = terrain.actions[maximum_action][0]
				  //action_dx = terrain.actions[maximum_action][1]

				  let maxState = [action_dy + currentState[0], action_dx + currentState[1]];
				  let maxQValue = terrain.q_table[maxState[0]][maxState[1]]

          let temporal_difference = (terrain.grid[nextState[0]][nextState[1]].reward + terrain.discountFactor *(maxQValue - currentQValue)  ); 
				  
          //let learning_rate = 1 / (1 + terrain.grid[currentState[0]][currentState[1]].visits)

          let q_value = currentQValue + (props.settingsConfig.learningRate * (temporal_difference));
				  terrain.q_table[currentState[0]][currentState[1]] = parseFloat(q_value.toFixed(2));

          terrain.grid[currentState[0]][currentState[1]].visits+=1;
          currentState = nextState;
          i++;

        }
        terrain.records.push(getRecord())
    }
    props.stopTraining();
    //console.log(props.settingsConfig.epochs);
    console.log(terrain.records)
    //console.log(terrain.grid)
  }
  function chooseAction(currentState,e_greedy){
    var rwc = require("random-weighted-choice");
    let actionOptions = [
      {weight: e_greedy * 10, id: "true"},
      {weight: 10*(1 - e_greedy), id: "false"}
    ];
    let chosenOption = rwc(actionOptions)
    let takingRandomAction = (chosenOption === "true");//true or false;
    let actions = ["left","down","right","up"];
    
    if(takingRandomAction){
      //console.log("Taking random action");
      //let random_index = random.randint(0,len(actions) - 1)
      while(true){
        let randomIndex = Math.floor(Math.random() * actions.length)
			  let selectedAction = actions[randomIndex]
			  let actionChange = terrain.actions[selectedAction]
        if(isValidState([actionChange[0] + currentState[0],actionChange[1] + currentState[1]])){
          //console.log("When action is random action is: " + selectedAction)
          return selectedAction;
        }
      }
    }
    else{
      //console.log("Taking greedy action");
      //let policyCandidates = new WeakMap();
      let policyCandidates = {};
      for(let action in terrain.actions){
        let nextState = [terrain.actions[action][0]+currentState[0],terrain.actions[action][1]+currentState[1]]
        //console.log(nextState)
        if (isValidState(nextState)){
				  //console.log(terrain.q_table);
					policyCandidates[nextState] = terrain.q_table[nextState[0]][nextState[1]]
          //policyCandidates.set(nextState,terrain.q_table[nextState[1]][nextState[0]]);
        }
      }
      //let maxState = max(policy_candidates, key=policy_candidates.get)
      let maxQValue = Number(Object.keys(policyCandidates).reduce((a, v) => Math.max(a, policyCandidates[v]), -Infinity));
      let maxState = Object.keys(policyCandidates).filter(v => policyCandidates[v] === maxQValue);

			//let maxQValue = policy_candidates[maxState]
			let listOfMax = [];
      for(let maxCandidate in policyCandidates){
        if(policyCandidates[maxCandidate] === maxQValue){
          let tempVals = maxCandidate.split(",").map(Number)
          listOfMax.push(tempVals);
        }
      }
      let randomIndex = Math.floor(Math.random() * listOfMax.length);
			maxState = listOfMax[randomIndex];
      //console.log(listOfMax)
      //Now we can use the max_state(state with the maximum q value to find the actioned perfomed to get there)
			let action_dy = maxState[0] - currentState[0];
			let action_dx = maxState[1] - currentState[1];

      for(let action in terrain.actions){
        if(terrain.actions[action][0] === action_dy && terrain.actions[action][1] === action_dx){
          return action;
        }
      }
    }

  }
  function isValidState(nextState){
    //console.log(nextState)
    if (nextState[0] < 0 || nextState[0] >= props.worldProperties.rows || 
        nextState[1] < 0 || nextState[1] >= props.worldProperties.cols){return false;}
		return true
  }
  function getRecord(){
    let record =  Array(props.worldProperties.rows).fill().map(() => Array(props.worldProperties.cols).fill(0))
    for(let i = 0; i < terrain.states.length; i++){
      let state = terrain.states[i]
			record[state[0]][state[1]] = terrain.q_table[state[0]][state[1]]
    }
    //console.log(record)
    return record;
  }
  function resetTerrainConfig(){
    for(let row = 0; row < 30; row++){
      for(let col = 0; col < 30; col++){
        if(terrain.grid[row][col].status === "wall"){
          continue;
        }
        if(row === props.settingsConfig.startRow && col  === props.settingsConfig.startCol){
          terrain.grid[row][col].status = "start";
          terrain.grid[row][col].onceSpecial = true;
        }
        else if(row === props.settingsConfig.finishRow && col === props.settingsConfig.finishCol){
          terrain.grid[row][col].status = "finish";
          terrain.grid[row][col].reward = 100;
          terrain.grid[row][col].onceSpecial = true;

        }
        else{
          terrain.grid[row][col].status = "default";
          terrain.grid[row][col].reward = 0;
          if(terrain.grid[row][col].onceSpecial){
          tweenToColor(terrain.grid[row][col], groundGeometry, [props.worldProperties.colors.default]);
          }

        }
      }
    }
    //console.log(terrain.records)
    props.finishApplyingSettings();
  }

  function calculateOptimalPolicy(){
    let currentState = [props.settingsConfig.startRow, props.settingsConfig.startCol];
    let policyList = [];
    policyList.push(currentState);
    
    while(!(currentState[0] === props.settingsConfig.finishRow && currentState[1] === props.settingsConfig.finishCol)
    && terrain.grid[currentState[0]][currentState[1]].status !== "wall"){
      let maxAction = chooseAction(currentState,props.policyCuriosity);
      let action_dy = terrain.actions[maxAction][0];
      let action_dx = terrain.actions[maxAction][1];

      let nextState = [action_dy + currentState[0], action_dx + currentState[1]];
      policyList.push(nextState);
      currentState = nextState;
      //console.log(maxAction);
      //console.log(action_dy);
    }
    terrain.optimalPolicy = policyList;

    
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
          terrain.grid[i][j].visits = -1; 
        }
        if(i === props.worldProperties.finish.row && j === props.worldProperties.finish.col){
          terrain.grid[i][j].status = "finish"; 
        }
        
        if(terrain.grid[i][j].status === "visited" || terrain.grid[i][j].visits > 0){
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
       terrain.grid[nodeRow][nodeCol].visits = -1;
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
