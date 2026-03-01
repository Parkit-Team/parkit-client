import './components.css';
import colors from '../colors';

const SteeringCounter = ({ wheelAngle = 0 }) => {
  const MAX_WHEEL_ANGLE = 60;
  const MAX_ROTATIONS = 2;

  const clamped = Math.max(-MAX_WHEEL_ANGLE, Math.min(MAX_WHEEL_ANGLE, wheelAngle));

  const steeringRotation = clamped / 30;

  const needleDeg = (steeringRotation / MAX_ROTATIONS) * 90;

  const cx = 200, cy = 160, r = 120;

  const degToRad = (deg) => ((deg - 90) * Math.PI) / 180;

  const needleRad = degToRad(needleDeg);
  const nx = cx + (r - 8) * Math.cos(needleRad);
  const ny = cy + (r - 8) * Math.sin(needleRad);

  const labels = [
    { val: 0, angleDeg: 0   },
    { val: 1, angleDeg: -48 },
    { val: 1, angleDeg: 48  },
    { val: 2, angleDeg: -90 },
    { val: 2, angleDeg: 90  },
  ];

  return (
    <div className="card steering">
      <p className="steering__title">Steering Counter</p>

      <svg viewBox="0 0 400 210" width="100%" height="100%"
        style={{ flex: 1, overflow: 'hidden' }}>

        {/* 바늘 */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ transition: 'all 0.15s ease' }}
        />

        {/* 반원 호 */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={colors.grey}
          strokeWidth="15"
        />

        {/* 숫자 라벨 */}
        {labels.map(({ val, angleDeg }, i) => {
          const rad = degToRad(angleDeg);
          const lx = cx + (r + 28) * Math.cos(rad);
          const ly = cy + (r + 28) * Math.sin(rad);
          return (
            <text key={i} x={lx} y={ly + 6} textAnchor="middle"
              fill={colors.grey} fontSize="24" fontFamily="Alata, sans-serif">
              {val}
            </text>
          );
        })}



        {/* 바늘 원점을 배경색으로 덮어서 숨김 */}
        <circle cx={cx} cy={cy} r="65" fill={colors.box} />

        {/* 각도 텍스트 */}
        <text x={cx} y={cy - 20} textAnchor="middle"
          fill="#FFFFFF" fontSize="40"
          fontFamily="Alata, sans-serif">
          {Math.round(wheelAngle)}°
        </text>

        {/* Wheel Angle 라벨 */}
        <text x={cx} y={cy + 20} textAnchor="middle"
          fill={colors.grey} fontSize="18"
          fontFamily="Alata, sans-serif">
          Wheel Angle
        </text>
      </svg>
    </div>
  );
};

export default SteeringCounter;
