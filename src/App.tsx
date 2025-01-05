import React, { useState, createContext, useContext } from 'react';
import './App.css';
import Input_Component from './components/Input_Component/Input_Component';
import Player_Component from './components/Player_Component/Player_Component';

// Define the context types
type FileContextType = {
    audioFile: File | null;
    transcriptFile: File | null;
    setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
    setTranscriptFile: React.Dispatch<React.SetStateAction<File | null>>;
};

type PageStateContextType = {
    pageState: number;
    setPageState: React.Dispatch<React.SetStateAction<number>>;
};

// Create contexts
const FileContext = createContext<FileContextType | undefined>(undefined);
const PageStateContext = createContext<PageStateContextType | undefined>(undefined);

// Custom hook to use the FileContext
const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within the FileContext.Provider');
    }
    return context;
};

// Custom hook to use the PageStateContext
const usePageStateContext = () => {
    const context = useContext(PageStateContext);
    if (!context) {
        throw new Error('usePageStateContext must be used within the PageStateContext.Provider');
    }
    return context;
};

function App() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

    const [pageState, setPageState] = useState(0); // Use state for page navigation

    return (
        <FileContext.Provider value={{ audioFile, transcriptFile, setAudioFile, setTranscriptFile }}>
            <PageStateContext.Provider value={{ pageState, setPageState }}>
                {pageState === 0 && <Input_Component />}
                {pageState === 1 && <Player_Component />}
            </PageStateContext.Provider>
        </FileContext.Provider>
    );
}

export default App;
export { useFileContext, usePageStateContext };
