'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HealthScoreGaugeProps {
  score: number;
}

const HealthScoreGauge = ({ score }: HealthScoreGaugeProps) => {
  const [scoreColor, setScoreColor] = useState('');
  const [mutedColor, setMutedColor] = useState('');

  useEffect(() => {
    // This hook runs only on the client side, after mounting
    // to prevent hydration mismatch with computed styles.
    const computedStyle = getComputedStyle(document.documentElement);
    if (score >= 80) {
      setScoreColor(`hsl(${computedStyle.getPropertyValue('--chart-2').trim()})`);
    } else if (score >= 50) {
      setScoreColor(`hsl(${computedStyle.getPropertyValue('--chart-4').trim()})`);
    } else {
      setScoreColor(`hsl(${computedStyle.getPropertyValue('--chart-1').trim()})`);
    }
    setMutedColor(`hsl(${computedStyle.getPropertyValue('--muted').trim()})`);
  }, [score]);


  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  if (!scoreColor) {
    // Render a placeholder to prevent layout shift
    return <div className="w-40 h-40" />;
  }

  return (
    <div className="w-40 h-40">
       <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={-180}
            innerRadius="65%"
            outerRadius="100%"
            dataKey="value"
            stroke="none"
          >
             <Cell fill={scoreColor} />
             <Cell fill={mutedColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthScoreGauge;
