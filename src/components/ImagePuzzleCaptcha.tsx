import React, { useState, useRef } from 'react';

interface ImagePuzzleCaptchaProps {
    onVerify: () => void;
}

// Simple slider puzzle: user must drag slider to complete the puzzle
export default function ImagePuzzleCaptcha({ onVerify }: ImagePuzzleCaptchaProps) {
    const [solved, setSolved] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [dragging, setDragging] = useState(false);
    const sliderRef = useRef<HTMLInputElement>(null);

    // Random offset for puzzle piece (for demo, could be randomized per render)
    const PUZZLE_OFFSET = 60; // px
    const PUZZLE_WIDTH = 40; // px
    const PUZZLE_IMAGE = '/images/captcha-bg.jpg'; // Use a public domain or your own image

    // When slider is released, check if it's close enough to the target
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setSliderValue(value);
        setDragging(true);
    };
    const handleSliderMouseUp = () => {
        setDragging(false);
        // If slider is within 5px of the offset, consider solved
        if (Math.abs(sliderValue - PUZZLE_OFFSET) < 5) {
            setSolved(true);
            onVerify();
        } else {
            setSliderValue(0); // Reset
        }
    };

    return (
        <div className="w-full max-w-xs mx-auto flex flex-col items-center">
            <div className="relative w-64 h-32 mb-4 rounded-lg overflow-hidden border border-white/20 bg-gray-900">
                <img
                    src={PUZZLE_IMAGE}
                    alt="Captcha background"
                    className="w-full h-full object-cover opacity-80"
                    draggable={false}
                />
                {/* Puzzle piece */}
                <div
                    className="absolute top-6"
                    style={{
                        left: `${sliderValue}px`,
                        width: PUZZLE_WIDTH,
                        height: PUZZLE_WIDTH,
                        background: `url(${PUZZLE_IMAGE}) -${PUZZLE_OFFSET}px -24px/256px 128px`,
                        border: '2px solid #0ff',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px #0008',
                        opacity: solved ? 0.7 : 1,
                        transition: dragging ? 'none' : 'left 0.3s',
                        pointerEvents: 'none',
                    }}
                />
                {/* Target outline */}
                <div
                    className="absolute top-6 border-2 border-dashed border-cyan-400 rounded"
                    style={{
                        left: `${PUZZLE_OFFSET}px`,
                        width: PUZZLE_WIDTH,
                        height: PUZZLE_WIDTH,
                        opacity: 0.7,
                        pointerEvents: 'none',
                    }}
                />
            </div>
            <input
                ref={sliderRef}
                type="range"
                min={0}
                max={200}
                value={sliderValue}
                onChange={handleSliderChange}
                onMouseUp={handleSliderMouseUp}
                onTouchEnd={handleSliderMouseUp}
                disabled={solved}
                className="w-64 mt-2 accent-cyan-400"
                aria-label="Slide to complete the puzzle"
            />
            <div className="text-xs text-gray-400 mt-2">
                {solved ? 'Captcha solved!' : 'Slide the puzzle piece into place to verify you are human.'}
            </div>
        </div>
    );
} 