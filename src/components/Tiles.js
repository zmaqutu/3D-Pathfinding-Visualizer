import React from 'react'

function Tiles() {
    return (
        <mesh rotation={[-Math.PI /2, 0, 0]}>
        <planeBufferGeometry attach = "geometry" args = {[30,30]} />
          <meshStandardMaterial attach = 'material' color="green" />
        </mesh>
    )
}

export default Tiles
