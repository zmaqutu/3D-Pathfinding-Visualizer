<h1 align="center">3D Pathfinding Algorithm Visualizer </h1>

<div align="center" >
  <img src="https://img.shields.io/badge/made%20by-Zongo%20Maqutu-blue" />
  <img src="https://img.shields.io/badge/React%20Js-v17.0.1-61dafb" />
  <img src="https://img.shields.io/badge/Javascript-94%25-fffe6a" />
  <img src="https://img.shields.io/badge/HTML-94%25-e34c26" />
  <img src="https://img.shields.io/badge/pull%20requests-welcome-green" />
</div>

*A Visualizer for some common pathfinding algorithms in 3D.*
## Live Demo
A live interactive demo can be found [here](https://zmaqutu.github.io/3D-Pathfinding-Visualizer/).
<img src="./readmeAssets/WorldSetup.gif" width="100%">

## Features
### Weighted and unweighted algorithms
* **Dijkstra’s algorithm** (weighted) <br>
The father of pathfinding algorithms, it creates a tree of shortest paths from the starting vertex, the source, to all other points in the graph. <b>Guarantees</b> the shortest path!

* **A\* Search algorithm** (weighted) <br>
One of the best and a popular technique used in path-finding and graph traversals with heuristic. <b>Guarantees</b> the shortest path!

* **Breadth-First Search** (unwighted) <br>
The algorithm starts at the tree root, and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. <b>Guarantees</b> the shortest path!

* **Depth-First Search** (unwighted) <br>
The algorithm starts at the root node and explores as far as possible along each branch before backtracking. <b>Does not guarantee</b> the shortest path!

### Maze generation
Two methods to generate a maze:
* Recursive Division <img src="./readmeAssets/RecursiveDijkstra.gif" width="100%">
* Random <img src="./readmeAssets/RandomMaze.gif" width="100%">

### Libraries used
* Three.js
* react-three-fiber
* Tween.js

## Contributing
Contributions are welcome. Please feel free to make a PR.

## Project setup
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
```
npm install
npm start
```
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Future Scope
* Add trees and buildings as wall objects
* Add button to toggle node information as text on each node in shortest path
* Add funcitonality to move start and finish nodes by dragging
* Add control panel to edit world setup more 
* Add more algorithms to visualize

<p align="center">Made with ❤️ in React.js</p>