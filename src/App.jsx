import './App.css';
import Header from './components/Header';
import SteeringCounter from './components/SteeringCounter';
import CoachingPoint from './components/CoachingPoint';
import coachingTips from './coachingTips.json';

import React, { useState, useEffect, useRef } from 'react';
import SensorData from './components/SensorData';
import ScoreBoard from './components/ScoreBoard';
import SessionControl from './components/SessionControl';

// 🔥 소켓 라이브러리 임포트 (설치 필수: npm install @stomp/stompjs sockjs-client)
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const getCoaching = (id) => coachingTips.find(tip => tip.id === id) || null;

function App() {
  const [score, setScore] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [sensorData, setSensorData] = useState({ front: 200, back: 0, left: 100, right: 100 });
  const [wheelAngle, setWheelAngle] = useState(0); // 핸들 각도 추가
  const [coachingId, setCoachingId] = useState(8); // 소켓에서 받을 ID

  const coachingRef = useRef(null);
  const coaching = getCoaching(coachingId);

  const handleStart = () => { setScore(70); setIsRunning(true); };
  const handleStop = () => {
    if (isRunning) { setIsRunning(false); setSensorData({ front: 200, back: 0, left: 100, right: 100 }); }
    else { setScore(0); }
  };

  useEffect(() => { coachingRef.current = coaching; }, [coaching]);

  // ---------------------------------------------------------
  // 1. 소켓 연결 테스트 (기존 시뮬레이션 타이머를 대체함)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!isRunning) return;

    // 팀원 서버 주소와 포트가 맞는지 꼭 확인하세요! (8082 vs 8080)
    const socket = new SockJS('http://localhost:8082/ws/parkit');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ 소켓 연결 성공!');
        client.subscribe('/topic/coaching', (msg) => {
          const data = JSON.parse(msg.body);
          console.log('📦 데이터 수신:', data);

          // 받은 데이터를 상태에 업데이트
          setCoachingId(data.coachingId);
          setWheelAngle(data.wheelAngle);
          setSensorData({
            front: data.front,
            back: data.back,
            left: data.left,
            right: data.right
          });
        });
      },
      onStompError: (frame) => console.error('소켓 에러:', frame),
    });

    client.activate();
    return () => client.deactivate();
  }, [isRunning]);

  // ---------------------------------------------------------
  // 2. 점수 가감점 로직 (기존 로직 유지)
  // ---------------------------------------------------------
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
    <div className="app">
      <Header isRunning={isRunning} sessionTime={81} />
      <main className="main">
        <div className="row--top">
          <div className="steering-wrap card">
            <SteeringCounter wheelAngle={wheelAngle} />
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
              <ScoreBoard score={Math.floor(score)} isRunning={isRunning} />
            </div>
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