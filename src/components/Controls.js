import { OrbitControls } from 'drei';
import React, {useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import TWEEN from '@tweenjs/tween.js';


function Controls(props) {
    const resetStatus = props.resetStatus;
    const {
        camera,
    } = useThree();

    const controls = useRef();



    useEffect(() => {
        if(props.resetStatus === true){
            resetCamera();
        }
       
    }, [resetStatus]);

    function resetCamera() {

            TWEEN.removeAll();
			new TWEEN.Tween(camera.position)
				.to({ x: 0, y: 400, z: 0 }, 2000)
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
