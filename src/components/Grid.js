import React, { useState, useRef, useEffect } from 'react'
import { MeshLambertMaterial } from 'three';
import Tiles from './Tiles';
import { Component } from 'react'
import { Canvas } from "react-three-fiber";

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
 return tempGrid;

}

function createNode(row, col){

  let node = {
      id: row * col + col,
      row: row,
      col: col,
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
    }, [])

    
  
    return (
        <mesh ref = {mesh} position = {[0,0,0]}>
          <gridHelper args = {[props.gridDimensions, props.gridDimensions, "hotpink", "hotpink"] }/>
          <>
          { grid.map((nodeID, index) => {
           return <Tiles nodeID={index}/>
          })}
          </>
          <axesHelper />
        </mesh>
    )
}


export default Grid
{ /*grid.map((nodeID, index) => { 
      grid[0].map((colID, idx) => {
        return <Tiles nodeID={idx} />
      })}
 
    )*/}