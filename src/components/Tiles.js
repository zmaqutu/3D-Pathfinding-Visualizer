import * as THREE from 'three'
import React , {useState, useMemo }from 'react'
import { Canvas , useLoader} from "react-three-fiber";
import { TextureLoader } from 'three'
import img from './ground.png'

let coord = [];
function calculateTilePosition(id){
    let y = Math.trunc(id/30); {/*Change 30 to a prop or state*/}
    let x = id % 30;

    console.log("y is : " + y);
    console.log("x is : " + x);

    return [y-14.5, x-14.5];

}

function Tiles(props) {
    const texture = useMemo(() => new THREE.TextureLoader().load(img), [img]);

    const [coordinates, setCoordinates] = useState([]);
    
    {/*setCoordinates(calculateTilePosition(props.nodeID));*/}
    coord  = calculateTilePosition(props.nodeID);
    console.log("Coordinate y is " + coord[0]);


    return (
        <mesh rotation={[-Math.PI /2, 0, 0]} 
        position={[coord[0],0,coord[1]]}>
        <planeBufferGeometry attach = "geometry" args = {[1,1]}  />
        <meshLambertMaterial attach = 'material' transparent>
        <primitive attach="map" object={texture} />
        </meshLambertMaterial>
        </mesh>
    )
}

export default Tiles
