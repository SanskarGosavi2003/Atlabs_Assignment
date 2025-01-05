import { useRef, createContext, useContext } from 'react';
import './Player_Component.css';
import Audio_Player_Component from '../Audio_Player_Component/Audio_Player_Component';
import Caption_Box_Component from '../Caption_Box_Component/Caption_Box_Component';

interface AudioContextValue {
    audioRef: React.RefObject<HTMLAudioElement>;
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

    return (
        <div className="player_component">
            <AudioContext.Provider value={{ audioRef }}>
                <div className="caption-container">
                    <Caption_Box_Component />
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
