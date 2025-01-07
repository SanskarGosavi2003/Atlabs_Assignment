import React, { useState, useCallback, useEffect } from "react";
import { useFileContext } from "../../App";
import { useAudioContext } from "../Player_Component/Player_Component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRotateRight, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import './Audio_Player_Component.css';
import dune from '../../assets/dune.png';

const Audio_Player_Component = React.memo(() => {
  const { audioFile } = useFileContext();
  const { audioRef } = useAudioContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Memoized callback for toggling play/pause
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, audioRef]);

  // Memoized callback for updating current time
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [audioRef]);

  // Seek the audio
  const handleSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  }, [audioRef]);

  // Set duration after metadata is loaded
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [audioRef]);

  // Move audio forward or backward
  const handleForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
    }
  }, [audioRef, duration]);

  const handleBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
    }
  }, [audioRef]);

  // Update the --progress CSS variable dynamically
  const updateProgress = useCallback(() => {
    const percentage = (currentTime / duration) * 100;
    document.documentElement.style.setProperty("--progress", `${percentage}%`);
  }, [currentTime, duration]);

  // Call this function whenever `currentTime` changes
  useEffect(() => {
    updateProgress();
  }, [currentTime, updateProgress]);

  return (
    <div className="audio_player_container">
      {audioFile ? (
        <div className="audio_player">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
          </audio>
          <img src={dune} className="cover_image" alt="" />
          <div className="audio_controls">
            <div className="buttons">
                <button className="reverse" onClick={handleBackward}>
                    <div className="icon-wrapper">
                        <span className="icon-label">-5</span>
                        <FontAwesomeIcon icon={faRotateLeft} />
                    </div>
                </button>
                <button className="play" onClick={togglePlayPause}>
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
                <button className="forward" onClick={handleForward}>
                  <div className="icon-wrapper">
                      <span className="icon-label">+5</span>
                      <FontAwesomeIcon icon={faRotateRight} />
                  </div>
                </button>
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onInput={handleSeek}
            />
          </div>
        </div>
      ) : (
        <p>No audio file uploaded.</p>
      )}
    </div>
  );
});

export default Audio_Player_Component;
