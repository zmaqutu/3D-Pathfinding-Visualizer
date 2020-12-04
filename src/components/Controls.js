import { OrbitControls } from 'drei';
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import React, {useEffect, useState, useRef } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import TWEEN, { Tween } from '@tweenjs/tween.js';
import * as THREE from 'three';


function Controls(props) {
    const resetStatus = props.resetStatus;
    const {
        camera,
        gl,
        scene,
    } = useThree();

    const controls = useRef();



    useEffect(() => {
        if(props.resetStatus == true){
            resetCamera();
        }
       
    }, [resetStatus]);

    function resetCamera() {

            TWEEN.removeAll();
			new TWEEN.Tween(camera.position)
				.to({ x: 0, y: 400, z: 0 }, 250)
				.easing(TWEEN.Easing.Exponential.Out)
				.onComplete(() => {
                    controls.current.update();
				})
				.start();
                
    } 

    return (
        <OrbitControls ref = {controls} enableRotate = {!props.resetStatus}/>
    )
}

export default Controls
