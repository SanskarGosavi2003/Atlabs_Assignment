import React from "react";
import './Caption_Box_Component.css';
import useCurrentWord from "../../hooks/useCurrentWord"; // Import the custom hook

interface CaptionBoxProps {
    transcriptionData: { word: string; start: number; end: number }[];
}

const Caption_Box_Component: React.FC<CaptionBoxProps> = React.memo(({ transcriptionData }) => {
    const currentWordIndex = useCurrentWord(transcriptionData); // Use the custom hook

    return (
        <div className="caption-box-container">
            <h2>Atlabs Assignment</h2>
            <div className="caption-box">
                {transcriptionData.map((data, index) => (
                    <React.Fragment key={index}>
                        <span
                            key={index}
                            className={`word ${index === currentWordIndex ? "highlight" : ""}`}
                        >
                            {data.word}
                        </span>
                        {" "}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
});

export default Caption_Box_Component;
