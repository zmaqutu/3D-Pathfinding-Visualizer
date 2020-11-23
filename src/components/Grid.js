import React, { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Color, Geometry, MeshLambertMaterial, TextureLoader } from 'three';
import Tiles from './Tiles';
import { Component } from 'react'
import { Canvas } from "react-three-fiber";
import img from './floor_texture.jpg';
import { tweenToColor, getNodesInShortestPathOrder } from './algorithms/helpers'
import TWEEN, { Tween } from '@tweenjs/tween.js';
import { weightedSearchAlgorithm } from "./algorithms/weightedSearchAlgorithm.js";


function Grid(props) {

  let groundMaterial;
  let groundMesh;
  let mouseDownX = 0;
  let mouseDownY = 0;
  
  const [groundGeometry, setGroundGeometry] = useState(new THREE.PlaneGeometry(300,300,30,30));
  //const [runState, setRunState] = useState(props.worldProperties.runState);
  const runState = props.worldProperties.runState;

  useEffect(() => {
    if(props.worldProperties.runState == true){
      visualizeAlgorithm();
    }
  }, [runState]);

  

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
    {/*Declare and initialize state variables/ */}
    const [terrain, setTerrain] = useState({
      grid: initializeGrid(),
    });
  
  function initializeGrid(){
    let tempGrid = [];
    for(let i = 0; i < 30; i++){
        let currentRow = [];
        for(let j = 0; j < 30; j++){
            let node = createNode(i, j);
            currentRow.push(node);
        }
        tempGrid.push(currentRow);
    }
    renderLoop();
   return tempGrid;
  }   

  function createNode(row, col){

    let status = "default";
    let faces = {};
    let faceIndex = row * 2 * props.worldProperties.cols + col * 2 ;
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
        id: row * col + col,
        row: row,
        col: col,
        faces: faces,
        status: status,
        distance: Infinity,
        totalDistance: Infinity,
        heuristicDistance: null,
        direction: null,
        weight: 0,
        previousNode: null,
    };
    
    if(status === "start"){
      tweenToColor(node, groundGeometry, [props.worldProperties.colors.start]);
      
    }
    else if(status === "finish"){
      tweenToColor(node, groundGeometry, [props.worldProperties.colors.finish]);
    }
    return node;
  }
  function renderLoop(){
    window.requestAnimationFrame(renderLoop);
    TWEEN.update();
  }

  function mouseUpHandler(event){
    if((mouseDownX != event.clientX) || (mouseDownY != event.clientY)){
      return;
    }
    else
    {
      let nodeId = findNodeId(event.faceIndex);
      if(terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status == "start" || terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status == "finish"){
       return;
      }
      else if(terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status == "wall"){
        terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status = "default";
        tweenToColor(terrain.grid[nodeId.nodeRow][nodeId.nodeCol], groundGeometry, [props.worldProperties.colors.default]);
        console.log(terrain.grid[nodeId.nodeRow][nodeId.nodeCol]);

      }
      else
      {
        terrain.grid[nodeId.nodeRow][nodeId.nodeCol].status = "wall";
        tweenToColor(terrain.grid[nodeId.nodeRow][nodeId.nodeCol], groundGeometry, [props.worldProperties.colors.wall]);
        console.log(terrain.grid[nodeId.nodeRow][nodeId.nodeCol]);
      }
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
    //if you move return
    mouseDownX = event.clientX;
    mouseDownY = event.clientY;
  }
  function visualizeAlgorithm(){
    console.log("Dijkstra Dijkstra Dijkstra");
    let nodesToAnimate = [];
    let processedSuccessfuly;
    const startNode = terrain.grid[props.worldProperties.start.row][props.worldProperties.start.col];
    const finishNode = terrain.grid[props.worldProperties.finish.row][props.worldProperties.finish.col];
    if(props.selectedAlgorithm.type == "weighted"){
      processedSuccessfuly = weightedSearchAlgorithm(
        terrain.grid,
        startNode,
        finishNode,
        nodesToAnimate,
        props.selectedAlgorithm.algorithm,
        props.selectedAlgorithm.heuristic,
      );
      console.log(processedSuccessfuly);
    }
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    //add conditions for unweighted and no paths found
    animateAlgorithm(nodesToAnimate, nodesInShortestPathOrder, 15);
    
    
  }
  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, timerDelay){
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
				if (i === visitedNodesInOrder.length) {
					setTimeout(() => {
						animateShortestPath(nodesInShortestPathOrder, 5 * timerDelay);
					}, timerDelay * i);
					return;
				}
				if ((visitedNodesInOrder[i].row == props.worldProperties.start.row &&
            visitedNodesInOrder[i].col == props.worldProperties.start.col) ||
					(visitedNodesInOrder[i].row == props.worldProperties.finish.row &&
						visitedNodesInOrder[i].col == props.worldProperties.finish.col)
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
        if (i == nodesInShortestPathOrder.length - 1) {
                }
      }, timerDelay * i);
    }
    props.updateRunState(false);
  }
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          <gridHelper args = {[300, props.gridDimensions, 0x5c78bd, 0x5c78bd] }/>
          <mesh rotation={[-Math.PI /2, 0, 0]}
           position={[0,-0.1,0]} 
           receiveShadow = {true}
           onPointerDown={e => mouseDownHandler(e)}
           onPointerUp = {e => mouseUpHandler(e)}
           >
            <primitive attach = 'geometry' object = {groundGeometry}  />  
            <primitive attach = 'material' object = {groundMaterial}  />    
          </mesh>

        {/*<mesh rotation={[-Math.PI /2, 0, 0]} position={[0,-0.09,0]}>
          <planeBufferGeometry attach = "geometry" args = {[300,300]}/>
          <meshLambertMaterial attach = "material" color = "black" side={THREE.FrontSide} opacity= {0.5}/>
    </mesh>*/}
          <axesHelper />
    </mesh>
    )
}


export default Grid
