"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

interface AudioPlayerButtonProps {
  soundFile: string;
}

const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({ soundFile }) => {
  const playAudio = () => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  return (
    <Button onClick={playAudio}>
      <PlayIcon /> Pronunciation
    </Button>
  );
};

export default AudioPlayerButton;
