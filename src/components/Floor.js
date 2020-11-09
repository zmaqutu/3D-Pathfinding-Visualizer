import React from 'react'

function Floor() {
    return (
        <mesh rotation={[-Math.PI /2, 0, 0]} position={[0, -3, -5]}>
         <planeBufferGeometry attach = 'geometry' args = {[1000, 1000, 30, 30]} />
        <meshStandardMaterial attach = 'material' color="grey"/>    
        </mesh>
    )
}

export default Floor
