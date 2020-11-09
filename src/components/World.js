import React from 'react';
import Grid from './Grid';
import * as THREE from 'three';
import { Canvas } from "react-three-fiber";
import Floor from './Floor';
import Tiles from './Tiles';
import { Plane, OrbitControls, PerspectiveCamera } from 'drei';
import { Scene } from 'three';

{/*function initializeGrid(){
    for(let i = 0; i < this.rows; i++){
        let currentRow = [];
        for(let j = cols; j < this.cols; j++){
            let node = this.createNode(i, j);
            currentRow.push(node);
        }
    }

}

function createNode(row, col){
    let faces = {};
    let faceIndex = row * 2 * this.cols + col * 2;

    let node = {
        id: row * this.cols + col,
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

    if (status == "start") {
        tweenToColor(node, this.ground.geometry, [this.colors.start]);
    } else if (status == "finish") {
        tweenToColor(node, this.ground.geometry, [this.colors.finish]);
    }

    return node;
}*/}

function World(props) {
   let width = window.innerWidth/2;
   let height = window.innerHeight/2;

    return (
        <>
        <Canvas colorManagement camera={{position: [0, 350, 0], fov: 50, aspect: width / height, far: 5000}} gl={{antialias: true}} raycaster= {new THREE.Raycaster()}>
        <ambientLight intensity = {1} color = {0xBBC2D0}/>
        {/*<fog attach = "fog" args = {[0xFFFFFF , 0, 750]}/>*/}
        <hemisphereLight color = {"hsl(0.6, 1, 0.6)"} groundColor = {0x87775d} intensity = {0.1} position = {[0,5,0]} />
        <directionalLight color = {"hsl(0.1, 1, 0.95)"} groundColor = {0x87775d} intensity = {0.5} position = {[-70,122.5,70]} castShadow = {true}>
        </directionalLight>
        <Floor />
        <Grid gridDimensions = {30}/>
        <OrbitControls />
      </Canvas>
      </>
    )
}

export default World

