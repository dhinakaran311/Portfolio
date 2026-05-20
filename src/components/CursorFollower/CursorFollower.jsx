import React, { useEffect, useRef } from 'react';

const CursorFollower = ({ isCursorVisible, followerPosition }) => {
    const ringRef = useRef(null);
    const dotRef = useRef(null);

    // Shrink on mousedown, expand on mouseup
    useEffect(() => {
        const onDown = () => {
            if (ringRef.current) ringRef.current.style.transform = 'scale(0.7)';
            if (dotRef.current) dotRef.current.style.transform = 'scale(1.8)';
        };
        const onUp = () => {
            if (ringRef.current) ringRef.current.style.transform = 'scale(1)';
            if (dotRef.current) dotRef.current.style.transform = 'scale(1)';
        };
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
        };
    }, []);

    return (
        <div
            className={`cursor-follower ${isCursorVisible ? 'visible' : ''}`}
            style={{
                transform: `translate3d(${followerPosition.x - 22}px, ${followerPosition.y - 22}px, 0)`
            }}
        >
            {/* Outer rotating ring */}
            <div className="cursor-ring" ref={ringRef}>
                <div className="cursor-ring__arc" />
            </div>

            {/* Middle pulse ring */}
            <div className="cursor-pulse" />

            {/* Inner ember dot */}
            <div className="cursor-dot" ref={dotRef} />
        </div>
    );
};

export default CursorFollower;
