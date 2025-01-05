import { useState } from "react";
import { useFileContext } from "../../App";
import { useAudioContext } from "../Player_Component/Player_Component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faForward, faBackward } from "@fortawesome/free-solid-svg-icons";
import './Audio_Player_Component.css';



const Audio_Player_Component = () => {
  const { audioFile } = useFileContext();
  const { audioRef } = useAudioContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Helper function to format time in min:seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Play or pause the audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update the current time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Seek the audio
  const handleSeek = (event: { target: { value: any; }; }) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(Number(event.target.value));
    }
  };

  // Update duration when the audio metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Move audio forward or backward
  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 5,
        duration
      );
    }
  };

  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
    }
  };

  return (
    <div className="audio_player">
      {audioFile ? (
        <div>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
          </audio>
          <div className="audio_controls">
            <button className="reverse" onClick={handleBackward}>
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button className="play" onClick={togglePlayPause}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <button className="forward" onClick={handleForward}>
              <FontAwesomeIcon icon={faForward} />
            </button>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
            />
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      ) : (
        <p>No audio file uploaded.</p>
      )}
    </div>
  );
};

export default Audio_Player_Component;
