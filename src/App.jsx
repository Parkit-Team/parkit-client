import './App.css';
import Header from './components/Header';
import SteeringCounter from './components/SteeringCounter';
import CoachingPoint from './components/CoachingPoint';

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
  return (
    <div className="app">
      <Header isRunning={true} sessionTime={81} />

      <main className="main">
        {/* 상단 행 */}
        <div className="row--top">
          <div className="steering-wrap">
            <SteeringCounter wheelAngle={30} />
          </div>
          <SensorData />
        </div>

        {/* 하단 행 */}
        <div className="row--bottom">
          <div className="coaching-wrap">
            <CoachingPoint
              message="핸들을 좌측으로 더 꺾으세요."
              subMessage="현재 각도 부족"
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
