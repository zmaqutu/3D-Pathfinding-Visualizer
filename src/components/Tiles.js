import * as THREE from 'three'
import React , {useState, useMemo }from 'react'
import { Canvas , useLoader} from "react-three-fiber";
import { TextureLoader } from 'three'
import img from './ground.png'

let coord = [];
function calculateTilePosition(id){
    let y = Math.trunc(id/30); {/*Change 30 to a prop or state*/}
    let x = id % 30;


    return [y-145, x-145];

}

function Tiles(props) {
    const loader = useMemo(() => new THREE.TextureLoader().load(img,
        function(texture){
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = props.gridProps.length;
            texture.repeat.y = props.gridProps[0].length;
        }), [img]);

    const [coordinates, setCoordinates] = useState([]);
    
    {/*setCoordinates(calculateTilePosition(props.nodeID));*/}
    coord  = calculateTilePosition(props.nodeID);


    return (
        <mesh rotation={[-Math.PI /2, 0, 0]} position={[0,-0.1,0]}>
            <planeBufferGeometry attach = "geometry" args = {[300,300]}  />
            <meshLambertMaterial attach = 'material' transparent>
                <primitive attach="map" object={loader} />
            </meshLambertMaterial>
        </mesh>
    )
}

export default Tiles
