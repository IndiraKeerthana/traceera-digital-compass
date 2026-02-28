import { motion } from "framer-motion";
import { ExternalLink, ShieldAlert } from "lucide-react";

const ResultsSidebar = ({ result }: { result: any }) => {
  if (!result) return null;

  const platforms = result.details || [];
  const exposure = result.exposure || {};

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            Intelligence Feed
          </h3>
          <p className="text-sm font-bold text-white">
            Target: {result.username}
          </p>
        </div>
        <ShieldAlert className="h-5 w-5 text-gray-400 opacity-70" />
      </div>

      {/* Platform Section */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {platforms.length > 0 ? (
          platforms.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Confidence: {item.confidence || 80}%
                  </p>
                </div>

                <a
                  href={`https://${item.name.toLowerCase()}.com/${result.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">
            No platforms detected.
          </p>
        )}
      </div>

      {/* Exposure Section */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Exposure Analysis
        </h4>

        <div className="space-y-2 text-sm">

          {exposure.email_exposed && (
            <p className="text-amber-300">
              📧 Email publicly linked
            </p>
          )}

          {exposure.location_exposed && (
            <p className="text-amber-300">
              📍 Location data inferred
            </p>
          )}

          {exposure.phone_exposed && (
            <p className="text-rose-400">
              📱 Phone number exposure risk
            </p>
          )}

          {exposure.password_leaked && (
            <p className="text-red-400">
              🔐 Password potentially leaked
            </p>
          )}

          {exposure.personal_details_exposed && (
            <p className="text-amber-300">
              👤 Personal details correlation detected
            </p>
          )}

          {!Object.values(exposure).some(Boolean) && (
            <p className="text-green-400">
              No critical exposure detected
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsSidebar;