import { useState } from "react";
import { motion } from "framer-motion";
import SearchInput from "@/components/SearchInput";
import NetworkGraph from "@/components/NetworkGraph";
import RiskScore from "@/components/RiskScore";
import ResultsSidebar from "@/components/ResultsSidebar";
import LoadingAnimation from "@/components/LoadingAnimation";

const Index = () => {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (data: {
    username: string;
    name?: string;
    email?: string;
  }) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const resData = await response.json();

      if (response.ok) {
        setResult({
          username: resData.username,
          nodes: resData.nodes,
          links: resData.links,
          riskScore: resData.risk_score,
          riskLevel: resData.risk_level,
          details: resData.platforms
        });
      } else {
        alert("Analysis failed.");
      }

    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Backend not running on port 8000.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white flex flex-col relative overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`w-full transition-all duration-700 ${
            result ? "pt-8 pb-6" : "pt-[18vh] pb-12"
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="mb-8">
  <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
    TraceEra
  </h1>
  <p className="text-gray-400 text-sm mt-2 tracking-wide">
    Digital Footprint Intelligence Engine
  </p>
</div>

            <SearchInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && <LoadingAnimation />}

        {/* Dashboard */}
        {result && !isLoading && (
          <div className="flex-1 max-w-7xl mx-auto px-6 pb-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <NetworkGraph nodes={result.nodes} links={result.links} />
                <RiskScore result={result} />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-7">
                <ResultsSidebar result={result} />
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;