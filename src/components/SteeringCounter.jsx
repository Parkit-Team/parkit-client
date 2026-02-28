import './components.css';
import colors from '../colors';

const SteeringCounter = ({ wheelAngle = 0, steeringCount = 0 }) => {
  const MAX_ANGLE = 540;
  const clampedAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, wheelAngle));
  const needleDeg = (clampedAngle / MAX_ANGLE) * 90;

  const cx = 120, cy = 120, r = 80;
  const labels = [
    { val: -2, angleDeg: -90 },
    { val: -1, angleDeg: -45 },
    { val: 0,  angleDeg: 0   },
    { val: 1,  angleDeg: 45  },
    { val: 2,  angleDeg: 90  },
  ];

  const degToRad = (deg) => ((deg - 90) * Math.PI) / 180;

  const needleRad = degToRad(needleDeg);
  const nx = cx + (r - 10) * Math.cos(needleRad);
  const ny = cy + (r - 10) * Math.sin(needleRad);

  return (
    <div className="card steering">
      <p className="steering__title">Steering Counter</p>

      <svg viewBox="0 0 240 140" width="240" height="140">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={colors.line}
          strokeWidth="8"
          strokeLinecap="round"
        />

        {labels.map(({ val, angleDeg }) => {
          const rad = degToRad(angleDeg);
          const lx = cx + (r + 18) * Math.cos(rad);
          const ly = cy + (r + 18) * Math.sin(rad);
          return (
            <text key={val} x={lx} y={ly + 4} textAnchor="middle"
              fill={colors.grey} fontSize="13" fontFamily="monospace">
              {Math.abs(val)}
            </text>
          );
        })}

        <line
          className="steering__needle"
          x1={cx} y1={cy} x2={nx} y2={ny}
          stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill="#FFFFFF" />
      </svg>

      <div className="steering__angle">{Math.round(wheelAngle)}°</div>
      <p className="steering__label">Wheel Angle</p>
    </div>
  );
};

export default SteeringCounter;
