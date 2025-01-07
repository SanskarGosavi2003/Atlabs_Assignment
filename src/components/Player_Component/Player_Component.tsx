import { useRef, createContext, useContext, useState, useEffect, useMemo } from 'react';
import './Player_Component.css';
import Audio_Player_Component from '../Audio_Player_Component/Audio_Player_Component';
import Caption_Box_Component from '../Caption_Box_Component/Caption_Box_Component';
import { useFileContext } from '../../App';

interface AudioContextValue {
    audioRef: React.RefObject<HTMLAudioElement>;
}

interface TranscriptionWord {
    word: string;
    start: number;
    end: number;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
};

const Player_Component = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextValue = useMemo(() => ({ audioRef }), [audioRef]);
    const { transcriptFile } = useFileContext(); // Assuming you have a context to provide the transcript file

    const [transcriptionData, setTranscriptionData] = useState<TranscriptionWord[]>([]);

    // Load transcription data when transcriptFile changes
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

    return (
        <div className="player_component">
            <AudioContext.Provider value={audioContextValue }>
                <div className="caption-container">
                    {/* Pass transcriptionData as a prop */}
                    <Caption_Box_Component transcriptionData={transcriptionData} />
                </div>
                <div className="audio-player-container">
                    <Audio_Player_Component />
                </div>
            </AudioContext.Provider>
        </div>
    );
};

export default Player_Component;
export { useAudioContext };
