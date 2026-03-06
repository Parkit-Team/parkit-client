import { useEffect } from 'react';
import './components.css';

const stepMessages = {
  1: '핸들 각도를 0도로 유지한 뒤, 앞으로 10m 전진하세요',
  2: '핸들 각도를 -360도로 돌린 뒤, 앞으로 5m 전진하세요',
  3: '핸들 각도를 180도로 돌린 뒤, 뒤로 3m 후진하세요',
  4: '핸들 각도를 360도로 돌린 뒤, 뒤로 3m 후진하며 핸들을 서서히 푸세요',
};


const CoachingPoint = ({
  message = '',
  level = '양호',
  isRunning = false,
  angleValue = 0,
  distanceValue = 0,
  step = 1,
}) => {
  const isDanger = isRunning && level === '위험';

  useEffect(() => {
    if (!message || !isRunning) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  }, [message]);

  return (
    <div
      className="card coaching"
      style={isDanger ? {
        borderColor: '#FA3A3A',
        boxShadow: 'inset 0 0 0 3px #FA3A3A, 0 0 12px rgba(250, 58, 58, 0.15)',
      } : {}}
    >
      <div className="cleant">

        {/* ── 왼쪽: Coaching Point ── */}
        <div className="coaching__body">
          <p className="coaching__title">Coaching Point</p>

          <div className="coaching__content">
            <p className="coaching__message" style={{ color: '#D9D9D9', fontWeight: 700 }}>
              [STEP {step}]
            </p>
            <p className="coaching__message" style={{ color: '#2ED573', fontSize: '32px' }}>
              {stepMessages[step] || (isRunning ? '데이터 수신 중...' : '세션이\n종료되었습니다.')}
            </p>
          </div>

          {/* 위험일 때만 경고 버튼 표시 */}
          {isDanger && (
            <div style={{
              marginTop: 24,
              padding: '18px 32px',
              border: '2px solid #FA3A3A',
              borderRadius: 16,
              background: 'rgba(250, 58, 58, 0.1)',
              textAlign: 'center',
            }}>
              <span style={{
                color: '#FA3A3A',
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'Alata, sans-serif',
              }}>
                전방 충돌 위험!
              </span>
            </div>
          )}
        </div>

        {/* ── 오른쪽: Real-Time Data ── */}
        <div className="realData__body">
          <p className="coaching__title">Real-Time Data</p>

          <div className="real__item">
            <div className="real__row">
              <span className="real__number" style={{ color: isRunning ? '#FFAA00' : '#FFFFFF' }}>
                {angleValue}°
              </span>
            </div>
            <p className="real__label">핸들 각도</p>
          </div>

          <div className="real__item">
            <div className="real__row">
              <span className="real__number" style={{ color: '#FFFFFF' }}>
                {distanceValue}m
              </span>
            </div>
            <p className="real__label">전진량</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoachingPoint;