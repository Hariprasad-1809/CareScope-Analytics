import React, { useEffect, useRef, useState } from 'react';
import { useCareStore } from '../store/useCareStore';

export const PulseLine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activityLogs = useCareStore((state) => state.activityLogs);
  const [isSpiking, setIsSpiking] = useState(false);
  const logsCountRef = useRef(activityLogs.length);

  // Monitor store logs to trigger spikes on new alarms
  useEffect(() => {
    if (activityLogs.length > logsCountRef.current) {
      const newLog = activityLogs[0];
      if (newLog && (newLog.type === 'alert' || newLog.severity === 'critical' || newLog.severity === 'high')) {
        setIsSpiking(true);
        const timer = setTimeout(() => {
          setIsSpiking(false);
        }, 2500); // Spike for 2.5 seconds
        return () => clearTimeout(timer);
      }
    }
    logsCountRef.current = activityLogs.length;
  }, [activityLogs]);

  // ECG Waveform animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Handle High-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    // Buffers to store points
    const points: number[] = new Array(width).fill(height / 2);

    // Waveform phase generator
    let frame = 0;
    
    const animate = () => {
      frame++;
      
      // Determine frequency and spike magnitude
      const cycleLength = isSpiking ? 35 : 75; // faster during spikes
      const phase = frame % cycleLength;
      
      let waveVal = 0;
      
      // Heartbeat QRS waveform shape
      if (phase >= 10 && phase < 13) {
        // P-wave
        waveVal = Math.sin((phase - 10) * (Math.PI / 3)) * 2;
      } else if (phase === 14) {
        // Q-wave (dip)
        waveVal = -2;
      } else if (phase >= 15 && phase <= 17) {
        // R-wave (big spike)
        const maxR = isSpiking ? 13 : 9;
        waveVal = (phase === 16) ? maxR : maxR * 0.5;
      } else if (phase === 18) {
        // S-wave (deep dip)
        waveVal = isSpiking ? -5 : -3;
      } else if (phase >= 21 && phase < 26) {
        // T-wave
        waveVal = Math.sin((phase - 21) * (Math.PI / 5)) * 3;
      }

      // Add small noise/idle jitter (0.2px)
      waveVal += (Math.random() - 0.5) * 0.4;
      
      // Shift array and insert new point at the end
      points.shift();
      // Center vertical alignment
      const centerY = height / 2;
      // Invert waveVal because canvas Y coordinates start from top
      points.push(centerY - waveVal);

      // Render frame
      ctx.clearRect(0, 0, width, height);
      
      // Draw flat timeline baseline grid underneath the wave
      ctx.strokeStyle = '#D8DCD4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw the ECG Trace Line
      ctx.strokeStyle = isSpiking ? '#FF6B5B' : '#0F5C56'; // Coral if spiking, Teal if normal
      ctx.lineWidth = isSpiking ? 2.5 : 1.8;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      
      for (let x = 1; x < width; x++) {
        ctx.lineTo(x, points[x]);
      }
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSpiking]);

  return (
    <div className="fixed top-0 left-0 w-full h-[18px] z-50 bg-[#F7F5EF] border-b border-[#D8DCD4] overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
export default PulseLine;
