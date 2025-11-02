import React, { useState, useEffect, useMemo, useContext } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
//components/Countries.jsx

import { selectedCountryContext } from '../EarthPage';

const Country = React.memo(({ feature, isHovered, onPointerOver, onPointerOut, onClick }) => {
    const geometry = useMemo(() => {
        if (!feature.geometry) return new THREE.BufferGeometry();

        const shapes = [];
        const coords = feature.geometry.coordinates;

        const processPolygon = (polygonCoords) => {
            const exteriorRing = polygonCoords[0];
            const shape = new THREE.Shape();
            if (exteriorRing.length > 0) {
                shape.moveTo(exteriorRing[0][0], exteriorRing[0][1]);
                for (let i = 1; i < exteriorRing.length; i++) {
                    shape.lineTo(exteriorRing[i][0], exteriorRing[i][1]);
                }
            }
            // Handle holes
            for (let i = 1; i < polygonCoords.length; i++) {
                const holeRing = polygonCoords[i];
                const holeShape = new THREE.Path();
                if (holeRing.length > 0) {
                    holeShape.moveTo(holeRing[0][0], holeRing[0][1]);
                    for (let j = 1; j < holeRing.length; j++) {
                        holeShape.lineTo(holeRing[j][0], holeRing[j][1]);
                    }
                }
                shape.holes.push(holeShape);
            }
            return shape;
        };

        if (feature.geometry.type === 'Polygon') {
            shapes.push(processPolygon(coords));
        } else if (feature.geometry.type === 'MultiPolygon') {
            coords.forEach(polygon => {
                shapes.push(processPolygon(polygon));
            });
        }

        if (shapes.length === 0) return new THREE.BufferGeometry();

        const geom = new THREE.ShapeGeometry(shapes);

        const R = 3.1;
        const positions = geom.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const lon = positions.getX(i);
            const lat = positions.getY(i);

            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            const x = -(R * Math.sin(phi) * Math.cos(theta));
            const z = R * Math.sin(phi) * Math.sin(theta);
            const y = R * Math.cos(phi);

            positions.setXYZ(i, x, y, z);
        }

        geom.computeVertexNormals();
        return geom;
    }, [feature]);

    return (
        <mesh
            geometry={geometry}
            onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
            onPointerOut={(e) => { e.stopPropagation(); onPointerOut(); }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
            <meshStandardMaterial
                color={isHovered ? 'white' : 'transparent'}
                opacity={isHovered ? 0.7 : 0}
                transparent={true}
            />
        </mesh>
    );
});

export function Countries({openSidebar}) {
    const [countries, setCountries] = useState(null);
    const [hoveredCountryId, setHoveredCountryId] = useState(null);
    const {selectedCountry, setSelectedCountry } = useContext(selectedCountryContext);

    useEffect(() => {
        fetch('/Assets/Geodata/countries.geojson')
            .then(res => res.json())
            .then(data => setCountries(data));
    }, []);

    const handleCountryClick = (feature) => {
        openSidebar();
        setSelectedCountry(feature.properties.name);
        console.log('Clicked on:', feature.properties.name);
    };

    if (!countries) return null;

    return (
        <group>
            {countries.features.map(feature => (
                <Country
                    key={feature.properties.iso_a3}
                    feature={feature}
                    isHovered={hoveredCountryId === feature.properties.iso_a3}
                    onPointerOver={() => setHoveredCountryId(feature.properties.iso_a3)}
                    onPointerOut={() => setHoveredCountryId(null)}
                    onClick={() => handleCountryClick(feature)}
                />
            ))}
        </group>
    );
}
