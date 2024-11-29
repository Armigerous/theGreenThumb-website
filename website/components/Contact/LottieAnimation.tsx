"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

// Define the LottieAnimation functional component
const LottieAnimation: React.FC = () => {
  return (
    // Render the DotLottiePlayer component with the specified Lottie file
    <DotLottiePlayer src="/greenthumb-contact-us.lottie" autoplay loop />
  );
};

// Export the LottieAnimation component as the default export
export default LottieAnimation;
