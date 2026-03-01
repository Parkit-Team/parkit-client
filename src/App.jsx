import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SteeringCounter from './components/SteeringCounter';
import CoachingPoint from './components/CoachingPoint';
import coachingTips from './coachingTips.json';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// id로 코칭 데이터 조회
const getCoaching = (id) => coachingTips.find(tip => tip.id === id) || null;

function SensorData() {
  return (
    <div className="sensordata-wrap">
      <div className="card placeholder">Sensor Data</div>
    </div>
  );
}

function Score() {
  return (
    <div className="score-wrap">
      <div className="card placeholder">Score</div>
    </div>
  );
}

function SessionControl() {
  return (
    <div className="session-wrap">
      <div className="session-buttons">
        <button className="session-btn">SESSION START</button>
        <button className="session-btn session-btn--active">SESSION STOP</button>
      </div>
    </div>
  );
}

function App() {
  const [wheelAngle, setWheelAngle] = useState(0);
  const [coachingId, setCoachingId] = useState(13); // 기본값: 양호
  const coaching = getCoaching(coachingId);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/ws/parkit'),
      onStompError: (frame) => console.warn('STOMP 오류:', frame),
      onWebSocketError: (e) => console.warn('WebSocket 오류:', e),
      reconnectDelay: 0,
      onConnect: () => {
        console.log('✅ 소켓 연결 성공!');
        client.subscribe('/topic/coaching', (msg) => {
          const data = JSON.parse(msg.body);
          console.log('📦 받은 데이터:', data);

          setWheelAngle(data.wheelAngle);
          setCoachingId(data.coachingId);
        });
      },
    });

    try { client.activate(); } catch (e) { console.warn('소켓 연결 실패:', e); }
    return () => client.deactivate();
  }, []);

  return (
    <div className="app">
      <Header isRunning={true} sessionTime={81} />

      <main className="main">
        <div className="row--top">
          <div className="steering-wrap">
            <SteeringCounter wheelAngle={wheelAngle} />
          </div>
          <SensorData />
        </div>

        <div className="row--bottom">
          <div className="coaching-wrap">
            <CoachingPoint
              message={coaching?.message}
              subMessage={coaching?.subMessage}
              level={coaching?.level}
              isRunning={true}
            />
          </div>
          <div className="right-col">
            <Score />
            <SessionControl />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;