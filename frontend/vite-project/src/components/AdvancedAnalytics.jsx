import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GlassCard } from './ui/Card';
import { FiTrendingUp, FiActivity, FiCheckCircle } from 'react-icons/fi';

const AdvancedAnalytics = ({ dashboardData }) => {
  // Demo historical data for area chart
  const performanceData = [
    { month: 'Jan', avgScore: 65, evaluations: 120 },
    { month: 'Feb', avgScore: 68, evaluations: 132 },
    { month: 'Mar', avgScore: 74, evaluations: 156 },
    { month: 'Apr', avgScore: 72, evaluations: 145 },
    { month: 'May', avgScore: 79, evaluations: 180 },
    { month: 'Jun', avgScore: 82, evaluations: 195 },
  ];

  const answerStatusData = dashboardData?.answerPapersStatus ? [
    { name: 'Not Assigned', value: dashboardData.answerPapersStatus.Not_Assigned || 0, color: 'var(--color-accent-red)' },
    { name: 'Pending', value: dashboardData.answerPapersStatus.Pending || 0, color: 'var(--color-accent-yellow)' },
    { name: 'Evaluated', value: dashboardData.answerPapersStatus.Evaluated || 0, color: 'var(--color-accent-green)' },
  ] : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[--color-bg-elevated] border border-[--color-border-bright] p-3 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="font-medium text-[--color-text-primary] mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1 last:mb-0">
              <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: entry.color, backgroundColor: entry.color }} />
              <span className="text-[--color-text-secondary]">{entry.name}:</span>
              <span className="font-bold text-white tracking-wide">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Area Chart: System Performance Trend */}
        <GlassCard className="flex flex-col relative overflow-hidden group">
          <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[100%] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
          <div className="mb-6 flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 flex items-center gap-2">
                <FiActivity className="text-blue-400" /> Evaluation Trends
              </h3>
              <p className="text-sm text-[--color-text-secondary] mt-1">Average scores over time</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#8a8aa0', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8a8aa0', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1}} />
                <Area 
                  type="monotone" 
                  dataKey="avgScore" 
                  name="Avg Score (%)"
                  stroke="var(--color-accent-blue)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  activeDot={{ r: 6, fill: '#fff', stroke: 'var(--color-accent-blue)', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Donut Chart: Overall Paper Status Distribution */}
        <GlassCard className="flex flex-col relative overflow-hidden group">
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[80%] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-violet-500/20 transition-all duration-700" />
          <div className="mb-2 relative z-10">
            <h3 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 flex items-center gap-2">
              <FiCheckCircle className="text-violet-400" /> Evaluation Distribution
            </h3>
            <p className="text-sm text-[--color-text-secondary] mt-1">Status of all answer papers</p>
          </div>
          <div className="flex-1 w-full min-h-[250px] flex items-center justify-center relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={answerStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {answerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}40)` }} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text for Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-6">
              <span className="text-3xl font-bold font-heading text-white">
                {dashboardData?.totalAnswerPapers || 0}
              </span>
              <span className="text-xs text-[--color-text-muted] uppercase tracking-widest font-semibold mt-1">Total Papers</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex justify-center gap-6 mt-2 relative z-10">
            {answerStatusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}80` }} />
                <span className="text-sm font-medium text-[--color-text-secondary]">{entry.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default AdvancedAnalytics;
