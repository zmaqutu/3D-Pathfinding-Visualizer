import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import buildingImg from './building_texture.jpg';
import { tweenGroup } from './algorithms/helpers';

const CELL = 10;
const HALF = 150;
const CENTER_OFFSET = HALF - CELL / 2; // first cell center is -145, last is +145

// One shared texture instance for all buildings. Filled in async; materials
// using it pick up the image once load completes.
const buildingTexture = new THREE.TextureLoader().load(buildingImg, (tex) => {
   tex.wrapS = THREE.RepeatWrapping;
   tex.wrapT = THREE.RepeatWrapping;
   tex.repeat.set(1, 3); // stack panels vertically on the tall side faces
   tex.colorSpace = THREE.SRGBColorSpace;
});

function cellWorldXZ(row, col) {
   return [col * CELL - CENTER_OFFSET, row * CELL - CENTER_OFFSET];
}

// Pops the object3D up from scale 0 → 1 with a slight overshoot. Anchored at
// the group's origin (which we keep at ground level), so it grows up from
// the floor rather than expanding from the middle.
function useScaleIn(ref, duration = 450) {
   useEffect(() => {
      const obj = ref.current;
      if (!obj) return;
      obj.scale.set(0.001, 0.001, 0.001);
      new TWEEN.Tween(obj.scale, tweenGroup)
         .to({ x: 1, y: 1, z: 1 }, duration)
         .easing(TWEEN.Easing.Back.Out)
         .start();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
}

function Building({ row, col }) {
   const [x, z] = cellWorldXZ(row, col);
   const groupRef = useRef();
   const material = useMemo(
      () => new THREE.MeshLambertMaterial({ map: buildingTexture, color: 0xb8b8c8 }),
      []
   );
   useScaleIn(groupRef);
   return (
      <group ref={groupRef} position={[x, 0, z]}>
         <mesh position={[0, 10, 0]} castShadow receiveShadow material={material}>
            <boxGeometry args={[7, 20, 7]} />
         </mesh>
      </group>
   );
}

function Tree({ row, col }) {
   const [x, z] = cellWorldXZ(row, col);
   const groupRef = useRef();
   useScaleIn(groupRef);
   return (
      <group ref={groupRef} position={[x, 0, z]}>
         <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.7, 1.0, 6, 8]} />
            <meshLambertMaterial color={0x8b5a2b} />
         </mesh>
         <mesh position={[0, 9, 0]} castShadow>
            <coneGeometry args={[3, 8, 10]} />
            <meshLambertMaterial color={0x2d6a3e} />
         </mesh>
      </group>
   );
}

export const WALL_TYPES = ['building', 'tree'];

export default function WallObjects({ walls }) {
   return (
      <>
         {Object.values(walls).map((w) => {
            const key = `${w.row}-${w.col}`;
            if (w.type === 'tree') return <Tree key={key} row={w.row} col={w.col} />;
            return <Building key={key} row={w.row} col={w.col} />;
         })}
      </>
   );
}
