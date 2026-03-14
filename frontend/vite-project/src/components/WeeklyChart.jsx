import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from './ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[--color-bg-elevated] border border-[--color-border-bright] p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="font-medium text-[--color-text-primary] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[--color-text-secondary]">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const WeeklyChart = ({ data }) => {
  // Demo data if none provided
  const chartData = data && data.length > 0 ? data : [
    { day: 'Mon', assigned: 12, evaluated: 8 },
    { day: 'Tue', assigned: 19, evaluated: 15 },
    { day: 'Wed', assigned: 15, evaluated: 10 },
    { day: 'Thu', assigned: 22, evaluated: 20 },
    { day: 'Fri', assigned: 8, evaluated: 12 },
    { day: 'Sat', assigned: 5, evaluated: 8 },
    { day: 'Sun', assigned: 2, evaluated: 5 },
  ];

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-[--color-text-primary]">
            Weekly Activity
          </h3>
          <p className="text-sm text-[--color-text-secondary]">Assigned vs. Evaluated papers</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[--color-accent-blue]"></span>
            <span className="text-[--color-text-secondary]">Assigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[--color-accent-green]"></span>
            <span className="text-[--color-text-secondary]">Evaluated</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-text-muted)" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              stroke="var(--color-text-muted)" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border-bright)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="assigned" 
              name="Assigned"
              stroke="var(--color-accent-blue)" 
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--color-bg-primary)', strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-accent-blue)' }}
            />
            <Line 
              type="monotone" 
              dataKey="evaluated" 
              name="Evaluated"
              stroke="var(--color-accent-green)" 
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--color-bg-primary)', strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-accent-green)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default WeeklyChart;