// src/components/Earth.js

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Model } from './Model';
import { Boundries } from './Boundries'; // Corrected spelling
import { Countries } from './Countries'; // Corrected spelling

export function Earth({ selectedMonth, hasRotated, openSidebar }) {

    const earthRef = useRef();

    useFrame((state, delta) => {
        if (earthRef.current && !hasRotated) {
            earthRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={earthRef}>
            <Model selectedMonth={selectedMonth} position={[0, 0, 0]} />
            <Boundries radius={3} />
            <Countries openSidebar={openSidebar}/>
        </group>
    );
}