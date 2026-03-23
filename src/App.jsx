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
  const [sessionId, setSessionId] = useState(null);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [straightDistance, setStraightDistance] = useState(0);
  const [coachingId, setCoachingId] = useState(5);
  const [step, setStep] = useState(1);
  const [targetAngle, setTargetAngle] = useState(0);
  const [targetDistance, setTargetDistance] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  
  const coachingRef = useRef(null);
  const coaching = getCoaching(coachingId);

  const handleStart = async () => {
    try {
      //인그레스
      // const res = await fetch('http://<ingress-address>/api/driving-sessions/start', {
      // 노드포트
      //const res = await fetch('http://10.0.2.111:32515/api/driving-sessions/start', {
      //로컬
      const res = await fetch('http://192.168.201.98:50030/report/api/driving-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'parkit-user' }),
      });
      const data = await res.json();
      console.log('start 응답:', data);
      setSessionId(data.sessionId);
      setScore(70);
      setIsRunning(true);
      setSessionTime(0);
    } catch (err) {
      console.error('start 실패:', err);
    }
  };

  const handleStop = async () => {
    if (isRunning) {
      //인그레스
      // await fetch(`http://<ingress-address>/api/driving-sessions/${sessionId}/stop`, {
      //노드포트
      //await fetch(`http://10.0.2.111:32515/api/driving-sessions/${sessionId}/stop`, {
      // 로컬
      await fetch(`http://192.168.201.98:50030/report/api/driving-sessions/${sessionId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontendScore: score }),
      });
      setIsRunning(false);
      setSessionTime(0);
      setSensorData(null);
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

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => { coachingRef.current = coaching; }, [coaching]);

  useEffect(() => {
    if (!isRunning) return;

    const client = new Client({
      //인그레스
      //webSocketFactory: () => new SockJS('http://<ingress-address>/ws/parkit'),
      //노드포트
      //webSocketFactory: () => new SockJS('http://10.0.2.112:30779/ws/parkit'),
      //로컬
      webSocketFactory: () => {
        const sock = new SockJS('http://192.168.201.98:50030/socket/ws/parkit');
        sock.withCredentials = false;
        return sock;
      },
      reconnectDelay: 5000,
      onStompError: (frame) => console.warn('STOMP 오류:', frame),
      onWebSocketError: (e) => console.warn('WebSocket 오류:', e),
      onConnect: () => {
        console.log('✅ 소켓 연결 성공!');
        client.subscribe('/topic/coaching', (msg) => {
          const data = JSON.parse(msg.body);
          const distances = data.distances ?? {};
          const { frontDistance, backDistance, leftDistance, rightDistance } = distances;
          
          if (data.currentAngle !== undefined) setSteeringAngle(data.currentAngle);
          if (data.coachingId !== undefined) setCoachingId(data.coachingId);
          if (data.currentDistance !== undefined) setStraightDistance(data.currentDistance);
          if (data.step !== undefined) setStep(data.step);
          if (data.targetAngle !== undefined) setTargetAngle(data.targetAngle);
          if (data.targetDistance !== undefined) setTargetDistance(data.targetDistance);
          if (frontDistance !== undefined && backDistance !== undefined &&
              leftDistance !== undefined && rightDistance !== undefined) {
            setSensorData({
              front: frontDistance,
              back: backDistance,
              left: leftDistance,
              right: rightDistance,
            });
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
          <Header isRunning={isRunning} sessionTime={sessionTime} />
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