import React from 'react';
import { GlassCard } from './ui/Card';
import { motion } from 'framer-motion';

const ProgressBar = ({ label, count, total, color, delay }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-[--color-text-primary]">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-heading font-semibold" style={{ color }}>{count}</span>
          <span className="text-xs text-[--color-text-muted]">({percentage}%)</span>
        </div>
      </div>
      <div className="h-2 w-full bg-[--color-bg-elevated] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const AnswerPapersStatus = ({ data }) => {
  if (!data) return null;

  const total = (data.Not_Assigned || 0) + (data.Pending || 0) + (data.Evaluated || 0);

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[--color-border-default]">
        <h3 className="text-lg font-heading font-semibold text-[--color-text-primary]">
          Answer Paper Status
        </h3>
        <span className="text-sm px-3 py-1 bg-[--color-bg-elevated] rounded-full text-[--color-text-secondary] border border-[--color-border-default]">
          Total: {total}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2">
        <ProgressBar label="Evaluated" count={data.Evaluated || 0} total={total} color="var(--color-accent-green)" delay={0.2} />
        <ProgressBar label="Pending" count={data.Pending || 0} total={total} color="var(--color-accent-orange)" delay={0.3} />
        <ProgressBar label="Not Assigned" count={data.Not_Assigned || 0} total={total} color="var(--color-accent-blue)" delay={0.4} />
      </div>
    </GlassCard>
  );
};

export default AnswerPapersStatus;