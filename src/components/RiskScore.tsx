import { motion } from "framer-motion";

const RiskScore = ({ result }: { result: any }) => {
  if (!result) return null;

  const score = result.riskScore ?? 0;
  const level = result.riskLevel ?? "Low";

  const color =
    score >= 60 ? "text-red-500 bg-red-500"
    : score >= 30 ? "text-orange-400 bg-orange-400"
    : "text-green-400 bg-green-400";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl p-6 bg-black/40 border border-white/10"
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
        Privacy Risk Assessment
      </h3>

      <div className="flex justify-between items-center mb-4">
        <span className={`text-2xl font-bold ${color.split(" ")[0]}`}>
          {level}
        </span>
        <span className="text-4xl font-black opacity-20">
          {score}%
        </span>
      </div>

      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${color.split(" ")[1]}`}
        />
      </div>
    </motion.div>
  );
};

export default RiskScore;