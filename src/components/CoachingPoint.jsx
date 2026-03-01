import './components.css';

// level별 색상 매핑
const levelStyle = {
  위험: { color: '#FA3A3A', border: '#FA3A3A', glow: 'rgba(250, 58, 58, 0.15)' },
  경고: { color: '#FFAA00', border: '#FFAA00', glow: 'rgba(255, 170, 0, 0.15)' },
  양호: { color: '#2ED573', border: '#2ED573', glow: 'rgba(46, 213, 115, 0.15)' },
};

// props: message, subMessage, level('위험'|'경고'|'양호'), isRunning
const CoachingPoint = ({ message = '', subMessage = '', level = '양호', isRunning = false }) => {
  const style = isRunning ? levelStyle[level] : null;

  return (
    <div
      className="card coaching"
      style={isRunning ? {
        borderColor: style.border,
        boxShadow: `inset 0 0 0 2px ${style.border}, 0 0 12px ${style.glow}`,
      } : {}}
    >
      <p className="coaching__title" style={isRunning ? { color: style.color } : {}}>
        Coaching Point
      </p>

      <div className="coaching__body">
        <p className="coaching__message" style={isRunning ? { color: style.color } : {}}>
          {message || (isRunning ? '데이터 수신 중...' : '세션이 종료되었습니다.')}
        </p>
        {subMessage && (
          <p className="coaching__sub" style={isRunning ? { color: style.color } : {}}>
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default CoachingPoint;