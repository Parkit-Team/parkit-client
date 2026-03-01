// src/components/SensorData.jsx
import './components.css';

// 친구의 방식처럼 거리별 상태 매핑
const sensorLevels = (cm) => {
  if (cm <= 30) return { level: '위험', color: '#FA3A3A' }; // 30cm 이하
  if (cm <= 80) return { level: '경고', color: '#FFAA00' }; // 80cm 이하
  return { level: '양호', color: '#2ED573' }; // 그 외
};

const SensorData = ({ data = { front: 200, back: 200, left: 200, right: 200 }, isRunning = false }) => {
  const sensors = [
    { key: 'front', label: '전방', value: data.front },
    { key: 'back', label: '후방', value: data.back },
    { key: 'left', label: '좌측', value: data.left },
    { key: 'right', label: '우측', value: data.right },
  ];

  return (
    <div className="card sensordata">
      <p className="sensordata__title">Sensor Data</p>
      <div className="sensordata__body">
        {sensors.map((s) => {
          const { color } = sensorLevels(s.value);
          // 0cm일 때 100%, 200cm 이상일 때 0%가 되도록 계산
          const fillWidth = isRunning ? Math.max(0, 100 - (s.value / 2)) : 0;

          return (
            <div key={s.key} className="sensordata__row">
              <span className="sensordata__label">{s.label}</span>
              <div className="sensordata__bar-bg">
                <div 
                  className="sensordata__bar-fill" 
                  style={{ 
                    width: `${fillWidth}%`, 
                    backgroundColor: isRunning ? color : 'var(--color-line)' 
                  }}
                />
              </div>
              <span className="sensordata__value" style={{ color: isRunning ? color : 'var(--color-grey)' }}>
                {isRunning ? `${s.value}cm` : '--'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorData;