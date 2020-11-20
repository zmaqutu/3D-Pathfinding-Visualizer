import React, { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Geometry, MeshLambertMaterial, TextureLoader } from 'three';
import Tiles from './Tiles';
import { Component } from 'react'
import { Canvas } from "react-three-fiber";
import img from './floor_texture.jpg';
import { tweenToColor } from './algorithms/helpers'
import TWEEN, { Tween } from '@tweenjs/tween.js';


function Grid(props) {

  let groundGeometry = props.worldProperties.groundGeometry;
  let groundMaterial;
  let groundMesh;
  useEffect(() => {
    // code to run on component mount

  }, []);

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
      console.log(node.faces[1])
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

  {/*groundGeometry.rotateY(-Math.PI / 4);

  let loader1 = new THREE.TextureLoader();
			let floortiles = loader1.load(img,
				function(texture) {
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.repeat.x = 30;
					texture.repeat.y = 30;
				},
				undefined,
				function(error) {
					console.log(error);
				}
			);*/}
  
  //groundMaterial = THREE.MeshLambertMaterial({map: loader});
  //const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)

  
  groundMaterial = new THREE.MeshLambertMaterial({
    map: loader,
    side: THREE.FrontSide,
    vertexColors: THREE.FaceColors,
  });
  console.log(groundMaterial);
     
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          <gridHelper args = {[300, props.gridDimensions, 0x5c78bd, 0x5c78bd] }/>
          <mesh rotation={[-Math.PI /2, 0, 0]} position={[0,-0.1,0]} receiveShadow = {true}>
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
