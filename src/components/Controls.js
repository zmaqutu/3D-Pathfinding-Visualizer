import React, { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as TWEEN from '@tweenjs/tween.js';
import { tweenGroup } from './algorithms/helpers';

function Controls(props) {
    const resetStatus = props.resetStatus;
    const { camera } = useThree();
    const controls = useRef();

    useFrame(() => {
        tweenGroup.update();
    });

    useEffect(() => {
        if (resetStatus === true) {
            tweenGroup.removeAll();
            new TWEEN.Tween(camera.position, tweenGroup)
                .to({ x: 0, y: 385, z: 0 }, 2000)
                .easing(TWEEN.Easing.Exponential.Out)
                .onComplete(() => {
                    if (controls.current) controls.current.update();
                })
                .start();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetStatus]);

    return (
        <OrbitControls ref={controls} enableRotate={!resetStatus} />
    );
}

export default Controls;
