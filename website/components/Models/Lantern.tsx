// src/models/Lantern.tsx

import * as THREE from "three";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

// Define the GLTFAction type
type GLTFAction = THREE.AnimationClip;

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_3: THREE.Mesh;
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_7: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_9: THREE.Mesh;
    Object_10: THREE.Mesh;
    Object_11: THREE.Mesh;
    Object_12: THREE.Mesh;
    Object_13: THREE.Mesh;
    Object_14: THREE.Mesh;
    Object_15: THREE.Mesh;
    Object_16: THREE.Mesh;
  };
  materials: {
    Rastkreuz_O_Material_u1_v1: THREE.MeshStandardMaterial;
    bottom: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function Lantern(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/lantern.glb") as GLTFResult;
  return (
    <group
      {...props}
      dispose={null}
      scale={[0.3, 0.3, 0.3]}
      position={[0, -2, 0]}
    >
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_3.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_8.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_9.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_10.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_11.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_12.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_13.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_14.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_15.geometry}
          material={materials.Rastkreuz_O_Material_u1_v1}
        />
        <mesh geometry={nodes.Object_16.geometry} material={materials.bottom} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/lantern.glb");

export default Lantern;
