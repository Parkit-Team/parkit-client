import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function Sensor() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/ws/parkit'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/coaching', (msg) => {
          setData(JSON.parse(msg.body));
        });
      },
    });
    client.activate();
    return () => client.deactivate();
  }, []);

const fields = [
    { key: 'step',          label: 'Step',            unit: '' },
    { key: 'steeringAngle', label: 'Steering Angle',  unit: '°' },
    { key: 'straight',      label: 'Straight',        unit: '' },
    { key: 'front',         label: '전방',             unit: 'cm' },
    { key: 'back',          label: '후방',             unit: 'cm' },
    { key: 'left',          label: '좌측',             unit: 'cm' },
    { key: 'right',         label: '우측',             unit: 'cm' },
    { key: 'timestamp',     label: 'Timestamp',       unit: '' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}>
      <div style={{
        background: '#0D0D1F',
        border: '1px solid #2A2A4A',
        boxShadow: 'inset 0 0 0 3px #2A2A4A',
        borderRadius: 20,
        padding: '32px 40px',
        minWidth: 400,
      }}>
        <div style={{ color: '#2ED573', fontSize: 16, fontWeight: 700, marginBottom: 24, letterSpacing: 1 }}>
          📡 Socket Debug
        </div>

        {data && (
          <div style={{
            color: '#FFAA00',
            fontSize: 11,
            marginBottom: 20,
            padding: '10px 12px',
            background: '#0a0a10',
            borderRadius: 8,
            wordBreak: 'break-all',
            lineHeight: 1.6,
          }}>
            {JSON.stringify(data, null, 2)}
          </div>
        )}

        {data ? fields.map(({ key, label, unit }) => (
          <div key={key} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 40,
            padding: '10px 0',
            borderBottom: '1px solid #1a1a2e',
          }}>
            <span style={{ color: '#8899aa', fontSize: 13 }}>{label}</span>
            <span style={{ color: data[key] !== undefined ? '#FFFFFF' : '#FA3A3A', fontSize: 15, fontWeight: 600 }}>
              {data[key] !== undefined ? `${data[key]}${unit}` : '❌ 키 없음'}
            </span>
          </div>
        )) : (
          <div style={{ color: '#555', textAlign: 'center', padding: '20px 0' }}>
            대기 중...
          </div>
        )}
      </div>
    </div>
  );
}

export default Sensor;