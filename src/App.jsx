import './App.css';
import Header from './components/Header';
import SteeringCounter from './components/SteeringCounter';
import CoachingPoint from './components/CoachingPoint';
import coachingTips from './coachingTips.json';

import React, { useState, useEffect } from 'react';
import SensorData from './components/SensorData';
import ScoreBoard from './components/ScoreBoard';
import SessionControl from './components/SessionControl';

const getCoaching = (id) => coachingTips.find(tip => tip.id === id) || null;

function App() {
  const [score, setScore] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [sensorData, setSensorData] = useState({ front: 200, back: 0, left: 100, right: 100 });
  const [direction, setDirection] = useState(1); // 1: 증가, -1: 감소

  const handleStart = () => { 
    setScore(70); 
    setIsRunning(true); 
  };

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false); 
      setSensorData({ front: 200, back: 0, left: 100, right: 100 });
    } else {
      setScore(0);
    }
  };

  // 실시간 테스트 로직
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        
        setSensorData(prev => {
          let nextFront = prev.front + (20 * direction); // 20씩 변화
          if (nextFront >= 200) { nextFront = 200; setDirection(-1); }
          else if (nextFront <= 0) { nextFront = 0; setDirection(1); }

          return {
            front: nextFront,
            back: 200 - nextFront,
            left: 100 + (direction * 15),
            right: 100 - (direction * 15)
          };
        });

        setScore(prev => {
          const isDanger = sensorData.front < 60;
          let newScore = isDanger ? prev - 2 : prev + 1;
          return Math.max(0, Math.min(100, newScore));
        });
      }, 500); 
    }
    return () => clearInterval(timer);
  }, [isRunning, sensorData.front, direction]);

  // 점수에 따른 코칭 id 변경 (1: 위험, 8: 양호)
  const coachingId = score < 50 ? 1 : 8;
  const coaching = getCoaching(coachingId);

  return (
    <div className="app">
      <Header isRunning={isRunning} sessionTime={81} />

      <main className="main">
        <div className="row--top">
          <div className="steering-wrap card">
            <SteeringCounter wheelAngle={-15} />
          </div>
          <div className="sensordata-wrap card">
            <SensorData data={sensorData} isRunning={isRunning}/>
          </div>
        </div>

        <div className="row--bottom">
          <div className="coaching-wrap card">
            <CoachingPoint
              message={coaching?.message}
              subMessage={coaching?.subMessage}
              level={coaching?.level}
              isRunning={isRunning}
            />
          </div>
          <div className="right-col">
            <div className="score-wrap card">
              <ScoreBoard score={score} isRunning={isRunning} />
            </div>
            <div className="session-wrap">
              <SessionControl 
                isRunning={isRunning} 
                onStart={handleStart} 
                onStop={handleStop} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;