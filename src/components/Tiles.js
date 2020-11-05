import * as THREE from 'three'
import React , {useState, useMemo }from 'react'
import { Canvas , useLoader} from "react-three-fiber";
import { TextureLoader } from 'three'
import img from './ground.png'

function Tiles(props) {
    const texture = useMemo(() => new THREE.TextureLoader().load(img), [img]);
    console.log("Props are working, propX is: " + props.tileX );
    {/*let texture = require('./assets/floor-texture.jpg');
    const texture =  new useLoader(THREE.TextureLoader, img);*/}
    return (
        <mesh rotation={[-Math.PI /2, 0, 0]} 
        position={[props.tilePosition.tileX,props.tilePosition.tileY,props.tilePosition.tileZ]}>
        <planeBufferGeometry attach = "geometry" args = {[1,1]}  />
        <meshLambertMaterial attach = 'material' transparent>
        <primitive attach="map" object={texture} />
        </meshLambertMaterial>
        </mesh>
    )
}

export default Tiles
