"use client";

import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
import { Content } from "@prismicio/client";
import { useRef } from "react";

import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type SkyDiveProps = {
  sentence: string | null;
  flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

const ThreeText = ({
  sentence,
  color = "white",
}: {
  sentence: string;
  color?: string;
}) => {
  const words = sentence.toUpperCase().split(" ");
  const material = new THREE.MeshLambertMaterial();
  const isDesktop = useMediaQuery("(min-width: 950px)", true);

  return words.map((word: string, index: number) => (
    <Text
      key={`${word} + ${index}`}
      scale={isDesktop ? 1 : 0.5}
      color={color}
      material={material}
      font="/fonts/Alpino-Variable.woff"
      fontWeight={900}
      anchorX={"center"}
      anchorY={"middle"}
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,."
    >
      {word}
    </Text>
  ));
};

const Scene = ({ sentence, flavor }: SkyDiveProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const canRef = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Group>(null);
  const cloud2Ref = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);

  const ANGLE = (Math.PI / 180) * 75;

  const getXPosition = (distance: number) => distance * Math.cos(ANGLE);
  const getYPosition = (distance: number) => distance * Math.sin(ANGLE);

  const getXYPositions = (distance: number) => ({
    x: getXPosition(distance),
    y: getYPosition(-1 * distance),
  });

  useGSAP(() => {
    if (
      !cloudsRef.current ||
      !cloud1Ref.current ||
      !cloud2Ref.current ||
      !canRef.current ||
      !textRef.current
    )
      return;

    // Setting initial positions for the can and clouds
    gsap.set(cloudsRef.current.position, { z: 10 });
    gsap.set(canRef.current.position, { ...getXYPositions(-4) });

    gsap.set(
      textRef.current.children.map((word) => word.position),
      {
        ...getXYPositions(7),
        z: 2,
      },
    );

    // Rotating the can around it's y-axis
    gsap.to(canRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1.7,
      repeat: -1,
      ease: "none",
    });

    // Infinite clouds scroll
    const DISTANCE = 15;
    const DURATION = 6;

    gsap.set([cloud1Ref.current.position, cloud2Ref.current.position], {
      ...getXYPositions(DISTANCE),
    });

    gsap.to(cloud1Ref.current.position, {
      y: `+=${getYPosition(DISTANCE * 2)}`,
      x: `+=${getXPosition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      duration: DURATION,
    });

    gsap.to(cloud2Ref.current.position, {
      y: `+=${getYPosition(DISTANCE * 2)}`,
      x: `+=${getXPosition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      duration: DURATION,
      delay: DURATION / 2,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".sky-dive",
        pin: true,
        start: "top top",
        end: "+=2000",
        scrub: 1.5,
      },
    });

    scrollTl
      .to("body", {
        backgroundColor: "#C0F0F5",
        overwrite: "auto",
        duration: 0.1,
      })
      .to(
        cloudsRef.current.position,
        {
          z: 0,
          duration: 0.3,
        },
        0,
      )
      .to(canRef.current.position, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(
        textRef.current.children.map((word) => word.position),
        {
          keyframes: [
            { x: 0, y: 0, z: -1 },
            { ...getXYPositions(-7), z: -7 },
          ],
          stagger: 0.3,
        },
        0,
      )
      .to(canRef.current.position, {
        ...getXYPositions(4),
        duration: 0.5,
        ease: "back.in(1.7)",
      })
      .to(cloudsRef.current.position, { z: 7, duration: 0.5 });
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan
          flavor={flavor}
          ref={canRef}
          rotationIntensity={0}
          floatIntensity={3}
          floatSpeed={3}
        >
          <pointLight intensity={30} color="#8C0413" decay={0.6} />
        </FloatingCan>
      </group>

      {/* Clouds  */}
      <Clouds ref={cloudsRef}>
        <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
        <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
      </Clouds>

      {/* Text  */}
      <group ref={textRef}>
        {sentence && <ThreeText sentence={sentence} color="#F97315" />}
      </group>

      {/* Lighting  */}
      <ambientLight intensity={2} color="#9DDEFA" />
      <Environment files="/hdrs/field.hdr" environmentIntensity={1.5} />
    </group>
  );
};

export default Scene;
