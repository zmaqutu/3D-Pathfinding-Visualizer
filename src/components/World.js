import React from 'react'
import Grid from './Grid';
import { Canvas } from "react-three-fiber";
import Floor from './Floor';
import Tiles from './Tiles'
import { Plane, OrbitControls, PerspectiveCamera } from 'drei'

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
    return (
        <>
        <Canvas colorManagement camera={{position: [0, 35, 0], fov: 50}}>
        <ambientLight intensity = {0.3}/>
        <Floor />
        <Grid gridDimensions = {30}/>
        
        <OrbitControls />
      </Canvas>
      </>
    )
}

export default World

