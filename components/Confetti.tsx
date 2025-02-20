import React, { useEffect } from "react";
import { confetti } from "@tsparticles/confetti";

const Confetti: React.FC = () => {
  useEffect(() => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ["star"],
      colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    };

    // Call the shoot function in sequence to create the animation effect
    const triggerConfetti = () => {
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    };

    triggerConfetti();
  }, []); // Empty array ensures this runs once when the component is mounted

  return null; // No UI is rendered by the component
};

export default Confetti;
