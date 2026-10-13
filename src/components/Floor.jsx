import React from 'react';

function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -5]}>
            <planeGeometry args={[5000, 5000, 30, 30]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
}

export default Floor;
