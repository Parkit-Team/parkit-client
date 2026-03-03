import React from 'react';
import './components.css';

const SessionControl = ({ isRunning, onStart, onStop }) => {
  return (
    <div className="session-control">
      {/* START 버튼 박스 */}
      <div className={`session-btn-wrap card ${isRunning ? 'btn--disabled' : 'btn--active-green'}`}>
        <button 
          className="session-btn"
          onClick={onStart}
          disabled={isRunning}
        >
          SESSION START
        </button>
      </div>
      
      {/* STOP 버튼 박스 */}
      <div className={`session-btn-wrap card ${!isRunning ? 'btn--disabled' : ''}`}>
        <button 
          className="session-btn"
          onClick={onStop}
        >
          SESSION STOP
        </button>
      </div>
    </div>
  );
};

export default SessionControl;