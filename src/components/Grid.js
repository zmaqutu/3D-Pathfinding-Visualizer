import React, { useRef } from 'react'
import { MeshLambertMaterial } from 'three';
import Tiles from './Tiles';

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

function Grid(props) {
    const mesh = useRef(null);
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          <gridHelper args = {[props.gridDimensions, props.gridDimensions, "hotpink", "hotpink"] }/>
          <Tiles 
            tilePosition = {
              {
                tileX :  14.5,
                tileY : 0,
                tileZ : 0.5
              }
          }
          />
          <axesHelper />
        </mesh>
    )
}

export default Grid
