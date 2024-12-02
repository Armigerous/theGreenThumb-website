// Confetti.tsx
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";

const Confetti: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadConfettiPreset(engine);
  }, []);

  return (
    <Particles
      id="confetti"
      init={particlesInit}
      options={{
        preset: "confetti",
        fullScreen: { enable: true, zIndex: 1000 }, // Higher z-index to ensure it's on top

        emitters: [
          {
            position: { x: 0, y: 50 }, // Left side of the screen
            rate: {
              delay: 0.1,
              quantity: 5,
            },
            size: {
              width: 2,
              height: 100,
            },
          },
          {
            position: { x: 100, y: 50 }, // Right side of the screen
            rate: {
              delay: 0.1,
              quantity: 5,
            },
            size: {
              width: 2,
              height: 100,
            },
          },
        ],
        particles: {
          move: {
            direction: "top",
            outModes: {
              default: "out",
            },
            speed: 8,
          },
          size: {
            value: { min: 3, max: 5 },
          },
          color: {
            value: ["#FF7F50", "#FFD700", "#FF69B4", "#1E90FF", "#32CD32"],
          },
          opacity: {
            value: { min: 0.6, max: 1 },
          },
        },
      }}
    />
  );
};

export default Confetti;
