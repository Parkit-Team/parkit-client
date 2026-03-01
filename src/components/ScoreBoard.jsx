// src/components/ScoreBoard.jsx
import './components.css';

const ScoreBoard = ({ score = 0, isRunning = false }) => {
  const getDisplayInfo = () => {
    // 세션 중이거나, 종료 후 점수가 남아있을 때의 상태 판단
    if (score >= 80) return { text: "EXCELLENT", color: "var(--color-green)" };
    if (score >= 50) return { text: "GOOD", color: "var(--color-orange)" };
    if (score > 0) return { text: "POOR", color: "var(--color-red)" };
    return { text: "READY", color: "var(--color-grey)" };
  };

  const display = getDisplayInfo();

  return (
    <div className="card score">
      <p className="score__title">Score</p>
      <div className="score__body">
        <div className="score__left">
          <span className="score__number" style={{ color: display.color }}>{score}</span>
          <span className="score__total">/ 100</span>
        </div>
        <div className="score__right">
          <span className="score__status" style={{ color: display.color }}>{display.text}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;