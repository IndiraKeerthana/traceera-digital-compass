import { motion } from "framer-motion";
import { useMemo } from "react";
import type { AnalysisResult } from "@/lib/analyzer";

interface RiskScoreProps {
  result: AnalysisResult;
}

const RiskScore = ({ result }: RiskScoreProps) => {
  const { risk_score } = result;

  const riskLevel = useMemo(() => {
    if (risk_score >= 70) return { label: "High Risk", colorClass: "text-destructive" };
    if (risk_score >= 40) return { label: "Medium Risk", colorClass: "text-warning" };
    return { label: "Low Risk", colorClass: "text-success" };
  }, [risk_score]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (risk_score / 100) * circumference;

  const strokeColor = useMemo(() => {
    if (risk_score >= 70) return "hsl(var(--destructive))";
    if (risk_score >= 40) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  }, [risk_score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-xl p-6 flex flex-col items-center gap-3"
    >
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Assessment</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-3xl font-bold ${riskLevel.colorClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {risk_score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-medium ${riskLevel.colorClass}`}>{riskLevel.label}</span>

      <div className="grid grid-cols-2 gap-2 w-full mt-2 text-xs">
        <ExposureChip label="Email" exposed={result.breach.email_found} />
        <ExposureChip label="Location" exposed={result.breach.location_exposed} />
        <ExposureChip label="Password" exposed={result.breach.password_leaked} />
        <ExposureChip label="Phone" exposed={result.breach.phone_exposed} />
      </div>
    </motion.div>
  );
};

const ExposureChip = ({ label, exposed }: { label: string; exposed: boolean }) => (
  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${exposed ? "bg-destructive/10" : "bg-success/10"}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${exposed ? "bg-destructive" : "bg-success"}`} />
    <span className={`${exposed ? "text-destructive" : "text-success"}`}>{label}</span>
  </div>
);

export default RiskScore;
