import { useEffect } from 'react';
import './components.css';
import steps from '../steps.json';

const levelStyle = {
  위험: { border: '#FA3A3A', glow: 'rgba(250, 58, 58, 0.15)' },
  양호: { border: '#2ED573', glow: 'rgba(46, 213, 115, 0.15)' },
};

const CoachingPoint = ({
  message = '',
  level = '양호',
  isRunning = false,
  angleValue = 0,
  distanceValue = 0,
  step = 1,
}) => {
  const style = isRunning ? (levelStyle[level] ?? levelStyle['양호']) : null;
  const stepData = steps.find(s => s.step === step) || steps[0];

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
      style={isRunning ? {
        borderColor: style.border,
        boxShadow: `inset 0 0 0 3px ${style.border}, 0 0 12px ${style.glow}`,
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
              {stepData.message || (isRunning ? '데이터 수신 중...' : '세션이\n종료되었습니다.')}
            </p>
          </div>

          {/* coaching__content 밖, coaching__body 안 */}
          <div style={{
            marginTop: 'auto',        /* 바닥으로 밀기 */
            padding: '18px 32px',
            border: `2px solid ${isRunning && level === '위험' ? '#FA3A3A' : 'transparent'}`,
            borderRadius: 16,
            background: isRunning && level === '위험' ? 'rgba(250, 58, 58, 0.1)' : 'transparent',
            textAlign: 'center',
            visibility: isRunning && level === '위험' ? 'visible' : 'hidden',
            boxSizing: 'border-box',
          }}>
            <span style={{
              color: '#FA3A3A',
              fontSize: 28,
              fontWeight: 700,
              fontFamily: 'Alata, sans-serif',
            }}>
              {message}
            </span>
          </div>
        </div>

        {/* ── 오른쪽: Real-Time Data ── */}
        <div className="realData__body">
          <p className="coaching__title">Real-Time Data</p>

          <div className="real__item">
            <div className="real__row">
              <span className="real__number" style={{ color: isRunning ? '#FFAA00' : '#FFFFFF' }}>
                {angleValue}°
              </span>
              <span className="score__total">/ {stepData.targetAngle}°</span>
            </div>
            <p className="real__label">핸들 각도</p>
          </div>

          <div className="real__item">
            <div className="real__row">
              <span className="real__number" style={{ color: '#FFFFFF' }}>
                {distanceValue}m
              </span>
              <span className="score__total">/ {stepData.targetDistance}m</span>
            </div>
            <p className="real__label">전진량</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoachingPoint;