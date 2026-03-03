// src/components/ScoreBoard.jsx
import './components.css';

const ScoreBoard = ({ score = 0, isRunning = false }) => {
  const getDisplayInfo = () => {
    // 1. 세션이 실행 중일 때
    if (isRunning) {
      if (score >= 80) return { text: "EXCELLENT", color: "var(--color-green)" };
      if (score >= 50) return { text: "GOOD", color: "var(--color-orange)" };
      // 0점 포함 50점 미만은 모두 POOR
      return { text: "POOR", color: "var(--color-red)" };
    }

    // 2. 세션이 멈춰있을 때 (결과 화면 또는 시작 전)
    if (score > 0) {
      // 주행이 끝났는데 점수가 남아있다면 결과 등급 표시
      if (score >= 80) return { text: "EXCELLENT", color: "var(--color-green)" };
      if (score >= 50) return { text: "GOOD", color: "var(--color-orange)" };
      return { text: "POOR", color: "var(--color-red)" };
    }

    // 3. 점수가 0이고 세션도 중지된 상태일 때만 READY
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