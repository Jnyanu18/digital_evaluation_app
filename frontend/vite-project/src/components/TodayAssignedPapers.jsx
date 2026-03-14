import React from "react";
import { FiClock, FiFileText } from "react-icons/fi";
import { GlassCard } from "./ui/Card";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

const TodaysAssignedPapers = ({ data }) => {
  // Demo data if none
  const papers = data && data.length > 0 ? data : [
    { _id: "1", subject: { subjectname: "Mathematics 101" }, exam: { examType: "Midterm" }, student: { email: "student1@example.com" }, assigned_date: new Date().toISOString() },
    { _id: "2", subject: { subjectname: "Physics 202" }, exam: { examType: "Endterm" }, student: { email: "student2@example.com" }, assigned_date: new Date().toISOString() }
  ];

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between pb-4 border-b border-[--color-border-default]">
        <h3 className="text-lg font-heading font-semibold text-[--color-text-primary] flex items-center gap-2">
          <FiClock className="text-[--color-accent-orange]" /> Recent Assignments
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 rounded bg-[--color-accent-orange]/10 text-[--color-accent-orange]">
          Today
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {papers.length > 0 ? (
          papers.slice(0, 5).map((paper, index) => (
            <div key={paper._id || index} className="p-3 rounded-lg bg-[--color-bg-elevated] border border-[--color-border-default] hover:border-[--color-border-bright] transition-colors group">
              <div className="flex gap-3">
                <div className="p-2 rounded bg-[--color-accent-violet]/10 text-[--color-accent-violet] h-fit mt-0.5">
                  <FiFileText className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-medium text-[--color-text-primary] truncate">
                    {paper.subject?.subjectname || "Subject Name"}
                  </h4>
                  <p className="text-xs text-[--color-text-secondary] mt-1 truncate">
                    {paper.student?.email || "student@example.com"}
                  </p>
                  <p className="text-[10px] text-[--color-text-muted] mt-1.5 uppercase tracking-wider font-semibold">
                    {paper.exam?.examType || "Exam"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[--color-border-default] rounded-xl">
            <FiFiFileText className="w-8 h-8 text-[--color-text-muted] mb-3" />
            <p className="text-sm font-medium text-[--color-text-primary] mb-1">No New Papers</p>
            <p className="text-xs text-[--color-text-secondary]">You have caught up with today's assignments.</p>
          </div>
        )}
      </div>

      {papers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[--color-border-default]">
          <Link to="/assignedpapers" className="block">
            <Button variant="ghost" fullWidth className="text-sm py-2">View All Assignments</Button>
          </Link>
        </div>
      )}
    </GlassCard>
  );
};

export default TodaysAssignedPapers;