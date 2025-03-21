import { useGSAP } from "@gsap/react";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import React, { useRef } from "react";
import { Group } from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useStore } from "@/hooks/useStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const isReady = useStore((state) => state.isReady)

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);
  const can4Ref = useRef<Group>(null);
  const can5Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const cansGroupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (
      !can1Ref.current ||
      !can2Ref.current ||
      !can3Ref.current ||
      !can4Ref.current ||
      !can5Ref.current ||
      !can1GroupRef.current ||
      !can2GroupRef.current ||
      !cansGroupRef.current
    )
      return;

    // If all the refs exist then all the models have loaded
    isReady()

    // Setting the positions of the cans
    gsap.set(can1Ref.current.position, { x: -1.5 });
    gsap.set(can1Ref.current.rotation, { z: -0.5 });

    gsap.set(can2Ref.current.position, { x: 1.5 });
    gsap.set(can2Ref.current.rotation, { z: 0.5 });

    gsap.set(can3Ref.current.position, { y: 5, z: 2 });
    gsap.set(can4Ref.current.position, { x: 2, y: 4, z: 2 });
    gsap.set(can5Ref.current.position, { y: -5 });

    const introTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: "back.out(1.4)",
      },
    });

    if (window.scrollY < 20) {
      introTl
        .from(can1GroupRef.current.position, { x: 1, y: -5 }, 0)
        .from(can1GroupRef.current.rotation, { z: 3 }, 0)
        .from(can2GroupRef.current.position, { x: 1, y: 5 }, 0)
        .from(can2GroupRef.current.rotation, { z: 3 }, 0);
    }

    const scrollTl = gsap.timeline({
      defaults: {
        duration: 2,
      },
      scrollTrigger: {
        trigger: ".hero-slice",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    scrollTl
      // Rotate the entire cans group
      .to(cansGroupRef.current.rotation, { y: Math.PI * 2 })

      // BlackCherry - Can1
      .to(can1Ref.current.position, { x: -0.2, y: -0.7, z: -2 }, 0)
      .to(can1Ref.current.rotation, { z: 0.3 }, 0)

      // LemonLime - Can2
      .to(can2Ref.current.position, { x: 1, y: -0.2, z: -1 }, 0)
      .to(can2Ref.current.rotation, { z: 0 }, 0)

      // Grape - Can3
      .to(can3Ref.current.position, { x: -0.3, y: 0.5, z: -1 }, 0)
      .to(can3Ref.current.rotation, { z: -0.1 }, 0)

      // Starwberry - Can4
      .to(can4Ref.current.position, { x: 0, y: -0.3, z: 0.5 }, 0)
      .to(can4Ref.current.rotation, { z: 0.3 }, 0)

      // Watermelon - Can5
      .to(can5Ref.current.position, { x: 0.3, y: 0.5, z: -0.5 }, 0)
      .to(can5Ref.current.rotation, { z: -0.25 }, 0)

      .to(
        cansGroupRef.current.position,
        { x: 1, duration: 3, ease: "sine.inOut" },
        1.3,
      );
  });

  return (
    <group ref={cansGroupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          floatSpeed={FLOAT_SPEED}
          flavor="blackCherry"
        />
      </group>

      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          floatSpeed={FLOAT_SPEED}
          flavor="lemonLime"
        />
      </group>

      <FloatingCan ref={can3Ref} floatSpeed={FLOAT_SPEED} flavor="grape" />
      <FloatingCan
        ref={can4Ref}
        floatSpeed={FLOAT_SPEED}
        flavor="strawberryLemonade"
      />
      <FloatingCan ref={can5Ref} floatSpeed={FLOAT_SPEED} flavor="watermelon" />

      <Environment files="hdrs/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
