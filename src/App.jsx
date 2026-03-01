import './App.css';
import Header from './components/Header';
import SteeringCounter from './components/SteeringCounter';
import CoachingPoint from './components/CoachingPoint';
import coachingTips from './coachingTips.json';

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
  // 코칭 id 데이터 불러오기
  const coachingId = 8;
  const coaching = getCoaching(coachingId);

  return (
    <div className="app">
      <Header isRunning={true} sessionTime={81} />

      <main className="main">
        {/* 상단 행 */}
        <div className="row--top">
          <div className="steering-wrap">
            <SteeringCounter wheelAngle={-15} />
          </div>
          <SensorData />
        </div>

        {/* 하단 행 */}
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