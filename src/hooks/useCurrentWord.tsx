import { useEffect, useState } from "react";
import { useAudioContext } from "../components/Player_Component/Player_Component";

interface TranscriptionWord {
    word: string;
    start: number;
    end: number;
}

const useCurrentWord = (transcriptionData: TranscriptionWord[]) => {
    const { audioRef } = useAudioContext();
    const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);

    useEffect(() => {
        const updateCurrentWord = () => {
            if (audioRef.current) {
                const currentTime = audioRef.current.currentTime;
                const currentWord = transcriptionData.find(
                    (word) => currentTime >= word.start && currentTime <= word.end
                );
                if (currentWord) {
                    const index = transcriptionData.indexOf(currentWord);
                    setCurrentWordIndex(index);
                } else {
                    setCurrentWordIndex(null); // Reset if no word is found
                }
            }
        };

        const interval = setInterval(updateCurrentWord, 100);
        return () => clearInterval(interval);
    }, [transcriptionData, audioRef]);

    return currentWordIndex;
};

export default useCurrentWord;