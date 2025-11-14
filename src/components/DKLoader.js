import React from 'react';
import '../LoadingAnimation.css';

const DKLoader = () => (
  <div className="loading-screen">
    <div className="dk-loader">
      <div className="dk-loader-content">
        <div className="dk-letters">
          <span className="dk-letter d">D</span>
          <div className="energy-bar"></div>
          <span className="dk-letter k">K</span>
        </div>
        <div className="loading-text">Loading Portfolio</div>
      </div>
    </div>
  </div>
);

export default DKLoader;
