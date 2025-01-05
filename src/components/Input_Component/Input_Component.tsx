import React, { useState, useRef, useEffect } from "react";
import "./Input_Component.css";
import { useFileContext, usePageStateContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const Input_Component = () => {
    const { audioFile, transcriptFile, setAudioFile, setTranscriptFile } = useFileContext();
    const { pageState, setPageState } = usePageStateContext();
    const [inputKey, setInputKey] = useState(0);
    const [audioPreviewURL, setAudioPreviewURL] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            setAudioPreviewURL(URL.createObjectURL(file));
            setIsPlaying(false);
        }
    };

    const handleTranscriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTranscriptFile(file);
        }
    };

    const handleSubmit = () => {
        setPageState(pageState === 0 ? 1 : 0);
        console.log("Files saved to local storage.");
    };

    const handleRemove = () => {
        setAudioFile(null);
        setTranscriptFile(null);
        setAudioPreviewURL(null);
        setIsPlaying(false);
        setInputKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        return () => {
            if (audioPreviewURL) {
                URL.revokeObjectURL(audioPreviewURL);
            }
        };
    }, [audioPreviewURL]);

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(prevState => !prevState);
        }
    };

    return (
        <div className="input_component">
            <h2>Upload Audio and Transcript</h2>
            <div className="upload_card">
                {audioFile ? (
                    <div
                        className={`upload_box circular_player ${isPlaying ? 'playing' : ''} ${audioFile ? 'success-border success-background' : ''}`}
                        onClick={togglePlayback}
                    >
                        <div className="play_pause_icon">
                        {isPlaying ? (
                            <FontAwesomeIcon icon={faPause} style={{ color: 'rgba(255, 127, 80, 1)' }} />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} style={{ color: 'rgba(255, 127, 80, 1)' }} />
                        )}
                        </div>
                        <audio ref={audioRef} src={audioPreviewURL || undefined} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}></audio>
                    </div>
                ) : (
                    <label htmlFor={`audio-upload-${inputKey}`} className={`upload_box ${audioFile ? 'success-border success-background' : ''}`}>
                        <div className="upload_icon">+</div>
                        <p>Upload Audio</p>
                    </label>
                )}
                <input
                    id={`audio-upload-${inputKey}`}
                    key={`audio-${inputKey}`}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    hidden={!audioFile}
                />
                {audioFile && (
                    <label htmlFor={`transcript-upload-${inputKey}`} className={`upload_box smaller ${transcriptFile ? 'success-border success-background' : ''}`}>
                        <p>{transcriptFile ? "Transcript Loaded" : "Add Transcript File"}</p>
                    </label>
                )}
                <input
                    id={`transcript-upload-${inputKey}`}
                    key={`transcript-${inputKey}`}
                    type="file"
                    accept="application/json"
                    onChange={handleTranscriptFileChange}
                    hidden
                />
            </div>
            <div className="action_buttons">
                <button className="submit_button" onClick={handleSubmit}>
                    Submit
                </button>
                <button className="remove_button" onClick={handleRemove}>
                    Remove
                </button>
            </div>
        </div>
    );
};

export default Input_Component;