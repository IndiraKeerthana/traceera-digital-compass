import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SearchInput from "@/components/SearchInput";
import NetworkGraph from "@/components/NetworkGraph";
import RiskScore from "@/components/RiskScore";
import ResultsSidebar from "@/components/ResultsSidebar";
import LoadingAnimation from "@/components/LoadingAnimation";

const Index = () => {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = useCallback(
    async ({
      username,
      name,
      email,
    }: {
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            name,
            email,
          }),
        });

        const resData = await response.json();

        if (!response.ok) {
          alert("Backend error");
          setIsLoading(false);
          return;
        }

        setResult({
          username: resData.username,
          nodes: resData.nodes,
          links: resData.links,
          riskScore: resData.risk_score,
          riskLevel: resData.risk_level,
          details: resData.platforms,
          exposure: resData.exposure,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Backend not reachable:", error);
        alert("TraceEra backend is not running.");
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col">
      {/* Header Area */}
      <div className="w-full pt-16 pb-10 transition-all duration-500">
        <div className="max-w-5xl mx-auto px-6 text-center">

          {/* App Title (Always Visible) */}
          <div className="mb-10">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TraceEra
            </h1>
            <p className="text-gray-400 text-sm mt-3 tracking-wide">
              Digital Footprint Intelligence Engine
            </p>
          </div>

          {/* Search Input */}
          <SearchInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && <LoadingAnimation />}
      </AnimatePresence>

      {/* Dashboard */}
      {result && !isLoading && (
        <div className="flex-1 max-w-7xl mx-auto px-6 pb-16 w-full animate-in fade-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <NetworkGraph
                nodes={result.nodes}
                links={result.links}
              />
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
  );
};

export default Index;