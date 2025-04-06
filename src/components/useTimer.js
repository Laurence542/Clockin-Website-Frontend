import { useState, useEffect } from 'react';

export default function useTimer() {
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('timer');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 1;
        localStorage.setItem('timer', newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}
