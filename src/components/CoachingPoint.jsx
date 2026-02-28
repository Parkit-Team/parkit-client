import './components.css';

const CoachingPoint = ({ message = '', subMessage = '', isRunning = false }) => {
  return (
    <div className={`card coaching ${isRunning ? 'card--active coaching--active' : ''}`}>
      <p className="coaching__title">Coaching Point</p>

      <div className="coaching__body">
        <p className="coaching__message">
          {message || (isRunning ? '데이터 수신 중...' : '세션이 종료되었습니다.')}
        </p>
        {subMessage && (
          <p className="coaching__sub">{subMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CoachingPoint;
