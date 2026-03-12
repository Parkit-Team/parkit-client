import './App.css';
import Header from './components/Header';
import SteeringCounter from './components/SteeringCounter';
import CoachingPoint from './components/CoachingPoint';
import coachingTips from './coachingTips.json';

import React, { useState, useEffect, useRef } from 'react';
import SensorData from './components/SensorData';
import ScoreBoard from './components/ScoreBoard';
import SessionControl from './components/SessionControl';
import Sensor from './sensor';

import { Routes, Route } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const getCoaching = (id) => coachingTips.find(tip => tip.id === id) || null;

function App() {
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [straightDistance, setStraightDistance] = useState(0);
  const [coachingId, setCoachingId] = useState(5);
  const [step, setStep] = useState(1);
  const [targetAngle, setTargetAngle] = useState(0);
  const [targetDistance, setTargetDistance] = useState(0);

  const coachingRef = useRef(null);
  const coaching = getCoaching(coachingId);

  const handleStart = () => { setScore(70); setIsRunning(true); };
  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setSensorData({ front: 600, back: 600, left: 600, right: 600 });
      setStraightDistance(0);
      setSteeringAngle(0);
      setCoachingId(5);
      setStep(1);
      setTargetAngle(0);
      setTargetDistance(0);
    } else {
      setScore(0);
    }
  };

  useEffect(() => { coachingRef.current = coaching; }, [coaching]);

  useEffect(() => {
    if (!isRunning) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/ws/parkit'),
      reconnectDelay: 5000,
      onStompError: (frame) => console.warn('STOMP 오류:', frame),
      onWebSocketError: (e) => console.warn('WebSocket 오류:', e),
      onConnect: () => {
        console.log('✅ 소켓 연결 성공!');
        client.subscribe('/topic/coaching', (msg) => {
          const data = JSON.parse(msg.body);
          if (data.currentAngle !== undefined) setSteeringAngle(data.currentAngle);
          if (data.coachingId !== undefined) setCoachingId(data.coachingId);
          if (data.currentDistance !== undefined) setStraightDistance(data.currentDistance);
          if (data.step !== undefined) setStep(data.step);
          if (data.targetAngle !== undefined) setTargetAngle(data.targetAngle);
          if (data.targetDistance !== undefined) setTargetDistance(data.targetDistance);
          if (data.frontDistance !== undefined && data.backDistance !== undefined &&
              data.leftDistance !== undefined && data.rightDistance !== undefined) {
            setSensorData({ front: data.frontDistance, back: data.backDistance, left: data.leftDistance, right: data.rightDistance });
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [isRunning]);

  useEffect(() => {
    let scoreTimer;
    if (isRunning) {
      scoreTimer = setInterval(() => {
        const currentLevel = coachingRef.current?.level;
        setScore(prev => {
          let scoreChange = 0;
          if (currentLevel === "위험") scoreChange = -1;
          else if (currentLevel === "양호") scoreChange = 1;
          return Math.max(0, Math.min(100, prev + scoreChange));
        });
      }, 500);
    }
    return () => clearInterval(scoreTimer);
  }, [isRunning]);

  return (
    <Routes>
      <Route path="/sensor" element={<Sensor />} />
      <Route path="/*" element={
        <div className="app">
          <Header isRunning={isRunning} sessionTime={81} />
          <main className="main">
            <div className="row--top">
              <div className="steering-wrap card">
                <SteeringCounter steeringAngle={steeringAngle} />
              </div>
              <div className="sensordata-wrap card">
                <SensorData data={sensorData ?? { front: 400, back: 400, left: 400, right: 400 }} isRunning={isRunning} />
              </div>
            </div>
            <div className="row--bottom">
              <div className="coaching-wrap card">
                <CoachingPoint
                  message={coaching?.message}
                  level={coaching?.level}
                  isRunning={isRunning}
                  angleValue={steeringAngle}
                  distanceValue={straightDistance}
                  step={step}
                  targetAngle={targetAngle}
                  targetDistance={targetDistance}
                />
              </div>
              <div className="right-col">
                <div className="score-wrap card">
                  <ScoreBoard score={Math.floor(score)} isRunning={isRunning} />
                </div>
                <div className="session-wrap">
                  <SessionControl isRunning={isRunning} onStart={handleStart} onStop={handleStop} />
                </div>
              </div>
            </div>
          </main>
        </div>
      } />
    </Routes>
  );
}

export default App;