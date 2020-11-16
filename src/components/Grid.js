import React, { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Geometry, MeshLambertMaterial, TextureLoader } from 'three';
import Tiles from './Tiles';
import { Component } from 'react'
import { Canvas } from "react-three-fiber";
import img from './floor_texture.jpg';

 let arr = new Array(1);

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
  console.log(tempGrid);

  for(let i = 0; i < 1; i++){
      arr[i] = 0;
  }
 return tempGrid;

}

function createNode(row, col){

  let status = "status";
  let faces = {};
  let faceIndex = row * 2 * 30 + col * 2 ;
  console.log("FaceIndex is: " + faceIndex);
  {/*faces[1] = this.ground.geometry.faces[faceIndex];
	faceIndex = faceIndex % 2 == 0 ? faceIndex + 1 : faceIndex - 1;
	faces[2] = this.ground.geometry.faces[faceIndex];*/}
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

  return node;
}

function Grid(props) {
    const mesh = useRef(null);
    {/*Declare and initialize state variables/ */}
    const [grid, setGrid] = useState([]);

    useEffect(() => {
      // code to run on component mount
      setGrid(initializeGrid());
    }, []);

    const loader = useMemo(() => new THREE.TextureLoader().load(img,
      function(texture){
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.x = 30;
          texture.repeat.y = 30;
      }), [img]);
      
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          <gridHelper args = {[300, props.gridDimensions, 0x5c78bd, 0x5c78bd] }/>
          <mesh rotation={[-Math.PI /2, 0, 0]} position={[0,-0.1,0]} receiveShadow = {true}>
            <planeBufferGeometry attach = "geometry" args = {[300,300]}  />
            <meshLambertMaterial attach = 'material' transparent>
                <primitive attach="map" object={loader} />
            </meshLambertMaterial>
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
