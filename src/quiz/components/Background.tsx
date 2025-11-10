import React from 'react';
import cloudImg from '../images/nube.png';

export default function Background({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen p-6" style={{ backgroundColor: '#F0EEF6', overflow: 'hidden' }}>
        <img src={cloudImg} alt="cloud" style={{ position: 'absolute', top: '2%', left: '0%', width: 520, height: 320, zIndex: 0, opacity: 0.95, pointerEvents: 'none' }} />
        <img src={cloudImg} alt="cloud" style={{ position: 'absolute', top: '4%', right: '0%', width: 520, height: 320, zIndex: 0, opacity: 0.95, pointerEvents: 'none' }} />
        <img src={cloudImg} alt="cloud" style={{ position: 'absolute', bottom: '14%', left: '2%', width: 620, height: 380, zIndex: 0, opacity: 0.95, pointerEvents: 'none' }} />
        <img src={cloudImg} alt="cloud" style={{ position: 'absolute', bottom: '4%', right: '2%', width: 480, height: 300, zIndex: 0, opacity: 0.95, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
            {children}
        </div>
    </div>
  );
}

