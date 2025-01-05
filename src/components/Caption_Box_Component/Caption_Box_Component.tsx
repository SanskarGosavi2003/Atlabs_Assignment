import { useState, useEffect } from "react";
import { useFileContext } from "../../App";
import { useAudioContext } from "../Player_Component/Player_Component";
import './Caption_Box_Component.css';

const Caption_Box_Component = () => {
    const { transcriptFile } = useFileContext();
    const { audioRef } = useAudioContext();
    const [transcriptionData, setTranscriptionData] = useState<{ word: string; start: number; end: number }[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);

    useEffect(() => {
        if (transcriptFile) {
            const reader = new FileReader();
    
            reader.onload = () => {
                try {
                    const jsonContent = JSON.parse(reader.result as string);
                    if (Array.isArray(jsonContent)) {
                        setTranscriptionData(jsonContent);
                    } else {
                        console.error("Transcription file does not contain a valid list.");
                    }
                } catch (error) {
                    console.error("Error reading the transcription file:", error);
                }
            };
    
            reader.readAsText(transcriptFile);
        }
    }, [transcriptFile]);

    useEffect(() => {
        const updateCurrentWord = () => {
            if (audioRef.current) {
                const currentTime = audioRef.current.currentTime;
                const currentWord = transcriptionData.find((word) => currentTime >= word.start && currentTime <= word.end);
                if (currentWord) {
                    const index = transcriptionData.indexOf(currentWord);
                    setCurrentWordIndex(index);
                }
            }
        };

        const interval = setInterval(updateCurrentWord, 100);
        return () => clearInterval(interval);
    }, [audioRef, transcriptionData]);

    return (
        <div className="caption-box-container">
            <h2>Atlabs Assignment</h2>
            <div className="caption-box">
                {transcriptionData.map((data, index) => (
                    <span
                        key={index}
                        className={`word ${index === currentWordIndex ? "highlight" : ""}`}
                    >
                        {data.word}{" "}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Caption_Box_Component;
