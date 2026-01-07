import React from 'react';
import { FaCode } from 'react-icons/fa';

const CursorFollower = ({ isCursorVisible, followerPosition }) => {
    return (
        <div
            className={`cursor-follower ${isCursorVisible ? 'visible' : ''}`}
            style={{
                transform: `translate3d(${followerPosition.x - 14}px, ${followerPosition.y - 14}px, 0)`
            }}
        >
            <FaCode />
        </div>
    );
};

export default CursorFollower;
