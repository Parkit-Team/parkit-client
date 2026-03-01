import './App.css';
import Header from './components/Header';
import SteeringCounter from './components/SteeringCounter';
import CoachingPoint from './components/CoachingPoint';
import coachingTips from './coachingTips.json';

import React, { useState, useEffect, useRef } from 'react';
import SensorData from './components/SensorData';
import ScoreBoard from './components/ScoreBoard';
import SessionControl from './components/SessionControl';

const getCoaching = (id) => coachingTips.find(tip => tip.id === id) || null;

function App() {
  const [score, setScore] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [sensorData, setSensorData] = useState({ front: 200, back: 0, left: 100, right: 100 });
  const [direction, setDirection] = useState(1); 
  const [testToggle, setTestToggle] = useState(true);

  const coachingRef = useRef(null);

  const handleStart = () => { setScore(70); setIsRunning(true); };
  const handleStop = () => {
    if (isRunning) { setIsRunning(false); setSensorData({ front: 200, back: 0, left: 100, right: 100 }); }
    else { setScore(0); }
  };

  const coachingId = testToggle ? 12 : 1;
  const coaching = getCoaching(coachingId);

  useEffect(() => { coachingRef.current = coaching; }, [coaching]);

  // 1. 센서 시뮬레이션: 1cm 단위로 아주 부드럽게 움직이도록 수정
  useEffect(() => {
    let sensorTimer;
    if (isRunning) {
      sensorTimer = setInterval(() => {
        setSensorData(prev => {
          let nextFront = prev.front + (1 * direction); // 1cm씩 변화
          let nextDir = direction;
          
          if (nextFront >= 200) { nextFront = 200; nextDir = -1; setDirection(-1); }
          else if (nextFront <= 0) { nextFront = 0; nextDir = 1; setDirection(1); }

          return {
            front: nextFront,
            back: 200 - nextFront,
            left: 100 + (nextDir * 5),
            right: 100 - (nextDir * 5)
          };
        });
      }, 20); // 0.02초마다 업데이트하여 눈이 즐거운 부드러운 움직임 구현
    }
    return () => clearInterval(sensorTimer);
  }, [isRunning, direction]);

  // 2. 코칭 메시지 토글 타이머 (메시지 전환 테스트 유지)
  useEffect(() => {
    let msgTimer;
    if (isRunning) {
      msgTimer = setInterval(() => {
        setTestToggle(prev => !prev);
      }, 3000); // 3초마다 메시지 교체
    }
    return () => clearInterval(msgTimer);
  }, [isRunning]);

  // 3. 점수 가감점 타이머 (감점과 가점의 속도를 동일하게 설정)
  useEffect(() => {
    let scoreTimer;
    if (isRunning) {
      scoreTimer = setInterval(() => {
        const currentLevel = coachingRef.current?.level;
        setScore(prev => {
          let scoreChange = 0;
          if (currentLevel === "위험") {
            scoreChange = -1;  // 위험 시 0.5초당 -1점 (1초에 -2점)
          } else if (currentLevel === "양호") {
            scoreChange = 1;   // 양호 시 0.5초당 +1점 (1초에 +2점) - 감점과 속도 통일!
          }
          const nextScore = prev + scoreChange;
          return Math.max(0, Math.min(100, nextScore));
        });
      }, 500);
    }
    return () => clearInterval(scoreTimer);
  }, [isRunning]);

  return (
    <div className="app">
      <Header isRunning={isRunning} sessionTime={81} />
      <main className="main">
        <div className="row--top">
          <div className="steering-wrap card"><SteeringCounter wheelAngle={-15} /></div>
          <div className="sensordata-wrap card"><SensorData data={sensorData} isRunning={isRunning}/></div>
        </div>
        <div className="row--bottom">
          <div className="coaching-wrap card">
            <CoachingPoint message={coaching?.message} subMessage={coaching?.subMessage} level={coaching?.level} isRunning={isRunning} />
          </div>
          <div className="right-col">
            <div className="score-wrap card"><ScoreBoard score={Math.floor(score)} isRunning={isRunning} /></div>
            <div className="session-wrap">
              <SessionControl isRunning={isRunning} onStart={handleStart} onStop={handleStop} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;