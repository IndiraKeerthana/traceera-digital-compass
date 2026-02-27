import { motion } from "framer-motion";

const ResultsSidebar = ({ result }: { result: any }) => {
  if (!result) return null;

  const platforms = result.details || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl p-6 bg-black/40 border border-white/10 h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          Intelligence Feed
        </h3>
        <p className="text-sm font-bold text-white">
          Target: {result.username}
        </p>
      </div>

      {/* Platform List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {platforms.length > 0 ? (
          platforms.map((platform: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {platform.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Profile Detected
                  </p>
                </div>

                <span className="text-xs text-green-400 font-medium">
                  CONFIRMED
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-xs text-gray-500 italic">
              No digital footprints detected.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500 uppercase tracking-widest">
        Scan Complete
      </div>
    </motion.div>
  );
};

export default ResultsSidebar;