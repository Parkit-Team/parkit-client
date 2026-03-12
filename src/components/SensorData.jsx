import './components.css';

const sensorLevels = (cm, key) => {
  const dangerLimit = (key === 'front' || key === 'back') ? 200 : 80;
  if (cm <= dangerLimit * 0.15) return { color: '#FA3A3A' };
  if (cm <= dangerLimit) return { color: '#FFAA00' };
  return { color: '#2ED573' };
};

const SensorData = ({ data = { front: 600, back: 600, left: 600, right: 600 }, isRunning = false }) => {
  const sensors = [
    { key: 'front', label: '전방', value: data.front },
    { key: 'back',  label: '후방', value: data.back },
    { key: 'left',  label: '좌측', value: data.left },
    { key: 'right', label: '우측', value: data.right },
  ];

  return (
    <div className="card sensordata">
      <p className="sensordata__title">Sensor Data</p>
      <div className="sensordata__body">
        {sensors.map((s) => {
          const { color } = sensorLevels(s.value, s.key);
          const fillWidth = isRunning ? Math.max(0, 100 - (s.value / 6)) : 0;

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