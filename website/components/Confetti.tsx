import React, { useEffect } from "react";
import { confetti } from "@tsparticles/confetti";

const Confetti: React.FC = () => {
  useEffect(() => {
    // Trigger the confetti animation
    confetti({
      // Customize your confetti options here
      angle: 90,
      spread: 45,
      startVelocity: 45,
      decay: 0.9,
      gravity: 1,
      drift: 0,
      ticks: 200,
      colors: ["#FF7F50", "#FFD700", "#FF69B4", "#1E90FF", "#32CD32"],
      shapes: ["square", "circle"],
      scalar: 1,
      zIndex: 1000,
      disableForReducedMotion: true,
    });
  }, []);

  return null; // This component doesn't render anything
};

export default Confetti;
