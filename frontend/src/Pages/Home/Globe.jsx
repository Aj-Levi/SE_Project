import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function Globe({hasRotated}) {
    const texture = useTexture(`/Assets/Textures/earth-august.jpg`);
    const meshRef = useRef(null);
    useFrame((state, delta) => {
        if (meshRef.current && !hasRotated) {
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[(Math.PI) / 10, (Math.PI) * (5 / 4), 0]}>
            {/* The shape of the object.
                  args={[radius, widthSegments, heightSegments]} */}
            <sphereGeometry args={[3.05, 32, 32]} />

            {/* The appearance of the object.
                  We're using a 'standard' material which reacts to light. */}
            <meshStandardMaterial map={texture} wireframe={false} />
        </mesh>
    );
}