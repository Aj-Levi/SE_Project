//components/Model.jsx

import { useTexture } from '@react-three/drei';



export function Model({position, selectedMonth }) {

  const texture = useTexture(`/Assets/Textures/earth-${selectedMonth}.jpg`);

 
    return (

        <mesh position={position}>
            {/* The shape of the object.
          args={[radius, widthSegments, heightSegments]} */}
            <sphereGeometry args={[3, 32, 32]} />

            {/* The appearance of the object.
          We're using a 'standard' material which reacts to light. */}
            <meshStandardMaterial map={texture} wireframe={false} />
        </mesh>
    );
}