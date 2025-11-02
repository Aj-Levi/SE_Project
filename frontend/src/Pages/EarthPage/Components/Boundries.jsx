// src/components/Boundaries.js
import React, { useState, useEffect, useMemo } from 'react';
import { Line } from '@react-three/drei';
import { latLonToVector3 } from "../Helpers/latLonToVector3"

export function Boundries({ radius }) {
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    fetch('/Assets/Geodata/countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
      });
  }, []);



  const lines = useMemo(() => {
    if (!countries) return [];

    const allLines = [];
    // GeoJSON features can be Polygons or MultiPolygons
    countries.features.forEach(feature => {
      const coords = feature.geometry.coordinates;

      if (feature.geometry.type === 'Polygon') {
        const points = coords[0].map(p => latLonToVector3(p[1], p[0], radius + 0.01));
        allLines.push(points);
      } else if (feature.geometry.type === 'MultiPolygon') {
        coords.forEach(poly => {
          const points = poly[0].map(p => latLonToVector3(p[1], p[0], radius + 0.01));
          allLines.push(points);
        });
      }
    });
    return allLines;
  }, [countries, radius]);

  if (!countries) {
    return null;
  }

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="aliceblue"
          lineWidth={0.5}
        />
      ))}
    </group>
  );
}