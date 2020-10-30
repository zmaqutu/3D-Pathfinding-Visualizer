import React from 'react'

function Floor() {
    return (
        <mesh rotation={[-Math.PI /2, 0, 0]} position={[0, -3, -5]}>
         <planeBufferGeometry attach = 'geometry' args = {[100, 100]} />
        <meshStandardMaterial attach = 'material' color="black"/>    
        </mesh>
    )
}

export default Floor
